/**
 * Lumina mobile-vs-web interaction rules.
 *
 * The grid (grid.ts) answers "what shape is the layout?". This module answers
 * the sibling question: "how does the user *touch* it?". Pointer vs. touch is
 * not a styling detail — it changes which idioms are even available (there is no
 * hover on a finger, no proximity field on a tap), so the system encodes the
 * rules once, executably, instead of leaving each product to re-derive them.
 *
 * The companion prose is docs/system/mobile-vs-web.md.
 */

import { deviceForWidth, type DeviceClass } from "./grid.js";

/** How "distance-driven" interactions should source their distance. */
export type ProximityMode = "pointer" | "scroll" | "none";

export type InteractionProfile = {
  device: DeviceClass;
  /** Primary input. Drives hover vs. press affordances. */
  pointer: "coarse" | "fine";
  /** Does a hover state exist at all? */
  hover: boolean;
  /**
   * Which proximity idiom applies:
   *  - "pointer": pointer-distance scaling (ProximityDock).
   *  - "scroll":  scroll-distance scaling (ScrollProximityRail) — the touch analog.
   *  - "none":    skip; reduced-motion or no meaningful focal point.
   */
  proximity: ProximityMode;
  /** Where primary navigation lives on this class. */
  primaryNav: "tab-bar" | "sidebar" | "top-bar";
  /** Minimum comfortable interactive target, px. */
  minTarget: number;
  /** Whether one-handed thumb reach should drive control placement. */
  thumbReach: boolean;
  /** Gestures the class is expected to support. */
  gestures: readonly string[];
  /** How much motion the class should budget for by default. */
  motionBudget: "reduced" | "standard" | "rich";
};

// ─── The rules ────────────────────────────────────────────────────────────────

export const interactionProfiles: Record<DeviceClass, InteractionProfile> = {
  mobile: {
    device: "mobile",
    pointer: "coarse",
    hover: false,
    proximity: "scroll",
    primaryNav: "tab-bar",
    minTarget: 44,
    thumbReach: true,
    gestures: ["tap", "swipe", "long-press", "pull-to-refresh"],
    motionBudget: "standard",
  },
  tablet: {
    device: "tablet",
    pointer: "coarse",
    hover: false,
    proximity: "scroll",
    primaryNav: "sidebar",
    minTarget: 44,
    thumbReach: false,
    gestures: ["tap", "swipe", "long-press", "drag"],
    motionBudget: "standard",
  },
  desktop: {
    device: "desktop",
    pointer: "fine",
    hover: true,
    proximity: "pointer",
    primaryNav: "top-bar",
    minTarget: 44,
    thumbReach: false,
    gestures: ["click", "hover", "right-click", "wheel", "drag", "keyboard"],
    motionBudget: "rich",
  },
  wide: {
    device: "wide",
    pointer: "fine",
    hover: true,
    proximity: "pointer",
    primaryNav: "sidebar",
    minTarget: 44,
    thumbReach: false,
    gestures: ["click", "hover", "right-click", "wheel", "drag", "keyboard"],
    motionBudget: "rich",
  },
};

// ─── Resolution helpers ───────────────────────────────────────────────────────

/** Interaction rules for a device class. */
export function getInteractionProfile(device: DeviceClass): InteractionProfile {
  return interactionProfiles[device];
}

/** Interaction rules for a viewport width. */
export function resolveInteraction(width: number): InteractionProfile {
  return interactionProfiles[deviceForWidth(width)];
}

/**
 * Which proximity component a surface should mount for this device — the single
 * decision that routes pointer surfaces to ProximityDock and touch surfaces to
 * ScrollProximityRail. `reduceMotion` forces "none".
 */
export function getProximityMode(
  device: DeviceClass,
  reduceMotion = false,
): ProximityMode {
  if (reduceMotion) return "none";
  return interactionProfiles[device].proximity;
}
