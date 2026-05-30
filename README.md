# Lumina Codex

Lumina Codex is both a portable design-system package and an immersive portfolio prototype. Point apps or agents to `LUMINA.md` when you want them to design with the Lumina system.

The live site is built with Next.js, React Three Fiber, and an editorial narrative shell. The system docs define naming, tags, product profiles, element coverage, and continuous improvement rules for apps across mobile, web, native, documents, presentations, canvas, and 3D surfaces.

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

The shared cross-medium design-system layer lives in this package.

- `LUMINA.md` is the main human/agent entry point.
- `AGENTS.md` gives Codex-style agents the repo-local operating rules.
- `lumina.manifest.json` gives tools a machine-readable map of the system.
- `docs/constitution.md` contains the Lumina Codex vision document.
- `docs/system/platform-taxonomy.md` defines the canonical tags for mobile, web, web apps, native apps, canvas, 3D, documents, and other rendered software.
- `docs/system/naming-and-tags.md` defines product, component, token, state, event, file, and user-facing naming rules.
- `docs/system/element-model.md` maps Lumina roles to HTML, React, TypeScript, SwiftUI, native mobile, SVG, canvas, and 3D engines.
- `docs/system/registry.md` tells agents where to read and where to write.
- `docs/system/continuous-improvement.md` defines the quick-add workflow for reusable agent discoveries.
- `docs/system/source-map.md` explains how app sources, product profiles, and sensitive references roll up into Lumina.
- `docs/system/adherence-audit.md` records which files are canonical, product-specific, archived, generated, or sensitive.
- `docs/products/` stores product profiles, including the migrated mobile design-system docs.
