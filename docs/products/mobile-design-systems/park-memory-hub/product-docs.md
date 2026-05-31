# ParkMemory Hub Product Docs

Lumina profile: `medium:mobile`, `platform:ios`, `framework:swiftui`, `capability:local-first`, `capability:sync`, `capability:invite`, `capability:location`, `data:shared-space`.

Canonical Lumina concept: `Shared Space`. ParkMemory Hub user-facing alias: `Circle`.

## Current App Model

ParkMemory Hub is Apple-first and local-first.

- Each device creates its own identity and circle on first launch.
- People join a shared circle through an invite link or invite code.
- Circle updates sync through CloudKit.
- Location sharing is opt-in.
- There is no third-party backend dependency in the current app.

## Core Features

- Memories: create photo memories with captions, tags, and optional locations.
- Radar: share your location with your circle and open member coordinates in Maps.
- Planner: create plans, add optional times and places, vote as a circle, and update plan status.
- Profile: set your name and profile photo, start or join a circle, share invites, and run manual sync.
- Sync: memories, planner updates, and radar updates sync through CloudKit, with manual iCloud sync available as a fallback.

## Privacy Position

ParkMemory Hub may handle:

- Display name and profile photo.
- Circle name and circle code.
- Memories, captions, tags, photos, and optional memory locations.
- Planner items, notes, times, places, votes, and sharing choices.
- Live or recent location only when enabled.
- Device identifiers needed for sync and circle membership.

The app should be described as user-controlled rather than data-minimal, because photos, location, profile, and planner content may be shared through CloudKit when the user chooses to use those features.

## App Store Privacy Review

Review whether App Store Connect disclosures need:

- User ID
- Precise or coarse location
- Photos or videos
- User content
- Contact or profile content, depending on final implementation

Use the latest Apple App Privacy wording when submitting.

## Release Checklist

Before TestFlight or App Review:

- Deploy production CloudKit schema for `iCloud.lxr.ParkMemoryHub`.
- Verify production record types and fields.
- Test with at least two physical iPhones and different Apple IDs.
- Verify a brand-new circle and joined circle.
- Verify memory sharing, planner visibility, radar sharing, invite link, and leave circle.
- Publish public Privacy Policy and Support URLs.
- Complete App Store Connect privacy answers based on final app behavior.
- Archive a Release build and upload it.

## Review Notes Pattern

Use this structure for App Review:

```text
ParkMemory Hub is a shared trip app for families and friends. Users create or join a circle, then share memories, plans, and optional location updates through iCloud/CloudKit. To test circle features, create a circle on one device, share the invite link from Profile, open it on a second device, and accept the invite inside the app.
```
