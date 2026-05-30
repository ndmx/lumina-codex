# Lumina Platform Taxonomy

Use these tags in docs, component registries, tickets, file metadata, and design audits. Tags are lowercase kebab-case.

## Medium Tags

Medium describes where the software is experienced.

| Tag | Use For |
|---|---|
| `mobile` | Handheld phone experiences across iOS, Android, webview, and PWA. |
| `tablet` | iPad, Android tablet, and large touch-first layouts. |
| `desktop` | macOS, Windows, Linux, and large pointer-first interfaces. |
| `web` | Browser-rendered documents, sites, apps, and embedded web surfaces. |
| `web-app` | Browser software with authenticated workflows, app state, or CRUD behavior. |
| `website` | Public content, marketing, portfolio, documentation, or editorial web pages. |
| `native-app` | Platform-native installed apps. |
| `ios-app` | iPhone/iPad software built for Apple platforms. |
| `android-app` | Android software using native, Kotlin, Java, React Native, Flutter, or webview shells. |
| `macos-app` | macOS-native installed software. |
| `desktop-app` | Installed desktop software across platforms. |
| `pwa` | Installable browser app with service worker/offline behavior. |
| `webview` | Web-rendered UI embedded in a native shell. |
| `canvas` | 2D canvas/WebGL/WebGPU/p5/Processing-style rendered surfaces. |
| `three-d` | Three.js, SceneKit, RealityKit, Unity, Unreal, or similar spatial scene UI. |
| `watch` | Watch-size wearable UI. |
| `tv` | Ten-foot remote-controlled software. |
| `spatial` | AR, VR, mixed reality, and visionOS-style spatial UI. |
| `document` | PDF, DOCX, generated reports, printable docs, or policy pages. |
| `presentation` | Slides, pitch decks, keynote-style artifacts. |
| `email` | Transactional or marketing email UI. |
| `cli` | Command-line or terminal interfaces. |
| `api` | Machine-facing API contracts and generated API docs. |

## Platform Tags

Platform describes the operating environment.

| Tag | Use For |
|---|---|
| `ios` | iOS and iPhone-specific behavior. |
| `ipados` | iPadOS-specific layouts, pointer/touch hybrids, Stage Manager. |
| `macos` | Apple desktop conventions. |
| `android` | Android phone/tablet conventions. |
| `windows` | Windows desktop conventions. |
| `linux` | Linux desktop/server UI conventions. |
| `browser` | Standards-based browser runtime. |
| `server` | Server-rendered, API, backend, or worker runtime. |
| `edge` | Edge runtime, CDN worker, or geographically distributed compute. |
| `cloud` | Hosted service, deployment, storage, auth, observability. |

## Framework Tags

Use framework tags only when the implementation detail matters.

| Tag | Use For |
|---|---|
| `html` | HTML documents and native HTML semantics. |
| `css` | CSS, Sass, PostCSS, Tailwind, design token output. |
| `javascript` | Runtime JavaScript. |
| `typescript` | TypeScript contracts, props, discriminated unions, generated types. |
| `react` | React components and JSX. |
| `nextjs` | Next.js App Router, metadata, server components, routes. |
| `vite` | Vite apps. |
| `swiftui` | SwiftUI screens, modifiers, native iOS components. |
| `uikit` | UIKit surfaces. |
| `react-native` | React Native apps. |
| `flutter` | Flutter apps. |
| `threejs` | Three.js or React Three Fiber scenes. |
| `svg` | SVG-native graphics and icon systems. |
| `webgl` | WebGL-rendered surfaces. |
| `webgpu` | WebGPU-rendered surfaces. |

## Surface Tags

Surface describes the user's location in the product.

| Tag | Definition |
|---|---|
| `app-shell` | The persistent navigation, root layout, or chrome. |
| `screen` | A full app destination on mobile or desktop. |
| `page` | A browser route or document route. |
| `view` | A contained area that can appear inside a screen/page. |
| `section` | A semantic content grouping inside a page/view. |
| `panel` | A supporting surface adjacent to or inside a primary view. |
| `card` | A repeated bounded object preview or summary. |
| `row` | A horizontal repeated list item. |
| `cell` | A grid/list unit, especially native mobile. |
| `toolbar` | Compact command region. |
| `tab-bar` | Primary navigation between major destinations. |
| `sidebar` | Persistent navigation or context region. |
| `dialog` | Interruptive modal decision surface. |
| `sheet` | Mobile/native bottom or side modal. |
| `popover` | Anchored contextual surface. |
| `toast` | Temporary status message. |
| `empty-state` | Surface shown when no records exist or a filter returns nothing. |
| `loading-state` | Surface shown while data is unavailable. |
| `error-state` | Surface shown after failure. |
| `scene` | Rendered spatial/canvas world. |
| `overlay` | Layer rendered above the primary surface. |

## Capability Tags

Use capability tags for behaviors shared across platforms.

| Tag | Definition |
|---|---|
| `local-first` | Core workflow works before account, network, or sync state. |
| `sync` | Background or explicit data movement between devices/users. |
| `share` | User-controlled outbound visibility. |
| `invite` | Joining a Shared Space. |
| `membership` | People/devices connected to a Shared Space. |
| `privacy` | User visibility, retention, permissions, disclosures. |
| `location` | Maps, coordinates, current-location use, or tracking. |
| `media` | Images, video, audio, uploads, attachments. |
| `messaging` | Notes, chat, notifications, announcements. |
| `schedule` | Time, calendar, routes, availability, plans. |
| `search` | Find/filter/query behavior. |
| `forms` | Inputs, validation, submission, composition. |
| `analytics` | Metrics, dashboards, usage, reporting. |
| `auth` | Sign in, identity, sessions, permissions. |
| `admin` | Staff, owner, operational control surfaces. |

