# Lumina Element Model

Lumina treats every UI as a tree of elements with names, roles, states, data, and platform implementation. This gives web, React, TypeScript, SwiftUI, HTML, SVG, canvas, and 3D scenes one shared vocabulary.

Sources checked for platform coverage: WHATWG HTML indices, MDN HTML element reference/content categories, React built-in and DOM component references, and the TypeScript Handbook. See `source-map.md`.

## Universal Element Record

Use this shape when cataloging a component, screen, or rendered element.

```ts
type LuminaElement = {
  id: string;
  name: string;
  role: string;
  medium: string[];
  platform: string[];
  framework: string[];
  surface?: string;
  capability?: string[];
  dataObject?: string;
  state?: string[];
  accessibilityRole?: string;
  nativeEquivalent?: string;
  implementation?: string;
};
```

Example:

```ts
const inviteButton = {
  id: "park.profile.invite-circle",
  name: "Invite to Circle",
  role: "Primary Action",
  medium: ["mobile"],
  platform: ["ios"],
  framework: ["swiftui"],
  surface: "screen",
  capability: ["invite", "share", "membership"],
  dataObject: "Shared Space",
  state: ["enabled"],
  accessibilityRole: "button",
  nativeEquivalent: "Button"
};
```

## Core UI Element Families

| Family | Lumina Roles | HTML / Web | React / TS | SwiftUI / Native |
|---|---|---|---|---|
| Root | App Shell, Document Root | `html`, `body`, `main` | root route, layout component | `App`, `Scene`, root `View` |
| Metadata | Metadata, Manifest, SEO | `head`, `title`, `meta`, `link`, `base` | Next metadata, route metadata | Info.plist, entitlements |
| Navigation | Navigation Item, Tab, Breadcrumb | `nav`, `a`, `menu`, `search` | router link, tab component | `TabView`, `NavigationStack`, toolbar |
| Sections | Page, Screen, Section, Region | `header`, `footer`, `section`, `article`, `aside`, `h1`-`h6`, `address` | page sections, slot layouts | `Section`, grouped `Form`, view hierarchy |
| Text | Label, Body, Caption, Inline Code | `p`, `span`, `strong`, `em`, `small`, `code`, `time` | typography component | `Text`, `Label` |
| Lists | Collection, Row, Ordered Steps | `ul`, `ol`, `li`, `dl`, `dt`, `dd` | mapped arrays, virtualized lists | `List`, `ForEach`, grids |
| Media | Image, Video, Audio, Figure | `img`, `picture`, `source`, `video`, `audio`, `track`, `figure`, `figcaption` | image/media components | `Image`, `PhotosPicker`, AV views |
| Embeds | External Object, Frame | `iframe`, `embed`, `object`, `portal` where supported | embed wrapper | webview/native embed |
| Graphics | Icon, Chart, Canvas, Scene | `canvas`, `svg`, `math` | R3F/Three components, chart components | Canvas, SceneKit, RealityKit |
| Forms | Input Field, Picker, Composer | `form`, `label`, `input`, `textarea`, `select`, `option`, `button` | controlled/uncontrolled forms | `Form`, `TextField`, `Toggle`, `Picker`, `Button` |
| Feedback | Dialog, Toast, Progress, Status | `dialog`, `progress`, `meter`, `output` | modal/toast/progress components | alerts, sheets, progress views |
| Tables | Data Grid, Comparison Table | `table`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`, `caption`, `colgroup`, `col` | table/grid component | `Table`, `Grid`, custom rows |
| Disclosure | Details, Accordion, Popover | `details`, `summary`, popover attributes | accordion/disclosure component | `DisclosureGroup`, sheet, popover |
| Templates | Slot, Template, Generated Region | `template`, `slot` | children, render props, portals | view builders, slots |
| Scripting | Scripted Behavior | `script`, `noscript` | client components, effects | app lifecycle, tasks |

## HTML Element Coverage

Current standard and commonly encountered HTML elements are grouped below for naming audits. Obsolete/deprecated tags are listed separately so older source docs can still be recognized without approving them for new UI.

### Root And Metadata

`html`, `head`, `title`, `base`, `link`, `meta`, `style`, `body`

### Sectioning And Landmarks

`header`, `footer`, `main`, `nav`, `section`, `article`, `aside`, `address`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `hgroup`, `search`

### Text And Inline Semantics

`p`, `hr`, `pre`, `blockquote`, `ol`, `ul`, `menu`, `li`, `dl`, `dt`, `dd`, `figure`, `figcaption`, `div`, `a`, `em`, `strong`, `small`, `s`, `cite`, `q`, `dfn`, `abbr`, `ruby`, `rt`, `rp`, `data`, `time`, `code`, `var`, `samp`, `kbd`, `sub`, `sup`, `i`, `b`, `u`, `mark`, `bdi`, `bdo`, `span`, `br`, `wbr`

### Edits

`ins`, `del`

### Embedded Media And Graphics

`picture`, `source`, `img`, `iframe`, `embed`, `object`, `param`, `video`, `audio`, `track`, `map`, `area`, `canvas`, `svg`, `math`

### Tables

`table`, `caption`, `colgroup`, `col`, `tbody`, `thead`, `tfoot`, `tr`, `td`, `th`

### Forms And Controls

`form`, `label`, `input`, `button`, `select`, `datalist`, `optgroup`, `option`, `textarea`, `output`, `progress`, `meter`, `fieldset`, `legend`

### Interactive And Web Components

`details`, `summary`, `dialog`, `template`, `slot`, autonomous custom elements such as `my-element`

### Scripting

`script`, `noscript`

### Obsolete Or Deprecated Recognition

Recognize these when auditing legacy files, but do not introduce them into new Lumina components:

`acronym`, `applet`, `basefont`, `bgsound`, `big`, `blink`, `center`, `content`, `dir`, `font`, `frame`, `frameset`, `image`, `keygen`, `marquee`, `menuitem`, `nobr`, `noembed`, `noframes`, `plaintext`, `rb`, `rtc`, `shadow`, `spacer`, `strike`, `tt`, `xmp`

## React And JSX Rules

- Lowercase JSX names map to platform/native elements such as `div`, `button`, `section`, `svg`, or custom elements.
- PascalCase JSX names map to user-defined React components.
- React built-ins are named as components: `Fragment`, `Profiler`, `StrictMode`, `Suspense`, and `Activity`.
- React DOM props use camelCase except `aria-*` and `data-*`, which remain kebab-case.
- Prefer component names that describe role and domain: `UploadVisibilityTag`, `SharedSpaceInviteDialog`, `MetricTile`.

## TypeScript Model Rules

- Name domain contracts as nouns: `SharedSpace`, `UploadRecord`, `VisibilityState`.
- Use discriminated unions for platform variants:

```ts
type LuminaPlatformTarget =
  | { kind: "ios-app"; framework: "swiftui" }
  | { kind: "web-app"; framework: "react" | "nextjs" }
  | { kind: "canvas"; framework: "threejs" | "webgl" | "webgpu" };
```

- Prefer explicit state names over boolean clusters when states are mutually exclusive:

```ts
type SyncState = "local" | "syncing" | "synced" | "failed";
```

## Native Mobile Mapping

| Lumina Role | iOS / SwiftUI | Android / Compose |
|---|---|---|
| App Shell | `TabView`, `NavigationStack` | `Scaffold`, navigation host |
| Page / Screen | `View` inside navigation | composable screen |
| Section | `Section`, `GroupBox` | section composable |
| List / Row | `List`, `ForEach` | `LazyColumn`, row composable |
| Card | custom `View`, `GroupBox` | `Card` |
| Primary Action | `Button`, toolbar item | `Button`, FAB |
| Secondary Action | `Button`, `Menu` item | `OutlinedButton`, menu item |
| Destructive Action | role destructive button, alert confirmation | destructive button, dialog confirmation |
| Input Field | `TextField`, `DatePicker`, `Picker`, `Toggle` | text field, date picker, switch |
| Dialog / Sheet | `alert`, `confirmationDialog`, `sheet` | dialog, bottom sheet |
| Empty State | `ContentUnavailableView` | empty state composable |
| Status Tag | `Label`, capsule text | chip/badge |

## Canvas, SVG, And 3D Mapping

Rendered scenes still need names.

| Lumina Role | Canvas / SVG / Three.js Equivalent |
|---|---|
| Scene | `Canvas`, `svg`, WebGL/WebGPU scene root |
| Camera | viewport/camera state |
| Layer | group, render pass, SVG group |
| Object | mesh, sprite, path, shape |
| Material | fill/stroke/shader/material token |
| Control | gesture handler, pointer zone, camera controls |
| Overlay | HTML overlay or HUD |
| Annotation | label, tooltip, callout |

