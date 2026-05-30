import { describe, it, expect } from "vitest";
import {
  recordFeedback,
  defaultSeverity,
  isFeedbackEvent,
  feedbackKinds,
  severityWeight,
  FeedbackValidationError,
} from "@/system/feedback";

describe("recordFeedback", () => {
  it("fills id, at, and severity from a draft", () => {
    const e = recordFeedback({
      productId: "jxl-scheduler",
      kind: "gap",
      target: { kind: "concept", ref: "Reminder" },
      detail: "No canonical reminder chip.",
    });
    expect(e.id).toMatch(/^gap-/);
    expect(e.at).toMatch(/\dT\d/);
    expect(e.severity).toBe("low");
    expect(e.productId).toBe("jxl-scheduler");
  });

  it("is deterministic for identical content + timestamp", () => {
    const draft = {
      productId: "p",
      kind: "error" as const,
      target: { kind: "scheme" as const, ref: "contrast-floor" },
      detail: "fails",
      at: "2026-05-30T00:00:00.000Z",
    };
    expect(recordFeedback(draft).id).toBe(recordFeedback(draft).id);
  });

  it("respects an explicit severity", () => {
    const e = recordFeedback({
      productId: "p",
      kind: "gap",
      target: { kind: "token", ref: "aura" },
      detail: "x",
      severity: "high",
    });
    expect(e.severity).toBe("high");
  });

  it("throws on unknown kind", () => {
    expect(() =>
      // @ts-expect-error testing runtime validation
      recordFeedback({ productId: "p", kind: "vibes", target: { kind: "token" }, detail: "x" }),
    ).toThrow(FeedbackValidationError);
  });

  it("throws when productId or detail is missing", () => {
    expect(() =>
      // @ts-expect-error missing productId
      recordFeedback({ kind: "gap", target: { kind: "token" }, detail: "x" }),
    ).toThrow(FeedbackValidationError);
    expect(() =>
      recordFeedback({ productId: "p", kind: "gap", target: { kind: "token" }, detail: "" }),
    ).toThrow(FeedbackValidationError);
  });
});

describe("defaultSeverity", () => {
  it("maps errors high and works info", () => {
    expect(defaultSeverity("error")).toBe("high");
    expect(defaultSeverity("clash")).toBe("medium");
    expect(defaultSeverity("works")).toBe("info");
  });

  it("severity weights increase with severity", () => {
    expect(severityWeight.info).toBeLessThan(severityWeight.low);
    expect(severityWeight.low).toBeLessThan(severityWeight.medium);
    expect(severityWeight.medium).toBeLessThan(severityWeight.high);
  });
});

describe("isFeedbackEvent", () => {
  it("accepts a real event and rejects junk", () => {
    const e = recordFeedback({
      productId: "p",
      kind: "works",
      target: { kind: "component", ref: "dock" },
      detail: "ok",
    });
    expect(isFeedbackEvent(e)).toBe(true);
    expect(isFeedbackEvent({ kind: "works" })).toBe(false);
    expect(isFeedbackEvent(null)).toBe(false);
    expect(isFeedbackEvent({ id: "x", at: "y", productId: "p", kind: "nope", detail: "d", target: {} })).toBe(
      false,
    );
  });
});

describe("feedbackKinds", () => {
  it("covers the seven signal types", () => {
    expect([...feedbackKinds].sort()).toEqual(
      ["clash", "error", "friction", "gap", "override", "proposal", "works"].sort(),
    );
  });
});
