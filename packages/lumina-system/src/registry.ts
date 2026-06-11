/**
 * Lumina public registry.
 *
 * Public registry for reusable Lumina reference surfaces.
 *
 * Private project names do not belong here. Reusable UI/UX examples are
 * registered as numbered design variations so npm users can choose design types
 * without needing to know any private implementation provenance.
 *
 * ── How to add a new design variation ─────────────────────────────────────────
 *
 * 1. Add a RegistryEntry to the `registryEntries` array below.
 * 2. Run `npm run test:run` to confirm the entry validates.
 * 3. Record the decision in docs/system/improvement-log.md.
 * 4. Create docs/design-variations/design-variation-XX.md with platform context.
 *
 * ── Concept aliases ───────────────────────────────────────────────────────────
 *
 * Lumina uses canonical cross-variation concept names (e.g. "Shared Space").
 * Keep public entries generic; private product aliases should stay outside the
 * public package.
 *
 * ── Token overrides ───────────────────────────────────────────────────────────
 *
 * If a design variation needs a different primary accent than the era default,
 * declare it in tokenOverrides. This does not affect other variations.
 *
 * ── Era choice ────────────────────────────────────────────────────────────────
 *
 * Pick the era that best matches the variation's atmosphere. All eras share the
 * same underlying type scale and spatial system - only the color mood shifts.
 */

import type { EraKey } from "./eras.js";

// Medium tags from platform-taxonomy.md
export type Medium =
  | "mobile" | "tablet" | "desktop" | "web" | "web-app" | "website"
  | "native-app" | "ios-app" | "android-app" | "macos-app" | "pwa"
  | "canvas" | "three-d" | "watch" | "tv" | "spatial" | "document"
  | "presentation" | "email" | "cli" | "api"
  | (string & {});

// Platform tags from platform-taxonomy.md
export type Platform =
  | "ios" | "ipados" | "macos" | "android" | "windows"
  | "linux" | "browser" | "server" | "edge" | "cloud"
  | (string & {});

// Framework tags from platform-taxonomy.md
export type Framework =
  | "react" | "nextjs" | "vite" | "swiftui" | "uikit"
  | "react-native" | "flutter" | "threejs" | "html" | "css"
  | "typescript" | "javascript" | "webgl" | "webgpu" | "svg"
  | (string & {});

export type RegistryEntry = {
  id: string;
  name: string;
  description: string;
  mediums: Medium[];
  platforms: Platform[];
  frameworks: Framework[];
  defaultEra: EraKey;
  tokenOverrides?: {
    accentPrimary?: string;
    accentSecondary?: string;
    surface?: string;
    background?: string;
    surfaceTreatment?: string;
    functionalDanger?: string;
    functionalPositive?: string;
    [key: string]: string | undefined;
  };
  conceptAliases?: {
    sharedSpace?: string;
    [conceptId: string]: string | undefined;
  };
  docsPath?: string;
  registeredAt: string;
};

/**
 * Backward-compatible type alias for older consumers of @xlumina/system.
 * New docs should prefer RegistryEntry and the design-variations module.
 */
export type ProductProfile = RegistryEntry;

// ─── Registered public design variations ──────────────────────────────────────

export const registryEntries: RegistryEntry[] = [
  {
    id: "design-variation-01",
    name: "Design Variation 01: Pearl Planner Glass",
    description:
      "Warm pearl-paper productivity surface for planning, scheduling, routes, and calm operational tools.",
    mediums: ["mobile", "tablet", "web-app", "desktop"],
    platforms: ["ios", "ipados", "browser", "macos"],
    frameworks: ["swiftui", "react", "nextjs", "css"],
    defaultEra: "atelier",
    tokenOverrides: {
      accentPrimary: "#3c9b91",
      surfaceTreatment: "pearl-paper/light with outline-glass controls",
      backgroundPair: "pairs-with-design-variation-02",
    },
    docsPath: "docs/design-variations/design-variation-01.md",
    registeredAt: "2026-06-01",
  },
  {
    id: "design-variation-02",
    name: "Design Variation 02: Smoked Graphite Glass",
    description:
      "Dark productivity surface with graphite glass, steel edges, pearl text, and muted teal glints.",
    mediums: ["mobile", "tablet", "web-app", "desktop"],
    platforms: ["ios", "ipados", "browser", "macos"],
    frameworks: ["swiftui", "react", "nextjs", "css"],
    defaultEra: "atelier",
    tokenOverrides: {
      accentPrimary: "#6cd0c3",
      surfaceTreatment: "smoked-graphite/dark with glass controls",
      appearancePreference: "system-light-dark segmented override",
      backgroundPair: "pairs-with-design-variation-01",
    },
    docsPath: "docs/design-variations/design-variation-02.md",
    registeredAt: "2026-06-01",
  },
  {
    id: "design-variation-03",
    name: "Design Variation 03: Chrome Pearl Memory Surface",
    description:
      "Reflective chrome/pearl surface for memories, places, profiles, journals, and shared personal spaces.",
    mediums: ["mobile", "tablet", "web-app"],
    platforms: ["ios", "ipados", "browser"],
    frameworks: ["swiftui", "react", "nextjs", "css"],
    defaultEra: "atelier",
    tokenOverrides: {
      accentPrimary: "#3c9b91",
      surfaceTreatment: "chrome-pearl/outline-glass",
    },
    docsPath: "docs/design-variations/design-variation-03.md",
    registeredAt: "2026-06-01",
  },
  {
    id: "design-variation-04",
    name: "Design Variation 04: Map Safety Glass",
    description:
      "Map-first operational surface with glass overlays and solid panels for urgent or dense safety workflows.",
    mediums: ["mobile", "tablet", "web-app", "desktop"],
    platforms: ["ios", "ipados", "browser", "android"],
    frameworks: ["swiftui", "react", "nextjs", "css"],
    defaultEra: "atelier",
    tokenOverrides: {
      accentPrimary: "#0e9a88",
      accentSecondary: "#d9542f",
      functionalDanger: "#c8102e",
      functionalPositive: "#1e7a4d",
      surfaceTreatment: "map-glass/solid-for-dense-safety-data",
    },
    docsPath: "docs/design-variations/design-variation-04.md",
    registeredAt: "2026-06-01",
  },
];

/**
 * Backward-compatible alias for the recursive-improvement loop.
 * Public examples are generic numbered design variations, not private apps.
 */
export const products: ProductProfile[] = registryEntries;

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getProduct(id: string): ProductProfile | undefined {
  return products.find((p) => p.id === id);
}

export function getRegistryEntry(id: string): RegistryEntry | undefined {
  return registryEntries.find((entry) => entry.id === id);
}

export function getProductsByPlatform(platform: Platform): ProductProfile[] {
  return products.filter((p) => p.platforms.includes(platform));
}

export function getRegistryEntriesByPlatform(platform: Platform): RegistryEntry[] {
  return registryEntries.filter((entry) => entry.platforms.includes(platform));
}

export function getProductsByEra(era: EraKey): ProductProfile[] {
  return products.filter((p) => p.defaultEra === era);
}

export function getRegistryEntriesByEra(era: EraKey): RegistryEntry[] {
  return registryEntries.filter((entry) => entry.defaultEra === era);
}

export function resolveConceptAlias(
  productId: string,
  conceptId: string,
  fallback: string,
): string {
  const product = getProduct(productId);
  return product?.conceptAliases?.[conceptId] ?? fallback;
}
