import { describe, it, expect } from "vitest";
import {
  interactionProfiles,
  getInteractionProfile,
  resolveInteraction,
  getProximityMode,
} from "@/system/platform-rules";
import { deviceOrder } from "@/system/grid";

describe("interactionProfiles", () => {
  it("covers every device class in the grid", () => {
    for (const device of deviceOrder) {
      expect(interactionProfiles[device]).toBeDefined();
      expect(interactionProfiles[device].device).toBe(device);
    }
  });

  it("touch classes have no hover and use scroll-proximity", () => {
    expect(interactionProfiles.mobile.hover).toBe(false);
    expect(interactionProfiles.mobile.proximity).toBe("scroll");
    expect(interactionProfiles.tablet.hover).toBe(false);
    expect(interactionProfiles.tablet.proximity).toBe("scroll");
  });

  it("pointer classes have hover and use pointer-proximity", () => {
    expect(interactionProfiles.desktop.hover).toBe(true);
    expect(interactionProfiles.desktop.proximity).toBe("pointer");
    expect(interactionProfiles.wide.proximity).toBe("pointer");
  });

  it("only mobile drives layout from thumb reach", () => {
    expect(interactionProfiles.mobile.thumbReach).toBe(true);
    expect(interactionProfiles.tablet.thumbReach).toBe(false);
    expect(interactionProfiles.desktop.thumbReach).toBe(false);
  });

  it("primary navigation matches the platform convention", () => {
    expect(interactionProfiles.mobile.primaryNav).toBe("tab-bar");
    expect(interactionProfiles.desktop.primaryNav).toBe("top-bar");
  });

  it("all interactive targets meet the constitution's 44px floor", () => {
    expect(interactionProfiles.mobile.minTarget).toBeGreaterThanOrEqual(44);
    expect(interactionProfiles.tablet.minTarget).toBeGreaterThanOrEqual(44);
    expect(interactionProfiles.desktop.minTarget).toBeGreaterThanOrEqual(44);
    expect(interactionProfiles.wide.minTarget).toBeGreaterThanOrEqual(44);
  });

  it("hover ⇒ pointer-proximity, no-hover ⇒ not pointer-proximity (internal consistency)", () => {
    for (const device of deviceOrder) {
      const p = interactionProfiles[device];
      if (p.hover) expect(p.proximity).toBe("pointer");
      else expect(p.proximity).not.toBe("pointer");
    }
  });
});

describe("resolveInteraction", () => {
  it("maps widths to the right profile", () => {
    expect(resolveInteraction(390).device).toBe("mobile");
    expect(resolveInteraction(800).device).toBe("tablet");
    expect(resolveInteraction(1280).device).toBe("desktop");
    expect(resolveInteraction(1920).device).toBe("wide");
  });
});

describe("getInteractionProfile", () => {
  it("returns the profile for a device", () => {
    expect(getInteractionProfile("mobile").pointer).toBe("coarse");
    expect(getInteractionProfile("desktop").pointer).toBe("fine");
  });
});

describe("getProximityMode", () => {
  it("routes pointer devices to the dock, touch to the rail", () => {
    expect(getProximityMode("desktop")).toBe("pointer");
    expect(getProximityMode("mobile")).toBe("scroll");
  });

  it("reduced motion forces none everywhere", () => {
    expect(getProximityMode("desktop", true)).toBe("none");
    expect(getProximityMode("mobile", true)).toBe("none");
  });
});
