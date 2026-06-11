# Lumina Codex — Project Wiki

> The home page for understanding this repository: what it is, how it's organized,
> and how the self-improving design system actually works.

---

## What this project is

Lumina Codex is **one repository with two faces, joined by a single idea**:

1. **`@xlumina/system`** — a portable, framework-agnostic *design-system brain*
   (zero runtime dependencies). Source: `packages/lumina-system/`.
2. **Lumina Codex** — an immersive Next.js / React Three Fiber portfolio site that
   *renders* the system as proof of craft. Source: `src/`.

The unifying idea is the part most design systems lack: **Lumina is designed to
improve itself.** It observes how products use it, scores its own fitness, and
proposes bounded, reversible changes — without letting an autonomous loop erode
the things that make it coherent.

This repo is for **the design system and everything related to design.** App
legal/operational material (privacy policies, support pages, release checklists)
is explicitly *out of scope* and has been removed.

---

## The self-improving loop (the core thesis)

> You cannot improve what you cannot measure, and you cannot safely automate
> improvement without protecting the things that must not change.

The loop lives in `packages/lumina-system/src/` and is driven by CLI scripts in
`scripts/`:

```
feedback → improvement-ledger → fitness → evaluation → closer → meta
                                   ↑                                  ↓
                              invariants  ───────────────────  (Goodhart guard)
```

| Module | Role |
|---|---|
| `feedback.ts` | The event vocabulary: `works · friction · clash · error · override · gap · proposal`. |
| `improvement-ledger.ts` | Aggregates feedback events into per-target signal. |
| `fitness.ts` | Computes a 0–100 composite score (Laplace-smoothed so any regression is measurable) and derives **bounded, provenance-tagged proposals**. |
| `invariants.ts` | The protected fixed points the loop may **not** auto-edit (the `Shared Space` concept, the `--ls-*` contract, the 44px touch target, contrast floors, proportional grid spans). Classifies every change as `auto` / `review` / `human-gated`. |
| `evaluation.ts` | Proves a proposed change regresses no product before promotion. |
| `closer.ts` | Closes the loop: propose → evaluate → auto-apply (honoring the freeze). |
| `meta.ts` | Goodhart guard — checks fitness against an un-gameable holdout so the system can't game its own metric. |

**Safety stance:** autonomous *source-file edits are intentionally human-gated.*
The loop proposes and proves; a human promotes anything with real blast radius.

### Running the loop

```bash
npm run lumina:audit      # score the ledger + open proposals  → docs/system/fitness-report.md
npm run lumina:evaluate   # prove no regression                → docs/system/evaluation-report.md
npm run lumina:close      # propose → evaluate → auto-apply     → docs/system/close-report.md
npm run lumina:meta       # Goodhart guard                      → docs/system/meta-report.md
```

From any project that installs the package, the same loop is available as a CLI:

```bash
npx lumina record --kind gap --target concept:Reminder --detail "no canonical chip"
npx lumina audit
# set LUMINA_FEEDBACK_URL to POST events to a central Lumina instead of a local file
```

The ledger (`lumina-ledger.jsonl`) and generated `*-report.md` files are the
loop's memory and demonstrations — they are design-system artifacts, not stray
output.

---

## The design-system axes

Each axis is a pure module answering one question. Theme helpers emit CSS custom
properties prefixed `--ls-*`; **consumers read those variables and never hardcode
color / radius / columns.**

| Module | Question | Key exports |
|---|---|---|
| `tokens.ts` | What are the primitives? | `tokens`, `colorPrimitives`, `spacing`, `typography`, `motion`, `radii` |
| `eras.ts` | What mood? | `eras`, `eraList`, `defaultEra` (atelier / memphis / brutalist) |
| `scheme.ts` | What canvas? | `resolveSchemeVars`, `schemes`, `invertScheme` (light/dark) |
| `grid.ts` | What shape per device? | `resolveGrid`, `spanColumns`, `gridTemplate` (proportional spans) |
| `variation.ts` | What per-instance fingerprint? | `createVariation`, `shiftHue` (seeded, bounded) |
| `platform-rules.ts` | How does the user touch it? | `resolveInteraction`, `getProximityMode` (touch vs pointer) |
| `registry.ts` | Which public design variations feed Lumina? | `registryEntries`, `products` legacy alias, `getRegistryEntry` |

---

## Repository map

```
LUMINA.md               # Agent entry point — start here, then follow the read order
AGENTS.md               # Repo-local operating rules for agents
KICKOFF.md              # Copy-paste prompts to point an agent at Lumina
lumina.manifest.json    # Machine-readable map of the system
lumina-ledger.jsonl     # The loop's feedback memory

packages/lumina-system/ # @xlumina/system — the executable brain (published to npm)
scripts/                # lumina:audit / evaluate / close / meta CLIs
src/                    # The Next.js + R3F portfolio site (the live showcase)
src/__tests__/          # ~337 cases across system + components (vitest)

docs/system/            # Canonical design-system docs (naming, taxonomy, element model…)
docs/design-variations/ # Public numbered UI/UX design types
docs/constitution.md    # Vision document (inspiration, not the implementation contract)
```

### Canonical read order (for agents)
`LUMINA.md` → `lumina.manifest.json` → `docs/system/README.md` → platform-taxonomy
→ naming-and-tags → element-model → scheme-grid-variation → mobile-vs-web →
integration-guide → registry → design variations → constitution (only if needed) →
continuous-improvement / recursive-loop (when changing the system).

---

## Design variations & the alias rule

Lumina names one canonical cross-product concept and gives public users generic
alias examples:

```
Lumina concept: Shared Space
  collaboration app → Group
  personal memory app → Circle
```

`Shared Space` is an **invariant** — renaming it breaks alias resolution
everywhere, so the loop can surface tension around it but never auto-rewrite it.

---

## Stack & local development

- Next.js (App Router) · React 19 · TypeScript · Three.js + React Three Fiber + drei + postprocessing
- The package itself has **zero runtime dependencies**.

```bash
npm install
npm run dev       # http://localhost:3000
npm run verify    # lint + build
npm test          # vitest
```

`@xlumina/system` is published: `npm install @xlumina/system`.

---

## Conventions

- Lowercase kebab-case tags; semantic token names, never raw visual names.
- Prefer native platform components before custom UI.
- Every reusable decision goes back into the system via the continuous-improvement
  workflow (`docs/system/continuous-improvement.md`) and `improvement-log.md`.
- Keep changes small and close to the relevant system file.
