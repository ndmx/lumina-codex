# ParkMemory Hub Design System

Lumina profile: `medium:mobile`, `platform:ios`, `framework:swiftui`, `native-app`, `capability:local-first`, `capability:sync`, `capability:location`, `data:shared-space`.

Canonical Lumina concept: `Shared Space`. ParkMemory Hub user-facing alias: `Circle`.

## Product Position

ParkMemory Hub is a local-first iOS app for small groups who want to collect trip memories, coordinate plans, and find each other during a park visit.

The product tone is native, family-friendly, and lightweight. It leans more on Apple system surfaces than JxL Scheduler does.

## Naming

Use these names consistently:

- Product: `ParkMemory Hub`
- Tabs: `Memories`, `Radar`, `Planner`, `Profile`
- Shared space: `Circle`
- Person in a circle: `Member`
- Invite action: `Invite to Circle`
- Join action: `Join Circle`
- Circle reset: `Start New Circle` or `Leave Circle`

Avoid mixing `Group`, `Family`, and `Circle` in user-facing copy unless there is a precise reason. The app currently uses Circle as the clearest public term.

## Current UI System

ParkMemory Hub currently uses mostly native SwiftUI styling:

- `TabView` root shell.
- `NavigationStack` in each feature.
- Native toolbar actions for add and iCloud sync.
- `List`, `Form`, `ContentUnavailableView`, `searchable`, sheets, alerts, and context menus.
- System colors such as `.blue`, `.green`, `.purple`, `.secondary`, `.background`, and `.systemGroupedBackground`.
- SF Symbols for memory, radar, planner, profile, sync, invite, map, delete, and add actions.

## Visual Tokens To Formalize

ParkMemory Hub does not yet have a central `AppTheme` like JxL Scheduler. If it grows, add one with semantic names rather than raw feature colors.

Suggested token set:

```text
ParkTheme.memory = blue
ParkTheme.place = green
ParkTheme.people = purple
ParkTheme.warning = orange
ParkTheme.destructive = red
ParkTheme.surface = system background
ParkTheme.surfaceGrouped = system grouped background
ParkTheme.textSecondary = secondary
```

Suggested layout set:

```text
ParkLayout.screenPadding = 16
ParkLayout.cardRadius = 14
ParkLayout.metricRadius = 12
ParkLayout.gridCardWidth = 168
```

## Feature Patterns

Memories:

- Grid of memory cards.
- Search by caption, tag, and place.
- Summary metrics for saved, tagged, and places.
- Native delete through context menu and detail view.
- Photos are selected intentionally by the user.

Radar:

- Location sharing is opt-in.
- Member coordinates should be openable in Maps.
- Current user controls their own visibility.
- Empty or inactive states should explain that members must enable sharing.

Planner:

- Plans support title, notes, optional time, optional place, visibility, votes, and status.
- Swipe to delete on plan rows.
- Visibility options should stay understandable: circle, selected members, or only me.

Profile:

- Own identity, profile photo, circle invite, join, leave, start new circle, and manual iCloud sync.
- Invite flows should use both link and code where useful.

## Accessibility

ParkMemory Hub is closer to standard iOS defaults, which is good for accessibility.

Keep:

- Native Forms and Lists for settings and join flows.
- VoiceOver labels on icon-only toolbar buttons.
- Dynamic Type through system text styles.
- Location sharing states that use text and icons, not only green or gray.

## Design Debt To Track

- Create a small shared `ParkTheme` and `ParkLayout` when repeated styling grows.
- Consolidate copy around Circle and Member.
- Confirm every feature has a clear no-network state.
- Make privacy-sensitive actions, especially Radar, explicit and reversible.
