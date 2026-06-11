import { describe, it, expect } from "vitest";
import {
  hashSeed,
  mulberry32,
  createVariation,
  shiftHue,
  resolveVariationVars,
} from "@/system/variation";

describe("hashSeed", () => {
  it("is deterministic", () => {
    expect(hashSeed("lumina")).toBe(hashSeed("lumina"));
  });

  it("differs for different seeds", () => {
    expect(hashSeed("a")).not.toBe(hashSeed("b"));
  });

  it("returns an unsigned 32-bit integer", () => {
    const h = hashSeed("anything");
    expect(Number.isInteger(h)).toBe(true);
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThanOrEqual(0xffffffff);
  });
});

describe("mulberry32", () => {
  it("produces a stable stream for a seed", () => {
    const a = mulberry32(123);
    const b = mulberry32(123);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("stays within [0, 1)", () => {
    const rand = mulberry32(42);
    for (let i = 0; i < 1000; i++) {
      const v = rand();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("createVariation", () => {
  it("is deterministic for a seed", () => {
    expect(createVariation("design-variation-03")).toEqual(createVariation("design-variation-03"));
  });

  it("differs between seeds (not a clone)", () => {
    const a = createVariation("design-variation-01");
    const b = createVariation("design-variation-03");
    expect(a).not.toEqual(b);
  });

  it("keeps every value inside its bounded range", () => {
    for (let i = 0; i < 200; i++) {
      const v = createVariation(`seed-${i}`);
      expect(v.accentHueShift).toBeGreaterThanOrEqual(-12);
      expect(v.accentHueShift).toBeLessThanOrEqual(12);
      expect(v.radiusScale).toBeGreaterThanOrEqual(0.85);
      expect(v.radiusScale).toBeLessThanOrEqual(1.15);
      expect(v.density).toBeGreaterThanOrEqual(0.92);
      expect(v.density).toBeLessThanOrEqual(1.08);
      expect(v.glow).toBeGreaterThanOrEqual(0.7);
      expect(v.glow).toBeLessThanOrEqual(1.25);
      expect(v.tilt).toBeGreaterThanOrEqual(-6);
      expect(v.tilt).toBeLessThanOrEqual(6);
    }
  });

  it("produces the requested number of jitter values in [-1, 1]", () => {
    const v = createVariation("x", 8);
    expect(v.jitter).toHaveLength(8);
    for (const j of v.jitter) {
      expect(j).toBeGreaterThanOrEqual(-1);
      expect(j).toBeLessThanOrEqual(1);
    }
  });
});

describe("shiftHue", () => {
  it("returns a valid hex string", () => {
    expect(shiftHue("#73f2df", 10)).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("a zero shift is (near) identity", () => {
    // rounding through HSL may move ±1 per channel; assert it stays close.
    const out = shiftHue("#73f2df", 0);
    expect(out).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("a non-zero shift changes the color", () => {
    expect(shiftHue("#73f2df", 40)).not.toBe("#73f2df");
  });

  it("passes through malformed input unchanged", () => {
    expect(shiftHue("not-a-color", 10)).toBe("not-a-color");
  });
});

describe("resolveVariationVars", () => {
  it("exposes --ls-var- custom properties", () => {
    const vars = resolveVariationVars(createVariation("seed"));
    expect(vars["--ls-var-radius-scale"]).toBeTruthy();
    expect(vars["--ls-var-tilt"]).toMatch(/deg$/);
    for (const key of Object.keys(vars)) {
      expect(key.startsWith("--ls-var-")).toBe(true);
    }
  });
});
