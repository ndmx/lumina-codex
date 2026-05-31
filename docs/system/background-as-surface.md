# Lumina Background-as-Surface Rule

`scheme.ts` decides *what canvas* a product is painted on (paper vs. void).
This rule decides *what to do with a canvas that already carries imagery* — a
decorative or photographic background. The default instinct is to drop content
into opaque cards so it stays legible. On a designed background that instinct is
usually wrong: it buries the surface that gives the screen its mood and turns an
atmosphere into a form. This file is the prose rule; it has no separate
executable module because it composes from `scheme.ts` overlays, the
`contrast-floor` invariant, and the touch rules already encoded.

Primarily a **mobile** rule (`mobile`, `native-app`, `ios-app`), but it holds on
any medium where a chosen background image is part of the design rather than a
neutral fill.

## The rule

**Treat the background as part of the primary visual surface, not as something
to hide behind opaque cards.** Text, icons, controls, and content groups sit
*directly on the background* whenever readability allows.

Avoid white or filled block backgrounds for the repeated content surfaces:

- summary sections
- cards
- profile rows
- plan rows
- memory cards
- radar / member panels

These are exactly the surfaces a designer reaches for an opaque card on out of
habit. On a decorative background, prefer to let them breathe on the surface.

## Separate without filling

Achieve grouping and legibility with the lightest tool that works, in this order:

1. **Spacing** — distance between groups is the first separator. Most "this
   needs a card" feelings are really "this needs more space."
2. **Hierarchy** — size, weight, and color of text/icons carry grouping before
   any container does.
3. **Dividers** — a thin rule (`--ls-border-subtle`) between rows beats wrapping
   each row in a box.
4. **Subtle shadow** — a soft drop shadow (`--ls-shadow`) to lift a control off
   busy imagery, used only when needed.
5. **Thin low-opacity outline** — a hairline border (`--ls-border-subtle`, and
   for an actual fill when unavoidable, `--ls-overlay-light`) around *repeated or
   tappable* blocks. An outline says "this is one tappable unit" without painting
   over the background.

Use the `--ls-*` properties from `resolveSchemeVars` for all of the above;
never hardcode a white panel color.

## Keep controls clear, don't box whole sections

Buttons and interactive controls stay **visually unambiguous** — a tappable
thing must read as tappable, and it must still meet the 44px touch target from
`platform-rules.ts`. That is not in tension with this rule: outline or lift a
*button*, do not wrap the whole *section it lives in* inside an opaque white
container.

The single exception: place content inside a filled container only when the
background genuinely makes it unreadable and the steps below can't recover it.

## Choosing backgrounds per screen

- Pick the background **per screen** for mood and clarity, not one image
  everywhere.
- Position the most detailed / high-contrast parts of the image **away from
  dense text areas** — keep busy regions behind whitespace, calm regions behind
  copy.

## When contrast fails

If text contrast drops below the `contrast-floor` invariant (the WCAG floor that
must hold in every scheme × era — see `invariants.ts`), recover it in this
order, *before* reaching for a white card:

1. A gentle **full-screen readability wash** — a single low-opacity scrim over
   the whole background (`--ls-overlay-light` / `--ls-overlay-medium`),
   preserving the image underneath.
2. A **gradient** — e.g. darkening toward the edge where text sits, image still
   visible.
3. Only then, and only locally, a filled container.

The wash protects the surface; a forest of white cards replaces it. The
contrast floor is non-negotiable, but it is a reason to *wash*, not to *box*.

## How this composes with the rest of the system

```
scheme.ts        → background / surface / overlay / border / shadow tokens
invariants.ts    → contrast-floor (the readability floor this rule defers to)
platform-rules.ts → 44px touch target controls must still meet
eras.ts          → accent mood the background should harmonize with
```

This rule is additive: it never lowers the contrast floor or shrinks a touch
target. It only changes *how* a screen reaches legibility — through surface,
spacing, and washes rather than opaque fills.
