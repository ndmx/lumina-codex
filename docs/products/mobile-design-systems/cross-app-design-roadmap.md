# Cross-App Design Roadmap

> Lumina status: the shared vocabulary in this file has been promoted into `docs/system/`. Keep this roadmap for mobile-specific implementation history; update Lumina first when naming or tagging rules change.

This is the practical next step for turning the current app-specific docs into an actual reusable design system.

## 1. Shared Vocabulary

Use the Lumina glossary across apps:

- Workspace: private on-device space.
- Shared Space: trusted collaboration container.
- Member: person or device participating in a shared space.
- Invite: link or code used to join.
- Sync: background movement of shared data.
- Share: explicit user action that makes content visible elsewhere.

Then allow product-specific labels:

- JxL Scheduler uses Group.
- ParkMemory Hub uses Circle.

## 2. Shared SwiftUI Foundation

Create a small package or copied module for:

- semantic colors
- spacing and radius
- empty states
- metric tiles
- search fields
- loading states
- toolbar action helpers
- keyboard dismissal modifier
- destructive confirmation helpers

Keep app-specific themes separate:

- `JxLTheme`
- `ParkTheme`

## 3. Shared Interaction Rules

Across apps:

- Top trailing plus creates the primary object.
- Swipe left deletes row/card items where deletion is expected.
- Tap card opens detail or edit.
- Share button means outbound user-controlled sharing.
- Sync button means iCloud refresh, not publish.
- Leave Shared Space is in Profile and requires confirmation.
- Reset local data is in Profile and requires confirmation.

## 4. Shared App Store Documentation Pattern

Each app should keep:

- support page
- privacy policy
- compliance or review-notes page
- release checklist
- design-system page

Use the same sections in each:

- Overview
- Current app model
- Information handled
- Sharing and CloudKit
- User controls
- Data retention
- Support contact
- App Review notes

## 5. Recommended Implementation Order

1. Keep `lumina-codex/docs/system/` as the design-system source.
2. Add a small shared SwiftUI component module after the second app repeats the same component.
3. Add design screenshots or Figma references per component.
4. Add accessibility expectations to every component.
5. Add App Store metadata templates for future apps.

## 6. Guardrails

- Do not over-abstract before a component appears in two apps.
- Do not make every app use the same visual palette.
- Do not hide native iOS behavior behind custom UI unless it improves the task.
- Do not use "local-first" as marketing only. The app must function locally.
- Do not claim privacy labels that do not match the implemented sharing behavior.
