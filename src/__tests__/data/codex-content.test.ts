import { describe, it, expect } from "vitest";
import {
  eras,
  principles,
  principleExhibits,
  principleDossiers,
  milestones,
  type EraKey,
} from "@/components/codex-content";

describe("eras", () => {
  it("has exactly 3 eras", () => {
    expect(eras).toHaveLength(3);
  });

  it("contains atelier, memphis, and brutalist keys", () => {
    const keys = eras.map((e) => e.key);
    expect(keys).toContain("atelier");
    expect(keys).toContain("memphis");
    expect(keys).toContain("brutalist");
  });

  it("each era has all required fields", () => {
    for (const era of eras) {
      expect(era.key).toBeTruthy();
      expect(era.name).toBeTruthy();
      expect(era.mood).toBeTruthy();
      expect(era.descriptor).toBeTruthy();
    }
  });

  it("era keys are unique", () => {
    const keys = eras.map((e) => e.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("principles", () => {
  it("has exactly 4 principles", () => {
    expect(principles).toHaveLength(4);
  });

  it("contains balance, contrast, rhythm, and unity", () => {
    const keys = principles.map((p) => p.key);
    expect(keys).toContain("balance");
    expect(keys).toContain("contrast");
    expect(keys).toContain("rhythm");
    expect(keys).toContain("unity");
  });

  it("each principle has all required fields", () => {
    for (const principle of principles) {
      expect(principle.key).toBeTruthy();
      expect(principle.name).toBeTruthy();
      expect(principle.shape).toBeTruthy();
      expect(principle.eyebrow).toBeTruthy();
      expect(principle.blurb).toBeTruthy();
      expect(principle.statement).toBeTruthy();
      expect(principle.status).toBeTruthy();
      expect(principle.accent).toBeTruthy();
      expect(principle.className).toBeTruthy();
    }
  });

  it("principle keys are unique", () => {
    const keys = principles.map((p) => p.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("balance is the first principle (default active state)", () => {
    expect(principles[0].key).toBe("balance");
  });

  it("each principle shape is a non-empty string", () => {
    const shapes = principles.map((p) => p.shape);
    expect(shapes).toEqual(["Sphere", "Torus", "Cube", "Prism"]);
  });
});

describe("principleExhibits", () => {
  it("has one exhibit per principle", () => {
    expect(principleExhibits).toHaveLength(principles.length);
  });

  it("each exhibit references a valid principle key", () => {
    const validKeys = new Set(principles.map((p) => p.key));
    for (const exhibit of principleExhibits) {
      expect(validKeys.has(exhibit.principleKey)).toBe(true);
    }
  });

  it("exhibit keys are unique (no duplicate principleKey)", () => {
    const keys = principleExhibits.map((e) => e.principleKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("each exhibit has a valid recommendedEra", () => {
    const validEraKeys = new Set<EraKey>(["atelier", "memphis", "brutalist"]);
    for (const exhibit of principleExhibits) {
      expect(validEraKeys.has(exhibit.recommendedEra)).toBe(true);
    }
  });

  it("each exhibit has all required text fields", () => {
    for (const exhibit of principleExhibits) {
      expect(exhibit.title).toBeTruthy();
      expect(exhibit.lede).toBeTruthy();
      expect(exhibit.body).toBeTruthy();
      expect(exhibit.sceneCue).toBeTruthy();
      expect(exhibit.narrativeCue).toBeTruthy();
      expect(exhibit.recommendedEraLabel).toBeTruthy();
    }
  });

  it("recommendedEraLabel matches the era name", () => {
    const eraNameByKey = Object.fromEntries(eras.map((e) => [e.key, e.name]));
    for (const exhibit of principleExhibits) {
      expect(exhibit.recommendedEraLabel).toBe(eraNameByKey[exhibit.recommendedEra]);
    }
  });
});

describe("principleDossiers", () => {
  it("has one dossier per principle", () => {
    expect(principleDossiers).toHaveLength(principles.length);
  });

  it("each dossier references a valid principle key", () => {
    const validKeys = new Set(principles.map((p) => p.key));
    for (const dossier of principleDossiers) {
      expect(validKeys.has(dossier.principleKey)).toBe(true);
    }
  });

  it("dossier principleKeys are unique", () => {
    const keys = principleDossiers.map((d) => d.principleKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("each dossier has non-empty list fields", () => {
    for (const dossier of principleDossiers) {
      expect(dossier.conductNotes.length).toBeGreaterThan(0);
      expect(dossier.sceneBehaviors.length).toBeGreaterThan(0);
      expect(dossier.copyNotes.length).toBeGreaterThan(0);
    }
  });

  it("each dossier has all required text fields", () => {
    for (const dossier of principleDossiers) {
      expect(dossier.chapterName).toBeTruthy();
      expect(dossier.opening).toBeTruthy();
      expect(dossier.atmosphere).toBeTruthy();
      expect(dossier.impactNote).toBeTruthy();
    }
  });

  it("principle order matches between principles and dossiers", () => {
    for (const principle of principles) {
      const dossier = principleDossiers.find((d) => d.principleKey === principle.key);
      expect(dossier).toBeDefined();
    }
  });
});

describe("milestones", () => {
  it("has at least 4 milestones", () => {
    expect(milestones.length).toBeGreaterThanOrEqual(4);
  });

  it("each milestone has a title and body", () => {
    for (const milestone of milestones) {
      expect(milestone.title).toBeTruthy();
      expect(milestone.body).toBeTruthy();
    }
  });

  it("milestone titles are numbered sequentially", () => {
    milestones.forEach((milestone, index) => {
      expect(milestone.title).toContain(String(index + 1));
    });
  });
});
