# Build With Lumina — Agent Kickoff

Point any coding agent at Lumina by pasting one of the prompts below. Lumina is a
portable design-system brain: an installable package (`@xlumina/system`) plus the
rules an agent should follow (`LUMINA.md` + `docs/system/`).

---

## The one-liner

> Read `lumina-codex/LUMINA.md` and follow it
> to build me **<your app idea>**.

That file routes the agent through the read order, the `@xlumina/system` package,
and the naming/platform/interaction rules.

---

## The full template (copy, fill the blanks)

> **Design system:** Use Lumina. Its entry point is
> `lumina-codex/LUMINA.md` — read it and
> `lumina.manifest.json` first, then follow the read order.
>
> **Install the brain:** `npm install @xlumina/system` (source lives at
> `packages/lumina-system/`). Theme with `resolveSchemeVars(scheme, era)`, lay out
> with `grid` (`spanColumns`/`resolveGrid`), give the instance identity with
> `createVariation("<app-id>")`, and choose interaction idioms with
> `platform-rules` (`resolveInteraction`, `getProximityMode`). Components must read
> the `--ls-*` CSS variables — never hardcode color/radius/columns.
>
> **What I want to build:** <one paragraph: the app, its users, the core jobs>
>
> **Platform/stack:** <e.g. Next.js web app | iOS SwiftUI | React Native>
>
> **Era / mood:** <atelier (default) | memphis | brutalist>
>
> **Before writing UI:** register the product in
> `packages/lumina-system/src/registry.ts`, follow `docs/system/naming-and-tags.md`
> and `docs/system/mobile-vs-web.md`, prefer native platform components, and log
> any reusable decision per `docs/system/continuous-improvement.md`.
>
> **Close the loop (important):** as you build, report back. Whenever something
> in Lumina worked cleanly, was missing, clashed, errored, or you had to override
> a default or invent a rule, record it — the simplest way from any project is the
> shipped CLI:
>
> ```bash
> npx lumina record --kind gap --target concept:Reminder --detail "no canonical chip"
> npx lumina audit     # see this project's fitness score + proposals
> ```
>
> (Or call `recordFeedback` from `@xlumina/system/feedback` programmatically; set
> `LUMINA_FEEDBACK_URL` to feed a central Lumina.) Your build is also the system's
> training signal — see `docs/system/recursive-loop.md`.

---

## What a good agent will do with that

1. Read `LUMINA.md` → `lumina.manifest.json` → the `docs/system/` read order.
2. `npm install @xlumina/system` (or import the source for non-JS stacks — see the
   SwiftUI / React Native sections of `docs/system/integration-guide.md`).
3. Tag the work (medium / platform / framework / surface) from
   `docs/system/platform-taxonomy.md`.
4. Register the product and pick an era.
5. Build screens that read `--ls-*` variables, on the Lumina grid, with the right
   pointer-vs-touch interaction rules.
6. Log new cross-product decisions back into Lumina.

---

## For non-JavaScript stacks

`@xlumina/system` is the source of truth even when you can't import it. For
SwiftUI, React Native, documents, etc., the agent reads the token/scheme/grid
values and generates matching native theme files, keeping a header that points
back to `packages/lumina-system/src/tokens.ts`. Details:
`docs/system/integration-guide.md`.
