# Lumina Source Map

This map explains how the `lumina-codex` package, public design variations, and
out-of-scope private reference folders roll up into Lumina. Paths are relative
to the repository root.

## Lumina Root

| Path | Lumina Role |
|---|---|
| `.` | Portable Lumina package and live Lumina Codex web experience. |
| `LUMINA.md` | Human and agent entry point. |
| `AGENTS.md` | Codex-style agent instructions. |
| `lumina.manifest.json` | Machine-readable system map. |
| `docs/system` | Cross-medium Lumina design-system source of truth. |
| `docs` | Launch, build, and roadmap documentation. |
| `docs/constitution.md` | Vision document for the immersive Codex site. Treat as inspiration, not the current implementation contract. |

## Design Variations

| Path | Lumina Mapping |
|---|---|
| `docs/design-variations/README.md` | Public index of reusable design types. |
| `docs/design-variations/design-variation-01.md` | Pearl Planner Glass. |
| `docs/design-variations/design-variation-02.md` | Smoked Graphite Glass. |
| `docs/design-variations/design-variation-03.md` | Chrome Pearl Memory Surface. |
| `docs/design-variations/design-variation-04.md` | Map Safety Glass. |

## Private Source Boundary

Private app sources may teach Lumina new patterns, but public docs must publish
only distilled design variations. Do not add private app names, launch docs, app
IDs, URLs, or source snapshots to this repository.

| Private Source Medium | Public Output |
|---|---|
| iOS app source | `docs/design-variations/design-variation-XX.md` plus package tokens/rules. |
| Web app source | `docs/design-variations/design-variation-XX.md` plus React/CSS guidance. |
| Android app source | Generic Android platform guidance and reusable variation rules. |
| macOS app source | Generic desktop/macOS platform guidance and reusable variation rules. |

## Out-of-Scope Reference Boundary

A sibling `../AppDEVguideS` folder is treated as an out-of-scope reference folder. Lumina may reference it as app-development background, but it must not ingest, copy, publish, or expose its contents in design-system docs.

## External References

- [WHATWG HTML Standard indices](https://html.spec.whatwg.org/dev/indices.html)
- [WHATWG HTML Standard](https://html.spec.whatwg.org/)
- [MDN HTML reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference)
- [MDN HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [MDN content categories](https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories)
- [React built-in components](https://react.dev/reference/react/components)
- [React DOM components](https://react.dev/reference/react-dom/components)
- [React: Your first component](https://react.dev/learn/your-first-component)
- [TypeScript Handbook: Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [TypeScript Handbook: Modules](https://www.typescriptlang.org/docs/handbook/modules/reference.html)
