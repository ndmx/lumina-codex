# JxL Scheduler Product Docs

Lumina profile: `medium:mobile`, `platform:ios`, `framework:swiftui`, `capability:local-first`, `capability:sync`, `capability:invite`, `capability:schedule`, `data:shared-space`.

Canonical Lumina concept: `Shared Space`. JxL Scheduler user-facing alias: `Group`.

## Current App Model

JxL Scheduler is local-first.

- No app-specific sign-in is required.
- A stable local user ID is created on first launch.
- SwiftData/local persistence is the UI source of truth.
- iCloud/CloudKit is optional and used for trusted group sharing.
- Existing public CloudKit development data is ignored by the migrated app.

## Public App Store Positioning

Short summary:

JxL Scheduler helps small teams plan route-aware work from an iPhone-first, local-first workspace.

Core features:

- Manage personal schedules and availability.
- Build routes and reorder stops.
- Open routes in Apple Maps or Google Maps.
- Keep notes-to-self, direct messages, and group updates.
- Store local uploads and share selected items.
- Use optional iCloud sharing for group collaboration.

## Review Notes Pattern

Use this structure for App Review:

```text
JxL Scheduler does not require a separate app account or sign-in. The app opens directly into a local-first workspace for schedules, availability, routes, messages, and uploads.

Core workflows can be tested on-device without network access: create availability, create a route with stops, send local messages/notes, and add uploads. Optional group collaboration uses Apple's iCloud/CloudKit sharing. To test sharing, sign in to iCloud on test devices and use the app's group sharing controls.
```

## Privacy Position

The app is documented as privacy-forward:

- User data starts on device.
- Sharing is optional.
- iCloud sharing uses Apple services.
- There is no app-specific backend, ad tracking, or external account system in the current app.

Live URLs used during App Store setup:

- `https://edentv.us/docs/jxl-scheduler-privacy`
- `https://edentv.us/docs/jxl-scheduler-support`
- `https://edentv.us/docs/jxl-scheduler-compliance`

## Release Metadata Snapshot

- Product name: JxL Scheduler
- Category: Productivity
- Secondary category: Business
- Copyright: `© 2026 LxRose EdenTV`
- Pricing: Free
- Release: Automatic after approval
- Privacy label: Data Not Collected
- Accessibility disclosure: Dark Interface, Reduced Motion

## Source Docs

The original design-system snapshot is kept for provenance:

- `../source-docs/jxl-scheduler/DESIGN_SYSTEM.md`
