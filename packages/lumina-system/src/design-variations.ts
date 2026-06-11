/**
 * Public Lumina design variations.
 *
 * These are reusable design types, not references to private projects. Each
 * variation captures a visual/UX pattern that can be used across mobile, web,
 * desktop, and future native platforms.
 */

import type { EraKey } from "./eras.js";
import type { Scheme } from "./scheme.js";
import type { BackgroundMaterialKey, ContentBlockTreatmentKey } from "./surface.js";
import type { Framework, Medium, Platform } from "./registry.js";

export type DesignVariationId =
  | "design-variation-01"
  | "design-variation-02"
  | "design-variation-03"
  | "design-variation-04";

export type DesignVariation = {
  id: DesignVariationId;
  number: number;
  name: string;
  signature: {
    system: "Lumina Design System";
    variation: string;
    creator: "ndmx";
    code: string;
    comment: string;
  };
  description: string;
  mediums: Medium[];
  platforms: Platform[];
  frameworks: Framework[];
  recommendedSchemes: Scheme[];
  defaultEra: EraKey;
  backgroundMaterials: BackgroundMaterialKey[];
  preferredTreatments: ContentBlockTreatmentKey[];
  accent: string;
  bestFor: readonly string[];
  visualRules: readonly string[];
  uxRules: readonly string[];
  docsPath: string;
};

export const designVariations: Record<DesignVariationId, DesignVariation> = {
  "design-variation-01": {
    id: "design-variation-01",
    number: 1,
    name: "Pearl Planner Glass",
    signature: createDesignVariationSignature(1),
    description:
      "Warm pearl-paper productivity surface with faint planner structure, transparent blocks, glass controls, and softened teal actions.",
    mediums: ["mobile", "tablet", "web-app", "desktop"],
    platforms: ["ios", "ipados", "browser", "macos"],
    frameworks: ["swiftui", "react", "nextjs", "css"],
    recommendedSchemes: ["light"],
    defaultEra: "atelier",
    backgroundMaterials: ["pearl", "chrome"],
    preferredTreatments: ["outline", "glass"],
    accent: "#3c9b91",
    bestFor: ["scheduling", "planning", "routes", "local-first productivity"],
    visualRules: [
      "Use warm pearl paper or frosted calendar imagery with calm text zones.",
      "Push busy chrome or glass detail to the edges.",
      "Avoid default white cards; use transparent outlines and near-clear glass first.",
    ],
    uxRules: [
      "Keep repeated planning blocks easy to scan.",
      "Use solid panels only for forms or contrast recovery.",
      "Prefer native platform controls over decorative replacements.",
    ],
    docsPath: "docs/design-variations/design-variation-01.md",
  },
  "design-variation-02": {
    id: "design-variation-02",
    number: 2,
    name: "Smoked Graphite Glass",
    signature: createDesignVariationSignature(2),
    description:
      "Dark productivity surface with graphite glass, steel edges, pearl text, translucent charcoal blocks, and muted teal glints.",
    mediums: ["mobile", "tablet", "web-app", "desktop"],
    platforms: ["ios", "ipados", "browser", "macos"],
    frameworks: ["swiftui", "react", "nextjs", "css"],
    recommendedSchemes: ["dark"],
    defaultEra: "atelier",
    backgroundMaterials: ["smoked-graphite", "steel"],
    preferredTreatments: ["glass", "solid-panel"],
    accent: "#6cd0c3",
    bestFor: ["dark mode", "night scheduling", "premium dashboards", "operational tools"],
    visualRules: [
      "Use a dark-specific background image rather than tinting the light asset.",
      "Keep cards smoked and translucent, not heavy black slabs.",
      "Use broad, low-opacity glow instead of neon effects.",
    ],
    uxRules: [
      "Expose System, Light, and Dark as a persisted preference when appearance is part of the product identity.",
      "Apply the resolved scheme at the app root.",
      "Dim light-mode empty-state art so it supports the dark surface.",
    ],
    docsPath: "docs/design-variations/design-variation-02.md",
  },
  "design-variation-03": {
    id: "design-variation-03",
    number: 3,
    name: "Chrome Pearl Memory Surface",
    signature: createDesignVariationSignature(3),
    description:
      "Reflective image-led surface for memories, places, profiles, and shared personal spaces.",
    mediums: ["mobile", "tablet", "web-app"],
    platforms: ["ios", "ipados", "browser"],
    frameworks: ["swiftui", "react", "nextjs", "css"],
    recommendedSchemes: ["light", "dark"],
    defaultEra: "atelier",
    backgroundMaterials: ["chrome-pearl", "pearl", "marble", "steel"],
    preferredTreatments: ["outline", "glass"],
    accent: "#3c9b91",
    bestFor: ["memories", "journals", "places", "profiles", "shared spaces"],
    visualRules: [
      "Let the background carry the emotional tone.",
      "Use transparent outlined repeated blocks.",
      "Keep dense copy away from high-contrast chrome detail.",
    ],
    uxRules: [
      "Separate with spacing and hierarchy before adding containers.",
      "Use glass for stats and controls that need tactility.",
      "Preserve the background unless contrast genuinely fails.",
    ],
    docsPath: "docs/design-variations/design-variation-03.md",
  },
  "design-variation-04": {
    id: "design-variation-04",
    number: 4,
    name: "Map Safety Glass",
    signature: createDesignVariationSignature(4),
    description:
      "Map-first operational surface that uses glass overlays for lightweight controls and solid panels for urgent or dense safety workflows.",
    mediums: ["mobile", "tablet", "web-app", "desktop"],
    platforms: ["ios", "ipados", "browser", "android"],
    frameworks: ["swiftui", "react", "nextjs", "css"],
    recommendedSchemes: ["light", "dark"],
    defaultEra: "atelier",
    backgroundMaterials: ["map"],
    preferredTreatments: ["glass", "solid-panel"],
    accent: "#0e9a88",
    bestFor: ["maps", "location", "safety", "incident reporting", "field operations"],
    visualRules: [
      "Treat the map as content, not wallpaper.",
      "Keep functional status colors separate from brand color.",
      "Use solid panels when speed and clarity outrank atmosphere.",
    ],
    uxRules: [
      "Do not rely on color alone for severity or safety state.",
      "Use direct, consent-oriented copy.",
      "Keep controls accessible over map detail.",
    ],
    docsPath: "docs/design-variations/design-variation-04.md",
  },
};

export function createDesignVariationSignature(number: number): DesignVariation["signature"] {
  const variation = `Variation ${String(number).padStart(2, "0")}`;
  return {
    system: "Lumina Design System",
    variation,
    creator: "ndmx",
    code: `Lumina Design System · ${variation} · Created by ndmx`,
    comment: `/* Lumina Design System · ${variation} · Created by ndmx */`,
  };
}

export const designVariationList = Object.values(designVariations);

export function getDesignVariation(id: string): DesignVariation | undefined {
  return designVariationList.find((variation) => variation.id === id);
}

export function getDesignVariationsByPlatform(platform: Platform): DesignVariation[] {
  return designVariationList.filter((variation) => variation.platforms.includes(platform));
}

export function getDesignVariationsByScheme(scheme: Scheme): DesignVariation[] {
  return designVariationList.filter((variation) => variation.recommendedSchemes.includes(scheme));
}

export function formatDesignVariationSignature(id: string): string | undefined {
  return getDesignVariation(id)?.signature.code;
}

export function getDesignVariationCodeComment(id: string): string | undefined {
  return getDesignVariation(id)?.signature.comment;
}
