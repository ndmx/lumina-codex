import { describe, it, expect } from "vitest";
import { recordFeedback, type FeedbackDraft } from "@/system/feedback";
import { products } from "@/system/registry";
import {
  evaluateCandidate,
  evaluateBatch,
  applyPromotions,
  fitnessGate,
  checkGate,
  perProductGate,
  protectedKeys,
  type SystemState,
  type CandidateChange,
} from "@/system/evaluation";

const at = "2026-05-30T00:00:00.000Z";
const ev = (d: FeedbackDraft) => recordFeedback({ ...d, at });

// Baseline with positive signal plus two negative signals on resolvable targets.
// (Positive signal matters: fitness is a ratio, so a score of 0 can't regress —
// a realistic ledger always carries some "works".)
function baseline(): SystemState {
  return {
    products,
    events: [
      ev({ productId: "a", kind: "works", target: { kind: "component", ref: "dock" }, detail: "ok" }),
      ev({ productId: "a", kind: "override", target: { kind: "token", ref: "accent" }, detail: "x" }),
      ev({ productId: "b", kind: "gap", target: { kind: "concept", ref: "Reminder" }, detail: "x" }),
    ],
    values: {},
  };
}

const resolveTarget = (kind: string, ref: string): CandidateChange["apply"] => (s) => ({
  ...s,
  events: s.events.filter((e) => !(e.target.kind === kind && e.target.ref === ref)),
});

describe("evaluateCandidate", () => {
  it("promotes an auto candidate that lifts fitness with no regression", () => {
    const candidate: CandidateChange = {
      id: "c1",
      target: { kind: "token", ref: "accent" },
      tier: "auto",
      describe: "resolve the override",
      apply: resolveTarget("token", "accent"),
    };
    const result = evaluateCandidate(baseline(), candidate);
    expect(result.verdict).toBe("promote");
    expect(result.promotedState).toBeDefined();
  });

  it("rejects an auto candidate that regresses fitness (the ratchet)", () => {
    const candidate: CandidateChange = {
      id: "c2",
      target: { kind: "token", ref: "spark" },
      tier: "auto",
      describe: "introduces a failure",
      apply: (s) => ({
        ...s,
        events: [
          ...s.events,
          ev({ productId: "a", kind: "error", target: { kind: "token", ref: "spark" }, detail: "boom", severity: "high" }),
        ],
      }),
    };
    const result = evaluateCandidate(baseline(), candidate);
    expect(result.verdict).toBe("reject");
    expect(result.reasons.join()).toMatch(/regressed/);
    expect(result.promotedState).toBeUndefined();
  });

  it("rejects a candidate that mutates an invariant without approval", () => {
    const candidate: CandidateChange = {
      id: "c3",
      target: { kind: "concept", ref: "Shared Space" },
      tier: "human-gated",
      describe: "rename the canonical concept",
      apply: (s) => ({ ...s, values: { ...s.values, "concept:Shared Space": "Group" } }),
    };
    const result = evaluateCandidate(baseline(), candidate);
    expect(result.verdict).toBe("reject");
    expect(result.reasons.join()).toMatch(/invariant/);
  });

  it("allows an invariant mutation when it carries approval, gated by tier", () => {
    const candidate: CandidateChange = {
      id: "c3b",
      target: { kind: "concept", ref: "Shared Space" },
      tier: "human-gated",
      describe: "approved rename",
      apply: (s) => ({
        ...s,
        values: { ...s.values, "concept:Shared Space": "Group", "approved:concept:Shared Space": "true" },
      }),
    };
    // Not auto-promoted (tier), but no longer a hard reject either.
    expect(evaluateCandidate(baseline(), candidate).verdict).toBe("needs-approval");
  });

  it("holds a review/human-gated candidate for approval even when gates pass", () => {
    const candidate: CandidateChange = {
      id: "c4",
      target: { kind: "concept", ref: "Reminder" },
      tier: "review",
      describe: "canonicalize Reminder",
      apply: resolveTarget("concept", "Reminder"),
    };
    const result = evaluateCandidate(baseline(), candidate);
    expect(result.verdict).toBe("needs-approval");
    expect(result.promotedState).toBeUndefined();
  });

  it("rejects when a custom gate fails after the change", () => {
    const candidate: CandidateChange = {
      id: "c5",
      target: { kind: "token", ref: "accent" },
      tier: "auto",
      describe: "introduces a clash",
      apply: (s) => ({
        ...s,
        events: [...s.events, ev({ productId: "a", kind: "clash", target: { kind: "naming", ref: "z" }, detail: "x" })],
      }),
    };
    const gates = [fitnessGate(), checkGate("no-clash", (s) => !s.events.some((e) => e.kind === "clash"))];
    expect(evaluateCandidate(baseline(), candidate, gates).verdict).toBe("reject");
  });

  it("never mutates the baseline (auto-revert is structural)", () => {
    const base = baseline();
    const beforeEvents = base.events.length;
    const candidate: CandidateChange = {
      id: "c6",
      target: { kind: "token", ref: "accent" },
      tier: "auto",
      describe: "mutates",
      apply: (s) => ({ ...s, events: [], values: { ...s.values, foo: "bar" } }),
    };
    evaluateCandidate(base, candidate);
    expect(base.events.length).toBe(beforeEvents);
    expect(base.values.foo).toBeUndefined();
  });
});

describe("gates", () => {
  it("perProductGate fails when any product fails the predicate", () => {
    const gate = perProductGate("only-android", (p) => p.platforms.includes("android"));
    const result = gate.run(baseline());
    expect(result.passed).toBe(false);
    expect(result.detail).toMatch(/failed for/);
  });

  it("fitnessGate carries a numeric score", () => {
    expect(fitnessGate().run(baseline()).score).toBeTypeOf("number");
  });
});

describe("evaluateBatch", () => {
  it("sorts promote first, reject last", () => {
    const cands: CandidateChange[] = [
      {
        id: "reject", target: { kind: "concept", ref: "Shared Space" }, tier: "auto",
        describe: "", apply: (s) => ({ ...s, values: { ...s.values, "concept:Shared Space": "X" } }),
      },
      {
        id: "promote", target: { kind: "token", ref: "accent" }, tier: "auto",
        describe: "", apply: resolveTarget("token", "accent"),
      },
    ];
    const verdicts = evaluateBatch(baseline(), cands).map((r) => r.verdict);
    expect(verdicts[0]).toBe("promote");
    expect(verdicts[verdicts.length - 1]).toBe("reject");
  });
});

describe("applyPromotions", () => {
  it("folds only promoted candidates onto the baseline", () => {
    const cands: CandidateChange[] = [
      { id: "good", target: { kind: "token", ref: "accent" }, tier: "auto", describe: "", apply: resolveTarget("token", "accent") },
      { id: "held", target: { kind: "concept", ref: "Reminder" }, tier: "review", describe: "", apply: resolveTarget("concept", "Reminder") },
    ];
    const { promoted, state } = applyPromotions(baseline(), cands);
    expect(promoted).toEqual(["good"]);
    // the auto one removed the override; the review one was held, so its gap stays
    expect(state.events.some((e) => e.target.ref === "accent")).toBe(false);
    expect(state.events.some((e) => e.target.ref === "Reminder")).toBe(true);
  });
});

describe("protectedKeys", () => {
  it("includes the Shared Space concept invariant", () => {
    expect(protectedKeys()).toContain("concept:Shared Space");
  });
});
