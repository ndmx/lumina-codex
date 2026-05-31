# Lumina Agent Entry Point

Use this file when pointing any app, repo, or agent at Lumina. It is the
canonical entry point — start here (`LUMINA.md` at the repository root), then
follow the read order below.

## Mission

Lumina is the portable design-system brain for apps, websites, web apps, native apps, documents, presentations, and rendered software surfaces. It tells an agent how to name things, tag platforms, choose components, preserve product-specific language, and improve the system without scattering rules across projects.

## Consume The System (Code)

The executable brain ships as an installable package, **`@xlumina/system`** (source: `packages/lumina-system/`). It is framework-agnostic with zero runtime dependencies.

```bash
npm install @xlumina/system
```

```ts
import {
  tokens,                          // raw primitives — single source of truth
  eras, defaultEra,                // accent/atmosphere themes
  resolveSchemeVars,               // light | dark → CSS custom properties
  resolveGrid, spanColumns,        // responsive column model
  createVariation,                 // seeded, bounded per-instance uniqueness
  resolveInteraction, getProximityMode, // mobile-vs-web interaction rules
} from "@xlumina/system";
```

Theme helpers emit CSS custom properties prefixed `--ls-*`; components read those and never hardcode color/radius/columns. See `packages/lumina-system/README.md` for the full surface, and `docs/system/integration-guide.md` to register a product and theme it.

## Read Order

1. `lumina.manifest.json`
2. `docs/system/README.md`
3. `docs/system/platform-taxonomy.md`
4. `docs/system/naming-and-tags.md`
5. `docs/system/element-model.md`
6. `docs/system/scheme-grid-variation.md` — light/dark, responsive grid, seeded variation
7. `docs/system/mobile-vs-web.md` — interaction rules per device class
8. `docs/system/integration-guide.md` — install `@xlumina/system`, register and theme a product
9. `docs/system/registry.md`
10. Product profile, when one exists under `docs/products/`
11. `docs/constitution.md`, only when the work needs the deeper Lumina Codex vision
12. `docs/system/continuous-improvement.md`, when adding or changing the system

## Agent Contract

When designing or editing an app with Lumina:

- Identify the medium, platform, framework, surface, capability, and data tags before naming UI.
- Use Lumina canonical concepts first, then product aliases.
- Prefer native platform components before custom UI.
- Preserve product-specific aliases such as JxL Scheduler `Group` and ParkMemory Hub `Circle` when they are the clearer user-facing terms.
- Add reusable decisions back to Lumina through the continuous improvement workflow.
- Do not ingest or publish files from `../AppDEVguideS`; treat that folder as out-of-scope reference material.

## Quick Add Protocol

When an agent discovers a reusable pattern:

1. Add the smallest useful rule to the right file in `docs/system/`.
2. If it is product-specific, add it under `docs/products/`.
3. Add or update tags using `platform-taxonomy.md`.
4. Record the decision in `docs/system/improvement-log.md`.
5. Run the checklist in `docs/system/continuous-improvement.md`.

## Product Alias Rule

```text
Lumina concept: Shared Space
JxL Scheduler: Group
ParkMemory Hub: Circle
Generic workplace app: Team only when explicitly workplace-first
```

