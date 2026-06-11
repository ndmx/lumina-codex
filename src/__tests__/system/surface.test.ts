import { describe, it, expect } from "vitest";
import {
  backgroundMaterials,
  contentBlockTreatments,
  recommendContentBlock,
} from "@/system/surface";

describe("backgroundMaterials", () => {
  it("knows the image-led material families used by Lumina mobile apps", () => {
    expect(backgroundMaterials["chrome-pearl"].recommendedFor).toContain("shared-space");
    expect(backgroundMaterials.chrome.guidance.defaultTreatment).toBe("glass");
    expect(backgroundMaterials["smoked-graphite"].recommendedFor).toContain("night-mode");
    expect(backgroundMaterials.map.guidance.preferredTextZone).toBe("map-safe-area");
  });
});

describe("contentBlockTreatments", () => {
  it("keeps outline and glass treatments lighter than a solid panel", () => {
    expect(contentBlockTreatments.outline.fill).toBe("transparent");
    expect(contentBlockTreatments.glass.fill).toBe("var(--ls-overlay-medium)");
    expect(contentBlockTreatments["solid-panel"].fill).toBe("var(--ls-surface)");
  });
});

describe("recommendContentBlock", () => {
  it("uses outlines for repeated chrome-pearl blocks when contrast is low", () => {
    expect(recommendContentBlock({ background: "chrome-pearl", repeated: true }).key).toBe(
      "outline",
    );
  });

  it("upgrades interactive image-surface blocks to glass", () => {
    expect(
      recommendContentBlock({ background: "chrome-pearl", interactive: true }).key,
    ).toBe("glass");
  });

  it("avoids opaque cards on chrome-pearl even when contrast risk rises", () => {
    expect(
      recommendContentBlock({ background: "chrome-pearl", dense: true, contrastRisk: "high" })
        .key,
    ).toBe("glass");
  });

  it("allows solid panels for dense safety map data", () => {
    expect(
      recommendContentBlock({ background: "map", dense: true, contrastRisk: "high" }).key,
    ).toBe("solid-panel");
  });

  it("uses glass before solid panels on smoked-graphite scheduler backgrounds", () => {
    expect(
      recommendContentBlock({ background: "smoked-graphite", repeated: true }).key,
    ).toBe("glass");
    expect(
      recommendContentBlock({ background: "smoked-graphite", dense: true, contrastRisk: "high" })
        .key,
    ).toBe("solid-panel");
  });
});
