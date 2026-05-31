# Lumina System

Lumina is the shared design-system language for software rendered on any medium: iOS apps, Android apps, desktop apps, browser sites, web apps, embedded webviews, documents, presentations, and spatial or canvas-based interfaces.

This folder is the source of truth for names, tags, and element coverage. Product-specific systems such as JxL Scheduler and ParkMemory Hub should map their local terms into Lumina instead of inventing new global terms.

For app or agent usage, start at `LUMINA.md`.

## Files

- `platform-taxonomy.md`: the canonical medium, platform, runtime, and surface tags.
- `naming-and-tags.md`: naming rules for products, screens, components, tokens, props, files, states, events, and user-facing copy.
- `element-model.md`: the canonical Lumina element model, with coverage for HTML, React, TypeScript, SwiftUI, native mobile, canvas, SVG, and 3D engines.
- `source-map.md`: where the existing appDesign files and adjacent app folders fit into Lumina.
- `registry.md`: ownership map for canonical files and product profiles.
- `continuous-improvement.md`: the agent workflow for quickly adding reusable system knowledge.
- `improvement-log.md`: the running record of decisions and additions.

## Core Rule

Use the most stable semantic name at the Lumina level, then allow local product labels beneath it.

Example:

```text
Lumina concept: Shared Space
JxL Scheduler label: Group
ParkMemory Hub label: Circle
Implementation examples: CloudKit share, workspace membership table, invite link, join code
```

This keeps the whole portfolio consistent without erasing the language that makes each app understandable.

## Decision Order

1. Name the user's intent.
2. Name the information object.
3. Name the surface where it appears.
4. Name the component role.
5. Name the platform-specific implementation.

Example:

```text
Intent: invite people
Object: Shared Space
Surface: Profile Screen
Component role: Primary Action
iOS implementation: toolbar button + share sheet
Web implementation: button + dialog + copy link affordance
```
