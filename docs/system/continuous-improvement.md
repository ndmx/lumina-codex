# Lumina Continuous Improvement

Lumina should improve as agents build real apps. The goal is not to freeze the system; it is to keep reusable decisions flowing back into one durable source.

> **Executable path.** This document is the human workflow. Its automated
> counterpart is the recursive loop in `recursive-loop.md`: while an agent builds
> with `@xlumina/system`, it reports feedback (`recordFeedback`) into
> `lumina-ledger.jsonl`; `npm run lumina:audit` scores system fitness and emits
> bounded, invariant-gated proposals. Use the manual workflow below to *promote*
> a proposal once it is approved.

## When To Add To Lumina

Add a rule, token, component, alias, or pattern when at least one of these is true:

- The same decision appears in two products.
- A product creates a term that needs to map to a Lumina concept.
- A platform introduces a new medium, framework, surface, or capability.
- An accessibility, privacy, or interaction rule prevents future mistakes.
- An agent had to infer a rule that should be explicit next time.

Do not add to Lumina when the decision is one-off styling, unfinished exploration, or local implementation detail with no design-system value.

## Agent Workflow

1. Identify whether the change is system-wide, a public variation, or private-app-specific.
2. Update the smallest canonical file that owns the rule.
3. If the change affects naming, update `naming-and-tags.md`.
4. If the change affects tags, update `platform-taxonomy.md`.
5. If the change affects UI structure or framework mapping, update `element-model.md`.
6. If the change adds a design variation, registry entry, or file, update `registry.md`.
7. Record the decision in `improvement-log.md`.
8. Run a repo scan for old or conflicting language.
9. Run project verification if code or package metadata changed.

## Quick Entry Template

Use this format in `improvement-log.md`:

```text
## YYYY-MM-DD - Short Decision Name

Type: rule | alias | token | component | design-variation | audit | source-boundary
Scope: system | design-variation | private-app | archive
Tags: tag-one, tag-two

Decision:
- What changed.

Reason:
- Why it belongs in Lumina.

Files:
- Path(s) updated.
```

## Conflict Rules

- Current system docs beat archived source snapshots.
- Private app wording stays private; public variation docs use generic labels.
- Native platform conventions beat custom UI unless a design variation explains why.
- Sensitive files in `../AppDEVguideS` must never be copied into Lumina.
