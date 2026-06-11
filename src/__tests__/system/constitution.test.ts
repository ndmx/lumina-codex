import { describe, it, expect } from "vitest";
import {
  luminaConstitution,
  constitutionPrinciples,
  componentSpecFields,
  governanceRules,
  getConstitutionPrinciple,
  getFoundationRequirement,
  isConstitutionPrincipleId,
} from "@/system/constitution";

describe("luminaConstitution", () => {
  it("exposes the June 2026 constitution as a versioned system contract", () => {
    expect(luminaConstitution.name).toBe("Lumina Design Constitution");
    expect(luminaConstitution.version).toBe("1.0.0");
    expect(luminaConstitution.effectiveDate).toBe("2026-06-11");
  });

  it("defines the eight constitution principles", () => {
    expect(constitutionPrinciples.map((principle) => principle.id)).toEqual([
      "purpose",
      "agency",
      "responsibility",
      "familiarity",
      "flexibility",
      "simplicity",
      "craft",
      "delight",
    ]);
  });

  it("keeps each principle auditable", () => {
    for (const principle of constitutionPrinciples) {
      expect(principle.question).toContain("?");
      expect(principle.rule.length).toBeGreaterThan(40);
      expect(principle.auditTarget).toBeTruthy();
    }
  });

  it("captures Apple-platform foundation floors", () => {
    expect(getFoundationRequirement("accessibility")?.requirement).toContain("44px");
    expect(getFoundationRequirement("motion")?.requirement).toContain("reduced-motion");
    expect(getFoundationRequirement("privacy")?.requirement).toContain("permissions");
  });

  it("requires the component spec fields from the constitution", () => {
    expect(componentSpecFields).toContain("purpose");
    expect(componentSpecFields).toContain("platformAlignment");
    expect(componentSpecFields).toContain("tokenDependencies");
    expect(componentSpecFields).toContain("accessibility");
    expect(componentSpecFields).toContain("interactionRules");
  });

  it("human-gates changes to core principles and foundation floors", () => {
    const humanGated = governanceRules
      .filter((rule) => rule.requiredAction === "human-gated")
      .map((rule) => rule.id);

    expect(humanGated).toContain("core-principle-change");
    expect(humanGated).toContain("foundation-floor-change");
  });
});

describe("constitution helpers", () => {
  it("looks up a known principle", () => {
    expect(getConstitutionPrinciple("responsibility").name).toBe("Responsibility");
  });

  it("narrows valid principle ids", () => {
    expect(isConstitutionPrincipleId("craft")).toBe(true);
    expect(isConstitutionPrincipleId("decoration")).toBe(false);
  });

  it("returns undefined for unknown foundation requirements", () => {
    expect(getFoundationRequirement("unknown")).toBeUndefined();
  });
});
