# Lumina Integration Guide

How to plug a new project into the Lumina design system, and how to contribute back.

---

## What Lumina gives you

The executable brain ships as the **`@xlumina/system`** package (source:
`packages/lumina-system/`). Install it, or read the source directly.

```bash
npm install @xlumina/system
```

### Getting the package into your project

The package is publish-ready but **not yet published**. Until it is, use one of:

| Path | Command | When |
|---|---|---|
| Tarball (try it today) | `cd packages/lumina-system && npm run build && npm pack` → share the `.tgz` → `npm install ./lumina-system-1.0.0.tgz` | No registry; quickest way to let someone try it |
| npm (online) | `npm publish --access public` (needs the `@lumina` scope), then `npm install @xlumina/system` anywhere | Public distribution |
| Git | install from a Git URL/subdir | Private sharing without a registry |

Once installed, every project also gets a `lumina` CLI:

```bash
npx lumina record --kind gap --target concept:Reminder --detail "no canonical chip"
npx lumina audit     # score this project's ledger
npx lumina close     # propose → evaluate → auto-apply (honors the meta freeze)
npx lumina meta      # Goodhart guard
```

Set `LUMINA_FEEDBACK_URL` to POST feedback to a central Lumina instead of a local
`lumina-ledger.jsonl`, so many projects can feed one system. See
`docs/system/recursive-loop.md`.

| Resource | Import / File | What it is |
|---|---|---|
| Design tokens | `@xlumina/system/tokens` | Colors, spacing, typography, motion, layout primitives |
| Era/theme system | `@xlumina/system/eras` | Three atmosphere modes with full token sets |
| Light/dark schemes | `@xlumina/system/scheme` | `resolveSchemeVars(scheme, era)` → `--ls-*` custom properties |
| Responsive grid | `@xlumina/system/grid` | One column model per device; `spanColumns`, `resolveGrid` |
| Seeded variation | `@xlumina/system/variation` | `createVariation(seed)` — bounded per-instance uniqueness |
| Interaction rules | `@xlumina/system/platform-rules` | Mobile-vs-web: hover, proximity, nav, targets, gestures |
| Product registry | `@xlumina/system/registry` | Where your project declares itself |
| Naming rules | `docs/system/naming-and-tags.md` | Naming conventions across all platforms |
| Platform taxonomy | `docs/system/platform-taxonomy.md` | Medium, platform, framework, surface, and capability tags |
| Element model | `docs/system/element-model.md` | Cross-platform component role mapping |
| Scheme/grid/variation | `docs/system/scheme-grid-variation.md` | How the three axes compose |
| Mobile-vs-web rules | `docs/system/mobile-vs-web.md` | When pointer vs. touch idioms apply |

> The registry lives in the package source at `packages/lumina-system/src/registry.ts`.
> Editing it (Step 2) means contributing back to the Lumina repo, not editing an
> installed copy.

---

## Step 1 — Choose your era

All projects start by picking a default era. The era sets the atmosphere — accent color, glow tint, and background mood — without touching the spatial or type systems.

| Era | Key | Tone | Use when |
|---|---|---|---|
| Atelier | `atelier` | Warm, luminous | The default. Grounded, craft-focused, premium |
| Memphis | `memphis` | Playful, electric | Consumer-facing, high energy, expressive |
| Cyber-Brutalist | `brutalist` | Cold, sharp, technical | Developer tools, dashboards, infrastructure |

Most projects default to `atelier`. Switch to `memphis` or `brutalist` when the product's character demands it, not as a style preference.

---

## Step 2 — Register your product

Add a `ProductProfile` entry to `packages/lumina-system/src/registry.ts`:

```typescript
{
  id: "your-app-id",              // kebab-case, must be unique
  name: "Your App Name",
  description: "One sentence description of what this product does.",
  mediums: ["web-app"],           // from platform-taxonomy.md
  platforms: ["browser"],         // from platform-taxonomy.md
  frameworks: ["nextjs", "react"],
  defaultEra: "atelier",
  conceptAliases: {
    sharedSpace: "Team",          // optional: product-specific name for Lumina concepts
  },
  tokenOverrides: {
    accentPrimary: "#a78bfa",     // optional: override the era's default accent
  },
  docsPath: "docs/products/your-app-id",
  registeredAt: "2026-05-06",    // today's date
}
```

Then run `npm run test:run` to verify the entry validates.

---

## Step 3 — Consume tokens

### Web / TypeScript projects

Import directly from the system files:

```typescript
import { colorPrimitives, colorSemantic, spacing, typography, motion } from "@xlumina/system/tokens";
import { eras, defaultEra } from "@xlumina/system/eras";
import { resolveConceptAlias } from "@xlumina/system/registry";

// Get the era for your product
const myEra = eras["atelier"];

// Resolve a concept alias
const sharedSpaceLabel = resolveConceptAlias("your-app-id", "sharedSpace", "Shared Space");
```

### CSS / web projects

Reference the CSS custom properties defined in `src/app/globals.css`. They mirror the TypeScript tokens:

```css
:root {
  --color-void: #06070a;    /* colorPrimitives.void */
  --color-aura: #73f2df;    /* colorPrimitives.aura */
  --color-spark: #ff7d60;   /* colorPrimitives.spark */
  --color-ivory: #f5eee5;   /* colorPrimitives.ivory */
}
```

Use `var(--color-aura)` in component CSS to stay coupled to the system.

### iOS / SwiftUI projects

Translate the token values into a Swift `Color` extension:

```swift
// LuminaTokens.swift
extension Color {
    static let luminaBackground = Color(hex: "06070a")
    static let luminaSurface    = Color(hex: "101217")
    static let luminaText       = Color(hex: "f5eee5")
    static let luminaAccent     = Color(hex: "73f2df")
    static let luminaSpark      = Color(hex: "ff7d60")
}
```

Add a note in your product docs pointing to `packages/lumina-system/src/tokens.ts` as the source of truth. When the TypeScript values change, the Swift file must update to match.

### React Native projects

Map tokens to a theme object:

```typescript
import { colorPrimitives, spacing, typography } from "@xlumina/system/tokens";

export const luminaTheme = {
  colors: colorPrimitives,
  space: spacing,
  fonts: {
    heading: "CormorantGaramond-SemiBold",
    body: "Manrope-Regular",
  },
};
```

---

## Step 4 — Apply era theming

Use the era's accent and glow values to style your product's atmosphere:

```typescript
import { eras } from "@xlumina/system/eras";

function getEraStyles(eraKey: EraKey) {
  const era = eras[eraKey];
  return {
    "--accent-primary": era.accent.primary,
    "--accent-secondary": era.accent.secondary,
    "--glow-top": era.glow.top,
    "--glow-mid": era.glow.mid,
  };
}
```

For CSS-only projects, define era classes that swap the custom properties:

```css
.era-memphis {
  --accent-primary: #fff878;
  --accent-on-primary: #1a1200;
  --glow-top: rgba(255, 185, 227, 0.26);
}
```

---

## Step 5 — Create your product profile docs

Create `docs/products/<your-app-id>/README.md` with:

```markdown
# Product: Your App Name

Tags: mobile, ios-app, swiftui, atelier

## Platform context
Brief description of the app and its primary use case.

## Lumina concept aliases
- Shared Space → Team

## Token overrides
- accentPrimary: #a78bfa (reason: matches brand identity)

## Notes for agents
Any product-specific naming rules, interaction patterns, or constraints
that are not covered by the Lumina system docs.
```

---

## Step 6 — Log the decision

Add an entry to `docs/system/improvement-log.md`:

```markdown
## YYYY-MM-DD - Add [Your App Name]

Type: product-profile
Scope: product
Tags: your-medium-tags, your-platform-tags

Decision: Registered [Your App Name] as a Lumina product. Uses atelier era.
Aliases sharedSpace to "Team".

Reason: Consistent token base prevents drift between the iOS app and the web version.

Files:
- `packages/lumina-system/src/registry.ts`
- `docs/products/your-app-id/README.md`
```

---

## How to contribute back to the system

If your new project surfaces a pattern that should live in the system — a new token category, a new canonical concept, a platform mapping that doesn't exist yet — follow the workflow in `docs/system/continuous-improvement.md`.

The test for whether something belongs in the system: **does it apply to two or more products, or would it prevent a mistake in a future product?** If yes, it goes in the system. If it's product-specific, it stays in your product docs.

---

## Checklist for a new project

- [ ] Chose a default era
- [ ] Added `ProductProfile` to `packages/lumina-system/src/registry.ts`
- [ ] Tests pass (`npm run test:run`)
- [ ] CSS custom properties or Swift/RN tokens derived from `packages/lumina-system/src/tokens.ts`
- [ ] Created `docs/products/<id>/README.md`
- [ ] Logged decision in `docs/system/improvement-log.md`
- [ ] Updated `lumina.manifest.json` `registeredProducts` list
