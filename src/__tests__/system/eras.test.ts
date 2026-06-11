import { describe, it, expect } from "vitest";
import { eras, eraList, defaultEra, type EraKey } from "@/system/eras";
import { colorPrimitives } from "@/system/tokens";

describe("eras record", () => {
  it("has exactly 3 eras: atelier, memphis, brutalist", () => {
    const keys = Object.keys(eras);
    expect(keys).toHaveLength(3);
    expect(keys).toContain("atelier");
    expect(keys).toContain("memphis");
    expect(keys).toContain("brutalist");
  });

  it("each era key matches its own key field", () => {
    for (const [key, era] of Object.entries(eras)) {
      expect(era.key).toBe(key);
    }
  });

  it("each era has all required fields", () => {
    for (const era of Object.values(eras)) {
      expect(era.key).toBeTruthy();
      expect(era.name).toBeTruthy();
      expect(era.mood).toBeTruthy();
      expect(era.descriptor).toBeTruthy();
      expect(era.backgroundTone).toMatch(/^(warm|neutral|cool)$/);
      expect(era.accent.primary).toBeTruthy();
      expect(era.accent.secondary).toBeTruthy();
      expect(era.accent.onPrimary).toBeTruthy();
      expect(era.glow.top).toBeTruthy();
      expect(era.glow.mid).toBeTruthy();
    }
  });

  it("accent colors are valid CSS color strings", () => {
    for (const era of Object.values(eras)) {
      const isHex = era.accent.primary.startsWith("#");
      const isRgba = era.accent.primary.startsWith("rgba");
      expect(isHex || isRgba).toBe(true);
    }
  });

  it("onPrimary colors ensure sufficient contrast (dark on light accents)", () => {
    // onPrimary values start with # and are dark (low lightness)
    for (const era of Object.values(eras)) {
      const color = era.accent.onPrimary;
      expect(color.startsWith("#")).toBe(true);
      // Lightness check: dark colors have low sum of hex channels
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      expect(brightness).toBeLessThan(80);
    }
  });
});

describe("atelier era", () => {
  it("uses aura as primary accent", () => {
    expect(eras.atelier.accent.primary).toBe(colorPrimitives.aura);
  });

  it("uses spark as secondary accent", () => {
    expect(eras.atelier.accent.secondary).toBe(colorPrimitives.spark);
  });

  it("has warm background tone", () => {
    expect(eras.atelier.backgroundTone).toBe("warm");
  });
});

describe("memphis era", () => {
  it("has neutral background tone", () => {
    expect(eras.memphis.backgroundTone).toBe("neutral");
  });

  it("uses a bright primary accent (yellow-family)", () => {
    // Memphis accent should be bright, not dark
    const color = eras.memphis.accent.primary;
    expect(color.startsWith("#")).toBe(true);
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    expect(brightness).toBeGreaterThan(200);
  });
});

describe("brutalist era", () => {
  it("has cool background tone", () => {
    expect(eras.brutalist.backgroundTone).toBe("cool");
  });

  it("uses electric aura for its high-voltage primary accent", () => {
    expect(eras.brutalist.accent.primary).toBe(colorPrimitives.auraElectric);
  });
});

describe("eraList", () => {
  it("contains all 3 eras", () => {
    expect(eraList).toHaveLength(3);
  });

  it("is consistent with the eras record", () => {
    for (const era of eraList) {
      expect(eras[era.key]).toEqual(era);
    }
  });

  it("era names are unique", () => {
    const names = eraList.map((e) => e.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("defaultEra", () => {
  it("is atelier", () => {
    expect(defaultEra).toBe("atelier");
  });

  it("corresponds to a valid era in the record", () => {
    expect(eras[defaultEra]).toBeDefined();
  });
});

describe("EraKey type coverage", () => {
  it("atelier, memphis, and brutalist are all valid EraKeys", () => {
    const keys: EraKey[] = ["atelier", "memphis", "brutalist"];
    for (const key of keys) {
      expect(eras[key]).toBeDefined();
    }
  });
});
