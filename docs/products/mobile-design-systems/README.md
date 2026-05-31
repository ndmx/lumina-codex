# Mobile Design-System Product Profiles

> Lumina note: this folder is now product-specific source material under the broader Lumina system. Use `docs/system/` as the cross-medium source of truth for naming, tags, platform taxonomy, and element coverage.

This folder collects the design-system and product-documentation work for the current EdenTV iOS apps:

- JxL Scheduler
- ParkMemory Hub

Lumina tags for this folder: `medium:mobile`, `platform:ios`, `framework:swiftui`, `native-app`, `capability:local-first`, `data:shared-space`.

It has two jobs:

1. Preserve source docs from each app so launch and review context does not get lost.
2. Turn the reusable parts into product-specific profiles under Lumina.

## Folder Map

```text
docs/products/mobile-design-systems/
  README.md
  shared/
    apple-ios-system-principles.md
    local-first-collaboration-pattern.md
  jxl-scheduler/
    design-system.md
    product-docs.md
  park-memory-hub/
    design-system.md
    product-docs.md
  source-docs/
    jxl-scheduler/
      DESIGN_SYSTEM.md
```

## Shared Design Direction

The apps should feel Apple-native before they feel branded. Use SwiftUI, SF Symbols, native sheets, native sharing, native maps, Dynamic Type, and clear navigation patterns as the base. Custom visual identity should sit on top of those conventions, not fight them.

The reusable direction across both apps is:

- Local-first: every core workflow should remain useful before sync or account state is considered.
- User-controlled sharing: sharing should be explicit, scoped, and easy to explain.
- Native iOS interaction: use `NavigationStack`, `TabView`, sheets, menus, swipe actions, context menus, share sheets, and Maps handoff where they match the job.
- Consistent language: use the same names for the same ideas across screens and docs.
- Lumina mapping: use `Shared Space` as the canonical system concept, then use `Group` for JxL Scheduler and `Circle` for ParkMemory Hub in user-facing copy.
- Calm utility: decorative surfaces should never make repeated planning tasks slower to scan.

## Source Material

Source docs were copied from:

- `Jx Scheduler`
- `ParkMemoryHub`
- `edentv/docs`

The polished docs in this folder are the recommended working reference. The original design-system snapshot is kept under `source-docs/jxl-scheduler/` for provenance; app legal/operational source docs (privacy, support, release, setup) were removed as out of scope for a design-system repo.

## When To Update

Update these docs when:

- a tab name or product name changes
- a new reusable component is added
- privacy, support, or App Store behavior changes
- CloudKit sync behavior changes
- a design decision becomes shared across multiple apps
