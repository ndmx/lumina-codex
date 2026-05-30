# Lumina Instructions For Agents

Before designing or modifying any product with this repository, read `LUMINA.md`.

## Required Behavior

- Treat `docs/system/` as the canonical design-system source.
- Treat `docs/products/` as product profiles and archived source context.
- Treat `docs/constitution.md` as vision and craft direction, not a replacement for the system rules.
- Use `lumina.manifest.json` for machine-readable routing.
- Use `docs/system/continuous-improvement.md` when adding or changing system rules.

## Naming Rules

- Use lowercase kebab-case for tags.
- Use semantic design token names, not raw visual names.
- Use `Shared Space` as the canonical collaboration concept.
- Use product aliases only where approved by `docs/system/naming-and-tags.md`.
- Do not introduce `Organization`, `Team`, `Files`, `Comms`, or `Ops` in user-facing copy unless a product profile explicitly allows it.

## Update Rules

- Keep changes small and close to the relevant system file.
- Add every reusable new decision to `docs/system/improvement-log.md`.
- Update `docs/system/registry.md` if a new file, product profile, or canonical source is added.
- Preserve archived source docs; annotate them instead of rewriting their history unless the visible user-facing wording is stale and obvious.

