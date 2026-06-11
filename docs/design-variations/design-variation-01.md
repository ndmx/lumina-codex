# Design Variation 01: Pearl Planner Glass

Code signature: `Lumina Design System · Variation 01 · Created by ndmx`

## Summary

Pearl Planner Glass is a light, calm productivity surface for scheduling,
planning, routes, tasks, and operational tools that still want warmth.

It uses a warm pearl-paper or frosted-calendar background, faint planning/grid
structure, transparent or near-clear content blocks, and softened teal actions.

## Best For

- mobile scheduling apps
- route or shift planning
- personal productivity
- calm local-first tools
- lightweight dashboards

## Visual Language

- Background: warm pearl paper, frosted glass, faint calendar or planner grid.
- Detail placement: keep the center calm for text; push chrome or glass detail
  to edges and corners.
- Surfaces: transparent outlines for repeated blocks, near-clear glass for
  controls and stats, solid panels only for forms or contrast recovery.
- Text: dark warm ink on light surfaces.
- Accent: softened teal for actions and selected state, not neon green.

## UX Rules

- Let the background act as the planning surface.
- Avoid default white cards; they flatten the material and erase the identity.
- Use a thin outline to separate repeated rows or cards.
- Keep primary actions obvious and native-feeling.
- Use compact, predictable navigation before decorative composition.

## Implementation Notes

SwiftUI:

- Use adaptive semantic color tokens.
- Put the background image at the root of each screen or tab container.
- Use `outline`, `glass`, and `solid` surface treatments.
- Use `Picker(...).pickerStyle(.segmented)` for compact settings.

Web:

- Use CSS custom properties for scheme tokens.
- Prefer `background-size: cover` plus a readability wash.
- Use `backdrop-filter` only when it improves clarity and performance allows.

## Pairs Well With

- Design Variation 02 for a user-selectable dark mode.
