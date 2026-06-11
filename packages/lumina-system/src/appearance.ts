/**
 * User-controlled appearance preferences.
 *
 * `scheme.ts` defines the light/dark canvas. This module teaches consuming apps
 * how to expose that axis without taking control away from the user: default to
 * the operating system, then allow a local Light or Dark override.
 */

import type { Scheme } from "./scheme.js";

export type AppearancePreferenceKey = "system" | "light" | "dark";

export type AppearancePreference = {
  key: AppearancePreferenceKey;
  title: string;
  icon: string;
  description: string;
  resolvedScheme: Scheme | "system";
};

export type AppearanceControlGuidance = {
  storageKey: string;
  defaultPreference: AppearancePreferenceKey;
  recommendedPlacement: readonly string[];
  preferredControl: "segmented-control" | "radio-group" | "menu";
  behavior: readonly string[];
};

export type BackgroundPairGuidance = {
  light: string;
  dark: string;
  rule: string;
  sharedComposition: readonly string[];
};

export const appearancePreferences: Record<AppearancePreferenceKey, AppearancePreference> = {
  system: {
    key: "system",
    title: "System",
    icon: "circle.lefthalf.filled",
    description: "Follow the device or browser appearance setting.",
    resolvedScheme: "system",
  },
  light: {
    key: "light",
    title: "Light",
    icon: "sun.max.fill",
    description: "Use the light scheme and light background assets.",
    resolvedScheme: "light",
  },
  dark: {
    key: "dark",
    title: "Dark",
    icon: "moon.fill",
    description: "Use the dark scheme and dark background assets.",
    resolvedScheme: "dark",
  },
};

export const appearanceControlGuidance: AppearanceControlGuidance = {
  storageKey: "AppAppearancePreference",
  defaultPreference: "system",
  recommendedPlacement: ["profile", "settings", "app-preferences"],
  preferredControl: "segmented-control",
  behavior: [
    "Persist the preference locally on this device.",
    "Apply the resolved scheme at the app root so every screen swaps together.",
    "Keep System as the default so the app respects OS-level accessibility and comfort settings.",
    "Use familiar light/dark/system icons when the platform provides them.",
  ],
};

export const pairedBackgroundGuidance: BackgroundPairGuidance = {
  light: "warm pearl paper, frosted glass, calm planner grid",
  dark: "smoked graphite glass, steel/chrome edges, faint planner grid",
  rule:
    "Pair background images by composition, not by literal inversion: keep the same calm text zones and edge detail, then retune material, contrast, and wash for the target scheme.",
  sharedComposition: [
    "calm center or reading lane behind dense copy",
    "busy material detail pushed to edges or corners",
    "low-contrast planner/grid structure that supports the product domain",
    "scheme-specific readability wash before opaque panels",
  ],
};

export function resolveAppearanceScheme(
  preference: AppearancePreferenceKey,
  systemScheme: Scheme,
): Scheme {
  if (preference === "system") {
    return systemScheme;
  }

  return preference;
}

export function getAppearancePreference(
  preference: string | undefined,
): AppearancePreference {
  if (preference === "light" || preference === "dark" || preference === "system") {
    return appearancePreferences[preference];
  }

  return appearancePreferences[appearanceControlGuidance.defaultPreference];
}
