# Lumina Naming And Tags

## Naming Principles

1. Prefer semantic names over visual names.
2. Prefer user intent over implementation.
3. Keep global names stable and allow product aliases.
4. Use platform-native terms in UI when users already know them.
5. Do not reuse one word for two concepts in the same product.
6. Do not rename native controls unless the custom name adds clarity.

## Canonical Product Concepts

| Lumina Concept | Definition | Allowed Product Labels |
|---|---|---|
| `Workspace` | Private local or personal working area. | Workspace, Local Workspace, My Space |
| `Shared Space` | Trusted collaboration container. | Group for JxL Scheduler, Circle for ParkMemory Hub, Team when the product is explicitly workplace-first |
| `Member` | Person or device participating in a Shared Space. | Member, Participant, Teammate |
| `Invite` | Link, code, or action that lets a person join. | Invite, Invite to Circle, Create Group Invite |
| `Sync` | Movement of data across devices or shared storage. | Sync, iCloud Sync, Refresh |
| `Share` | Explicit user action that makes content visible elsewhere. | Share, Share Route, Share Memory |
| `Visibility` | Who can see an object. | Only Me, Selected Members, Group, Circle, Public |
| `Record` | Persisted user-created object. | Memory, Route, Plan, Upload, Message, Incident |
| `Collection` | A group of records. | Memories, Routes, Uploads, Messages |
| `Profile` | Identity, settings, membership, privacy, and reset controls. | Profile, Settings when identity is not central |

## Code Naming

| Thing | Rule | Examples |
|---|---|---|
| Product package | lowercase kebab-case | `lumina-codex`, `park-memory-hub` |
| React component | PascalCase | `InviteDialog`, `MetricTile` |
| SwiftUI view | PascalCase with `View` when useful | `ProfileView`, `MemoryGrid` |
| Props type | Component name + `Props` | `InviteDialogProps` |
| Hook | camelCase starting with `use` | `useSharedSpace` |
| Function | camelCase verb phrase | `createInvite`, `formatVisibilityLabel` |
| Boolean | `is`, `has`, `can`, `should` prefix | `isShared`, `canDelete` |
| Event handler prop | `on` + event | `onInviteCreate`, `onVisibilityChange` |
| Internal handler | `handle` + event | `handleSubmit`, `handleDelete` |
| Type/interface | PascalCase domain noun | `SharedSpace`, `VisibilityState` |
| Discriminated union key | `kind`, `type`, or `status` consistently per domain | `kind: "group"`, `status: "syncing"` |
| CSS class | lowercase kebab-case, namespaced when global | `lumina-stage-card`, `app-shell` |
| CSS custom property | semantic kebab-case | `--color-surface-primary`, `--space-section` |
| Design token | category + semantic role | `color.action.primary`, `space.screen.padding` |
| File | follow framework convention; prefer kebab-case for web modules | `invite-dialog.tsx`, `shared-space.ts` |
| Test | subject + `.test` or platform convention | `visibility.test.ts`, `UploadVisibilityTests.swift` |

## User-Facing Copy

Use sentence case for labels and commands unless the platform requires title case.

| Pattern | Good | Avoid |
|---|---|---|
| Primary action | `Create group` | `New`, `Proceed`, `Submit` |
| Sharing action | `Share route` | `Publish route` unless it is public |
| Sync action | `Sync now` | `Refresh share` |
| Delete action | `Delete upload` | `Remove thing` |
| Empty state | `No uploads yet` | `Nothing here!` |
| Permission | `Allow location sharing` | `Enable radar magic` |

## Tag Shape

All tags use lowercase kebab-case.

```text
medium:web-app
platform:browser
framework:react
surface:dialog
capability:invite
state:empty
data:shared-space
component:primary-action
```

If a system only supports flat tags, drop the prefix but keep the value:

```text
web-app browser react dialog invite empty shared-space primary-action
```

## Component Role Names

Use these role names across web, iOS, and other UI engines.

| Role | Meaning |
|---|---|
| `App Shell` | Persistent root navigation and layout. |
| `Navigation Item` | A link, tab, sidebar item, route cell, or menu row. |
| `Primary Action` | Main task action on a surface. |
| `Secondary Action` | Useful but non-primary command. |
| `Destructive Action` | Delete, reset, leave, revoke, or clear. |
| `Input Field` | Text, date, picker, select, slider, toggle, checkbox, radio. |
| `Status Tag` | Compact state label. |
| `Visibility Tag` | Compact sharing/permission label. |
| `Metric Tile` | Small numerical summary. |
| `Object Card` | Preview of a user record. |
| `Object Row` | Compact list version of a record. |
| `Empty State` | No-data guidance. |
| `Loading State` | Pending-data surface. |
| `Error State` | Failure recovery surface. |
| `Confirmation` | User must approve a risky action. |
| `Detail View` | Full representation of one record. |
| `Composer` | Multi-field object creation or message entry. |
| `Inspector` | Side/panel detail editor. |

## Product Alias Registry

| Lumina Concept | JxL Scheduler | ParkMemory Hub | Generic Web App |
|---|---|---|---|
| Product | JxL Scheduler | ParkMemory Hub | Product name |
| Workspace | Workspace | My memories / local app state | Workspace |
| Shared Space | Group | Circle | Workspace, Team, Organization |
| Member | Member | Member | Member |
| Invite | Create Group / invite | Invite to Circle / Join Circle | Invite |
| Collection | Schedule, Routes, Messages, Uploads | Memories, Radar, Planner | Dashboard sections |
| Profile | Profile | Profile | Account or Settings |

## Avoid

- `mobile` as a synonym for `ios`; use both tags when both are true.
- `web` as a synonym for `web-app`; websites and web apps have different expectations.
- `group` as the global concept; use `Shared Space` globally and `Group` locally.
- `files` when the product UI uses `Uploads`.
- `team` when the experience is family, personal, or casual.
- `publish` unless content becomes visible to a public or broad audience.

