# Local-First Collaboration Pattern

This pattern is shared by JxL Scheduler and ParkMemory Hub.

Lumina tags: `medium:mobile`, `platform:ios`, `framework:swiftui`, `capability:local-first`, `capability:sync`, `capability:share`, `data:shared-space`.

## Principle

The app should be useful as a standalone iPhone app. Sync and collaboration are optional layers. The UI reads from local storage first, then sync services reconcile shared data when iCloud is available.

## Product Rules

- The app should not require an app-specific sign-in page.
- A local profile or device identity is created on first launch.
- Local changes render immediately.
- Sync failure should not block ordinary work.
- Sharing should be explicit and scoped.
- Imported records should preserve ownership and avoid surprise edits.

## Data Ownership

Use single-writer rules when possible:

- A user can edit records they own.
- Other members' records render read-only unless a feature intentionally grants edit access.
- Messages are append-only unless the app explicitly supports delete or clear.
- Soft deletes are preferred for synced records.

## CloudKit Positioning

CloudKit can still be local-first when it is optional and not the UI source of truth.

Recommended CloudKit behavior:

- Local database is the only thing screens query.
- CloudKit sync runs on launch, foreground, manual refresh, and after local mutations.
- Pending records stay visible locally when iCloud is unavailable.
- Shared data uses private/shared databases or Shared Space scoped records, not public database feeds.
- App Review notes should explain that iCloud is optional for collaboration.

## Invite and Sharing Language

Use Lumina concepts first, then product aliases:

- Shared Space: trusted people sharing selected data.
- Product aliases: JxL Scheduler says `Group`; ParkMemory Hub says `Circle`.
- Member: a person or device in a Shared Space.
- Share: send an item or make it visible to selected people.
- Publish: use only when an item becomes public or broadly visible beyond the trusted Shared Space.
- Sync: background movement of already shared data.

## Common Screens

Profile should own:

- local identity
- Shared Space creation and joining
- invite link or code
- leave Shared Space
- manual iCloud sync
- reset or local data management, if supported

Feature screens should own:

- create/edit/delete for their records
- visible sharing state
- scoped share action if the feature supports it
- local empty state
