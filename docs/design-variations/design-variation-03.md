# Design Variation 03: Chrome Pearl Memory Surface

Code signature: `Lumina Design System · Variation 03 · Created by ndmx`

## Summary

Chrome Pearl Memory Surface is an emotional, reflective design type for shared
places, memories, albums, profiles, and personal history. The background carries
the mood, so the UI must not bury it under opaque cards.

## Best For

- memory or journal apps
- trip and place-based experiences
- small-group shared spaces
- profile-heavy consumer apps
- photo-first mobile products

## Visual Language

- Background: pearl, chrome, marble, and soft steel materials.
- Composition: calm center or reading zones with more detail at edges.
- Surfaces: transparent blocks with thin outlines for repeated content.
- Controls: faint glass only where a tactile control needs separation.
- Accent: softened teal, pearl neutrals, restrained category colors.

## UX Rules

- Treat the background as the emotional surface.
- Use spacing and hierarchy before adding containers.
- Use thin outlines to separate memories, members, plans, and profile rows.
- Avoid default white cards on designed imagery.
- Keep text zones calm; do not place dense copy over high-contrast chrome.

## Implementation Notes

SwiftUI:

- Use per-screen backgrounds when different sections need different material
  moods.
- Use transparent repeated blocks with thin strokes.
- Use glass only for controls, stats, and active input areas.

Web:

- Use image-set or CSS variables to swap material backgrounds.
- Keep cards mostly transparent, with borders sourced from scheme tokens.
- Use a global readability wash before local filled panels.
