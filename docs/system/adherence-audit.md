# Lumina Adherence Audit

Date: 2026-05-06

This audit records how the project files align with the Lumina system.

## Scope

Included:

- Public design variations in `lumina-codex/docs/design-variations/`.
- Lumina Codex docs, manifest, agent entry points, and source files in `lumina-codex/`.
- The `lumina-codex/docs/constitution.md` vision document.

Excluded from design-system conformance:

- `lumina-codex/node_modules/`: installed third-party dependencies.
- `lumina-codex/.next/`: generated Next.js build output.
- `lumina-codex/package-lock.json`: generated dependency lockfile.
- `AppDEVguideS/`: out-of-scope reference material. This folder is a boundary and should not be copied into Lumina docs.

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
| `lumina-codex/docs/design-variations/*.md` | Adheres | Public numbered design types with no private app names or source snapshots. |

## Approved Alias Rules

- Lumina canonical concept: `Shared Space`.
- Generic collaboration alias example: `Group`.
- Generic personal-memory alias example: `Circle`.
- `Team` is allowed only for Apple Developer signing context or products that are explicitly workplace/team-first.
- `Organization`, `Files`, `Comms`, and `Ops` may appear only as discouraged terms, generic examples, or implementation-specific copy outside the public design variation docs.

## Verification Commands

```bash
rg -n "Organization|Team|Files|Comms|Ops|Group|Circle|group/circle|webapp|web app|web-app|Local Workspace|Publish" \
  --glob '!lumina-codex/package-lock.json' \
  --glob '!lumina-codex/node_modules/**' \
  --glob '!lumina-codex/.next/**' \
  --glob '!AppDEVguideS/**'
```

Interpret the remaining hits through the approved alias rules above.
