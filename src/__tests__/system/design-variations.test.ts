import { describe, it, expect } from "vitest";
import {
  designVariationList,
  designVariations,
  formatDesignVariationSignature,
  getDesignVariationCodeComment,
  getDesignVariation,
  getDesignVariationsByPlatform,
  getDesignVariationsByScheme,
} from "@/system/design-variations";

describe("designVariations", () => {
  it("publishes numbered generic design types", () => {
    expect(designVariationList.map((variation) => variation.id)).toEqual([
      "design-variation-01",
      "design-variation-02",
      "design-variation-03",
      "design-variation-04",
    ]);
  });

  it("describes Pearl Planner Glass without private app names", () => {
    const variation = designVariations["design-variation-01"];
    expect(variation.name).toBe("Pearl Planner Glass");
    expect(variation.signature.code).toBe(
      "Lumina Design System · Variation 01 · Created by ndmx",
    );
    expect(variation.signature.comment).toBe(
      "/* Lumina Design System · Variation 01 · Created by ndmx */",
    );
    expect(variation.backgroundMaterials).toContain("pearl");
    expect(variation.preferredTreatments).toContain("outline");
  });

  it("describes Smoked Graphite Glass as the dark companion", () => {
    const variation = designVariations["design-variation-02"];
    expect(variation.recommendedSchemes).toEqual(["dark"]);
    expect(variation.backgroundMaterials).toContain("smoked-graphite");
    expect(variation.uxRules.join(" ")).toContain("System, Light, and Dark");
  });

  it("keeps map safety distinct from atmospheric surface treatments", () => {
    const variation = designVariations["design-variation-04"];
    expect(variation.backgroundMaterials).toEqual(["map"]);
    expect(variation.preferredTreatments).toContain("solid-panel");
    expect(variation.visualRules.join(" ")).toContain("functional status colors");
  });
});

describe("design variation lookup helpers", () => {
  it("gets a design variation by id", () => {
    expect(getDesignVariation("design-variation-03")?.name).toBe(
      "Chrome Pearl Memory Surface",
    );
    expect(getDesignVariation("private-app")).toBeUndefined();
  });

  it("formats the required code-only app signature", () => {
    expect(formatDesignVariationSignature("design-variation-04")).toBe(
      "Lumina Design System · Variation 04 · Created by ndmx",
    );
    expect(getDesignVariationCodeComment("design-variation-04")).toBe(
      "/* Lumina Design System · Variation 04 · Created by ndmx */",
    );
    expect(formatDesignVariationSignature("private-app")).toBeUndefined();
    expect(getDesignVariationCodeComment("private-app")).toBeUndefined();
  });

  it("filters design variations by platform", () => {
    const ids = getDesignVariationsByPlatform("macos").map((variation) => variation.id);
    expect(ids).toContain("design-variation-01");
    expect(ids).toContain("design-variation-02");
  });

  it("filters design variations by scheme", () => {
    const darkIds = getDesignVariationsByScheme("dark").map((variation) => variation.id);
    expect(darkIds).toContain("design-variation-02");
    expect(darkIds).toContain("design-variation-03");
  });
});
