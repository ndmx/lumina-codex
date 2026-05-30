import { describe, it, expect } from "vitest";
import { recordFeedback, type FeedbackDraft } from "@/system/feedback";
import { products } from "@/system/registry";
import { proposeImprovements, type Proposal } from "@/system/fitness";
import { fitnessGate } from "@/system/evaluation";
import {
  parseTargetKey,
  compileProposal,
  closeLoop,
  resolvedKey,
  resolvedTargetsFromValues,
} from "@/system/closer";

const at = "2026-05-30T00:00:00.000Z";
const ev = (d: FeedbackDraft) => recordFeedback({ ...d, at });

function proposal(over: Partial<Proposal> = {}): Proposal {
  return {
    id: "reconsider-token:accent-primary",
    target: "token:accent-primary",
    action: "Retune the default accent.",
    motivation: "1 override",
    tier: "auto",
    reversible: true,
    evidence: ["override-1"],
    ...over,
  };
}

describe("parseTargetKey", () => {
  it("splits kind:ref, preserving refs that contain spaces", () => {
    expect(parseTargetKey("token:accent-primary")).toEqual({ kind: "token", ref: "accent-primary" });
    expect(parseTargetKey("concept:Shared Space")).toEqual({ kind: "concept", ref: "Shared Space" });
  });

  it("treats a wildcard ref as no ref", () => {
    expect(parseTargetKey("token:*")).toEqual({ kind: "token" });
  });
});

describe("compileProposal", () => {
  it("compiles a leaf proposal into an auto candidate that marks the target resolved", () => {
    const candidate = compileProposal(proposal());
    expect(candidate).not.toBeNull();
    expect(candidate!.tier).toBe("auto");
    const after = candidate!.apply({ products, events: [], values: {} });
    expect(after.values[resolvedKey("token:accent-primary")]).toBe("reconsider-token:accent-primary");
    expect(after.events.some((e) => e.kind === "works" && e.target.ref === "accent-primary")).toBe(true);
  });

  it("returns null for a wildcard target", () => {
    expect(compileProposal(proposal({ target: "token:*" }))).toBeNull();
  });

  it("forces an invariant target to human-gated regardless of the proposal tier", () => {
    // A malformed 'auto' proposal on an invariant must NOT compile to auto.
    const candidate = compileProposal(proposal({ target: "concept:Shared Space", tier: "auto" }));
    expect(candidate!.tier).toBe("human-gated");
  });
});

describe("closeLoop", () => {
  const baseline = () => ({
    products,
    events: [
      ev({ productId: "a", kind: "works", target: { kind: "component", ref: "dock" }, detail: "ok" }),
      ev({ productId: "a", kind: "override", target: { kind: "token", ref: "accent-primary" }, detail: "x" }),
      ev({ productId: "a", kind: "gap", target: { kind: "concept", ref: "Reminder" }, detail: "x" }),
      ev({ productId: "b", kind: "gap", target: { kind: "concept", ref: "Reminder" }, detail: "x" }),
    ],
    values: {} as Record<string, string>,
  });

  it("auto-applies the leaf proposal and defers the cross-product concept one", () => {
    const proposals = proposeImprovements(baseline().events, products);
    const close = closeLoop(baseline(), proposals, [fitnessGate()]);

    expect(close.applied).toContain("candidate:reconsider-token:accent-primary");
    expect(close.deferred.some((d) => d.candidateId === "candidate:canonicalize-concept:Reminder")).toBe(true);
  });

  it("emits resolution events to append and marks the target resolved in state", () => {
    const proposals = proposeImprovements(baseline().events, products);
    const close = closeLoop(baseline(), proposals, [fitnessGate()]);

    expect(close.newEvents.length).toBeGreaterThan(0);
    expect(close.newEvents.every((e) => e.kind === "works")).toBe(true);
    expect(close.state.values[resolvedKey("token:accent-primary")]).toBeTruthy();
  });

  it("never mutates the baseline", () => {
    const base = baseline();
    const before = base.events.length;
    closeLoop(base, proposeImprovements(base.events, products), [fitnessGate()]);
    expect(base.events.length).toBe(before);
    expect(Object.keys(base.values)).toHaveLength(0);
  });
});

describe("idempotency via resolvedTargets", () => {
  it("excludes already-resolved targets from the next proposal cycle", () => {
    const events = [
      ev({ productId: "a", kind: "override", target: { kind: "token", ref: "accent-primary" }, detail: "x" }),
    ];
    const first = proposeImprovements(events, products);
    expect(first.some((p) => p.target === "token:accent-primary")).toBe(true);

    const resolved = resolvedTargetsFromValues({ "resolved:token:accent-primary": "done" });
    const second = proposeImprovements(events, products, { resolvedTargets: resolved });
    expect(second.some((p) => p.target === "token:accent-primary")).toBe(false);
  });
});

describe("resolvedTargetsFromValues", () => {
  it("extracts the resolved target keys", () => {
    const values = { "resolved:token:x": "a", "change:token:x": "b", other: "c" };
    expect(resolvedTargetsFromValues(values)).toEqual(["token:x"]);
  });
});
