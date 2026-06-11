/**
 * Lumina Design Constitution.
 *
 * Distilled from the June 2026 Lumina Design Constitution into executable,
 * public design-system rules. Keep private app names, maintainer names, and
 * source-project provenance out of this module; consuming apps can layer their
 * own local labels through the registry and ledger.
 */

export type ConstitutionPrincipleId =
  | "purpose"
  | "agency"
  | "responsibility"
  | "familiarity"
  | "flexibility"
  | "simplicity"
  | "craft"
  | "delight";

export type ConstitutionPrinciple = {
  id: ConstitutionPrincipleId;
  name: string;
  question: string;
  rule: string;
  auditTarget: string;
};

export type FoundationRequirement = {
  id: string;
  name: string;
  requirement: string;
};

export type GovernanceRule = {
  id: string;
  trigger: string;
  requiredAction: "ledger-review" | "human-gated" | "automated-audit";
};

export type LuminaConstitution = {
  name: string;
  version: string;
  effectiveDate: string;
  primaryPlatforms: readonly string[];
  principles: readonly ConstitutionPrinciple[];
  foundations: readonly FoundationRequirement[];
  componentSpecFields: readonly string[];
  governance: readonly GovernanceRule[];
};

export const constitutionPrinciples: readonly ConstitutionPrinciple[] = [
  {
    id: "purpose",
    name: "Purpose",
    question: "What user goal does this serve?",
    rule: "Every screen, flow, and component must justify its user value before visual novelty.",
    auditTarget: "concept",
  },
  {
    id: "agency",
    name: "Agency",
    question: "Can people choose, recover, and leave?",
    rule: "Interfaces must preserve user control through clear escape hatches, undo paths, and recoverable states.",
    auditTarget: "component",
  },
  {
    id: "responsibility",
    name: "Responsibility",
    question: "Does this act in the user's best interest?",
    rule: "Privacy, safety, permission rationale, and transparent data use are product requirements, not polish.",
    auditTarget: "platform-rule",
  },
  {
    id: "familiarity",
    name: "Familiarity",
    question: "Does this build on what people already know?",
    rule: "Prefer platform-native patterns, system typography, and familiar controls unless a documented improvement exists.",
    auditTarget: "platform-rule",
  },
  {
    id: "flexibility",
    name: "Flexibility",
    question: "Does it adapt across devices, inputs, abilities, and contexts?",
    rule: "Responsive grid, appearance preferences, reduced motion, contrast, localization, and assistive tech must be first-class.",
    auditTarget: "grid",
  },
  {
    id: "simplicity",
    name: "Simplicity",
    question: "What can be removed without harming the goal?",
    rule: "Use the fewest tokens, surfaces, and words needed for clear hierarchy and direct action.",
    auditTarget: "token",
  },
  {
    id: "craft",
    name: "Craft",
    question: "Does every detail feel intentional?",
    rule: "Spacing, type, motion, materials, and copy must align to Lumina tokens and survive post-ship maintenance.",
    auditTarget: "token",
  },
  {
    id: "delight",
    name: "Delight",
    question: "Does the moment feel human without distracting from the task?",
    rule: "Micro-interactions, haptics, empty states, and era mood should support the user's work rather than decorate it.",
    auditTarget: "variation",
  },
] as const;

export const foundationRequirements: readonly FoundationRequirement[] = [
  {
    id: "accessibility",
    name: "Accessibility",
    requirement:
      "Support assistive labels, keyboard or switch navigation where applicable, reduced motion, high contrast, and a 44px minimum interactive target.",
  },
  {
    id: "semantic-color",
    name: "Semantic Color",
    requirement:
      "Read colors through semantic tokens and scheme variables; preserve contrast across every scheme and era.",
  },
  {
    id: "typography",
    name: "Typography",
    requirement:
      "Use platform/system type defaults first, then Lumina type tokens for scale, weight, leading, and hierarchy.",
  },
  {
    id: "layout",
    name: "Layout",
    requirement:
      "Resolve columns, margins, spans, and safe-area behavior through the grid instead of local one-off breakpoints.",
  },
  {
    id: "motion",
    name: "Motion",
    requirement:
      "Motion must communicate state, hierarchy, or feedback and must degrade cleanly under reduced-motion preferences.",
  },
  {
    id: "materials",
    name: "Materials",
    requirement:
      "Treat glass, outline, solid, and background-as-surface choices as semantic surface decisions tied to contrast and density.",
  },
  {
    id: "privacy",
    name: "Privacy",
    requirement:
      "Explain permissions in context, collect only what the experience needs, and prefer on-device processing where feasible.",
  },
  {
    id: "writing",
    name: "Writing",
    requirement:
      "Use concise, human, actionable copy with helpful recovery guidance for errors and empty states.",
  },
] as const;

export const componentSpecFields = [
  "purpose",
  "platformAlignment",
  "tokenDependencies",
  "variants",
  "accessibility",
  "interactionRules",
  "examples",
  "edgeCases",
] as const;

export const governanceRules: readonly GovernanceRule[] = [
  {
    id: "core-principle-change",
    trigger: "Changing, removing, or renaming a constitution principle.",
    requiredAction: "human-gated",
  },
  {
    id: "foundation-floor-change",
    trigger: "Lowering accessibility, contrast, privacy, reduced-motion, or target-size floors.",
    requiredAction: "human-gated",
  },
  {
    id: "platform-deviation",
    trigger: "Replacing platform-native behavior with a custom pattern.",
    requiredAction: "ledger-review",
  },
  {
    id: "new-pattern",
    trigger: "Adding a reusable pattern, material, component family, or design variation.",
    requiredAction: "ledger-review",
  },
  {
    id: "routine-conformance",
    trigger: "Verifying an implementation against the constitution.",
    requiredAction: "automated-audit",
  },
] as const;

export const luminaConstitution: LuminaConstitution = {
  name: "Lumina Design Constitution",
  version: "1.0.0",
  effectiveDate: "2026-06-11",
  primaryPlatforms: ["ios", "ipados", "macos", "watchos", "tvos", "visionos"],
  principles: constitutionPrinciples,
  foundations: foundationRequirements,
  componentSpecFields,
  governance: governanceRules,
};

export function getConstitutionPrinciple(
  id: ConstitutionPrincipleId,
): ConstitutionPrinciple {
  return constitutionPrinciples.find((principle) => principle.id === id)!;
}

export function isConstitutionPrincipleId(
  value: string,
): value is ConstitutionPrincipleId {
  return constitutionPrinciples.some((principle) => principle.id === value);
}

export function getFoundationRequirement(
  id: string,
): FoundationRequirement | undefined {
  return foundationRequirements.find((requirement) => requirement.id === id);
}
