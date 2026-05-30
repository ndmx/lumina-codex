/**
 * Lumina product registry.
 *
 * Every project that consumes or contributes to the Lumina design system
 * has an entry here. This file is the machine-readable partner to
 * docs/system/registry.md and lumina.manifest.json.
 *
 * ── How to add a new project ──────────────────────────────────────────────────
 *
 * 1. Add a ProductProfile entry to the `products` array below.
 * 2. Run `npm run test:run` to confirm the entry validates.
 * 3. Record the decision in docs/system/improvement-log.md.
 * 4. Create docs/products/<your-id>/README.md with platform context.
 *
 * ── Concept aliases ───────────────────────────────────────────────────────────
 *
 * Lumina uses canonical cross-product concept names (e.g. "Shared Space").
 * When your product needs a product-specific name for that concept, declare it
 * in conceptAliases: { sharedSpace: "Group" }.
 *
 * ── Token overrides ───────────────────────────────────────────────────────────
 *
 * If your product needs a different primary accent than the era default, declare
 * it in tokenOverrides. This does not affect other products.
 *
 * ── Era choice ────────────────────────────────────────────────────────────────
 *
 * Pick the era that best matches your product's atmosphere. All eras share the
 * same underlying type scale and spatial system — only the color mood shifts.
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

export type ProductProfile = {
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
    [key: string]: string | undefined;
  };
  conceptAliases?: {
    sharedSpace?: string;
    [conceptId: string]: string | undefined;
  };
  docsPath?: string;
  registeredAt: string;
};

// ─── Registered products ──────────────────────────────────────────────────────

export const products: ProductProfile[] = [
  {
    id: "lumina-codex",
    name: "Lumina Codex",
    description:
      "Portfolio and interactive design system demonstration site. The live reference implementation of the Lumina system.",
    mediums: ["web", "web-app", "three-d"],
    platforms: ["browser"],
    frameworks: ["nextjs", "react", "threejs", "typescript"],
    defaultEra: "atelier",
    docsPath: "docs/products/lumina-codex",
    registeredAt: "2026-05-06",
  },
  {
    id: "jxl-scheduler",
    name: "JxL Scheduler",
    description: "iOS scheduling and task management app.",
    mediums: ["mobile", "ios-app"],
    platforms: ["ios", "ipados"],
    frameworks: ["swiftui"],
    defaultEra: "atelier",
    conceptAliases: { sharedSpace: "Group" },
    docsPath: "docs/products/mobile-design-systems/jxl-scheduler",
    registeredAt: "2026-05-06",
  },
  {
    id: "park-memory-hub",
    name: "ParkMemory Hub",
    description: "iOS place and memory journaling app.",
    mediums: ["mobile", "ios-app"],
    platforms: ["ios"],
    frameworks: ["swiftui"],
    defaultEra: "atelier",
    conceptAliases: { sharedSpace: "Circle" },
    docsPath: "docs/products/mobile-design-systems/park-memory-hub",
    registeredAt: "2026-05-06",
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getProduct(id: string): ProductProfile | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByPlatform(platform: Platform): ProductProfile[] {
  return products.filter((p) => p.platforms.includes(platform));
}

export function getProductsByEra(era: EraKey): ProductProfile[] {
  return products.filter((p) => p.defaultEra === era);
}

export function resolveConceptAlias(
  productId: string,
  conceptId: string,
  fallback: string,
): string {
  const product = getProduct(productId);
  return product?.conceptAliases?.[conceptId] ?? fallback;
}
