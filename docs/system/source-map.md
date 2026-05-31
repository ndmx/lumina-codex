# Lumina Source Map

This map explains how the `lumina-codex` package, neighboring app sources, and out-of-scope reference folders roll up into Lumina. Paths are relative to the repository root.

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

## Product Profiles

| Path | Lumina Mapping |
|---|---|
| `docs/products/README.md` | Product profile index. |
| `docs/products/mobile-design-systems/README.md` | Product-specific mobile docs index. |
| `docs/products/mobile-design-systems/cross-app-design-roadmap.md` | Earlier version of the shared vocabulary; superseded by `docs/system/`. |
| `docs/products/mobile-design-systems/jxl-scheduler/design-system.md` | Product-specific Lumina profile for JxL Scheduler. |
| `docs/products/mobile-design-systems/park-memory-hub/design-system.md` | Product-specific Lumina profile for ParkMemory Hub. |
| `docs/products/mobile-design-systems/shared` | Native iOS and collaboration principles feeding Lumina. |
| `docs/products/mobile-design-systems/source-docs` | Snapshots only; do not treat as current naming source unless newer product docs are missing. |

## Adjacent App Sources

These live outside this repository, in the maintainer's local workspace. They are listed by medium so their vocabulary maps to the same element model; the local paths are intentionally omitted.

| Source | Medium Tags | Notes |
|---|---|---|
| JxL Scheduler (iOS) | `mobile`, `ios-app`, `native-app`, `swiftui` | Uses `Group`, `Member`, `Workspace`, `Uploads`. |
| ParkMemory Hub (iOS) | `mobile`, `ios-app`, `native-app`, `swiftui` | Uses `Circle`, `Member`, `Memories`, `Radar`, `Planner`. |
| iOS app sources | `mobile`, `ios-app`, `native-app`, `swiftui`, `location` | Candidates for future Lumina product profiles. |
| Web app sources | `web`, `web-app`, `website`, `browser` | Multiple React/Vite/static/server-rendered sources should map to the same element model. |
| Android app sources | `mobile`, `android-app`, `native-app` | Candidate for Android mapping. |
| macOS app sources | `desktop`, `macos-app`, `native-app` | Candidate for desktop mapping. |

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
