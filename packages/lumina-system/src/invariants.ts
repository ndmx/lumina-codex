/**
 * Lumina invariants — the fixed points the recursive loop may not edit.
 *
 * A self-improving system without protected invariants optimizes itself into
 * degeneracy: it games whatever it measures (Goodhart) and erodes the things
 * that make it coherent. So some decisions are off the table for autonomous
 * change, and every proposal is classified by how much human supervision its
 * blast radius demands.
 *
 *   auto         → safe to apply once the evaluation harness shows no regression
 *   review       → an agent/owner should eyeball it before promotion
 *   human-gated   → touches an invariant; never auto-applied, always escalated
 */

import type { FeedbackTarget, FeedbackTargetKind } from "./feedback.js";

export type AutonomyTier = "auto" | "review" | "human-gated";

export type Invariant = {
  /** Target kind this protects. */
  kind: FeedbackTargetKind;
  /** Specific ref, or "*" for the whole kind. */
  ref: string;
  reason: string;
};

/**
 * The protected set. These are the load-bearing contracts; the loop can surface
 * tension around them but cannot rewrite them without a human.
 */
export const invariants: readonly Invariant[] = [
  {
    kind: "constitution",
    ref: "core-principles",
    reason:
      "The eight constitution principles define the system's ethical and craft contract; changes require human review.",
  },
  {
    kind: "concept",
    ref: "Shared Space",
    reason:
      "Canonical cross-product concept. Renaming it breaks alias resolution everywhere.",
  },
  {
    kind: "token",
    ref: "--ls-contract",
    reason:
      "Components read `--ls-*` custom properties. Changing the variable contract breaks every consumer at once.",
  },
  {
    kind: "platform-rule",
    ref: "min-target",
    reason:
      "44px touch / accessible target minimum. An accessibility floor is not an optimization target.",
  },
  {
    kind: "scheme",
    ref: "contrast-floor",
    reason: "Text/background contrast minimums must hold in every scheme × era.",
  },
  {
    kind: "platform-rule",
    ref: "reduced-motion",
    reason:
      "Reduced-motion support is an accessibility floor, not a stylistic preference.",
  },
  {
    kind: "grid",
    ref: "proportional-spans",
    reason:
      "Spans stay proportional across devices. This law is what makes the grid consistent; it is structural, not a default.",
  },
] as const;

/** Is this target an invariant (whole-kind or specific ref)? */
export function isInvariant(target: FeedbackTarget): boolean {
  return invariants.some(
    (inv) =>
      inv.kind === target.kind && (inv.ref === "*" || inv.ref === target.ref),
  );
}

/** The matching invariant, if any — useful for explaining an escalation. */
export function matchInvariant(target: FeedbackTarget): Invariant | undefined {
  return invariants.find(
    (inv) =>
      inv.kind === target.kind && (inv.ref === "*" || inv.ref === target.ref),
  );
}

/**
 * How much supervision a change to this target needs.
 * - Invariants → human-gated.
 * - Naming/concept surface → review (wording has wide ripple).
 * - Everything else (leaf token defaults, component tweaks) → auto-eligible.
 */
export function classifyAutonomy(target: FeedbackTarget): AutonomyTier {
  if (isInvariant(target)) return "human-gated";
  if (target.kind === "constitution") return "human-gated";
  if (target.kind === "naming" || target.kind === "concept") return "review";
  return "auto";
}
