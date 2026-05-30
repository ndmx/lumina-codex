/**
 * Lumina closer — Stage 4 of the recursive loop.
 *
 * The step that finally closes the inner loop without a human in it: it compiles
 * a `Proposal` (text + target + tier) into an executable `CandidateChange`, runs
 * the batch through the evaluation harness, and reports which changes the harness
 * cleared to auto-apply.
 *
 *   proposeImprovements → compileProposal → harness → closeLoop
 *
 * Still pure: `closeLoop` returns the new state and the diff to persist (events
 * to append, values to write). The repo runner (scripts/lumina-close.mjs) does
 * the file I/O. Only `auto`-tier candidates that pass every gate are promoted;
 * everything else is deferred with a reason. A promotion records a resolution
 * event back into the ledger, which both improves fitness next cycle and marks
 * the target resolved so it is never re-proposed.
 */

import { recordFeedback, type FeedbackEvent, type FeedbackTarget, type FeedbackTargetKind } from "./feedback.js";
import type { Proposal } from "./fitness.js";
import { classifyAutonomy } from "./invariants.js";
import {
  applyPromotions,
  defaultGates,
  evaluateBatch,
  type CandidateChange,
  type EvaluationResult,
  type Gate,
  type SystemState,
  type Verdict,
} from "./evaluation.js";

/**
 * The productId stamped on events the loop generates about itself (resolutions).
 * The meta-loop (meta.ts) excludes these to compute an un-gameable holdout score.
 */
export const LOOP_PRODUCT_ID = "lumina-system";

/** Parse a `kind:ref` target key back into a structured target. */
export function parseTargetKey(key: string): FeedbackTarget {
  const idx = key.indexOf(":");
  if (idx === -1) return { kind: key as FeedbackTargetKind };
  const kind = key.slice(0, idx) as FeedbackTargetKind;
  const ref = key.slice(idx + 1);
  return ref === "*" ? { kind } : { kind, ref };
}

/** The value key marking a target resolved (read back by proposeImprovements). */
export function resolvedKey(targetKey: string): string {
  return `resolved:${targetKey}`;
}

/**
 * Turn a proposal into an executable candidate. The transform records a
 * resolution `works` event for the target and marks it resolved + notes the
 * change. Returns null for a wildcard target that can't be addressed.
 */
export function compileProposal(proposal: Proposal): CandidateChange | null {
  const target = parseTargetKey(proposal.target);
  if (!target.ref) return null;

  return {
    id: `candidate:${proposal.id}`,
    proposalId: proposal.id,
    target,
    // Derive the tier from the target, not the (possibly stale/forged) proposal,
    // so an invariant target can never slip through as auto.
    tier: classifyAutonomy(target),
    describe: proposal.action,
    apply: (s: SystemState): SystemState => {
      const resolution = recordFeedback({
        productId: LOOP_PRODUCT_ID,
        kind: "works",
        target,
        detail: `auto-resolved by closer via ${proposal.id}`,
      });
      return {
        ...s,
        events: [...s.events, resolution],
        values: {
          ...s.values,
          [resolvedKey(proposal.target)]: proposal.id,
          [`change:${proposal.target}`]: proposal.action,
        },
      };
    },
  };
}

export type DeferredChange = {
  candidateId: string;
  proposalId?: string;
  verdict: Verdict;
  reason: string;
};

export type CloseResult = {
  /** Every candidate's full verdict, promote-first. */
  results: EvaluationResult[];
  /** The committed state after auto-promotions (baseline untouched). */
  state: SystemState;
  /** Candidate ids that were auto-applied. */
  applied: string[];
  /** Candidates held back (needs-approval / reject) with the first reason. */
  deferred: DeferredChange[];
  /** Events added by promotions — append these to the ledger. */
  newEvents: FeedbackEvent[];
};

/**
 * Compile proposals, evaluate them, and fold the auto-promotions onto the
 * baseline. Pure — persistence is the caller's job using `newEvents` and
 * `state.values`.
 */
export function closeLoop(
  baseline: SystemState,
  proposals: Proposal[],
  gates: Gate[] = defaultGates(),
): CloseResult {
  const candidates = proposals
    .map(compileProposal)
    .filter((c): c is CandidateChange => c !== null);

  const results = evaluateBatch(baseline, candidates, gates);
  const { state, promoted } = applyPromotions(baseline, candidates, gates);

  const baselineIds = new Set(baseline.events.map((e) => e.id));
  const newEvents = state.events.filter((e) => !baselineIds.has(e.id));

  const deferred: DeferredChange[] = results
    .filter((r) => r.verdict !== "promote")
    .map((r) => ({
      candidateId: r.candidateId,
      proposalId: candidates.find((c) => c.id === r.candidateId)?.proposalId,
      verdict: r.verdict,
      reason: r.reasons[0] ?? "",
    }));

  return { results, state, applied: promoted, deferred, newEvents };
}

/** Pull the resolved target keys out of a values map (for proposeImprovements). */
export function resolvedTargetsFromValues(values: Record<string, string>): string[] {
  return Object.keys(values)
    .filter((k) => k.startsWith("resolved:"))
    .map((k) => k.slice("resolved:".length));
}
