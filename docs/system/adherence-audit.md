# Lumina Adherence Audit

Date: 2026-05-06

This audit records how the files in `DEV/appDesign` align with the Lumina system.

## Scope

Included:

- Markdown product profiles in `lumina-codex/docs/products/`.
- HTML source snapshots in `lumina-codex/docs/products/mobile-design-systems/source-docs/edentv-jxl/`.
- Lumina Codex docs, manifest, agent entry points, and source files in `lumina-codex/`.
- The `lumina-codex/docs/constitution.md` vision document.

Excluded from design-system conformance:

- `lumina-codex/node_modules/`: installed third-party dependencies.
- `lumina-codex/.next/`: generated Next.js build output.
- `lumina-codex/package-lock.json`: generated dependency lockfile.
- `AppDEVguideS/`: PDFs, icon material, and credential-like JSON files. This folder is a sensitive-material boundary and should not be copied into Lumina docs.

## Current Status

| Area | Status | Notes |
|---|---|---|
| `lumina-codex/LUMINA.md` | Canonical | Human and agent entry point. |
| `lumina-codex/AGENTS.md` | Canonical | Agent behavior rules. |
| `lumina-codex/lumina.manifest.json` | Canonical | Machine-readable routing map. |
| `lumina-codex/docs/system/` | Canonical | Source of truth for tags, names, element model, and source mapping. |
| `lumina-codex/README.md` | Adheres | Links to the Lumina system docs. |
| `lumina-codex/docs/*.md` | Adheres | Build and launch docs now reference the Lumina system direction. |
| `lumina-codex/src/**` | Adheres | Uses existing app/component naming. Three.js `Group` is a framework type, not a product naming term. |
| `lumina-codex/docs/constitution.md` | Adheres as vision | Marked as a vision document, not the active implementation contract. |
| `lumina-codex/docs/products/mobile-design-systems/README.md` | Adheres | Product-specific source material under Lumina. |
| `lumina-codex/docs/products/mobile-design-systems/cross-app-design-roadmap.md` | Adheres | Points to `lumina-codex/docs/system/` as the design-system source. |
| `lumina-codex/docs/products/mobile-design-systems/shared/*.md` | Adheres | Uses `Shared Space` as the canonical concept and product aliases beneath it. |
| `lumina-codex/docs/products/mobile-design-systems/jxl-scheduler/*.md` | Adheres | Uses `Group` only as JxL Scheduler's user-facing alias for Lumina `Shared Space`. |
| `lumina-codex/docs/products/mobile-design-systems/park-memory-hub/*.md` | Adheres | Uses `Circle` only as ParkMemory Hub's user-facing alias for Lumina `Shared Space`. |
| `lumina-codex/docs/products/mobile-design-systems/source-docs/**/*.md` | Adheres as archived snapshots | Each source snapshot is marked archival and points back to current Lumina docs. Legacy implementation terms may remain inside archived/code examples. |
| `lumina-codex/docs/products/mobile-design-systems/source-docs/edentv-jxl/*.html` | Adheres as archived snapshots | Each HTML snapshot includes Lumina archive metadata. The visible `Uploads and Files` label was corrected to `Uploads`. |

## Approved Alias Rules

- Lumina canonical concept: `Shared Space`.
- JxL Scheduler user-facing alias: `Group`.
- ParkMemory Hub user-facing alias: `Circle`.
- `Team` is allowed only for Apple Developer signing context or products that are explicitly workplace/team-first.
- `Organization` remains only inside archived implementation snapshots or code identifiers.
- `Files`, `Comms`, and `Ops` may appear only as discouraged terms or legacy snapshot content; current JxL copy uses `Uploads`, `Messages`, and route/schedule language.

## Verification Commands

```bash
rg -n "Organization|Team|Files|Comms|Ops|Group|Circle|group/circle|webapp|web app|web-app|Local Workspace|Publish" \
  --glob '!lumina-codex/package-lock.json' \
  --glob '!lumina-codex/node_modules/**' \
  --glob '!lumina-codex/.next/**' \
  --glob '!AppDEVguideS/**'
```

Interpret the remaining hits through the approved alias rules above.
