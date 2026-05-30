# Lumina Registry

This file tells agents where to look and where to write.

## Executable System Files

These are the canonical TypeScript sources. All other projects derive their values from here.

| File | Purpose | Update When |
|---|---|---|
| `packages/lumina-system/src/tokens.ts` | All design token primitives (colors, spacing, type, motion, layout). | A color, scale step, or primitive value changes across the system. |
| `packages/lumina-system/src/eras.ts` | Era/theme configurations with full token sets. | A new era is introduced or an era's accent/glow values change. |
| `packages/lumina-system/src/registry.ts` | Product registry and lookup helpers. | A new project joins or a product's platform/era/alias changes. |

## Canonical Documentation Files

| File | Purpose | Update When |
|---|---|---|
| `LUMINA.md` | Human and agent entry point. | Read order, agent contract, or quick-start behavior changes. |
| `AGENTS.md` | Codex-style agent instruction file. | Agent behavior rules change. |
| `lumina.manifest.json` | Machine-readable routing manifest. | Paths, version, read order, or registered products list changes. |
| `docs/system/README.md` | System overview. | Core system structure changes. |
| `docs/system/platform-taxonomy.md` | Medium, platform, framework, surface, and capability tags. | New render medium, platform, framework, or capability appears. |
| `docs/system/naming-and-tags.md` | Naming rules and aliases. | A new shared concept or product alias is approved. |
| `docs/system/element-model.md` | Cross-framework element model. | New UI engine, native component family, or HTML/platform element mapping is needed. |
| `docs/system/integration-guide.md` | Step-by-step guide for plugging in a new project. | Integration pattern or checklist changes. |
| `docs/system/source-map.md` | Repo/source boundaries. | Files move or new external app families are added. |
| `docs/system/adherence-audit.md` | Conformance record. | A repo-wide audit is run or source boundaries change. |
| `docs/system/continuous-improvement.md` | How agents add to Lumina. | Improvement process changes. |
| `docs/system/improvement-log.md` | Decision history. | Any reusable rule, alias, token, component, or pattern is added. |
| `docs/constitution.md` | Lumina Codex vision and craft constitution. | High-level creative direction changes. |

## Product Profiles

| Folder | Purpose |
|---|---|
| `docs/products/mobile-design-systems/` | Current iOS product profiles and archived source snapshots. |
| `docs/products/mobile-design-systems/jxl-scheduler/` | JxL Scheduler product language and design rules. |
| `docs/products/mobile-design-systems/park-memory-hub/` | ParkMemory Hub product language and design rules. |
| `docs/products/mobile-design-systems/shared/` | Shared native iOS collaboration principles. |
| `docs/products/mobile-design-systems/source-docs/` | Archived source snapshots. Use for context, not current naming authority. |

## Add-New-Product Checklist

Full instructions in `docs/system/integration-guide.md`. Quick version:

1. Add a `ProductProfile` entry to `packages/lumina-system/src/registry.ts`.
2. Run `npm run test:run` — the registry tests must pass.
3. Create `docs/products/<product-slug>/README.md` with platform context and alias notes.
4. Update `lumina.manifest.json` `registeredProducts` list.
5. Record the addition in `docs/system/improvement-log.md`.
6. Add approved concept aliases to `docs/system/naming-and-tags.md` only if they are reusable.

