import { describe, it, expect } from "vitest";
import {
  products,
  getProduct,
  getProductsByPlatform,
  getProductsByEra,
  resolveConceptAlias,
} from "@/system/registry";
import { eras } from "@/system/eras";

describe("products", () => {
  it("has at least 3 registered products", () => {
    expect(products.length).toBeGreaterThanOrEqual(3);
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

  it("lumina-codex is registered", () => {
    expect(products.find((p) => p.id === "lumina-codex")).toBeDefined();
  });

  it("jxl-scheduler is registered", () => {
    expect(products.find((p) => p.id === "jxl-scheduler")).toBeDefined();
  });

  it("park-memory-hub is registered", () => {
    expect(products.find((p) => p.id === "park-memory-hub")).toBeDefined();
  });
});

describe("lumina-codex product", () => {
  const codex = products.find((p) => p.id === "lumina-codex")!;

  it("targets browser platform", () => {
    expect(codex.platforms).toContain("browser");
  });

  it("uses nextjs and threejs frameworks", () => {
    expect(codex.frameworks).toContain("nextjs");
    expect(codex.frameworks).toContain("threejs");
  });

  it("defaults to atelier era", () => {
    expect(codex.defaultEra).toBe("atelier");
  });

  it("has no concept aliases (it is the reference implementation)", () => {
    expect(codex.conceptAliases).toBeUndefined();
  });
});

describe("mobile app products", () => {
  it("jxl-scheduler targets ios and ipados", () => {
    const jxl = products.find((p) => p.id === "jxl-scheduler")!;
    expect(jxl.platforms).toContain("ios");
    expect(jxl.platforms).toContain("ipados");
    expect(jxl.frameworks).toContain("swiftui");
  });

  it("park-memory-hub targets ios", () => {
    const park = products.find((p) => p.id === "park-memory-hub")!;
    expect(park.platforms).toContain("ios");
    expect(park.frameworks).toContain("swiftui");
  });

  it("jxl-scheduler aliases sharedSpace to Group", () => {
    const jxl = products.find((p) => p.id === "jxl-scheduler")!;
    expect(jxl.conceptAliases?.sharedSpace).toBe("Group");
  });

  it("park-memory-hub aliases sharedSpace to Circle", () => {
    const park = products.find((p) => p.id === "park-memory-hub")!;
    expect(park.conceptAliases?.sharedSpace).toBe("Circle");
  });
});

describe("getProduct", () => {
  it("returns the product for a known id", () => {
    const product = getProduct("lumina-codex");
    expect(product).toBeDefined();
    expect(product?.name).toBe("Lumina Codex");
  });

  it("returns undefined for an unknown id", () => {
    expect(getProduct("does-not-exist")).toBeUndefined();
  });
});

describe("getProductsByPlatform", () => {
  it("returns both mobile apps for ios platform", () => {
    const iosProducts = getProductsByPlatform("ios");
    const ids = iosProducts.map((p) => p.id);
    expect(ids).toContain("jxl-scheduler");
    expect(ids).toContain("park-memory-hub");
  });

  it("returns lumina-codex for browser platform", () => {
    const browserProducts = getProductsByPlatform("browser");
    expect(browserProducts.map((p) => p.id)).toContain("lumina-codex");
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
  it("returns the product-specific alias for jxl-scheduler sharedSpace", () => {
    expect(resolveConceptAlias("jxl-scheduler", "sharedSpace", "Shared Space")).toBe("Group");
  });

  it("returns the product-specific alias for park-memory-hub sharedSpace", () => {
    expect(resolveConceptAlias("park-memory-hub", "sharedSpace", "Shared Space")).toBe("Circle");
  });

  it("returns the fallback when no alias is defined for the concept", () => {
    expect(resolveConceptAlias("lumina-codex", "sharedSpace", "Shared Space")).toBe("Shared Space");
  });

  it("returns the fallback for an unknown product id", () => {
    expect(resolveConceptAlias("unknown-app", "sharedSpace", "Shared Space")).toBe("Shared Space");
  });

  it("returns the fallback for an unknown concept in a product with aliases", () => {
    expect(resolveConceptAlias("jxl-scheduler", "unknownConcept", "Default")).toBe("Default");
  });
});
