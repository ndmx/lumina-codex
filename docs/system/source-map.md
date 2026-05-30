# Lumina Source Map

This map explains how the `lumina-codex` package, neighboring app folders, and sensitive reference folders roll up into Lumina.

## Lumina Root

| Path | Lumina Role |
|---|---|
| `lumina-codex` | Portable Lumina package and live Lumina Codex web experience. |
| `lumina-codex/LUMINA.md` | Human and agent entry point. |
| `lumina-codex/AGENTS.md` | Codex-style agent instructions. |
| `lumina-codex/lumina.manifest.json` | Machine-readable system map. |
| `lumina-codex/docs/system` | Cross-medium Lumina design-system source of truth. |
| `lumina-codex/docs` | Launch, build, and roadmap documentation. |
| `lumina-codex/docs/constitution.md` | Vision document for the immersive Codex site. Treat as inspiration, not the current implementation contract. |

## Product Profiles

| Path | Lumina Mapping |
|---|---|
| `lumina-codex/docs/products/README.md` | Product profile index. |
| `lumina-codex/docs/products/mobile-design-systems/README.md` | Product-specific mobile docs index. |
| `lumina-codex/docs/products/mobile-design-systems/cross-app-design-roadmap.md` | Earlier version of the shared vocabulary; superseded by `docs/system/`. |
| `lumina-codex/docs/products/mobile-design-systems/jxl-scheduler/design-system.md` | Product-specific Lumina profile for JxL Scheduler. |
| `lumina-codex/docs/products/mobile-design-systems/park-memory-hub/design-system.md` | Product-specific Lumina profile for ParkMemory Hub. |
| `lumina-codex/docs/products/mobile-design-systems/shared` | Native iOS and collaboration principles feeding Lumina. |
| `lumina-codex/docs/products/mobile-design-systems/source-docs` | Snapshots only; do not treat as current naming source unless newer product docs are missing. |

## Adjacent App Sources

| Path | Medium Tags | Notes |
|---|---|---|
| `iOS_apps/Jx Scheduler` | `mobile`, `ios-app`, `native-app`, `swiftui` | Uses `Group`, `Member`, `Workspace`, `Uploads`. |
| `iOS_apps/ParkMemoryHub` | `mobile`, `ios-app`, `native-app`, `swiftui` | Uses `Circle`, `Member`, `Memories`, `Radar`, `Planner`. |
| `iOS_apps/candidate-ios-app` | `mobile`, `ios-app`, `native-app`, `swiftui`, `location` | Candidate for future Lumina product profile. |
| `iOS_apps/candidate-ios-app` | `mobile`, `ios-app`, `native-app`, `location` | Candidate for future Lumina product profile. |
| `DEV/web_apps` | `web`, `web-app`, `website`, `browser` | Multiple React/Vite/static/server-rendered sources should map to the same element model. |
| `DEV/android_apps` | `mobile`, `android-app`, `native-app` | Candidate for Android mapping. |
| `DEV/macOS_apps` | `desktop`, `macos-app`, `native-app` | Candidate for desktop mapping. |

## Sensitive Material Boundary

`../AppDEVguideS` remains outside `lumina-codex`. It includes PDFs and JSON credential-like files. Lumina can reference the folder as app-development background, but it should not ingest, copy, publish, or expose the JSON contents in design-system docs.

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
