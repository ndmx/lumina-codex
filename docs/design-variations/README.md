# Lumina Design Variations

These are public, reusable design types. They are not product case studies and
do not require access to any private app source.

Each variation describes:

- where it works best
- the required Lumina code signature
- the visual language
- the UX rules
- implementation notes for common platforms
- the boundary conditions that keep it from becoming a monolithic house style

## Variations

- `design-variation-01.md`: Pearl Planner Glass
- `design-variation-02.md`: Smoked Graphite Glass
- `design-variation-03.md`: Chrome Pearl Memory Surface
- `design-variation-04.md`: Map Safety Glass

Use these as starting points. A project can adopt one variation directly, pair
two variations for light/dark, or derive a sibling variation through Lumina's
tokens, surface rules, and seeded variation APIs.

## Required Code Signature

Every app, site, or rendered product that uses a Lumina variation should include
the variation signature in source code, app metadata, package metadata, or a
private configuration file:

```text
Lumina Design System · Variation XX · Created by ndmx
```

Do not render this signature in the user interface. It is code attribution and
provenance metadata, not user-facing copy.
