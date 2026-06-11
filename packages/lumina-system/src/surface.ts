/**
 * Surface rules learned from real Lumina apps.
 *
 * `scheme.ts` decides the canvas and `tokens.ts` names the colors. This module
 * decides how content should sit on top of an image-led or data-led surface.
 */

export type BackgroundMaterialKey =
  | "plain"
  | "pearl"
  | "chrome"
  | "chrome-pearl"
  | "steel"
  | "marble"
  | "smoked-graphite"
  | "map";

export type ContentBlockTreatmentKey =
  | "bare"
  | "outline"
  | "glass"
  | "solid-panel";

export type ContrastRisk = "low" | "medium" | "high";

export type BackgroundMaterial = {
  key: BackgroundMaterialKey;
  intent: string;
  recommendedFor: readonly string[];
  guidance: {
    preferredTextZone: "calm-center" | "edge-gradient" | "overlay-safe" | "map-safe-area";
    defaultTreatment: ContentBlockTreatmentKey;
    allowOpaqueCards: "avoid" | "only-when-contrast-fails" | "allowed-for-dense-data";
  };
};

export type ContentBlockTreatment = {
  key: ContentBlockTreatmentKey;
  description: string;
  fill: string;
  border: string;
  shadow: string;
  useWhen: readonly string[];
};

export const backgroundMaterials: Record<BackgroundMaterialKey, BackgroundMaterial> = {
  plain: {
    key: "plain",
    intent: "Neutral app canvas with no meaningful image detail.",
    recommendedFor: ["dense-data", "settings", "forms"],
    guidance: {
      preferredTextZone: "overlay-safe",
      defaultTreatment: "glass",
      allowOpaqueCards: "allowed-for-dense-data",
    },
  },
  pearl: {
    key: "pearl",
    intent: "Soft, personal, reflective atmosphere with low visual noise.",
    recommendedFor: ["profile", "memories", "personal-state"],
    guidance: {
      preferredTextZone: "calm-center",
      defaultTreatment: "outline",
      allowOpaqueCards: "only-when-contrast-fails",
    },
  },
  chrome: {
    key: "chrome",
    intent: "Premium utility surface with crisp metal contrast.",
    recommendedFor: ["planner", "tools", "status"],
    guidance: {
      preferredTextZone: "calm-center",
      defaultTreatment: "glass",
      allowOpaqueCards: "only-when-contrast-fails",
    },
  },
  "chrome-pearl": {
    key: "chrome-pearl",
    intent: "Chrome/pearl memory style: polished, emotional, and calm enough for text.",
    recommendedFor: ["radar", "memories", "shared-space"],
    guidance: {
      preferredTextZone: "calm-center",
      defaultTreatment: "outline",
      allowOpaqueCards: "avoid",
    },
  },
  steel: {
    key: "steel",
    intent: "Cool operational mood for utility or signal-heavy screens.",
    recommendedFor: ["analytics", "safety", "system-state"],
    guidance: {
      preferredTextZone: "edge-gradient",
      defaultTreatment: "glass",
      allowOpaqueCards: "allowed-for-dense-data",
    },
  },
  marble: {
    key: "marble",
    intent: "Warm editorial surface for slower reading and personal records.",
    recommendedFor: ["journal", "detail", "profile"],
    guidance: {
      preferredTextZone: "calm-center",
      defaultTreatment: "outline",
      allowOpaqueCards: "only-when-contrast-fails",
    },
  },
  "smoked-graphite": {
    key: "smoked-graphite",
    intent: "Dark-mode operational luxury surface with graphite glass, steel edges, and muted teal glints.",
    recommendedFor: ["scheduler", "planner", "profile", "night-mode", "operations"],
    guidance: {
      preferredTextZone: "calm-center",
      defaultTreatment: "glass",
      allowOpaqueCards: "only-when-contrast-fails",
    },
  },
  map: {
    key: "map",
    intent: "Live spatial surface where the map is content, not decoration.",
    recommendedFor: ["safety-map", "radar", "location"],
    guidance: {
      preferredTextZone: "map-safe-area",
      defaultTreatment: "glass",
      allowOpaqueCards: "allowed-for-dense-data",
    },
  },
};

export const contentBlockTreatments: Record<ContentBlockTreatmentKey, ContentBlockTreatment> = {
  bare: {
    key: "bare",
    description: "No container fill. Text, icons, and controls sit directly on the surface.",
    fill: "transparent",
    border: "transparent",
    shadow: "none",
    useWhen: ["page titles", "section labels", "low-density metadata"],
  },
  outline: {
    key: "outline",
    description: "Transparent block with a thin low-opacity outline.",
    fill: "transparent",
    border: "var(--ls-border-visible)",
    shadow: "none",
    useWhen: ["memory rows", "radar member blocks", "plan rows", "profile rows"],
  },
  glass: {
    key: "glass",
    description: "Almost-clear surface: a faint wash plus hairline so the background still leads.",
    fill: "var(--ls-overlay-medium)",
    border: "var(--ls-border)",
    shadow: "0 12px 32px rgba(0, 0, 0, 0.08)",
    useWhen: ["stat tiles", "controls on imagery", "map overlays", "dense-but-small blocks"],
  },
  "solid-panel": {
    key: "solid-panel",
    description: "Filled panel reserved for dense data or genuine contrast failure.",
    fill: "var(--ls-surface)",
    border: "var(--ls-border-visible)",
    shadow: "var(--ls-shadow)",
    useWhen: ["forms", "long text", "tables", "contrast recovery"],
  },
};

export type RecommendContentBlockOptions = {
  background: BackgroundMaterialKey;
  repeated?: boolean;
  interactive?: boolean;
  dense?: boolean;
  contrastRisk?: ContrastRisk;
};

export function recommendContentBlock(
  options: RecommendContentBlockOptions,
): ContentBlockTreatment {
  const material = backgroundMaterials[options.background] ?? backgroundMaterials.plain;
  const contrastRisk = options.contrastRisk ?? "low";

  if (contrastRisk === "high" || options.dense) {
    return material.guidance.allowOpaqueCards === "avoid"
      ? contentBlockTreatments.glass
      : contentBlockTreatments["solid-panel"];
  }

  if (contrastRisk === "medium" || options.interactive) {
    return contentBlockTreatments.glass;
  }

  if (options.repeated) {
    return contentBlockTreatments[material.guidance.defaultTreatment];
  }

  return contentBlockTreatments.bare;
}
