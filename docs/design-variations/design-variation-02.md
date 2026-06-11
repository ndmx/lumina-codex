# Design Variation 02: Smoked Graphite Glass

Code signature: `Lumina Design System · Variation 02 · Created by ndmx`

## Summary

Smoked Graphite Glass is a dark-mode luxury productivity surface. It is not a
black repaint. It uses graphite glass, smoked steel, subtle chrome edges, muted
teal glints, pearl text, and translucent charcoal cards.

## Best For

- dark mode for planning and scheduling tools
- evening-use productivity apps
- premium dashboards
- native mobile apps with strong visual identity
- desktop utilities that need a calm night surface

## Visual Language

- Background: graphite, smoked glass, steel/chrome ribbons, faint grid or data
  structure.
- Surfaces: translucent charcoal glass with thin pearl/steel outlines.
- Text: pearl/off-white primary text, muted silver secondary text.
- Accent: softened teal or sea-glass; broad and low-opacity glow only.
- Empty-state art: desaturate or dim light illustrations so they do not become
  the brightest object on screen.

## UX Rules

- Keep System as the default appearance preference.
- Offer `System | Light | Dark` when a product has a strong light/dark identity.
- Apply the resolved scheme at the app root so every screen swaps together.
- Pair dark backgrounds with the light composition rather than inverting pixels.
- Do not replace white-card clutter with heavy black slabs.

## Implementation Notes

SwiftUI:

- Persist appearance with local storage such as `@AppStorage`.
- Resolve `system`, `light`, or `dark` into a root preferred color scheme.
- Use a dark-specific image asset instead of tinting the light image.
- Keep forms and dense inputs on solid panels; let repeated blocks stay glass.

Web:

- Store the preference in local storage.
- Resolve `system` through `prefers-color-scheme`.
- Set a root data attribute or class before rendering visible content.
- Use separate light/dark background assets when the material mood changes.

## Pairs Well With

- Design Variation 01 for the light companion.
