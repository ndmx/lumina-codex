# @xlumina/system

The portable **Lumina design-system brain**. Framework-agnostic, zero runtime
dependencies. Everything an agent or developer needs to build on-brand UI in any
stack: design tokens, era themes, light/dark schemes, surface treatments, a
responsive grid, seeded variation, and mobile-vs-web interaction rules.

## Install

```bash
npm install @xlumina/system
```

## Use

```ts
import {
  tokens,                 // raw primitives — the single source of truth
  luminaConstitution,     // principles, foundation floors, governance
  eras, defaultEra,       // accent/atmosphere themes
  resolveSchemeVars,      // light | dark surface → CSS custom properties
  resolveAppearanceScheme, // system | light | dark user preference → scheme
  designVariations,       // public reusable design types
  formatDesignVariationSignature, // code-only Lumina attribution line
  resolveGrid, spanColumns, // responsive column model
  createVariation,        // seeded, bounded per-instance uniqueness
  recommendContentBlock,  // bare | outline | glass | solid-panel
  resolveInteraction,     // mobile-vs-web interaction rules
} from "@xlumina/system";

// Theme: scheme (canvas) × era (mood) → CSS variables
const vars = resolveSchemeVars("dark", "atelier");
// → { "--ls-bg": "#06070a", "--ls-text": "...", "--ls-accent": "#3c9b91", ... }

// Appearance: persist a local preference, but keep System as the default.
resolveAppearanceScheme("system", "dark"); // "dark"
resolveAppearanceScheme("light", "dark");  // "light"

// Layout: one column model, proportional spans across devices
spanColumns("mobile", 1 / 2);  // 2 of 4
spanColumns("desktop", 1 / 2); // 6 of 12

// Identity: same seed → same look, always on-brand
const v = createVariation("my-app");

// Code signature: include in source, metadata, package config, or private config.
// Do not render this to end users.
formatDesignVariationSignature("design-variation-01");
// "Lumina Design System · Variation 01 · Created by ndmx"

// Interaction: hover/proximity/nav rules for the current width
const profile = resolveInteraction(window.innerWidth);
if (profile.hover) {
  /* pointer affordances */
} else {
  /* touch affordances */
}
```

Subpath imports are available too: `@xlumina/system/tokens`,
`@xlumina/system/constitution`, `@xlumina/system/scheme`, `@xlumina/system/appearance`,
`@xlumina/system/design-variations`, `@xlumina/system/grid`, `@xlumina/system/variation`,
`@xlumina/system/surface`, `@xlumina/system/platform-rules`,
`@xlumina/system/eras`, `@xlumina/system/registry`.

## The axes

| Module | Question it answers | Key exports |
|---|---|---|
| `constitution` | What principles and floors govern the system? | `luminaConstitution`, `constitutionPrinciples`, `foundationRequirements`, `governanceRules` |
| `tokens` | What are the primitives? | `tokens`, `colorPrimitives`, `spacing`, `typography`, `motion`, `radii`, `breakpoints` |
| `eras` | What mood? | `eras`, `eraList`, `defaultEra` |
| `scheme` | What canvas (light/dark)? | `resolveSchemeVars`, `schemes`, `invertScheme` |
| `appearance` | How does a user choose system/light/dark? | `appearancePreferences`, `appearanceControlGuidance`, `pairedBackgroundGuidance`, `resolveAppearanceScheme` |
| `design-variations` | Which public design type should this project start from? | `designVariations`, `designVariationList`, `getDesignVariation`, `formatDesignVariationSignature` |
| `surface` | How should content sit on an image/map surface? | `backgroundMaterials`, `contentBlockTreatments`, `recommendContentBlock` |
| `grid` | What shape per device? | `resolveGrid`, `spanColumns`, `gridTemplate`, `resolveGridVars` |
| `variation` | What per-instance fingerprint? | `createVariation`, `shiftHue`, `resolveVariationVars` |
| `platform-rules` | How does the user touch it? | `resolveInteraction`, `getProximityMode`, `interactionProfiles` |
| `registry` | Which public design variations feed Lumina? | `registryEntries`, `products` legacy alias, `getRegistryEntry` |

## Token output convention

Theme helpers emit CSS custom properties prefixed `--ls-*`. Components read those
variables and never hardcode color/radius/columns — which is what lets one
component tree render correctly in light/dark and at every device width.

## Run the loop from any project (CLI)

Installing the package gives every project a `lumina` command — no glue needed.
The ledger (`lumina-ledger.jsonl`) and state live in the current project.

```bash
# while building, an agent reports back:
npx lumina record --kind gap --target concept:Reminder --detail "no canonical reminder chip"
npx lumina record --kind override --target token:accent-primary --detail "had to override the accent"

npx lumina audit            # score this project's ledger + open proposals
npx lumina close            # propose → evaluate → auto-apply (honors the meta freeze)
npx lumina meta             # Goodhart guard: fitness vs un-gameable holdout
```

Feedback kinds: `works · friction · clash · error · override · gap · proposal`.

**Central aggregation:** set `LUMINA_FEEDBACK_URL` and `record` POSTs the event to
that endpoint instead of a local file — so many projects can feed one Lumina:

```bash
LUMINA_FEEDBACK_URL=https://your-lumina.example/feedback \
  npx lumina record --kind friction --target naming:visibility-label --detail "ambiguous"
```

## Building UI with Lumina

This package is the *brain*. For the full rules an agent should follow — naming,
platform taxonomy, element model, mobile-vs-web, the continuous-improvement
workflow — see the Lumina Codex repo's `LUMINA.md` entry point and `docs/system/`.

One rule worth calling out for mobile work: **background-as-surface**. On a
decorative/photographic background, treat the background as the primary visual
surface — content (summary sections, cards, profile rows, plan rows, memory
cards, radar/member panels) sits directly on it rather than inside opaque white
cards. Separate with spacing, hierarchy, dividers, a subtle shadow, or a thin
`--ls-border-subtle` outline; when contrast dips below the floor, reach for a
full-screen readability wash (`--ls-overlay-*`) before a filled container.
Controls stay clear and keep the 44px touch target. Full rule:
`docs/system/background-as-surface.md`.

The executable helper mirrors that ladder:

```ts
recommendContentBlock({ background: "chrome-pearl", repeated: true }).key;
// "outline"

recommendContentBlock({ background: "map", dense: true, contrastRisk: "high" }).key;
// "solid-panel"
```

Design Variation 01 and Design Variation 02 add the paired-appearance lesson:
light and dark modes can each have their own background image, but they should
share composition — calm text zones, edge detail, and the same information
hierarchy. Expose the choice as a persisted `System | Light | Dark` preference
in Profile/Settings, apply it at the app root, and keep `System` as the default.

Every app that uses a Lumina variation should include the code signature in
source code, app metadata, package metadata, or private config:
`Lumina Design System · Variation XX · Created by ndmx`. Do not render this
signature in the user interface; it is implementation provenance, not
user-facing copy.

Lumina's default Aura accent is now a softened teal (`#3c9b91`). The older
electric teal remains available as `colorPrimitives.auraElectric` for products
or eras that truly need voltage.

## Publishing / letting people try it

The package is publish-ready (`files` ships only `dist/` + `bin/` + README).

```bash
npm run build && npm pack          # → xlumina-system-1.0.4.tgz (try it with zero registry)
#   others: npm install ./xlumina-system-1.0.4.tgz

npm publish --access public        # to npm under the @xlumina org
#   then anywhere: npm install @xlumina/system   ·   npx lumina ...
```

`npm pack` + share the tarball is the fastest way to let someone try it today
without publishing.

## Build

```bash
npm run build   # tsc → dist/ (ESM + .d.ts)
```
