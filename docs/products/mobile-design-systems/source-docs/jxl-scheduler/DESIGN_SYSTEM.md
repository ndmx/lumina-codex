# JxL Scheduler Design System

> Lumina archive status: source snapshot. Use `docs/products/mobile-design-systems/jxl-scheduler/design-system.md` for the current product profile and `docs/system/` for canonical naming and tags.

## Product Name

Use `JxL Scheduler` in all user-facing copy. In code, reference `AppBrand.productName` instead of hard-coding the product name.

## Principles

- Local-first: screens should communicate that work starts on this iPhone and sync is optional.
- iOS-native: prefer SwiftUI navigation, sheets, menus, SF Symbols, Dynamic Type text styles, and platform share/location/map behaviors.
- Calm operations: route, schedule, message, upload, and profile surfaces should be readable first, decorative second.
- Consistent language: use `Workspace` for the local personal space, `Group` for shared iCloud collaboration, and `Member` for a person in a group.

## Design Tokens

Tokens live in `Jx Scheduler/Views/Style.swift`.

- `AppBrand.productName`: product naming.
- `AppLayout`: spacing, screen width, and card radius.
- `AppTheme.background*`: app-level backgrounds.
- `AppTheme.surface*`: cards, raised controls, and muted panels.
- `AppTheme.text*`: primary, secondary, and tertiary text.
- `AppTheme.action*`: primary/destructive/support action colors.
- `AppTheme.status*`: semantic feedback such as success and warning.

Legacy aliases like `AppTheme.accent` remain for compatibility, but new code should prefer semantic tokens.

## Components

Use shared components and modifiers before creating one-off styling:

- `AppSectionHeader`: page title and optional supporting text.
- `AppStatTile`: small dashboard values.
- `AppTag`: compact status labels.
- `AppSearchField`: search input.
- `AppEmptyStateCard`: empty states with visual asset, title, and detail.
- `AppLoadingCard`: loading states.
- `.roundedContainer()`: bordered content containers.
- `.appCardBackground()`: card background for custom layouts.
- `.appInputField()`: text input fields.
- `.appPrimaryButton()` / `.roundedButton()`: primary call to action.
- `.appSecondaryButton()` / `.secondaryRoundedButton()`: secondary action.
- `.appBackground()`: app-level screen background.

## Naming Rules

- Prefer `Group` over `Organization` or `Team` in UI copy.
- Prefer `Uploads` for the tab, not `Files` or `Library`.
- Prefer `Messages` for the tab, not `Comms`.
- Prefer `Route`, `Stop`, `Schedule`, and `Availability` consistently.
- Keep labels short and action-oriented: `Create Group`, `Share Route`, `Import Photos`, `Save`.

## Apple HIG Alignment

- Use SF Symbols for standard actions such as share, delete, search, maps, and add.
- Use Dynamic Type text styles like `.headline`, `.subheadline`, `.body`, and `.caption`.
- Avoid relying on color alone; pair status colors with labels or icons.
- Respect safe areas and use native containers such as `NavigationStack`, `TabView`, sheets, menus, and share sheets.
- Keep custom colors semantic and consistent so color meaning does not drift across screens.
