/**
 * @xlumina/system — the portable Lumina design-system brain.
 *
 * Framework-agnostic, zero runtime dependencies. Everything an agent needs to
 * build on-brand UI in any stack: tokens, eras, light/dark schemes, the
 * responsive grid, seeded variation, and mobile-vs-web interaction rules — plus
 * the recursive-improvement loop (feedback → ledger → fitness → proposals),
 * bounded by invariants.
 *
 * Barrel export. Subpath imports (e.g. "@xlumina/system/scheme") are also
 * available via the package "exports" map.
 */

export * from "./tokens.js";
export * from "./eras.js";
export * from "./registry.js";
export * from "./scheme.js";
export * from "./grid.js";
export * from "./variation.js";
export * from "./platform-rules.js";

// Recursive improvement loop
export * from "./feedback.js";
export * from "./improvement-ledger.js";
export * from "./invariants.js";
export * from "./fitness.js";
export * from "./evaluation.js";
export * from "./closer.js";
export * from "./meta.js";
