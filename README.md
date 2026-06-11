# Lumina Codex

Lumina Codex is both a portable design-system package and an immersive portfolio prototype. Point apps or agents to `LUMINA.md` when you want them to design with the Lumina system.

The live site is built with Next.js, React Three Fiber, and an editorial narrative shell. The system docs define naming, tags, public design variations, element coverage, and continuous improvement rules for apps across mobile, web, native, documents, presentations, canvas, and 3D surfaces.

## The design system on npm — `@xlumina/system`

The portable Lumina brain ships as a published, framework-agnostic package with zero runtime dependencies ([npm](https://www.npmjs.com/package/@xlumina/system) · source: `packages/lumina-system/`).

```bash
npm install @xlumina/system
```

```ts
import {
  tokens,                   // raw primitives — the single source of truth
  eras, defaultEra,         // accent/atmosphere themes
  resolveSchemeVars,        // light | dark → CSS custom properties (--ls-*)
  resolveGrid, spanColumns, // responsive column model
  createVariation,          // seeded, bounded per-instance uniqueness
  resolveInteraction,       // mobile-vs-web interaction rules
} from "@xlumina/system";
```

Installing the package also gives every project the `lumina` CLI for the recursive-improvement loop:

```bash
npx lumina record --kind gap --target concept:Reminder --detail "no canonical chip"
npx lumina audit   # score this project's ledger + open proposals
```

See [`packages/lumina-system/README.md`](packages/lumina-system/README.md) for the full surface (subpath imports, usage, the loop) and `docs/design-variations/` to choose a public design type.

## Stack
- Next.js App Router
- TypeScript
- React 19
- Three.js with React Three Fiber and drei
- Postprocessing

## Local development
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification
```bash
npm run verify
```

## Environment
- `NEXT_PUBLIC_SITE_URL`
  Use this in preview/production so metadata, robots, and sitemap resolve to the correct domain.

## Current focus
- Authored chamber transitions between principles
- Principle-specific scene fields and chapter overlays
- Accessibility and mobile polish
- Launch preparation artifacts

## Lumina system docs

The rules and reference for the cross-medium design system (the prose layer behind the `@xlumina/system` package above):

- `LUMINA.md` is the main human/agent entry point.
- `AGENTS.md` gives Codex-style agents the repo-local operating rules.
- `lumina.manifest.json` gives tools a machine-readable map of the system.
- `docs/constitution.md` contains the Lumina Codex vision document.
- `docs/system/platform-taxonomy.md` defines the canonical tags for mobile, web, web apps, native apps, canvas, 3D, documents, and other rendered software.
- `docs/system/naming-and-tags.md` defines interface, component, token, state, event, file, and user-facing naming rules.
- `docs/system/element-model.md` maps Lumina roles to HTML, React, TypeScript, SwiftUI, native mobile, SVG, canvas, and 3D engines.
- `docs/system/registry.md` tells agents where to read and where to write.
- `docs/system/continuous-improvement.md` defines the quick-add workflow for reusable agent discoveries.
- `docs/system/source-map.md` explains how public design variations and out-of-scope private reference folders roll up into Lumina.
- `docs/system/adherence-audit.md` records which files are canonical, variation examples, archived, generated, or sensitive.
- `docs/design-variations/` stores public numbered design types for mobile, web, desktop, and future platforms.
