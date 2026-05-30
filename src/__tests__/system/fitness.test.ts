import { describe, it, expect } from "vitest";
import { recordFeedback, type FeedbackDraft } from "@/system/feedback";
import { computeFitness, proposeImprovements } from "@/system/fitness";
import { products } from "@/system/registry";

const at = "2026-05-30T00:00:00.000Z";
function make(drafts: FeedbackDraft[]) {
  return drafts.map((d) => recordFeedback({ ...d, at }));
}

describe("computeFitness", () => {
  it("scores a clean ledger high and a broken one low", () => {
    const good = make([
      { productId: "a", kind: "works", target: { kind: "component", ref: "dock" }, detail: "ok" },
      { productId: "b", kind: "works", target: { kind: "scheme", ref: "light" }, detail: "ok" },
    ]);
    const bad = make([
      { productId: "a", kind: "error", target: { kind: "token", ref: "x" }, detail: "broke", severity: "high" },
      { productId: "b", kind: "clash", target: { kind: "naming", ref: "y" }, detail: "conflict" },
    ]);
    const goodScore = computeFitness(good, products).metrics.score;
    const badScore = computeFitness(bad, products).metrics.score;
    expect(goodScore).toBeGreaterThan(badScore);
  });

  it("keeps the score within [0, 100]", () => {
    const events = make([
      { productId: "a", kind: "error", target: { kind: "token", ref: "x" }, detail: "broke", severity: "high" },
    ]);
    const { score } = computeFitness(events, products).metrics;
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("counts cross-product duplication", () => {
    const events = make([
      { productId: "a", kind: "gap", target: { kind: "concept", ref: "Reminder" }, detail: "x" },
      { productId: "b", kind: "gap", target: { kind: "concept", ref: "Reminder" }, detail: "x" },
      { productId: "a", kind: "gap", target: { kind: "token", ref: "solo" }, detail: "x" },
    ]);
    // Reminder hit by 2 products → duplication 1; "solo" by 1 → not counted.
    expect(computeFitness(events, products).metrics.duplication).toBe(1);
  });

  it("ranks hotspots worst-first by severity-weighted negative signal", () => {
    const events = make([
      { productId: "a", kind: "error", target: { kind: "token", ref: "hot" }, detail: "x", severity: "high" },
      { productId: "b", kind: "friction", target: { kind: "naming", ref: "mild" }, detail: "x", severity: "low" },
    ]);
    const { hotspots } = computeFitness(events, products);
    expect(hotspots[0].target).toBe("token:hot");
    expect(hotspots[0].negativeSignal).toBeGreaterThan(hotspots[1].negativeSignal);
  });
});

describe("proposeImprovements", () => {
  it("turns an error into a fix proposal", () => {
    const events = make([
      { productId: "a", kind: "error", target: { kind: "token", ref: "x" }, detail: "broke" },
    ]);
    const [p] = proposeImprovements(events, products);
    expect(p.id).toMatch(/^fix-/);
    expect(p.action).toMatch(/fix/i);
    expect(p.reversible).toBe(true);
    expect(p.evidence.length).toBeGreaterThan(0);
  });

  it("canonicalizes a gap that >= 2 products hit", () => {
    const events = make([
      { productId: "a", kind: "gap", target: { kind: "concept", ref: "Reminder" }, detail: "x" },
      { productId: "b", kind: "gap", target: { kind: "concept", ref: "Reminder" }, detail: "x" },
    ]);
    const p = proposeImprovements(events, products).find((x) => x.target === "concept:Reminder");
    expect(p?.id).toMatch(/^canonicalize-/);
    expect(p?.evidence).toHaveLength(2);
  });

  it("does NOT canonicalize a single-product gap", () => {
    const events = make([
      { productId: "a", kind: "gap", target: { kind: "concept", ref: "Solo" }, detail: "x" },
    ]);
    expect(proposeImprovements(events, products).some((p) => p.target === "concept:Solo")).toBe(false);
  });

  it("flags an override as a default to reconsider", () => {
    const events = make([
      { productId: "a", kind: "override", target: { kind: "token", ref: "accent-primary" }, detail: "x" },
    ]);
    const [p] = proposeImprovements(events, products);
    expect(p.id).toMatch(/^reconsider-/);
    expect(p.tier).toBe("auto");
  });

  it("tiers an invariant-touching proposal as human-gated", () => {
    const events = make([
      { productId: "a", kind: "error", target: { kind: "scheme", ref: "contrast-floor" }, detail: "x" },
    ]);
    const [p] = proposeImprovements(events, products);
    expect(p.tier).toBe("human-gated");
    expect(p.motivation).toMatch(/invariant/i);
  });

  it("stays bounded by the limit", () => {
    const events = make(
      Array.from({ length: 30 }, (_, i) => ({
        productId: `p${i}`,
        kind: "override" as const,
        target: { kind: "token" as const, ref: `t${i}` },
        detail: "x",
      })),
    );
    expect(proposeImprovements(events, products, { limit: 5 })).toHaveLength(5);
  });

  it("never proposes from pure 'works' signal", () => {
    const events = make([
      { productId: "a", kind: "works", target: { kind: "component", ref: "dock" }, detail: "ok" },
    ]);
    expect(proposeImprovements(events, products)).toHaveLength(0);
  });
});
