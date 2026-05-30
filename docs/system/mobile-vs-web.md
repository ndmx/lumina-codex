# Lumina Mobile vs Web Rules

The grid (`grid.ts`) decides *what shape* a layout is. These rules decide *how
the user touches it*. Pointer vs. touch is not cosmetic — it changes which
idioms exist at all. There is no hover on a finger and no proximity field on a
tap, so the system encodes the decision once, executably, in
`packages/lumina-system/src/platform-rules.ts`. This file is the prose companion.

A surface should read its profile, not guess:

```ts
import { resolveInteraction, getProximityMode } from "@xlumina/system/platform-rules";

const profile = resolveInteraction(window.innerWidth);
if (profile.hover) {
  // pointer affordances: hover states, tooltips, proximity dock
} else {
  // touch affordances: press states, larger targets, scroll-proximity
}
```

## The rules at a glance

| Concern | Mobile | Tablet | Desktop / Wide |
|---|---|---|---|
| Primary input | touch (coarse) | touch (coarse) | pointer (fine) |
| Hover exists? | No | No | Yes |
| Proximity idiom | scroll-distance | scroll-distance | pointer-distance |
| Primary nav | tab bar | sidebar | top bar / sidebar |
| Min target | 44px | 44px | 36px |
| Thumb-reach matters | Yes | No | No |
| Default motion budget | standard | standard | rich |
| Core gestures | tap, swipe, long-press | tap, swipe, drag | click, hover, right-click, wheel, keyboard |

## Why these, specifically

**Hover is pointer-only.** Never hide information or actions behind hover —
touch users can't reach it. Hover is an *enhancement* on top of a tap/click
target that already works. The `hover` flag exists so a component can add hover
behavior without assuming it.

**Proximity needs a focal point, and touch's focal point is scroll, not the
finger.** This is the rule the two proximity components embody:

- `pointer` → `ProximityDock`: distance measured from the cursor. Desktop/wide.
- `scroll` → `ScrollProximityRail`: distance measured from the rail's center as
  it scrolls. Mobile/tablet — the iOS wheel-picker / cover-flow feel.
- `none` → render the plain, accessible version. Forced whenever
  `prefers-reduced-motion` is set.

`getProximityMode(device, reduceMotion)` is the single routing decision; both
components already self-skip on the wrong medium, so the flag is the
belt-and-suspenders source of truth.

**Targets: 44 on touch, 36 on pointer.** 44px is the Apple HIG / Material
touch minimum (also in `grid.ts`'s `minTarget`). A precise pointer can hit
smaller, so desktop density is allowed to tighten to 36px.

**Thumb reach is a mobile-only constraint.** On a phone, primary actions belong
in the bottom third where a thumb lands; destructive or rare actions go up top.
On tablet and desktop this doesn't apply, so the `thumbReach` flag is only true
for mobile.

**Navigation convention follows the platform.** Tab bar on phones, sidebar on
tablets and wide desktops, top bar on standard desktop — what users already
expect on each, per the native-mobile mapping in `element-model.md`.

**Motion budget scales with capability and expectation.** Desktops get the rich
treatment (pointer-proximity, layered parallax); mobile keeps motion standard to
protect battery, scroll performance, and vestibular comfort. `prefers-reduced-
motion` overrides all of it — function must never depend on motion.

## How this composes with the rest of the system

```
grid.ts          → columns, margins, targets per device   (shape)
platform-rules.ts → hover, proximity, nav, gestures        (interaction)
scheme.ts        → light | dark surface                    (canvas)
eras.ts          → accent mood                             (atmosphere)
variation.ts     → seeded per-instance fingerprint         (identity)
```

A product picks none of these by hand at the call site — it reads the resolved
profile for the current width and scheme, and the right rules fall out.
