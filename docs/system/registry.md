# Lumina Registry

This file tells agents where to look and where to write.

## Executable System Files

These are the canonical TypeScript sources. All other projects derive their values from here.

| File | Purpose | Update When |
|---|---|---|
| `packages/lumina-system/src/constitution.ts` | Executable Lumina Design Constitution: principles, foundation floors, component spec fields, and governance rules. | A constitutional principle, foundation floor, or governance rule changes. |
| `packages/lumina-system/src/tokens.ts` | All design token primitives (colors, spacing, type, motion, layout). | A color, scale step, or primitive value changes across the system. |
| `packages/lumina-system/src/eras.ts` | Era/theme configurations with full token sets. | A new era is introduced or an era's accent/glow values change. |
| `packages/lumina-system/src/appearance.ts` | User appearance preference options and paired light/dark background guidance. | Apps need a System/Light/Dark override, paired backgrounds, or root-level scheme resolution changes. |
| `packages/lumina-system/src/surface.ts` | Background material names and content-block treatment recommendations. | Image-led surfaces, glass/outline/solid-panel rules, or map-surface decisions change. |
| `packages/lumina-system/src/registry.ts` | Public registry and lookup helpers for generic design variations. | A public variation changes platform/era metadata. |
| `packages/lumina-system/src/design-variations.ts` | Public numbered design variation library. | A reusable UI/UX design type is added or revised. |

## Canonical Documentation Files

| File | Purpose | Update When |
|---|---|---|
| `LUMINA.md` | Human and agent entry point. | Read order, agent contract, or quick-start behavior changes. |
| `AGENTS.md` | Codex-style agent instruction file. | Agent behavior rules change. |
| `lumina.manifest.json` | Machine-readable routing manifest. | Paths, version, read order, or design variation list changes. |
| `docs/system/README.md` | System overview. | Core system structure changes. |
| `docs/system/design-constitution.md` | Public design-system constitution. | Principles, foundation floors, component spec template, or governance rules change. |
| `docs/system/platform-taxonomy.md` | Medium, platform, framework, surface, and capability tags. | New render medium, platform, framework, or capability appears. |
| `docs/system/naming-and-tags.md` | Naming rules and aliases. | A new shared concept or product alias is approved. |
| `docs/system/element-model.md` | Cross-framework element model. | New UI engine, native component family, or HTML/platform element mapping is needed. |
| `docs/system/integration-guide.md` | Step-by-step guide for plugging in a new project. | Integration pattern or checklist changes. |
| `docs/system/source-map.md` | Repo/source boundaries. | Files move or new external app families are added. |
| `docs/system/adherence-audit.md` | Conformance record. | A repo-wide audit is run or source boundaries change. |
| `docs/system/continuous-improvement.md` | How agents add to Lumina. | Improvement process changes. |
| `docs/system/improvement-log.md` | Decision history. | Any reusable rule, alias, token, component, or pattern is added. |
| `docs/constitution.md` | Lumina Codex vision and craft constitution. | High-level creative direction changes. |

## Design Variations

| Folder | Purpose |
|---|---|
| `docs/design-variations/README.md` | Public variation index. |
| `docs/design-variations/design-variation-01.md` | Pearl Planner Glass. |
| `docs/design-variations/design-variation-02.md` | Smoked Graphite Glass. |
| `docs/design-variations/design-variation-03.md` | Chrome Pearl Memory Surface. |
| `docs/design-variations/design-variation-04.md` | Map Safety Glass. |

## Add-New-Variation Checklist

Full instructions in `docs/system/integration-guide.md`. Quick version:

1. Add a `DesignVariation` entry to `packages/lumina-system/src/design-variations.ts`.
2. Run `npm run test:run` — the registry tests must pass.
3. Create `docs/design-variations/design-variation-XX.md` with platform context, rules, and the required code signature.
4. Update `lumina.manifest.json` `designVariations` list.
5. Record the addition in `docs/system/improvement-log.md`.
6. Add approved concept aliases to `docs/system/naming-and-tags.md` only if they are reusable and generic.
