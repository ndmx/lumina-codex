import { describe, it, expect } from "vitest";
import {
  appearanceControlGuidance,
  appearancePreferences,
  getAppearancePreference,
  pairedBackgroundGuidance,
  resolveAppearanceScheme,
} from "@/system/appearance";

describe("appearancePreferences", () => {
  it("defines system, light, and dark options", () => {
    expect(Object.keys(appearancePreferences)).toEqual(["system", "light", "dark"]);
    expect(appearancePreferences.system.resolvedScheme).toBe("system");
    expect(appearancePreferences.light.resolvedScheme).toBe("light");
    expect(appearancePreferences.dark.resolvedScheme).toBe("dark");
  });

  it("uses platform-familiar icons for the segmented control", () => {
    expect(appearancePreferences.system.icon).toBe("circle.lefthalf.filled");
    expect(appearancePreferences.light.icon).toContain("sun");
    expect(appearancePreferences.dark.icon).toContain("moon");
  });
});

describe("resolveAppearanceScheme", () => {
  it("follows the system scheme when preference is system", () => {
    expect(resolveAppearanceScheme("system", "light")).toBe("light");
    expect(resolveAppearanceScheme("system", "dark")).toBe("dark");
  });

  it("honors explicit light and dark overrides", () => {
    expect(resolveAppearanceScheme("light", "dark")).toBe("light");
    expect(resolveAppearanceScheme("dark", "light")).toBe("dark");
  });
});

describe("getAppearancePreference", () => {
  it("falls back to system for unknown stored values", () => {
    expect(getAppearancePreference("sepia").key).toBe("system");
    expect(getAppearancePreference(undefined).key).toBe("system");
  });
});

describe("appearanceControlGuidance", () => {
  it("defaults to a persisted segmented control in app preferences", () => {
    expect(appearanceControlGuidance.defaultPreference).toBe("system");
    expect(appearanceControlGuidance.preferredControl).toBe("segmented-control");
    expect(appearanceControlGuidance.recommendedPlacement).toContain("profile");
    expect(appearanceControlGuidance.storageKey).toBe("AppAppearancePreference");
  });
});

describe("pairedBackgroundGuidance", () => {
  it("keeps light and dark backgrounds compositionally paired", () => {
    expect(pairedBackgroundGuidance.light).toContain("pearl");
    expect(pairedBackgroundGuidance.dark).toContain("graphite");
    expect(pairedBackgroundGuidance.sharedComposition).toContain(
      "calm center or reading lane behind dense copy",
    );
  });
});
