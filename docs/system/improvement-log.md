# Lumina Improvement Log

## 2026-05-31 - Background-as-surface rule (decorative backgrounds, mobile)

Type: rule
Scope: system
Tags: design-system, mobile, native-app, ios-app, background, surface, contrast, accessibility

Decision:
- Added `docs/system/background-as-surface.md`: on a decorative/photographic background, treat the background as part of the primary visual surface. Content (text, icons, controls, and the repeated content surfaces — summary sections, cards, profile rows, plan rows, memory cards, radar/member panels) sits directly on the background rather than inside opaque white/filled cards. Grouping and legibility come from spacing → hierarchy → dividers → subtle shadow → thin low-opacity outline, in that order, all sourced from `--ls-*` scheme variables. Buttons/controls stay visually clear and keep the 44px touch target, but whole sections are not wrapped in opaque containers. Backgrounds are chosen per screen, with busy regions kept away from dense text. When contrast drops below the `contrast-floor`, recover with a full-screen readability wash or gradient (`--ls-overlay-*`) before adding any filled container.
- Registered the doc in `docs/system/README.md` (Files list), `LUMINA.md` (read order, after `mobile-vs-web.md`), and `lumina.manifest.json` (`readOrder`).

Reason:
- The system encoded scheme surfaces, the contrast floor, and touch targets, but had no rule for what to do when a screen's background is itself designed. The unstated default — box everything in opaque cards for legibility — erases the chosen surface and contradicts the "Shared Space"/atmosphere intent. This makes the better default explicit and ties it to existing contracts so it composes additively: it never lowers the contrast floor or shrinks a target, it only changes *how* a screen reaches legibility (surface + spacing + wash over opaque fills).

Caveat:
- Kept as prose rather than a new executable module: it is a compositional/aesthetic principle, not a single resolvable value like proximity mode. It defers to the existing `contrast-floor` invariant and `platform-rules.ts` target minimum, which remain the enforceable floors.

Files:
- `docs/system/background-as-surface.md` (new)
- `docs/system/README.md`, `LUMINA.md`, `lumina.manifest.json` (updated)

## 2026-05-30 - Portable CLI + distribution (call the loop from any project)

Type: component, source-boundary
Scope: system
Tags: design-system, cli, distribution, npm, feedback, portability

Decision:
- Added `packages/lumina-system/bin/lumina.mjs` and a `"bin": { "lumina": ... }` entry, so any project that installs `@xlumina/system` gets a `lumina` CLI: `record | audit | close | meta`. The ledger/state live in the consumer's cwd. `record` appends locally by default, or POSTs to `$LUMINA_FEEDBACK_URL` when set — enabling many projects to feed one central Lumina with no code change. `close` honors the meta-loop freeze.
- Made the package distributable: `files` now ships `dist/` + `bin/` + README only (verified via `npm pack --dry-run` — 48 kB, no src/tests). Verified the full consumer path end-to-end: `npm pack` → `npm install ./*.tgz` into a fresh project → `npx lumina record/audit` runs and `import { … } from "@xlumina/system"` resolves (mechanically identical to a published install).
- Documented the three get-it paths (tarball / npm publish / git) and the CLI in `integration-guide.md`, the package README, `KICKOFF.md` (agents now report via `npx lumina record`), and the manifest `package` block (`cli`, `feedbackEnv`, `published: false`, `tryIt`).

Reason:
- The loop functions traveled with the package, but running them required repo-local scripts and a local ledger — so a consuming agent couldn't actually report back from its own project. A shipped `bin` makes "call it from any project" true with `npx lumina`, and the `LUMINA_FEEDBACK_URL` sink makes central aggregation possible without standing up a server. The package is now genuinely consumable; the only thing between it and `npm install @xlumina/system` is a `npm publish`, which requires the owner's registry auth.

Caveat:
- Still unpublished — distribution today is via `npm pack` tarball or a Git URL until someone runs `npm publish` under the `@lumina` scope. Central aggregation requires an endpoint that accepts the POSTed events (the client side is ready; the server is out of scope).

Files:
- `packages/lumina-system/bin/lumina.mjs` (new), `package.json` (bin + files)
- `docs/system/integration-guide.md`, `packages/lumina-system/README.md`, `KICKOFF.md`, `lumina.manifest.json` (updated)

## 2026-05-30 - Meta-loop / Goodhart guard (Stage 5 of the recursive loop)

Type: component, rule, audit
Scope: system
Tags: design-system, self-improving, goodhart, meta-loop, circuit-breaker, holdout

Decision:
- Added `packages/lumina-system/src/meta.ts`: the meta-loop that audits whether the inner loop's fitness still reflects reality. `holdoutScore` recomputes fitness from real-product signal only (excluding `LOOP_PRODUCT_ID` resolutions) so it cannot be gamed; `metaSignals` measures the self-resolution ratio, reopened targets, and unverified resolutions; `metaReview` raises alarms (`self-congratulation`, `metric-divergence`, `resolution-churn`, `unverified-resolution`), emits human-gated meta-proposals (`reweight-fitness`, `freeze-auto-promotion`, `tighten-gate`), and sets `freezeAutoPromotion`.
- Wired the circuit breaker into the closer: `scripts/lumina-close.mjs` now runs `metaReview` and refuses to auto-apply while `freezeAutoPromotion` is true. Exported `LOOP_PRODUCT_ID` from the closer as the shared marker for loop-generated events.
- Added `scripts/lumina-meta.mjs` + `npm run lumina:meta` (writes `docs/system/meta-report.md`). Verified: pristine ledger → fitness == holdout, no alarms; gamed ledger (1 real gap + 6 loop self-resolutions) → fitness 92.9 vs holdout 50, divergence 42.9, three alarms, auto-promotion frozen, reweight/freeze meta-proposals queued.
- Added 9 meta tests; manifest → recursiveLoop now lists meta + "stages 1-5 built".

Reason:
- Stage 4 introduced a real Goodhart vector: the closer raises fitness by appending its own `works` event on every resolution, so the system can inflate its score by congratulating itself. A self-improving system without a guard against gaming its own metric is unsafe by construction. The meta-loop closes the recursion at the meta level — it can propose changes to its own objective function, but only a human may approve them, and it can halt the inner loop (freeze) when the gameable metric drifts from the un-gameable holdout.

Caveat:
- One extension is deliberately left unbuilt and human-gated: wiring `auto` promotions into actual source-file edits (a codemod over e.g. `tokens.ts`). Autonomous source rewriting is the highest-blast-radius action in the system; keeping a person in that loop is the correct posture.

Files:
- `packages/lumina-system/src/meta.ts` (new); `closer.ts` (LOOP_PRODUCT_ID export); `index.ts` + `package.json` exports (+meta)
- `scripts/lumina-meta.mjs` (new), `scripts/lumina-close.mjs` (honors the freeze), root `package.json` (lumina:meta)
- `docs/system/recursive-loop.md`, `lumina.manifest.json` (updated)
- `src/__tests__/system/meta.test.ts` (new)

## 2026-05-30 - Loop closer (Stage 4 of the recursive loop)

Type: component, rule
Scope: system
Tags: design-system, self-improving, closer, auto-apply, idempotency, provenance

Decision:
- Added `packages/lumina-system/src/closer.ts`: `compileProposal` turns a `Proposal` into an executable `CandidateChange` (tier re-derived from the target via `classifyAutonomy`, so an invariant target can never compile to `auto`), and `closeLoop` compiles → evaluates → folds the `auto`-tier promotions, returning the new state plus the diff to persist (`newEvents`, `state.values`).
- Closing a target records a resolution `works` event and marks it resolved. Added a `resolvedTargets` option to `proposeImprovements` so resolved targets are excluded next cycle — the loop advances instead of re-proposing settled questions. Introduced `lumina-state.json` as the persisted mutable knowledge store (partner to the append-only ledger).
- Added `scripts/lumina-close.mjs` + `npm run lumina:close` (`--dry-run` to preview): reads ledger + state, proposes (minus resolved), closes the loop, appends resolution events to the ledger and writes `lumina-state.json`, and writes `docs/system/close-report.md`. Verified the full cycle: 1 auto-applied (`reconsider-token:accent-primary`), 3 deferred (review/human-gated), and idempotent on re-run (resolved target excluded, 0 applied).
- Added 10 closer tests; manifest → recursiveLoop now lists closer + state + "stages 1-4 built".

Reason:
- Stage 3 could prove a change safe but still needed a hand to apply it. The closer is the bridge that makes the inner loop run itself: observe → score → propose → evaluate → apply, with only `auto`-tier, gate-clearing, invariant-free changes auto-applied and everything else queued. Persisting against a state file + append-only ledger keeps full history while letting current health and the proposal set advance; the resolved-target exclusion is what makes re-runs idempotent rather than oscillating.

Caveat:
- The closer applies to the system's own state (ledger + `lumina-state.json`). Extending `auto` promotions into source-file edits (e.g. a token default in `tokens.ts`) is a codemod-shaped follow-up. Stage 5 (meta-loop over the fitness function/invariants) remains.

Files:
- `packages/lumina-system/src/closer.ts` (new); `fitness.ts` (resolvedTargets option); `index.ts` + `package.json` exports (+closer)
- `scripts/lumina-close.mjs` (new), root `package.json` (lumina:close), `lumina-ledger.jsonl` (seed), `.gitignore` (lumina-state.json)
- `docs/system/recursive-loop.md`, `lumina.manifest.json` (updated)
- `src/__tests__/system/closer.test.ts` (new)

## 2026-05-30 - Evaluation harness (Stage 3 of the recursive loop)

Type: component, rule
Scope: system
Tags: design-system, self-improving, evaluation, ratchet, invariants, gates

Decision:
- Added `packages/lumina-system/src/evaluation.ts`: the harness that gates promotion. A `CandidateChange.apply` is a pure transform over a COPY of `SystemState`, so the baseline is never mutated and auto-revert is structural (a rejected candidate is discarded — nothing to roll back).
- Gates run before/after: `fitnessGate` (the ratchet — fitness may not drop), `checkGate` (any predicate; stands in for "tests pass"/"adherence holds"), `perProductGate` (passes only if every registered product still passes). `evaluateCandidate` → verdict `promote | needs-approval | reject`; `evaluateBatch` sorts promote-first; `applyPromotions` folds promoted candidates onto the baseline, re-evaluating each step.
- Invariant protection lives in the evaluator: it diffs `protectedKeys()` between baseline and candidate and rejects any unapproved mutation (`approved:<key>` opts in). Tier policy: only `auto` verdicts auto-promote; `review`/`human-gated` cap at `needs-approval`.
- Hardened `computeFitness` with additive (Laplace) smoothing so the score stays monotonic even on an all-negative ledger — closing a hole where a zero-positive score could be pinned at 0 and hide a regression from the ratchet.
- Added `scripts/lumina-evaluate.mjs` + `npm run lumina:evaluate` (writes `docs/system/evaluation-report.md`) with worked candidates demonstrating promote / needs-approval×2 / reject (invariant) / reject (fitness regression). Added 13 evaluation tests; manifest → recursiveLoop now lists evaluation + "stages 1-3 built".

Reason:
- Stage 1–2 could observe, score, and propose, but had no way to *prove* a change safe before applying it. The harness is the gate that turns proposals into trustworthy promotions: a ratchet (no product regresses), invariant-protected, reversible by construction, with tiered autonomy. Evaluating against a copy is the design that makes "revert" free.

Caveat:
- Candidates are still handed to the harness explicitly (the demo set / an agent), and promoting a verdict to a real file change is the human/agent step. Stage 4 (feed `proposeImprovements` straight into the harness and auto-apply green `auto` verdicts) and Stage 5 (meta-loop over the fitness function/invariants) remain.

Files:
- `packages/lumina-system/src/evaluation.ts` (new); `fitness.ts` (smoothing); `index.ts` + `package.json` exports (+evaluation)
- `scripts/lumina-evaluate.mjs` (new), root `package.json` (lumina:evaluate)
- `docs/system/recursive-loop.md`, `lumina.manifest.json` (updated)
- `src/__tests__/system/evaluation.test.ts` (new)

## 2026-05-30 - Recursive improvement loop (agent-as-sensor)

Type: rule, component, audit
Scope: system
Tags: design-system, self-improving, feedback, fitness, invariants, provenance

Decision:
- Added the recursive-improvement loop to `@xlumina/system` as four pure modules: `feedback.ts` (agent-facing `recordFeedback` — seven signal kinds: works/friction/clash/error/override/gap/proposal), `improvement-ledger.ts` (append-only JSONL Knowledge base + aggregation), `invariants.ts` (the fixed points the loop may not edit + autonomy-tier classifier), and `fitness.ts` (`computeFitness` 0–100 score + `proposeImprovements` — bounded, deduped, provenance-tagged, tiered proposals).
- Added the runnable Monitor/Analyze surface: `scripts/lumina-audit.mjs` + `npm run lumina:audit`, which scores `lumina-ledger.jsonl` against the registry and writes `docs/system/fitness-report.md`. Seeded a sample ledger.
- Operationalized the recursion: `KICKOFF.md` now instructs every consuming agent to report feedback as it builds. `continuous-improvement.md` (human workflow) now points to the executable loop. Manifest → v0.5.0 with `systemModules` (+4) and a `recursiveLoop` block.
- Added 34 tests across feedback / ledger / invariants / fitness.

Reason:
- The system "improves as agents build" rule existed only as prose with no sensor, no score, and a log no machine read back. Making the consuming agent the sensor — and giving the system a fitness function, an append-only ledger, and bounded invariant-gated proposals — turns a documented process into an actual loop. The discipline (ratchet not random walk; reversible; invariant-protected; Goodhart-resistant tiers) is the design.

Caveat:
- This is Stage 1–2 (observe → score → propose). *Applying* a proposal is still human/agent-driven; the evaluation harness, tiered auto-promotion, and meta-loop are deliberately future stages.

Files:
- `packages/lumina-system/src/{feedback,improvement-ledger,invariants,fitness}.ts` (new), `index.ts` + `package.json` exports (updated)
- `scripts/lumina-audit.mjs`, `lumina-ledger.jsonl`, root `package.json` (lumina:audit)
- `docs/system/recursive-loop.md` (new), `KICKOFF.md`, `docs/system/continuous-improvement.md`, `lumina.manifest.json` (updated)
- `src/__tests__/system/{feedback,improvement-ledger,invariants,fitness}.test.ts` (new)

## 2026-05-30 - Extracted the executable brain into @xlumina/system

Type: packaging, source-boundary
Scope: system
Tags: design-system, package, npm, consumption, dogfood

Decision:
- Moved the executable system modules from `src/system/` into a real, publishable package at `packages/lumina-system/` (`@xlumina/system`): `tokens`, `eras`, `registry`, `scheme`, `grid`, `variation`, `platform-rules`, plus an `index.ts` barrel. Framework-agnostic, zero runtime dependencies, ESM + `.d.ts` build via `tsc`, subpath `exports` map.
- Repointed the app: `tsconfig.json` and `vitest.config.ts` now alias `@xlumina/system`, `@xlumina/system/*`, and the legacy `@/system/*` to the package source. `src/components/system-showcase.tsx` imports `@xlumina/system` so the app dogfoods the package.
- Removed the redundant `export type { EraKey }` (scheme) and `export type { DeviceClass }` (platform-rules) re-exports that would have collided under the barrel's `export *`.
- Fixed the three entry-point gaps that blocked "point an agent at Lumina": corrected the stale canonical path in `LUMINA.md`, refreshed `lumina.manifest.json` to v0.4.0 (package + systemModules + new read-order), and made `integration-guide.md`'s `@xlumina/system/*` imports real. Updated active docs to the new paths; left historical log entries intact.
- Added `KICKOFF.md` — copy-paste agent handoff prompts (one-liner + full template).

Reason:
- A design system's whole purpose is portable reuse. With the brain only importable via in-repo `@/system/*` alias, no external app or agent could actually consume it; the integration guide's `@xlumina/system/*` imports were fictional. Extracting a real package makes `npm install @xlumina/system` true and gives one source of truth (no copy-drift).

Caveat:
- In-repo consumption resolves via path alias to the package *source* (not `dist`), so dev needs no package build. Publishing runs `npm run build` in `packages/lumina-system/` then `npm publish`.

Files:
- `packages/lumina-system/` (new package: src/*, index.ts, package.json, tsconfig.json, README.md, .gitignore)
- `tsconfig.json`, `vitest.config.ts` (alias repoint)
- `src/components/system-showcase.tsx` (imports `@xlumina/system`)
- `LUMINA.md`, `lumina.manifest.json`, `KICKOFF.md`, `docs/system/integration-guide.md`, `docs/system/registry.md`, `docs/system/mobile-vs-web.md`, `docs/system/scheme-grid-variation.md` (updated)

## 2026-05-30 - Scheme, Grid, and Variation Axes

Type: token, layout, system
Scope: system
Tags: design-system, light-dark, responsive-grid, variation, proximity, cross-device

Decision:
- Introduced `src/system/scheme.ts` — a `light | dark` surface axis that is *orthogonal* to eras. An era supplies accent/glow mood; a scheme supplies the surface/text/border foundation. `resolveSchemeVars(scheme, era)` flattens a pair into `--ls-*` CSS custom properties.
- Introduced `src/system/grid.ts` — one column model mapped per device class (mobile 4 / tablet 8 / desktop·wide 12), derived from the existing token breakpoints (sm 720 / md 960 / xl 1600). `spanColumns(device, fraction)` keeps spans proportional across devices so "half" stays half.
- Introduced `src/system/variation.ts` — seeded, bounded randomness (FNV-1a hash + mulberry32). Same seed → identical profile; every varied value is clamped to a tight range. Lets instances be siblings, not clones, without leaving the brand.
- Added `src/components/proximity-dock.tsx` — distance-driven scaling that caches `getBoundingClientRect` and only re-measures on resize/scroll (ResizeObserver + passive scroll), batching pointer reads into one rAF. Skips the effect on coarse pointers and reduced-motion.
- Added the `/system` showcase route (`src/app/system/`) rendering light/dark × mobile/web frames from the new `--ls-*` tokens only, plus a grid overlay, seed shuffle, and the proximity dock.
- Added 3 system test suites (scheme, grid, variation).

Reason:
- The system shipped dark-only with eras as the sole theme axis. Light/dark is a separate concern (canvas vs. accent) and deserves its own axis so the matrix is scheme × era, not a combinatorial explosion of eras.
- A single column model is what keeps a design system consistent across phone/tablet/desktop; the grid module makes that mapping executable and testable rather than living only in media queries.
- "Introduce randomness so instances aren't clones" only stays on-brand if the randomness is deterministic and bounded — hence a seeded PRNG with clamped ranges instead of free `Math.random`.

Follow-up (same day) — wired light/dark into the shipped page, added the mobile interaction analog and the mobile-vs-web rules:
- Channelized `globals.css` into four scheme channels (`--fg`, `--line`, `--panel`, `--text-strong`) consumed via `rgb(var(--x) / a)`. Dark stays the default; `.lumina-page[data-scheme="light"]` flips the channels plus page/body backgrounds. Accent (aura/spark) and the 12 high-alpha "luminous" chamber whites are intentionally left constant across schemes.
- Wired a persisted light/dark toggle into `LuminaHome` (reads saved preference, falls back to `prefers-color-scheme`, guarded storage access, `startTransition` to satisfy the no-sync-setState-in-effect rule).
- Added `src/components/scroll-proximity-rail.tsx` — the touch-native analog of the dock. Distance is measured from the rail's scroll center, not a pointer; caches layout-relative offsets and reads only `scrollLeft` per frame.
- Added `src/system/platform-rules.ts` + `docs/system/mobile-vs-web.md` — executable interaction rules per device class (hover, proximity idiom, nav, target, gestures, motion). `getProximityMode(device, reduceMotion)` is the single decision that routes pointer→dock, touch→rail.

Caveat:
- The `/system` showcase surfaces are token-driven via `--ls-*`. The shipped page now themes via the `globals.css` channel variables (a parallel mechanism). Both are correct; a future pass could unify them onto one variable namespace.

Files:
- `src/system/scheme.ts` (new)
- `src/system/grid.ts` (new)
- `src/system/variation.ts` (new)
- `src/system/platform-rules.ts` (new)
- `src/components/proximity-dock.tsx` (new)
- `src/components/scroll-proximity-rail.tsx` (new)
- `src/components/system-showcase.tsx` (new)
- `src/app/system/page.tsx` (new)
- `src/app/system/showcase.css` (new)
- `src/app/globals.css` (channelized for light/dark + scheme-toggle styles)
- `src/components/lumina-home.tsx` (light/dark toggle + persistence)
- `src/__tests__/system/scheme.test.ts` (new)
- `src/__tests__/system/grid.test.ts` (new)
- `src/__tests__/system/variation.test.ts` (new)
- `src/__tests__/system/platform-rules.test.ts` (new)
- `src/components/codex-content.ts` (fixed a latent `EraKey` re-export that broke type-check)
- `docs/system/scheme-grid-variation.md` (new)
- `docs/system/mobile-vs-web.md` (new)

## 2026-05-06 - Executable Token Layer and Product Registry

Type: token, source-boundary, product-profile
Scope: system
Tags: design-system, tokens, eras, registry, extensibility

Decision:
- Introduced `src/system/tokens.ts` as the single canonical source for all design primitives (colors, spacing, typography, motion, radii, breakpoints, z-layers).
- Introduced `src/system/eras.ts` as the typed era/theme system with full accent, glow, and tone fields per era.
- Introduced `src/system/registry.ts` as the machine-readable product registry with typed `ProductProfile` entries and lookup helpers.
- Registered three existing products: lumina-codex, jxl-scheduler, park-memory-hub.
- Refactored `codex-content.ts` to source `EraKey` and `eras` from `src/system/eras.ts`.
- Updated `lumina.manifest.json` to v0.3.0 with `tokenSource`, `eraSource`, `productRegistry`, and `registeredProducts` fields.
- Created `docs/system/integration-guide.md` with a step-by-step guide for adding new projects.
- Updated `docs/system/registry.md` to reference the new executable files.
- Added 82 system-level tests covering tokens, eras, and registry.

Reason:
- The system had excellent documentation taxonomy but no executable layer. New projects had no programmatic way to consume or extend Lumina values.
- The TypeScript token file is the canonical source; CSS custom properties and platform-specific theme files (Swift, RN) are downstream artifacts that must mirror it.
- The product registry enforces that every project that uses Lumina is visible to the system, which enables cross-product consistency checks and alias resolution.

Files:
- `src/system/tokens.ts` (new)
- `src/system/eras.ts` (new)
- `src/system/registry.ts` (new)
- `src/components/codex-content.ts` (refactored)
- `lumina.manifest.json` (updated to v0.3.0)
- `docs/system/integration-guide.md` (new)
- `docs/system/registry.md` (updated)
- `src/__tests__/system/tokens.test.ts` (new)
- `src/__tests__/system/eras.test.ts` (new)
- `src/__tests__/system/registry.test.ts` (new)

## 2026-05-06 - Repository Consolidation

Type: source-boundary
Scope: system
Tags: design-system, agent-entrypoint, continuous-improvement

Decision:
- Moved the constitution into `docs/constitution.md`.
- Moved mobile design-system material into `docs/products/mobile-design-systems/`.
- Added `LUMINA.md`, `AGENTS.md`, `lumina.manifest.json`, `registry.md`, and `continuous-improvement.md`.

Reason:
- Lumina should be a single portable package that any app or agent can reference.
- Product profiles, source snapshots, and the creative constitution now live under one root without mixing sensitive app-development material into the design system.

Files:
- `LUMINA.md`
- `AGENTS.md`
- `lumina.manifest.json`
- `docs/constitution.md`
- `docs/products/mobile-design-systems/`
- `docs/system/registry.md`
- `docs/system/continuous-improvement.md`

