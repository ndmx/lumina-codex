# Lumina Design Constitution

Status: canonical design-system contract  
Executable partner: `packages/lumina-system/src/constitution.ts`  
Version: 1.0.0, effective 2026-06-11

This document incorporates the June 2026 Lumina Design Constitution into the
public Lumina design system. It keeps the constitution's Apple-platform intent
while removing private app names and maintainer-specific provenance from the
package surface.

Lumina's core commitment:

> Every interface built with Lumina should feel native to its platform,
> respectful of people, systematically consistent, and distinctly Lumina through
> eras, schemes, variation, and carefully governed tokens.

## Core Principles

These eight principles are non-negotiable inputs to design review, code review,
and automated audits.

| Principle | Review Question | System Rule |
|---|---|---|
| Purpose | What user goal does this serve? | Every screen, flow, and component must justify its user value before visual novelty. |
| Agency | Can people choose, recover, and leave? | Interfaces preserve user control with clear escape hatches, undo paths, cancel states, and recoverable errors. |
| Responsibility | Does this act in the user's best interest? | Privacy, safety, permission rationale, and transparent data use are product requirements. |
| Familiarity | Does this build on what people already know? | Prefer platform-native patterns, system typography, and familiar controls unless a documented improvement exists. |
| Flexibility | Does it adapt across devices, inputs, abilities, and contexts? | Grid, appearance, reduced motion, contrast, localization, and assistive tech are first-class. |
| Simplicity | What can be removed without harming the goal? | Use the fewest tokens, surfaces, and words needed for clear hierarchy and direct action. |
| Craft | Does every detail feel intentional? | Spacing, type, motion, materials, and copy align to Lumina tokens and survive post-ship maintenance. |
| Delight | Does the moment feel human without distracting from the task? | Micro-interactions, haptics, empty states, and era mood support the user's work rather than decorate it. |

## Foundation Floors

These floors apply to all design variations and consuming apps.

- Accessibility: support assistive labels, keyboard or switch navigation where
  applicable, reduced motion, high contrast, and a 44px minimum interactive
  target.
- Semantic color: read colors through semantic tokens and `--ls-*` variables;
  preserve contrast across every scheme and era.
- Typography: use platform/system type defaults first, then Lumina type tokens
  for scale, weight, leading, and hierarchy.
- Layout: resolve columns, margins, spans, and safe-area behavior through the
  grid instead of local one-off breakpoints.
- Motion: communicate state, hierarchy, or feedback, and degrade cleanly under
  reduced-motion preferences.
- Materials: treat glass, outline, solid, and background-as-surface choices as
  semantic surface decisions tied to contrast and density.
- Privacy: explain permissions in context, collect only what the experience
  needs, and prefer on-device processing where feasible.
- Writing: use concise, human, actionable copy with helpful recovery guidance
  for errors and empty states.

## Component Spec Template

New reusable components should document these fields before becoming a public
pattern or design variation:

1. Purpose
2. Platform alignment
3. Token dependencies
4. Variants by platform, era, and state
5. Accessibility requirements
6. Interaction rules
7. Examples
8. Edge cases

## Governance

The constitution is living, but not casual. Use the Lumina ledger and review
loop when the system learns from real work.

| Trigger | Required Action |
|---|---|
| Changing, removing, or renaming a core principle | Human-gated review |
| Lowering accessibility, contrast, privacy, reduced-motion, or target-size floors | Human-gated review |
| Replacing platform-native behavior with a custom pattern | Ledger review |
| Adding a reusable pattern, material, component family, or design variation | Ledger review |
| Verifying an implementation against the constitution | Automated audit |

The executable invariants in `packages/lumina-system/src/invariants.ts` protect
the core principles, 44px target floor, contrast floor, reduced-motion floor,
grid proportionality, and token contract from autonomous rewrites.

## Relationship To The Vision Constitution

`docs/constitution.md` remains the Lumina Codex creative vision. This file is
the reusable system contract for apps, packages, and agents. When they differ,
use this file for design-system implementation and use the vision constitution
for the Codex experience itself.
