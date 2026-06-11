# Lumina System

Lumina is the shared design-system language for software rendered on any medium: iOS apps, Android apps, desktop apps, browser sites, web apps, embedded webviews, documents, presentations, and spatial or canvas-based interfaces.

This folder is the source of truth for names, tags, and element coverage.
Reusable visual systems should be published as numbered design variations, not
as private app profiles.

For app or agent usage, start at `LUMINA.md`.

## Files

- `platform-taxonomy.md`: the canonical medium, platform, runtime, and surface tags.
- `design-constitution.md`: the canonical principles, foundation floors, component spec template, and governance rules. Its executable partner is `packages/lumina-system/src/constitution.ts`.
- `naming-and-tags.md`: naming rules for products, screens, components, tokens, props, files, states, events, and user-facing copy.
- `element-model.md`: the canonical Lumina element model, with coverage for HTML, React, TypeScript, SwiftUI, native mobile, canvas, SVG, and 3D engines.
- `background-as-surface.md`: the mobile rule for decorative backgrounds — treat the background as the primary surface; content sits on it rather than inside opaque cards. Its executable partner is `packages/lumina-system/src/surface.ts`.
- `appearance` module: `packages/lumina-system/src/appearance.ts` names the System/Light/Dark preference pattern, paired background guidance, and root-level scheme resolution.
- `source-map.md`: where public package files and private source boundaries fit into Lumina.
- `registry.md`: ownership map for canonical files and design variations.
- `continuous-improvement.md`: the agent workflow for quickly adding reusable system knowledge.
- `improvement-log.md`: the running record of decisions and additions.

## Core Rule

Use the most stable semantic name at the Lumina level, then allow local product labels beneath it in private apps. Public docs should stay generic.

Example:

```text
Lumina concept: Shared Space
Generic collaboration label: Group
Generic personal-memory label: Circle
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
