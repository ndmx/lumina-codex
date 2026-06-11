# Design Variation 04: Map Safety Glass

Code signature: `Lumina Design System · Variation 04 · Created by ndmx`

## Summary

Map Safety Glass is the operational counterweight to the more atmospheric
variations. It uses glass overlays on maps, but it allows solid panels for
forms, urgent workflows, dense safety data, and anything where speed and clarity
matter more than preserving background visibility.

## Best For

- map-first mobile apps
- safety and incident reporting
- location-aware dashboards
- emergency or alert flows
- operational field tools

## Visual Language

- Background: live map, spatial data, or operational surface.
- Controls: floating glass chips and filter bars.
- Panels: solid where the user must read, decide, or report quickly.
- Colors: separate brand accent from functional status colors.
- Status roles: danger, warning, success, info are semantic and must not be
  confused with decoration.

## UX Rules

- The map is content, not wallpaper.
- Use glass for lightweight overlays and filters.
- Use solid panels for reporting forms, severity choices, evidence lists, and
  urgent confirmations.
- Do not rely on color alone for safety states; pair with labels or icons.
- Prefer direct, consent-oriented copy.

## Implementation Notes

SwiftUI:

- Use native maps and location permission flows where possible.
- Keep floating controls at accessible touch sizes.
- Use semantic status colors for severity and confirmation states.

Web:

- Keep map controls keyboard accessible.
- Avoid stacking translucent overlays over dense map labels.
- Use solid panels for step-by-step reporting or decision flows.
