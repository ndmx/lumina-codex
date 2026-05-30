# Apple iOS System Principles

This is the shared baseline for EdenTV iPhone apps. It is based on Apple Human Interface Guidelines, SwiftUI conventions, and the same mental model used by the iOS design system resources in Figma.

Lumina tags: `medium:mobile`, `platform:ios`, `framework:swiftui`, `native-app`.

## Platform First

Prefer platform components unless there is a strong product reason to customize.

- Navigation: `NavigationStack`, toolbar items, native back behavior, and clear screen titles.
- Tabs: `TabView` with short labels and SF Symbols.
- Sheets: use sheets for create, edit, join, share, and import flows.
- Inputs: use native text fields, pickers, date pickers, toggles, menus, and segmented controls.
- Actions: use SF Symbols for add, search, share, delete, upload, map, location, sync, and profile.
- Lists: use swipe actions for common destructive row operations.

## Accessibility

Every app should support the basics by default:

- Dark interface where the app is dark or honors dark mode.
- Reduced motion by avoiding essential information in animations and respecting system settings.
- Dynamic Type for body, headline, subheadline, caption, and title text.
- VoiceOver labels for icon-only buttons.
- Status meaning should not depend on color alone. Pair color with text, symbols, or position.
- Hit targets should feel comfortable on iPhone, especially for route and schedule operations.

## Visual Hierarchy

Use large type only for page-level identity. Compact surfaces like cards, list rows, and toolbars should use tighter typography.

Recommended hierarchy:

- Screen title: native navigation title or one large app section title.
- Section title: headline or title3.
- Card title: headline.
- Metadata: caption or subheadline with secondary color.
- Actions: short labels, icons when familiar.

## Layout

Use consistent spacing and stable surfaces:

- Screen horizontal padding: 16 points for phone-first tools.
- Card radius: 12 to 20 points, depending on app tone.
- Avoid cards inside cards unless the inner card is a repeated item.
- Avoid moving controls between empty, loading, and filled states.
- Keep the primary create action in the top toolbar when possible.

## Color

Color should carry a limited meaning:

- Primary accent: main call to action or selected state.
- Success: available, synced, confirmed, mapped.
- Warning: pending, incomplete, needs attention.
- Destructive: delete, leave, clear, remove.
- Secondary text: supporting labels and metadata.

Use semantic token names in code. Do not scatter raw hex values through feature views.

## Copy

Use short, consistent words:

- Prefer nouns for tabs: Schedule, Routes, Messages, Uploads, Profile, Memories, Radar, Planner.
- Prefer verbs for actions: Create, Save, Share, Import, Delete, Sync.
- Avoid internal words such as organization, comms, files, or ops when the product language uses Shared Space aliases, messages, uploads, routes, or circles.

## Design Review Checklist

- Does the screen work with no network?
- Is there one obvious primary action?
- Does the empty state teach the next action without becoming a second create button?
- Are destructive actions available but not visually dominant?
- Does text fit on a small iPhone and an iPad?
- Can a user leave a text field or sheet without getting stuck?
- Are color meanings consistent with the rest of the app?
