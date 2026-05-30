/**
 * Lumina evaluation harness — Stage 3 of the recursive loop.
 *
 * A proposal is only a hypothesis. Before it changes the system it must be
 * *proven* not to regress anything. The harness applies a candidate change to a
 * COPY of system state, runs the gates before and after, and promotes the change
 * only if every gate holds, no gate regresses, no invariant is mutated, and the
 * autonomy tier allows it.
 *
 * Auto-revert is structural, not a step: `apply` returns a new state and never
 * mutates the baseline, so a rejected candidate is simply discarded. There is
 * nothing to roll back.
 *
 * Pure and deterministic — no fs, no git. The repo runner
 * (scripts/lumina-evaluate.mjs) wires this to real candidates and writes a report.
 */

import type { FeedbackEvent, FeedbackTarget } from "./feedback.js";
import { computeFitness } from "./fitness.js";
import { invariants, type AutonomyTier } from "./invariants.js";
import type { ProductProfile } from "./registry.js";

const EPSILON = 1e-9;

/** Everything the gates read. Candidates transform it immutably. */
export type SystemState = {
  products: ProductProfile[];
  events: FeedbackEvent[];
  /**
   * Free-form facts a candidate can read/write: token defaults, registered
   * concepts, etc. Protected keys (see `protectedKeys`) are watched for
   * unapproved mutation. Approve a change by also setting `approved:<key>`.
   */
  values: Record<string, string>;
};

export type GateResult = {
  name: string;
  passed: boolean;
  /** Optional numeric score; a drop counts as a regression even if still passing. */
  score?: number;
  detail: string;
};

export type Gate = {
  name: string;
  run: (state: SystemState) => GateResult;
};

export type CandidateChange = {
  id: string;
  proposalId?: string;
  /** What part of the system this touches — drives invariant/tier checks. */
  target: FeedbackTarget;
  tier: AutonomyTier;
  describe: string;
  /** Pure transform: returns a NEW state, never mutates the input. */
  apply: (state: SystemState) => SystemState;
};

export type Verdict = "promote" | "needs-approval" | "reject";

export type GateComparison = {
  name: string;
  before: GateResult;
  after: GateResult;
  regressed: boolean;
};

export type EvaluationResult = {
  candidateId: string;
  target: FeedbackTarget;
  tier: AutonomyTier;
  verdict: Verdict;
  comparisons: GateComparison[];
  reasons: string[];
  /** Present only when verdict === "promote". Otherwise the baseline stands. */
  promotedState?: SystemState;
};

// ─── Built-in gates ───────────────────────────────────────────────────────────

/** Fitness must not drop. The core ratchet. */
export function fitnessGate(): Gate {
  return {
    name: "fitness",
    run: (s) => {
      const score = computeFitness(s.events, s.products).metrics.score;
      return { name: "fitness", passed: true, score, detail: `fitness ${score}/100` };
    },
  };
}

/** A boolean predicate as a gate (stand-in for "tests pass", "adherence holds"). */
export function checkGate(name: string, predicate: (s: SystemState) => boolean | string): Gate {
  return {
    name,
    run: (s) => {
      const out = predicate(s);
      const passed = out === true;
      return {
        name,
        passed,
        detail: passed ? `${name}: ok` : typeof out === "string" ? out : `${name}: failed`,
      };
    },
  };
}

/**
 * Run a predicate across every registered product; passes only if all pass.
 * This is how "no product regresses" becomes a single gate.
 */
export function perProductGate(
  name: string,
  predicate: (product: ProductProfile, s: SystemState) => boolean,
): Gate {
  return {
    name,
    run: (s) => {
      const failures = s.products.filter((p) => !predicate(p, s)).map((p) => p.id);
      return {
        name,
        passed: failures.length === 0,
        detail: failures.length === 0 ? `${name}: all products ok` : `${name}: failed for ${failures.join(", ")}`,
      };
    },
  };
}

export function defaultGates(): Gate[] {
  return [fitnessGate()];
}

// ─── Invariant protection ─────────────────────────────────────────────────────

/** The `values` keys that represent invariant definitions. */
export function protectedKeys(): string[] {
  return invariants.map((inv) => `${inv.kind}:${inv.ref}`);
}

/**
 * Protected keys whose value changed between baseline and candidate without an
 * accompanying `approved:<key>` flag. A non-empty result blocks promotion.
 */
function unapprovedInvariantBreaches(before: SystemState, after: SystemState): string[] {
  return protectedKeys().filter((key) => {
    const changed = before.values[key] !== after.values[key];
    const approved = after.values[`approved:${key}`] === "true";
    return changed && !approved;
  });
}

// ─── The evaluator ────────────────────────────────────────────────────────────

function regressed(before: GateResult, after: GateResult): boolean {
  if (before.passed && !after.passed) return true;
  if (before.score != null && after.score != null) {
    return after.score < before.score - EPSILON;
  }
  return false;
}

/**
 * Evaluate one candidate against a baseline. The baseline is never mutated.
 */
export function evaluateCandidate(
  baseline: SystemState,
  candidate: CandidateChange,
  gates: Gate[] = defaultGates(),
): EvaluationResult {
  const after = candidate.apply(clone(baseline));

  const comparisons: GateComparison[] = gates.map((gate) => {
    const b = gate.run(baseline);
    const a = gate.run(after);
    return { name: gate.name, before: b, after: a, regressed: regressed(b, a) };
  });

  const reasons: string[] = [];

  for (const cmp of comparisons) {
    if (!cmp.after.passed) reasons.push(`gate "${cmp.name}" fails after change: ${cmp.after.detail}`);
    else if (cmp.regressed) {
      reasons.push(
        `gate "${cmp.name}" regressed (${fmt(cmp.before)} → ${fmt(cmp.after)})`,
      );
    }
  }

  const breaches = unapprovedInvariantBreaches(baseline, after);
  for (const key of breaches) {
    reasons.push(`mutates invariant "${key}" without approval`);
  }

  let verdict: Verdict;
  if (reasons.length > 0) {
    verdict = "reject";
  } else if (candidate.tier === "auto") {
    verdict = "promote";
  } else {
    verdict = "needs-approval";
    reasons.push(`gates pass, but tier "${candidate.tier}" requires human approval before promotion`);
  }

  return {
    candidateId: candidate.id,
    target: candidate.target,
    tier: candidate.tier,
    verdict,
    comparisons,
    reasons,
    promotedState: verdict === "promote" ? after : undefined,
  };
}

/** Evaluate many candidates against the same baseline, promote-first. */
export function evaluateBatch(
  baseline: SystemState,
  candidates: CandidateChange[],
  gates: Gate[] = defaultGates(),
): EvaluationResult[] {
  const rank: Record<Verdict, number> = { promote: 0, "needs-approval": 1, reject: 2 };
  return candidates
    .map((c) => evaluateCandidate(baseline, c, gates))
    .sort((a, b) => rank[a.verdict] - rank[b.verdict]);
}

/**
 * Fold every promoted candidate onto the baseline in order — the new committed
 * state after a harness run. Non-promoted candidates are left out (auto-revert).
 * Re-evaluates each step so a later promotion can't ride in on a stale baseline.
 */
export function applyPromotions(
  baseline: SystemState,
  candidates: CandidateChange[],
  gates: Gate[] = defaultGates(),
): { state: SystemState; promoted: string[] } {
  let state = clone(baseline);
  const promoted: string[] = [];
  for (const candidate of candidates) {
    const result = evaluateCandidate(state, candidate, gates);
    if (result.verdict === "promote" && result.promotedState) {
      state = result.promotedState;
      promoted.push(candidate.id);
    }
  }
  return { state, promoted };
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function clone(state: SystemState): SystemState {
  return {
    products: state.products,
    events: [...state.events],
    values: { ...state.values },
  };
}

function fmt(r: GateResult): string {
  return r.score != null ? String(r.score) : r.passed ? "pass" : "fail";
}
