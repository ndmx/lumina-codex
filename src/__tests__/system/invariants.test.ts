import { describe, it, expect } from "vitest";
import {
  invariants,
  isInvariant,
  matchInvariant,
  classifyAutonomy,
} from "@/system/invariants";

describe("invariants", () => {
  it("protects the canonical Shared Space concept", () => {
    expect(isInvariant({ kind: "concept", ref: "Shared Space" })).toBe(true);
  });

  it("protects the accessibility target floor and contrast floor", () => {
    expect(isInvariant({ kind: "platform-rule", ref: "min-target" })).toBe(true);
    expect(isInvariant({ kind: "scheme", ref: "contrast-floor" })).toBe(true);
  });

  it("does not protect ordinary targets", () => {
    expect(isInvariant({ kind: "token", ref: "accent-primary" })).toBe(false);
    expect(isInvariant({ kind: "concept", ref: "Reminder" })).toBe(false);
  });

  it("every invariant carries a reason", () => {
    for (const inv of invariants) {
      expect(inv.reason.length).toBeGreaterThan(10);
    }
  });

  it("matchInvariant returns the protecting rule", () => {
    expect(matchInvariant({ kind: "concept", ref: "Shared Space" })?.reason).toMatch(/canonical/i);
    expect(matchInvariant({ kind: "token", ref: "accent-primary" })).toBeUndefined();
  });
});

describe("classifyAutonomy", () => {
  it("invariants are human-gated", () => {
    expect(classifyAutonomy({ kind: "scheme", ref: "contrast-floor" })).toBe("human-gated");
    expect(classifyAutonomy({ kind: "concept", ref: "Shared Space" })).toBe("human-gated");
  });

  it("naming and non-invariant concepts need review", () => {
    expect(classifyAutonomy({ kind: "naming", ref: "visibility-label" })).toBe("review");
    expect(classifyAutonomy({ kind: "concept", ref: "Reminder" })).toBe("review");
  });

  it("leaf targets (token defaults, components) are auto-eligible", () => {
    expect(classifyAutonomy({ kind: "token", ref: "accent-primary" })).toBe("auto");
    expect(classifyAutonomy({ kind: "component", ref: "dock" })).toBe("auto");
  });
});
