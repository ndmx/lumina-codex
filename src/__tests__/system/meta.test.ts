import { describe, it, expect } from "vitest";
import { recordFeedback, type FeedbackDraft } from "@/system/feedback";
import { products } from "@/system/registry";
import { LOOP_PRODUCT_ID } from "@/system/closer";
import {
  holdoutScore,
  metaSignals,
  metaReview,
  DIVERGENCE_THRESHOLD,
  SELF_WORKS_THRESHOLD,
} from "@/system/meta";

let n = 0;
const ev = (d: FeedbackDraft) => recordFeedback({ ...d, at: `2026-05-30T00:00:${String(n++).padStart(2, "0")}.000Z` });

const realWorks = (ref: string) =>
  ev({ productId: "design-variation-01", kind: "works", target: { kind: "component", ref }, detail: "ok" });
const selfWorks = (ref: string) =>
  ev({ productId: LOOP_PRODUCT_ID, kind: "works", target: { kind: "token", ref }, detail: "auto-resolved" });
const realGap = (ref: string, productId = "design-variation-01") =>
  ev({ productId, kind: "gap", target: { kind: "concept", ref }, detail: "real gap" });

describe("holdoutScore", () => {
  it("ignores loop-generated works (un-gameable)", () => {
    const withSelf = [realGap("A"), selfWorks("x"), selfWorks("y"), selfWorks("z")];
    const withoutSelf = [realGap("A")];
    // Loop-generated works must not raise the holdout.
    expect(holdoutScore(withSelf, products)).toBe(holdoutScore(withoutSelf, products));
  });
});

describe("metaSignals", () => {
  it("separates loop works from real works", () => {
    const events = [realWorks("dock"), selfWorks("x"), selfWorks("y")];
    const s = metaSignals(events, []);
    expect(s.totalWorks).toBe(3);
    expect(s.selfWorks).toBe(2);
    expect(s.productWorks).toBe(1);
    expect(s.selfResolutionRatio).toBeCloseTo(2 / 3, 2);
  });

  it("flags a resolved target that a real product re-reports as reopened", () => {
    const events = [realGap("Reminder")];
    const s = metaSignals(events, ["concept:Reminder"]);
    expect(s.reopenedTargets).toContain("concept:Reminder");
  });

  it("counts resolutions with no external confirmation as unverified", () => {
    const events = [selfWorks("x")]; // only loop confirmation
    const s = metaSignals(events, ["token:x", "token:y"]);
    expect(s.unverifiedResolutions).toEqual(["token:x", "token:y"]);
  });
});

describe("metaReview — healthy", () => {
  it("no alarms and no freeze when the metric tracks real signal", () => {
    const events = [realWorks("dock"), realGap("Reminder")];
    const review = metaReview(events, products);
    expect(review.divergence).toBe(0);
    expect(review.alarms).toHaveLength(0);
    expect(review.freezeAutoPromotion).toBe(false);
    expect(review.metaProposals).toHaveLength(0);
  });
});

describe("metaReview — gamed", () => {
  const gamed = () => {
    const events = [realGap("Reminder")];
    for (let i = 0; i < 6; i++) events.push(selfWorks(`t${i}`));
    return events;
  };

  it("detects self-congratulation and metric divergence", () => {
    const review = metaReview(gamed(), products, ["token:t0", "token:t1", "token:t2"]);
    expect(review.fitness).toBeGreaterThan(review.holdout);
    expect(review.divergence).toBeGreaterThanOrEqual(DIVERGENCE_THRESHOLD);
    const codes = review.alarms.map((a) => a.code);
    expect(codes).toContain("self-congratulation");
    expect(codes).toContain("metric-divergence");
  });

  it("freezes auto-promotion and proposes reweighting — all human-gated", () => {
    const review = metaReview(gamed(), products, ["token:t0"]);
    expect(review.freezeAutoPromotion).toBe(true);
    const kinds = review.metaProposals.map((p) => p.kind);
    expect(kinds).toContain("reweight-fitness");
    expect(kinds).toContain("freeze-auto-promotion");
    for (const p of review.metaProposals) expect(p.tier).toBe("human-gated");
  });
});

describe("metaReview — churn", () => {
  it("raises resolution-churn and proposes tightening the gate", () => {
    const events = [realWorks("dock"), realGap("Reminder")];
    const review = metaReview(events, products, ["concept:Reminder"]);
    expect(review.alarms.map((a) => a.code)).toContain("resolution-churn");
    expect(review.metaProposals.map((p) => p.kind)).toContain("tighten-gate");
  });
});

describe("thresholds", () => {
  it("exposes tunable constants", () => {
    expect(DIVERGENCE_THRESHOLD).toBeGreaterThan(0);
    expect(SELF_WORKS_THRESHOLD).toBeGreaterThan(0);
    expect(SELF_WORKS_THRESHOLD).toBeLessThanOrEqual(1);
  });
});
