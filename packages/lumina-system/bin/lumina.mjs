#!/usr/bin/env node
/**
 * lumina — portable CLI for the recursive-improvement loop.
 *
 * Ships inside @xlumina/system, so ANY project that installs the package can run
 * the loop without writing glue:
 *
 *   npx lumina record --kind gap --target concept:Reminder --detail "no canonical chip"
 *   npx lumina audit          # score this project's lumina-ledger.jsonl
 *   npx lumina close          # propose → harness → auto-apply (honors meta freeze)
 *   npx lumina meta           # Goodhart guard: fitness vs un-gameable holdout
 *
 * The ledger (lumina-ledger.jsonl) and state (lumina-state.json) live in the
 * CURRENT project (process.cwd()). `record` appends locally by default, or POSTs
 * to $LUMINA_FEEDBACK_URL when set — so many projects can feed one central
 * Lumina without any code change.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const lib = await import(resolve(here, "../dist/index.js"));
const {
  products,
  recordFeedback,
  serializeEvent,
  appendEvent,
  parseLedger,
  computeFitness,
  proposeImprovements,
  fitnessGate,
  checkGate,
  closeLoop,
  resolvedTargetsFromValues,
  metaReview,
} = lib;

const cwd = process.cwd();
const ledgerPath = resolve(cwd, "lumina-ledger.jsonl");
const statePath = resolve(cwd, "lumina-state.json");

const [cmd, ...rest] = process.argv.slice(2);
const flags = parseFlags(rest);

function parseFlags(args) {
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      const val = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : "true";
      out[key] = val;
    }
  }
  return out;
}

function readLedger() {
  return existsSync(ledgerPath) ? parseLedger(readFileSync(ledgerPath, "utf8")) : [];
}
function readResolved() {
  const values = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : {};
  return { values, resolvedTargets: resolvedTargetsFromValues(values) };
}
function parseTarget(s) {
  if (!s) return { kind: "other" };
  const i = s.indexOf(":");
  return i === -1 ? { kind: s } : { kind: s.slice(0, i), ref: s.slice(i + 1) };
}

async function record() {
  if (!flags.kind || !flags.detail) {
    fail("record needs --kind and --detail (and usually --target kind:ref)");
  }
  const event = recordFeedback({
    productId: flags.product ?? "unregistered:" + (flags.product || "local"),
    kind: flags.kind,
    target: parseTarget(flags.target),
    detail: flags.detail,
    severity: flags.severity,
    suggestedChange: flags.suggest,
    agent: flags.agent ?? process.env.LUMINA_AGENT ?? "cli",
    systemVersion: lib.tokens ? undefined : undefined,
  });

  const remote = process.env.LUMINA_FEEDBACK_URL;
  if (remote) {
    const res = await fetch(remote, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: serializeEvent(event),
    });
    console.log(`lumina: posted ${event.kind} → ${remote} (${res.status})`);
    return;
  }
  const prev = existsSync(ledgerPath) ? readFileSync(ledgerPath, "utf8") : "";
  writeFileSync(ledgerPath, appendEvent(prev, event));
  console.log(`lumina: recorded ${event.kind} on ${event.target.kind}:${event.target.ref ?? "*"} → lumina-ledger.jsonl`);
}

function audit() {
  const events = readLedger();
  const { resolvedTargets } = readResolved();
  const { metrics } = computeFitness(events, products);
  const proposals = proposeImprovements(events, products, { resolvedTargets });
  console.log(`lumina audit — fitness ${metrics.score}/100 · ${events.length} events · ${proposals.length} proposals`);
  for (const p of proposals) console.log(`  [${p.tier}] ${p.id} — ${p.action}`);
}

function meta() {
  const events = readLedger();
  const { resolvedTargets } = readResolved();
  const r = metaReview(events, products, resolvedTargets);
  console.log(`lumina meta — fitness ${r.fitness} vs holdout ${r.holdout} (divergence ${r.divergence})${r.freezeAutoPromotion ? "  🧊 FROZEN" : ""}`);
  for (const a of r.alarms) console.log(`  🚨 ${a.code} [${a.severity}] — ${a.detail}`);
  if (r.alarms.length === 0) console.log("  ✅ metric is tracking reality");
}

function close() {
  const dryRun = flags["dry-run"] === "true";
  const events = readLedger();
  const { values, resolvedTargets } = readResolved();
  const proposals = proposeImprovements(events, products, { resolvedTargets });
  const baseline = { products, events, values };
  const gates = [fitnessGate(), checkGate("no-new-clash", (s) => !s.events.some((e) => e.kind === "clash"))];
  const out = closeLoop(baseline, proposals, gates);

  const review = metaReview(events, products, resolvedTargets);
  const frozen = review.freezeAutoPromotion;

  console.log(`lumina close${dryRun ? " (dry run)" : ""} — proposals ${proposals.length}, applied ${frozen ? 0 : out.applied.length}, deferred ${out.deferred.length}`);
  if (frozen) console.log(`  🧊 frozen by meta-guard (divergence ${review.divergence})`);
  if (!frozen) for (const id of out.applied) console.log(`  ✅ ${id}`);
  for (const d of out.deferred) console.log(`  ⏸  ${d.verdict} — ${d.candidateId}`);

  if (!dryRun && !frozen && out.applied.length > 0) {
    let next = existsSync(ledgerPath) ? readFileSync(ledgerPath, "utf8") : "";
    for (const e of out.newEvents) next = appendEvent(next, e);
    writeFileSync(ledgerPath, next);
    writeFileSync(statePath, JSON.stringify(out.state.values, null, 2) + "\n");
    console.log(`  persisted ${out.newEvents.length} event(s) + lumina-state.json`);
  }
}

function help() {
  console.log(`lumina — recursive design-system loop (@xlumina/system)

Usage:
  lumina record --kind <k> --target <kind:ref> --detail "<text>" [--product <id>] [--severity <s>] [--suggest "<change>"]
  lumina audit            score this project's lumina-ledger.jsonl
  lumina close [--dry-run] propose → evaluate → auto-apply (honors meta freeze)
  lumina meta             Goodhart guard: fitness vs un-gameable holdout
  lumina help

Feedback kinds: works · friction · clash · error · override · gap · proposal
Set LUMINA_FEEDBACK_URL to POST events to a central Lumina instead of a local file.`);
}

function fail(msg) {
  console.error(`lumina: ${msg}`);
  process.exit(1);
}

try {
  if (cmd === "record") await record();
  else if (cmd === "audit") audit();
  else if (cmd === "close") close();
  else if (cmd === "meta") meta();
  else help();
} catch (err) {
  fail(err instanceof Error ? err.message : String(err));
}
