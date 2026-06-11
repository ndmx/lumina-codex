# Lumina Scheme, Grid, and Variation

Three executable axes plus the user-facing appearance preference layer that sit
on top of the canonical tokens. They answer three
distinct questions, and they are intentionally independent so they compose
instead of multiplying.

```
tokens.ts      raw primitives (one source of truth)
  ├─ scheme.ts   WHAT CANVAS?   light | dark surface foundation
  ├─ appearance.ts WHAT DID THE USER CHOOSE? system | light | dark preference
  ├─ eras.ts     WHAT MOOD?     accent + glow atmosphere
  ├─ grid.ts     WHAT SHAPE?    column model per device class
  └─ variation.ts WHAT FINGERPRINT?  seeded, bounded uniqueness
```

All four flatten into `--ls-*` CSS custom properties. Components read those
variables and never hardcode color, radius, or column counts — which is exactly
why one component tree renders correctly in light/dark and on phone/desktop.

Live proof: the `/system` route.

## Scheme (light / dark)

A scheme is the **canvas**, orthogonal to era. An era can render in either
scheme; a scheme works under any era. This avoids baking "dark" into every era
and keeps the matrix `scheme × era` instead of duplicating eras.

```ts
import { resolveSchemeVars } from "@xlumina/system/scheme";

const vars = resolveSchemeVars("light", "atelier");
// → { "--ls-bg": "#f3ece1", "--ls-text": "#15140f", "--ls-accent": "#73f2df", ... }
```

- `dark` is the default and matches the shipped page.
- `light` is warm paper (not clinical white) so the brand's ivory warmth holds.
- Era drives `--ls-accent` / `--ls-glow-*`; scheme drives `--ls-bg` / `--ls-text` /
  `--ls-border` / `--ls-surface` / `--ls-shadow`.

## Appearance Preference (system / light / dark)

The scheme axis is internal. The user-facing control should usually be:

```text
System | Light | Dark
```

```ts
import { resolveAppearanceScheme } from "@xlumina/system/appearance";

resolveAppearanceScheme("system", "dark"); // "dark"
resolveAppearanceScheme("light", "dark");  // "light"
```

Default to `System`, persist the preference locally, and apply the resolved
scheme at the app root so all screens, tokens, and paired background assets move
together. If a product uses image-led backgrounds in both schemes, pair them by
composition: same calm text zones and edge detail, different material mood.

## Grid (cross-device consistency)

One column model, mapped per device class. Consistency comes from spans being
**proportional**, not fixed: a "half" card is 2 of 4 columns on mobile and 6 of
12 on desktop.

| Device  | Width            | Columns | Margin | Gutter | Target | Pointer |
|---------|------------------|---------|--------|--------|--------|---------|
| mobile  | `< 720px`        | 4       | 20px   | 16px   | 44px   | coarse  |
| tablet  | `720–959px`      | 8       | 32px   | 20px   | 44px   | coarse  |
| desktop | `960–1599px`     | 12      | 48px   | 24px   | 44px   | fine    |
| wide    | `≥ 1600px`       | 12      | 80px   | 32px   | 44px   | fine    |

Breakpoints are derived from `tokens.ts`, so the JS grid and the CSS media
queries can never drift.

```ts
import { spanColumns, resolveGridVars } from "@xlumina/system/grid";

spanColumns("mobile", 1 / 2);  // 2
spanColumns("desktop", 1 / 2); // 6  → same proportion, different device
```

The `pointer` field (`coarse` / `fine`) is the bridge to the next section: it is
how a surface decides whether pointer-only idioms like proximity apply.

## Variation (siblings, not clones)

"Introduce randomness so instances aren't clones" only stays on-brand if the
randomness is **deterministic and bounded**. We seed a PRNG (FNV-1a → mulberry32)
so the same seed always yields the same look, and clamp every output to a tight
range so the brand never breaks.

```ts
import { createVariation } from "@xlumina/system/variation";

createVariation("design-variation-03"); // stable across reloads, reproducible in tests
```

| Field            | Range         | Effect                          |
|------------------|---------------|---------------------------------|
| `accentHueShift` | `-12°…+12°`   | accent breathes within its family |
| `radiusScale`    | `0.85…1.15`   | corner softness                 |
| `density`        | `0.92…1.08`   | spacing rhythm                  |
| `glow`           | `0.7…1.25`    | atmosphere intensity            |
| `tilt`           | `-6°…+6°`     | decorative rotation             |

Seed with a product id, a user id, or a route to give each instance a stable
fingerprint.

## Proximity, not just hover

`ProximityDock` (`src/components/proximity-dock.tsx`) implements distance-driven
scaling: nearby items scale and lighten by how close the pointer is, instead of a
binary hover on/off.

Two rules make it production-safe:

1. **Cache geometry.** `getBoundingClientRect()` runs once and re-runs only when
   geometry can change (resize + scroll via `ResizeObserver` and a passive
   listener). `pointermove` does pure math on the cached centers, batched into a
   single `requestAnimationFrame`. The naive per-move-per-item version forces a
   synchronous reflow every frame.
2. **Honor the medium.** Proximity is a pointer idiom. On `pointer: coarse`
   (touch) there is no hovering pointer to be "near", and `prefers-reduced-motion`
   users opted out — in both cases the dock renders as a plain, accessible row and
   the effect is skipped. See `grid.ts`'s `pointer` field for the same coarse/fine
   distinction applied to layout.
