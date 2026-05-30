# JxL Scheduler Design System

Lumina profile: `medium:mobile`, `platform:ios`, `framework:swiftui`, `native-app`, `capability:local-first`, `capability:sync`, `capability:schedule`, `data:shared-space`.

Canonical Lumina concept: `Shared Space`. JxL Scheduler user-facing alias: `Group`.

## Product Position

JxL Scheduler is a local-first scheduling and route-planning app for people managing availability, routes, messages, uploads, and optional iCloud group sharing.

The product tone is calm operations: dense enough for repeated work, warm enough to feel approachable, and native enough that iPhone users already understand the controls.

## Naming

Use these names in user-facing UI and docs:

- Product: `JxL Scheduler`
- Tabs: `Schedule`, `Routes`, `Messages`, `Uploads`, `Profile`
- Sharing unit: `Group`
- Person in group: `Member`
- File surface: `Uploads`, not Files
- Messaging surface: `Messages`, not Comms
- Local space: `Workspace`

Avoid `Organization`, `Team`, `Comms`, `Files`, and `Ops` in primary UI unless the feature truly changes meaning.

## Source Tokens

The current source of truth is:

`iOS_apps/Jx Scheduler/Jx Scheduler/Views/Style.swift`

Important tokens:

```text
AppBrand.productName = "JxL Scheduler"

AppLayout.horizontalPadding = 16
AppLayout.verticalSpacing = 16
AppLayout.sectionSpacing = 22
AppLayout.cardCornerRadius = 20
AppLayout.contentMaxWidth = 560

AppTheme.actionPrimary = #D8AE57
AppTheme.actionDestructive = #A61E22
AppTheme.actionSupport = #2E6B57
AppTheme.backgroundBase = #050203
AppTheme.backgroundWarm = #1B0B0E
AppTheme.surfacePrimary = #161011
AppTheme.surfaceSecondary = #241718
AppTheme.borderSubtle = #7B5934 at 34 percent opacity
AppTheme.textPrimary = white
AppTheme.textSecondary = #D8CCBC
AppTheme.textTertiary = #9F907B
AppTheme.statusSuccess = #3B8F72
AppTheme.statusWarning = #C9912E
```

## Components

Use shared components before custom one-off styling:

- `AppSectionHeader`: screen or section lead.
- `AppStatTile`: small dashboard counts.
- `AppTag`: compact status or visibility label.
- `AppSearchField`: search input.
- `AppEmptyStateCard`: visual empty state with optional action.
- `AppLoadingCard`: loading state.
- `.roundedContainer()`: standard bordered surface.
- `.appCardBackground()`: custom card surface.
- `.appInputField()`: dark text input surface.
- `.appPrimaryButton()`: main action.
- `.appSecondaryButton()`: secondary action.
- `.appBackground()`: app-level background.

## Screen Patterns

Schedule:

- Calendar and availability should use the same system as the other tabs.
- Available days should be visually marked with success green or a green dot.
- Availability cards should support tap to edit and swipe left to delete.
- Recurring availability should include a start date and end date.

Routes:

- Keep a single create affordance in the top trailing toolbar.
- Route cards should show route name, mapped status, stop count, visibility, and clear map handoff.
- Stop order should be editable with stable up/down controls or a native reorder pattern.
- Apple Maps and Google Maps links should include every mapped stop in order when possible.

Messages:

- The composer must dismiss the keyboard when tapping outside the input.
- Clearing/deleting messages should be available but guarded enough to avoid accidental loss.
- Message scope should be clear: note to self, direct member, or group update.

Uploads:

- Treat uploads as local-first records with explicit sharing state.
- Show file actions without crowding the tab header.
- Use Uploads as the main label everywhere.

Profile:

- Own local profile, group settings, invite/share, leave group, reset profile/data, and manual sync.

## Accessibility

Current App Store accessibility labels include:

- Dark Interface
- Reduced Motion

Keep the implementation aligned with those disclosures. Avoid essential motion-only feedback, and keep the app comfortable in its dark theme.

## Design Debt To Track

- Schedule should continue converging with Routes, Messages, and Uploads.
- Shared route delivery to selected group members needs a clear recipient state.
- Shared upload records/assets need download state, retention behavior, and sharing permissions.
- Leave group and reset data should be obvious in Profile, not hidden in developer-only flows.
