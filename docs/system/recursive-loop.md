# Lumina Recursive Improvement Loop

Lumina improves *because* agents build on it. While a consuming agent implements
a user's project, it is also a **sensor**: it reports what worked, what it had to
invent, what clashed, and what errored. Those reports are the signal the system
scores itself on and proposes changes from. The agent both *uses* the system and
*improves* it — that is the recursion.

```
   build a real project                report back
   with @xlumina/system   ───────────►  recordFeedback(...)
        ▲                                     │
        │                                     ▼
   3. apply (gated)                     lumina-ledger.jsonl   (Knowledge)
        ▲                                     │
        │                                     ▼
   2. propose (bounded,            computeFitness + proposeImprovements
      provenance, tiered)  ◄──────  (scripts/lumina-audit.mjs, on a schedule)
```

This is the real version of the "self-improving system" — not a model rewriting
itself, but a disciplined control loop: **observe → score → propose → gate →
apply → repeat**, where change is only ever a *ratchet* (no product regresses),
never a random walk.

## 1. The agent is the sensor (`feedback.ts`)

While building, the agent emits normalized events:

```ts
import { recordFeedback } from "@xlumina/system/feedback";

// I had to invent a rule the system doesn't have:
recordFeedback({
  productId: "design-variation-01",
  kind: "gap",
  target: { kind: "concept", ref: "Reminder" },
  detail: "No canonical reminder chip; invented one.",
  suggestedChange: "Add a Reminder status-tag role with a recurrence variant.",
  agent: "claude",
  systemVersion: "1.0.0",
});
```

Seven signal kinds: `works` · `friction` (had to infer a rule) · `clash`
(rules conflicted) · `error` · `override` (fought a default) · `gap` (missing) ·
`proposal` (concrete suggestion). The package only *produces* the event;
persisting it (to the JSONL ledger, an endpoint, …) is the host's job.

## 2. The ledger is the knowledge base (`improvement-ledger.ts`)

Append-only JSON Lines — one event per line. This is what turns the prose
`improvement-log.md` into something the system can *read back*: to score itself
and to avoid re-deciding settled questions. A corrupt line never poisons the
ledger.

## 3. Fitness makes improvement measurable (`fitness.ts`)

You cannot improve what you cannot score. `computeFitness(events, products)`
reduces the ledger to a 0–100 health score plus hotspots: reward `works`,
penalize severity-weighted negative signal, and weigh **cross-product
duplication** heavily — a target two products independently struggled with is, by
Lumina's own rule, a system gap, not a product quirk.

`proposeImprovements(events, products)` then derives **bounded, deduped,
provenance-tagged** proposals:

| Signal | Proposal |
|---|---|
| `error` on a target | `fix-…` |
| `gap`/`friction`/`clash` from ≥ 2 products | `canonicalize-…` |
| `override` of a default | `reconsider-…` |
| explicit agent `proposal` | `agent-…` |

Every proposal carries `evidence` (the event ids that justify it) and is
`reversible: true`.

## 4. Invariants keep it honest (`invariants.ts`)

A self-improving system without protected fixed points games whatever it
measures (Goodhart) and erodes its own coherence. So every proposal gets an
**autonomy tier**:

- `auto` — leaf defaults (a token value, a component tweak): promote once the
  evaluation harness shows no regression.
- `review` — naming/concept wording: an owner eyeballs it (wide ripple).
- `human-gated` — touches an **invariant** (the `Shared Space` concept, the
  `--ls-*` contract, the 44px target floor, the contrast floor, proportional
  grid spans): never auto-applied.

## 5. The evaluation harness gates promotion (`evaluation.ts`)

A proposal is a hypothesis; it must be *proven* not to regress anything before it
changes the system. The harness applies a candidate to a **copy** of system state,
runs the gates before and after, and returns a verdict:

- **promote** — every gate holds, nothing regressed, no invariant mutated, and the
  tier is `auto`.
- **needs-approval** — gates pass, but the tier is `review` / `human-gated`.
- **reject** — a gate failed or regressed, or the candidate mutates an invariant
  without an `approved:<key>` flag.

Auto-revert is structural, not a step: `apply` returns a new state and never
mutates the baseline, so a rejected or held candidate is simply discarded — there
is nothing to roll back. Gates are pluggable; `fitnessGate` (the ratchet:
fitness may not drop), `checkGate` (any predicate — stands in for "tests pass" /
"adherence holds"), and `perProductGate` (passes only if **every** registered
product still passes) ship built-in.

`applyPromotions` folds the promoted candidates onto the baseline in order,
re-evaluating each step so a later change can't ride in on a stale baseline — the
new committed state after a harness run.

## 6. The closer applies the cleared changes (`closer.ts`)

The step that closes the inner loop without a human. `compileProposal` turns a
`Proposal` into an executable `CandidateChange` (its tier re-derived from the
target, so an invariant can never slip through as `auto`). `closeLoop` then
compiles every open proposal, runs the batch through the harness, and:

- **auto-applies** the `auto`-tier promotions — appending a resolution `works`
  event to the ledger and marking the target resolved in `lumina-state.json`;
- **defers** everything else (`needs-approval` / `reject`) with a reason.

A resolution does two things: it lifts fitness next cycle (positive signal) and it
**excludes the target from future proposals** (`resolvedTargets`), so the loop
advances instead of re-deciding settled questions. Re-running is idempotent.

`lumina-state.json` is the persisted mutable knowledge (what's resolved, what
defaults changed) — the partner to the append-only ledger.

## 7. The meta-loop guards against Goodhart (`meta.ts`)

The inner loop optimizes a score — and the closer raises that score by appending
its *own* `works` event each time it resolves something. Left unwatched, the
system would inflate its score by congratulating itself. The meta-loop is the
guard, run on a slow, human-supervised cadence:

- a **holdout score** computed only from signal the inner loop *cannot write*
  (real product feedback, excluding `lumina-system` resolutions) — it can't be
  gamed;
- **alarms** when the gameable fitness diverges from the holdout
  (`metric-divergence`), when loop-generated `works` dominate
  (`self-congratulation`), or when a "resolved" target gets re-reported
  (`resolution-churn`);
- **meta-proposals** to re-weight the fitness function, add an invariant, or
  tighten a gate — **always `human-gated`**, because a loop that can rewrite its
  own objective is the ultimate Goodhart failure;
- a **circuit breaker** (`freezeAutoPromotion`) that the closer honors: when the
  metric has drifted from reality, Stage-4 auto-application halts.

On a gamed ledger (one real gap, six loop self-resolutions) inner fitness reads
92.9 while the holdout stays at 50 — the 42.9 divergence trips the alarms, freezes
auto-promotion, and queues the reweight/freeze meta-proposals for a human.

## 8. Run it

```bash
npm run lumina:audit             # score the ledger → fitness-report.md
npm run lumina:evaluate          # run candidates through the harness → evaluation-report.md
npm run lumina:close             # propose → harness → auto-apply (honors the meta freeze)
npm run lumina:close -- --dry-run  # preview without persisting
npm run lumina:meta              # Goodhart guard: fitness vs holdout → meta-report.md
```

Each builds the package first, prints results, and writes a report. Put
`lumina:close` and `lumina:meta` on a schedule and the loop runs itself: observe →
score → propose → evaluate → apply — with the meta-loop watching the metric.

## What is intentionally NOT automated yet

All five stages are built: **observe** (feedback) → **score** (fitness) →
**propose** (bounded/tiered) → **evaluate** (harness) → **apply** (closer,
idempotent) → **meta** (Goodhart guard with a circuit breaker). One extension
remains deliberately *unbuilt*, and it should stay human-gated: wiring `auto`
promotions into **source-file edits** (a codemod that changes, say, a token
default in `tokens.ts` and re-runs the suite). Autonomous source rewriting is the
highest-blast-radius action in the system; keeping it behind a human is the
correct posture, not a missing feature. The closer applies to the system's own
state (ledger + `lumina-state.json`); promoting a verdict into a real file change
is where a person still signs off.

The discipline throughout — bounded, gated, reversible, invariant-protected, and
now metric-audited — is what lets each layer act without the layer below it
running away.
