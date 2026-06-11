import { describe, it, expect } from "vitest";
import {
  colorPrimitives,
  colorSemantic,
  materialColors,
  roleColors,
  shadows,
  spacing,
  typography,
  motion,
  radii,
  breakpoints,
  layers,
  tokens,
} from "@/system/tokens";

describe("colorPrimitives", () => {
  it("has all required primitive colors", () => {
    expect(colorPrimitives.void).toMatch(/^#/);
    expect(colorPrimitives.ink).toMatch(/^#/);
    expect(colorPrimitives.ivory).toMatch(/^#/);
    expect(colorPrimitives.aura).toMatch(/^#/);
    expect(colorPrimitives.auraElectric).toMatch(/^#/);
    expect(colorPrimitives.spark).toMatch(/^#/);
    expect(colorPrimitives.cyan).toMatch(/^#/);
    expect(colorPrimitives.sand).toMatch(/^#/);
  });

  it("void is the darkest background (#06070a)", () => {
    expect(colorPrimitives.void).toBe("#06070a");
  });

  it("aura is the softened teal brand accent", () => {
    expect(colorPrimitives.aura).toBe("#3c9b91");
  });

  it("keeps an electric aura for high-energy variants", () => {
    expect(colorPrimitives.auraElectric).toBe("#73f2df");
  });

  it("spark matches the CSS custom property value (#ff7d60)", () => {
    expect(colorPrimitives.spark).toBe("#ff7d60");
  });

  it("primitive color values are unique (no accidental duplicates)", () => {
    const hexValues = Object.values(colorPrimitives).filter((v) => v.startsWith("#"));
    expect(new Set(hexValues).size).toBe(hexValues.length);
  });
});

describe("colorSemantic", () => {
  it("background maps to void", () => {
    expect(colorSemantic.background).toBe(colorPrimitives.void);
  });

  it("surface maps to ink", () => {
    expect(colorSemantic.surface).toBe(colorPrimitives.ink);
  });

  it("accent.primary maps to aura", () => {
    expect(colorSemantic.accent.primary).toBe(colorPrimitives.aura);
  });

  it("accent.secondary maps to spark", () => {
    expect(colorSemantic.accent.secondary).toBe(colorPrimitives.spark);
  });

  it("text levels are defined", () => {
    expect(colorSemantic.text.primary).toBeTruthy();
    expect(colorSemantic.text.muted).toBeTruthy();
    expect(colorSemantic.text.subtle).toBeTruthy();
    expect(colorSemantic.text.faint).toBeTruthy();
  });

  it("border levels are defined", () => {
    expect(colorSemantic.border.subtle).toBeTruthy();
    expect(colorSemantic.border.visible).toBeTruthy();
    expect(colorSemantic.border.strong).toBeTruthy();
  });
});

describe("shadows", () => {
  it("has an atmosphere shadow", () => {
    expect(shadows.atmosphere).toBeTruthy();
  });

  it("has glow shadows for primary and secondary accents", () => {
    expect(shadows.glow.aura).toBeTruthy();
    expect(shadows.glow.auraElectric).toBeTruthy();
    expect(shadows.glow.spark).toBeTruthy();
  });
});

describe("materialColors", () => {
  it("defines the image-led material families learned from mobile apps", () => {
    expect(materialColors.chrome.base).toBeTruthy();
    expect(materialColors.pearl.wash).toContain("rgba");
    expect(materialColors.marble.line).toContain("rgba");
    expect(materialColors.steel.base).toBeTruthy();
    expect(materialColors.graphiteGlass.base).toBe(colorPrimitives.graphite);
  });
});

describe("roleColors", () => {
  it("separates brand colors from functional safety/status roles", () => {
    expect(roleColors.brand.primary).toBe(colorPrimitives.aura);
    expect(roleColors.status.danger).not.toBe(roleColors.brand.primary);
    expect(roleColors.status.success).toBeTruthy();
  });
});

describe("spacing", () => {
  it("has all standard scale steps", () => {
    const expectedKeys = ["0", "1", "2", "3", "4", "5", "6", "8", "12", "16"];
    for (const key of expectedKeys) {
      expect(spacing[key as keyof typeof spacing]).toBeDefined();
    }
  });

  it("all spacing values are rem or 0", () => {
    for (const value of Object.values(spacing)) {
      expect(value === "0" || value.endsWith("rem")).toBe(true);
    }
  });

  it("step 4 is 1rem (base unit)", () => {
    expect(spacing["4"]).toBe("1rem");
  });

  it("step 8 is double step 4", () => {
    const base = parseFloat(spacing["4"]);
    const double = parseFloat(spacing["8"]);
    expect(double).toBeCloseTo(base * 2);
  });
});

describe("typography", () => {
  it("defines display and body font families", () => {
    expect(typography.family.display).toBeTruthy();
    expect(typography.family.body).toBeTruthy();
  });

  it("display family includes Cormorant Garamond", () => {
    expect(typography.family.display).toContain("Cormorant Garamond");
  });

  it("body family includes Manrope", () => {
    expect(typography.family.body).toContain("Manrope");
  });

  it("has a base size of 1rem", () => {
    expect(typography.size.base).toBe("1rem");
  });

  it("all sizes are rem values", () => {
    for (const value of Object.values(typography.size)) {
      expect(value.endsWith("rem")).toBe(true);
    }
  });

  it("defines bold weight as 700", () => {
    expect(typography.weight.bold).toBe("700");
  });

  it("has tight tracking for display headings", () => {
    expect(typography.tracking.tight).toMatch(/-\d/);
  });
});

describe("motion", () => {
  it("normal duration matches CSS transition value (220ms)", () => {
    expect(motion.duration.normal).toBe("220ms");
  });

  it("all duration values are ms strings", () => {
    for (const value of Object.values(motion.duration)) {
      expect(value.endsWith("ms")).toBe(true);
    }
  });

  it("durations increase from instant to slowest", () => {
    const values = [
      motion.duration.instant,
      motion.duration.fast,
      motion.duration.normal,
      motion.duration.slow,
      motion.duration.slower,
      motion.duration.slowest,
    ].map((v) => parseInt(v));

    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });

  it("defines standard easing curves", () => {
    expect(motion.easing.linear).toBe("linear");
    expect(motion.easing.in).toContain("cubic-bezier");
    expect(motion.easing.out).toContain("cubic-bezier");
    expect(motion.easing.inOut).toContain("cubic-bezier");
  });
});

describe("radii", () => {
  it("has none (0) and pill (999px) as anchors", () => {
    expect(radii.none).toBe("0");
    expect(radii.pill).toBe("999px");
  });

  it("2xl matches the chamber's 2.25rem border-radius", () => {
    expect(radii["2xl"]).toBe("2.25rem");
  });
});

describe("breakpoints", () => {
  it("sm is 720px (mobile breakpoint from app)", () => {
    expect(breakpoints.sm).toBe("720px");
  });

  it("md is 960px (tablet breakpoint from app)", () => {
    expect(breakpoints.md).toBe("960px");
  });

  it("breakpoint values increase in order", () => {
    const values = [breakpoints.sm, breakpoints.md, breakpoints.lg, breakpoints.xl].map(
      (v) => parseInt(v),
    );
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});

describe("layers", () => {
  it("modal is above overlay", () => {
    expect(layers.modal).toBeGreaterThan(layers.overlay);
  });

  it("toast is above modal", () => {
    expect(layers.toast).toBeGreaterThan(layers.modal);
  });

  it("tooltip is the highest layer", () => {
    const max = Math.max(...Object.values(layers));
    expect(layers.tooltip).toBe(max);
  });
});

describe("tokens aggregate", () => {
  it("exposes all major categories", () => {
    expect(tokens.color).toBeDefined();
    expect(tokens.spacing).toBeDefined();
    expect(tokens.typography).toBeDefined();
    expect(tokens.motion).toBeDefined();
    expect(tokens.radii).toBeDefined();
    expect(tokens.breakpoints).toBeDefined();
    expect(tokens.layers).toBeDefined();
    expect(tokens.shadows).toBeDefined();
  });
});
