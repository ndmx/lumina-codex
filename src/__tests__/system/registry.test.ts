import { describe, it, expect } from "vitest";
import {
  products,
  registryEntries,
  getProduct,
  getProductsByPlatform,
  getProductsByEra,
  getRegistryEntry,
  getRegistryEntriesByPlatform,
  getRegistryEntriesByEra,
  resolveConceptAlias,
} from "@/system/registry";
import { eras } from "@/system/eras";

describe("products", () => {
  it("has numbered public design variations", () => {
    expect(products.length).toBeGreaterThanOrEqual(4);
  });

  it("each product id is unique", () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each product has all required fields", () => {
    for (const product of products) {
      expect(product.id).toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(product.description).toBeTruthy();
      expect(product.mediums.length).toBeGreaterThan(0);
      expect(product.platforms.length).toBeGreaterThan(0);
      expect(product.frameworks.length).toBeGreaterThan(0);
      expect(product.defaultEra).toBeTruthy();
      expect(product.registeredAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("all defaultEra values are valid era keys", () => {
    const validEraKeys = new Set(Object.keys(eras));
    for (const product of products) {
      expect(validEraKeys.has(product.defaultEra)).toBe(true);
    }
  });

  it("the legacy products export mirrors registryEntries", () => {
    expect(products).toBe(registryEntries);
  });

  it("design-variation-01 is registered", () => {
    expect(products.find((p) => p.id === "design-variation-01")).toBeDefined();
  });

  it("design-variation-03 is registered", () => {
    expect(products.find((p) => p.id === "design-variation-03")).toBeDefined();
  });

  it("design-variation-04 is registered", () => {
    expect(products.find((p) => p.id === "design-variation-04")).toBeDefined();
  });
});

describe("public design variation references", () => {
  it("design-variation-01 targets ios and ipados", () => {
    const variation = products.find((p) => p.id === "design-variation-01")!;
    expect(variation.platforms).toContain("ios");
    expect(variation.platforms).toContain("ipados");
    expect(variation.frameworks).toContain("swiftui");
  });

  it("design-variation-03 targets ios", () => {
    const variation = products.find((p) => p.id === "design-variation-03")!;
    expect(variation.platforms).toContain("ios");
    expect(variation.frameworks).toContain("swiftui");
    expect(variation.tokenOverrides?.surfaceTreatment).toContain("chrome-pearl");
  });

  it("design-variation-04 separates brand accents from safety roles", () => {
    const variation = products.find((p) => p.id === "design-variation-04")!;
    expect(variation.platforms).toContain("ios");
    expect(variation.frameworks).toContain("swiftui");
    expect(variation.tokenOverrides?.functionalDanger).toBe("#c8102e");
    expect(variation.tokenOverrides?.surfaceTreatment).toContain("map-glass");
  });

  it("design-variation-01 records the paired appearance-background variation", () => {
    const variation = products.find((p) => p.id === "design-variation-02")!;
    expect(variation.tokenOverrides?.appearancePreference).toContain("system-light-dark");
    expect(variation.tokenOverrides?.surfaceTreatment).toContain("smoked-graphite");
    expect(variation.tokenOverrides?.backgroundPair).toContain("design-variation-01");
  });
});

describe("getProduct", () => {
  it("returns the product for a known id", () => {
    const product = getProduct("design-variation-01");
    expect(product).toBeDefined();
    expect(product?.name).toContain("Design Variation 01");
  });

  it("returns undefined for an unknown id", () => {
    expect(getProduct("does-not-exist")).toBeUndefined();
  });
});

describe("new registry helpers", () => {
  it("returns the registry entry for a known id", () => {
    expect(getRegistryEntry("design-variation-02")?.name).toContain("Design Variation 02");
  });

  it("filters registry entries by platform and era", () => {
    expect(getRegistryEntriesByPlatform("ios").map((p) => p.id)).toContain("design-variation-01");
    expect(getRegistryEntriesByEra("atelier").length).toBeGreaterThanOrEqual(4);
  });
});

describe("getProductsByPlatform", () => {
  it("returns design variations for ios platform", () => {
    const iosProducts = getProductsByPlatform("ios");
    const ids = iosProducts.map((p) => p.id);
    expect(ids).toContain("design-variation-01");
    expect(ids).toContain("design-variation-03");
    expect(ids).toContain("design-variation-04");
  });

  it("returns design variations for browser platform", () => {
    const browserProducts = getProductsByPlatform("browser");
    expect(browserProducts.map((p) => p.id)).toContain("design-variation-01");
  });

  it("returns empty array for a platform with no registered products", () => {
    expect(getProductsByPlatform("watch")).toHaveLength(0);
  });
});

describe("getProductsByEra", () => {
  it("returns all products using the atelier era", () => {
    const atelierProducts = getProductsByEra("atelier");
    expect(atelierProducts.length).toBeGreaterThanOrEqual(3);
  });

  it("returns empty array for an era with no products", () => {
    expect(getProductsByEra("memphis")).toHaveLength(0);
  });
});

describe("resolveConceptAlias", () => {
  it("returns the fallback when no alias is defined for the concept", () => {
    expect(resolveConceptAlias("design-variation-01", "sharedSpace", "Shared Space")).toBe("Shared Space");
  });

  it("returns the fallback for an unknown product id", () => {
    expect(resolveConceptAlias("unknown-app", "sharedSpace", "Shared Space")).toBe("Shared Space");
  });

  it("returns the fallback for an unknown concept in a generic variation", () => {
    expect(resolveConceptAlias("design-variation-01", "unknownConcept", "Default")).toBe("Default");
  });
});
