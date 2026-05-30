/**
 * Lumina improvement ledger — the Knowledge base of the recursive loop.
 *
 * Append-only, machine-readable (JSON Lines: one event per line). This is what
 * turns the prose `improvement-log.md` into something the system can read back
 * — to score itself, to avoid re-deciding settled questions, and to attach
 * provenance to every change it proposes.
 *
 * Pure: serialize/parse/aggregate only. The host owns the file or transport.
 */

import type { FeedbackEvent, FeedbackKind, FeedbackTargetKind } from "./feedback.js";
import { isFeedbackEvent } from "./feedback.js";

/** Serialize one event to a single JSONL line (no trailing newline). */
export function serializeEvent(event: FeedbackEvent): string {
  return JSON.stringify(event);
}

/** Append an event to existing ledger text, returning the new text. */
export function appendEvent(ledger: string, event: FeedbackEvent): string {
  const line = serializeEvent(event);
  if (ledger.length === 0) return line + "\n";
  return ledger.endsWith("\n") ? ledger + line + "\n" : ledger + "\n" + line + "\n";
}

/**
 * Parse JSONL ledger text into events. Malformed or non-event lines are skipped
 * (a corrupt line must never poison the whole ledger). Returns the good events;
 * use `parseLedgerStrict` when you need to know about drops.
 */
export function parseLedger(text: string): FeedbackEvent[] {
  return parseLedgerStrict(text).events;
}

export function parseLedgerStrict(text: string): {
  events: FeedbackEvent[];
  skipped: number;
} {
  const events: FeedbackEvent[] = [];
  let skipped = 0;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    try {
      const parsed: unknown = JSON.parse(line);
      if (isFeedbackEvent(parsed)) events.push(parsed);
      else skipped++;
    } catch {
      skipped++;
    }
  }
  return { events, skipped };
}

// ─── Aggregation ──────────────────────────────────────────────────────────────

export type LedgerSummary = {
  total: number;
  byKind: Record<FeedbackKind, number>;
  byTarget: Record<FeedbackTargetKind, number>;
  byProduct: Record<string, number>;
  /** Distinct products reporting on each `kind:ref` target. */
  productsPerTarget: Record<string, Set<string>>;
};

function emptyKindCounts(): Record<FeedbackKind, number> {
  return {
    works: 0,
    friction: 0,
    clash: 0,
    error: 0,
    override: 0,
    gap: 0,
    proposal: 0,
  };
}

/** The stable key for a target across events. */
export function targetKey(event: FeedbackEvent): string {
  return `${event.target.kind}:${event.target.ref ?? "*"}`;
}

export function summarize(events: FeedbackEvent[]): LedgerSummary {
  const byKind = emptyKindCounts();
  const byTarget: Record<string, number> = {};
  const byProduct: Record<string, number> = {};
  const productsPerTarget: Record<string, Set<string>> = {};

  for (const e of events) {
    byKind[e.kind]++;
    byTarget[e.target.kind] = (byTarget[e.target.kind] ?? 0) + 1;
    byProduct[e.productId] = (byProduct[e.productId] ?? 0) + 1;
    const key = targetKey(e);
    (productsPerTarget[key] ??= new Set()).add(e.productId);
  }

  return {
    total: events.length,
    byKind,
    byTarget: byTarget as Record<FeedbackTargetKind, number>,
    byProduct,
    productsPerTarget,
  };
}
