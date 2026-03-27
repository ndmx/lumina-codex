# Lumina Codex Build Log

## 2026-03-27

### Current milestone
- Established the first durable baseline for the project.
- Built the interactive homepage shell for `Lumina Codex` with a live React Three Fiber chamber.
- Connected editorial content, chapter navigation, and principle controls to the hero experience.

### What is implemented
- Next.js App Router foundation with TypeScript and Tailwind.
- A `Codex Chamber` hero driven by React Three Fiber and Three.js.
- Era switching for `Atelier`, `Memphis`, and `Cyber-Brutalist`.
- Live principle behaviors for `Balance`, `Contrast`, `Rhythm`, and `Unity`.
- Shader-driven aura shell, atmospheric particles, post-processing, and scroll-linked scene response.
- A sticky narrative rail that tracks chapter focus and scroll progress.
- Editorial principle cards that can trigger the live chamber state.
- Accessibility scaffolding including semantic sections, keyboard-friendly controls, reduced-motion fallback, and live announcements.

### Key files
- `src/components/lumina-home.tsx`
- `src/components/codex-chamber.tsx`
- `src/components/codex-scene.tsx`
- `src/components/codex-scroll-rail.tsx`
- `src/components/codex-content.ts`
- `src/app/page.tsx`
- `src/app/globals.css`

### Verification
- `npm run lint` — passing
- `npm run build` — passing

### Git checkpoint intent
- Create the first reliable baseline commit before expanding into richer chapter exhibits, authored geometry, or CMS-backed content.

### Next recommended move
- Turn each principle section into a deeper chapter exhibit that pushes richer state into the live chamber.

## 2026-03-27 — Narrative Depth Pass

### What changed
- Added a second shader-driven energy layer with a narrative backdrop behind the orb.
- Lifted scroll progress and active chapter tracking into the homepage shell.
- Converted the narrative rail into a controlled component that reflects global page state.
- Added chapter-aware transitions so the hero, editorial panels, principles, and roadmap move as one sequence.

### Scene-specific upgrades
- New custom shader backdrop in `src/components/codex-scene.tsx` that reacts to active principle and scroll depth.
- Camera drift, fog, bloom, and chamber energy now intensify more intentionally as the visitor moves down the page.

### Experience-specific upgrades
- `src/components/lumina-home.tsx` now coordinates chapter focus and page progress.
- `src/components/codex-scroll-rail.tsx` now renders from shared state instead of maintaining its own observer.
- `src/app/globals.css` now includes chapter-aware transitions and mood shifts across major sections.

### Verification
- `npm run lint` — passing
- `npm run build` — passing

### Next recommended move
- Build richer chapter exhibits for each principle so the lower page sections introduce distinct scene states, copy, and interaction behaviors instead of only summary cards.

## 2026-03-27 — Principle Theater Pass

### What changed
- Expanded the principles section from summary cards into a true exhibit layer.
- Added long-form exhibit copy, scene cues, narrative cues, and recommended eras for each principle.
- Introduced a sticky exhibit panel that stays in view while the visitor explores the principle grid.
- Threaded the active principle accent through the shell so rail, cards, and exhibit panel visually respond to the current focus.

### Experience-specific upgrades
- `src/components/codex-content.ts` now includes structured exhibit content for each principle.
- `src/components/lumina-home.tsx` now coordinates the principle theater and supports one-click era + principle handoff back into the chamber.
- `src/app/globals.css` now styles the exhibit panel, two-column principle theater layout, and active accent propagation.

### Verification
- `npm run lint` — passing
- `npm run build` — passing

### Next recommended move
- Introduce principle-specific scene variants or micro-routes so each exhibit can change more than the active principle state and begin to feel like its own authored chapter.
