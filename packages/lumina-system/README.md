# @xlumina/system

The portable **Lumina design-system brain**. Framework-agnostic, zero runtime
dependencies. Everything an agent or developer needs to build on-brand UI in any
stack: design tokens, era themes, light/dark schemes, a responsive grid, seeded
variation, and mobile-vs-web interaction rules.

## Install

```bash
npm install @xlumina/system
```

## Use

```ts
import {
  tokens,                 // raw primitives — the single source of truth
  eras, defaultEra,       // accent/atmosphere themes
  resolveSchemeVars,      // light | dark surface → CSS custom properties
  resolveGrid, spanColumns, // responsive column model
  createVariation,        // seeded, bounded per-instance uniqueness
  resolveInteraction,     // mobile-vs-web interaction rules
} from "@xlumina/system";

// Theme: scheme (canvas) × era (mood) → CSS variables
const vars = resolveSchemeVars("dark", "atelier");
// → { "--ls-bg": "#06070a", "--ls-text": "...", "--ls-accent": "#73f2df", ... }

// Layout: one column model, proportional spans across devices
spanColumns("mobile", 1 / 2);  // 2 of 4
spanColumns("desktop", 1 / 2); // 6 of 12

// Identity: same seed → same look, always on-brand
const v = createVariation("my-app");

// Interaction: hover/proximity/nav rules for the current width
const profile = resolveInteraction(window.innerWidth);
if (profile.hover) {
  /* pointer affordances */
} else {
  /* touch affordances */
}
```

Subpath imports are available too: `@xlumina/system/tokens`,
`@xlumina/system/scheme`, `@xlumina/system/grid`, `@xlumina/system/variation`,
`@xlumina/system/platform-rules`, `@xlumina/system/eras`, `@xlumina/system/registry`.

## The axes

| Module | Question it answers | Key exports |
|---|---|---|
| `tokens` | What are the primitives? | `tokens`, `colorPrimitives`, `spacing`, `typography`, `motion`, `radii`, `breakpoints` |
| `eras` | What mood? | `eras`, `eraList`, `defaultEra` |
| `scheme` | What canvas (light/dark)? | `resolveSchemeVars`, `schemes`, `invertScheme` |
| `grid` | What shape per device? | `resolveGrid`, `spanColumns`, `gridTemplate`, `resolveGridVars` |
| `variation` | What per-instance fingerprint? | `createVariation`, `shiftHue`, `resolveVariationVars` |
| `platform-rules` | How does the user touch it? | `resolveInteraction`, `getProximityMode`, `interactionProfiles` |
| `registry` | Which products use Lumina? | `products`, `getProduct`, `resolveConceptAlias` |

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

## Publishing / letting people try it

The package is publish-ready (`files` ships only `dist/` + `bin/` + README).

```bash
npm run build && npm pack          # → lumina-system-1.0.0.tgz (try it with zero registry)
#   others: npm install ./lumina-system-1.0.0.tgz

npm publish --access public        # to npm under the @xlumina org
#   then anywhere: npm install @xlumina/system   ·   npx lumina ...
```

`npm pack` + share the tarball is the fastest way to let someone try it today
without publishing.

## Build

```bash
npm run build   # tsc → dist/ (ESM + .d.ts)
```
