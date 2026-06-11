# Lumina Instructions For Agents

Before designing or modifying any product with this repository, read `LUMINA.md`.

## Required Behavior

- Treat `docs/system/` as the canonical design-system source.
- Treat `docs/design-variations/` as public reusable UI/UX examples.
- Treat `docs/constitution.md` as vision and craft direction, not a replacement for the system rules.
- Use `lumina.manifest.json` for machine-readable routing.
- Use `docs/system/continuous-improvement.md` when adding or changing system rules.

## Naming Rules

- Use lowercase kebab-case for tags.
- Use semantic design token names, not raw visual names.
- Use `Shared Space` as the canonical collaboration concept.
- Use product aliases only in private apps; public Lumina docs should stay generic.
- Do not introduce private app names, app IDs, launch URLs, or source snapshots into public docs.

## Update Rules

- Keep changes small and close to the relevant system file.
- Add every reusable new decision to `docs/system/improvement-log.md`.
- Update `docs/system/registry.md` if a new file, design variation, or canonical source is added.
- Distill private app lessons into numbered design variations rather than preserving private source docs.
