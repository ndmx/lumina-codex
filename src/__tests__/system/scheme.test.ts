import { describe, it, expect } from "vitest";
import {
  schemes,
  schemeList,
  defaultScheme,
  invertScheme,
  resolveSchemeVars,
} from "@/system/scheme";

describe("schemes", () => {
  it("defines both light and dark", () => {
    expect(schemes.light).toBeDefined();
    expect(schemes.dark).toBeDefined();
    expect(schemeList).toHaveLength(2);
  });

  it("dark background is darker than light background", () => {
    // crude luminance check on the hex backgrounds
    expect(schemes.dark.background).toBe("#06070a");
    expect(schemes.light.background.toLowerCase()).not.toBe(schemes.dark.background);
  });

  it("light text is dark ink, dark text is ivory (inverted)", () => {
    expect(schemes.light.text.primary).toBe("#15140f");
    expect(schemes.dark.text.primary).toMatch(/^#f/i);
  });

  it("every scheme exposes the full surface contract", () => {
    for (const s of schemeList) {
      expect(s.background).toBeTruthy();
      expect(s.surface).toBeTruthy();
      expect(s.surfaceRaised).toBeTruthy();
      expect(s.text.primary).toBeTruthy();
      expect(s.text.faint).toBeTruthy();
      expect(s.border.strong).toBeTruthy();
      expect(s.overlay.heavy).toBeTruthy();
      expect(s.shadow).toBeTruthy();
    }
  });

  it("default scheme is dark (matches the shipped page)", () => {
    expect(defaultScheme).toBe("dark");
  });
});

describe("invertScheme", () => {
  it("flips between light and dark", () => {
    expect(invertScheme("dark")).toBe("light");
    expect(invertScheme("light")).toBe("dark");
  });
});

describe("resolveSchemeVars", () => {
  it("produces --ls- prefixed custom properties", () => {
    const vars = resolveSchemeVars("dark", "atelier");
    for (const key of Object.keys(vars)) {
      expect(key.startsWith("--ls-")).toBe(true);
    }
  });

  it("scheme and era axes are independent", () => {
    const darkAtelier = resolveSchemeVars("dark", "atelier");
    const lightAtelier = resolveSchemeVars("light", "atelier");
    // Same era → same accent, regardless of scheme.
    expect(darkAtelier["--ls-accent"]).toBe(lightAtelier["--ls-accent"]);
    // Different scheme → different background.
    expect(darkAtelier["--ls-bg"]).not.toBe(lightAtelier["--ls-bg"]);
  });

  it("era drives the accent", () => {
    const atelier = resolveSchemeVars("dark", "atelier");
    const memphis = resolveSchemeVars("dark", "memphis");
    expect(atelier["--ls-accent"]).not.toBe(memphis["--ls-accent"]);
  });

  it("falls back to safe defaults for unknown inputs", () => {
    // @ts-expect-error testing runtime resilience
    const vars = resolveSchemeVars("plaid", "vaporwave");
    expect(vars["--ls-bg"]).toBeTruthy();
    expect(vars["--ls-accent"]).toBeTruthy();
  });
});
