/**
 * Lumina meta-loop — Stage 5 of the recursive loop. The Goodhart guard.
 *
 * Stages 1–4 optimize a fitness score by applying changes. The danger of any
 * self-improving system is that it games its own metric. Lumina has a concrete
 * version of this hole: the closer (Stage 4) raises fitness by appending its OWN
 * `works` event every time it "resolves" something — so the system can inflate
 * its score by congratulating itself.
 *
 * The meta-loop watches for exactly that. It runs on a slower, human-supervised
 * cadence and never auto-applies anything:
 *
 *  - a **holdout score** computed only from signal the inner loop cannot write
 *    (real product feedback), so it can't be gamed;
 *  - **alarms** when the gameable fitness diverges from the holdout, when
 *    loop-generated `works` dominate, or when "resolved" targets get re-reported;
 *  - **meta-proposals** to change the fitness function or invariants — ALWAYS
 *    human-gated, because a loop that can autonomously rewrite its own objective
 *    is the ultimate Goodhart failure;
 *  - a **circuit breaker** (`freezeAutoPromotion`) the closer honors to halt
 *    Stage-4 auto-application when the metric has drifted from reality.
 */

import { computeFitness } from "./fitness.js";
import type { FeedbackEvent, FeedbackSeverity } from "./feedback.js";
import { targetKey } from "./improvement-ledger.js";
import { LOOP_PRODUCT_ID } from "./closer.js";
import type { ProductProfile } from "./registry.js";

const NEGATIVE_KINDS = new Set(["friction", "clash", "error", "override", "gap"]);

/** Divergence (gameable fitness − holdout) at/above this is a high alarm + freeze. */
export const DIVERGENCE_THRESHOLD = 20;
/** Loop-generated share of positive signal at/above this trips self-congratulation. */
export const SELF_WORKS_THRESHOLD = 0.5;

export type MetaSignals = {
  totalWorks: number;
  /** `works` the loop generated about itself (productId === LOOP_PRODUCT_ID). */
  selfWorks: number;
  /** `works` from real consuming products. */
  productWorks: number;
  /** selfWorks / totalWorks — the core gaming vector. */
  selfResolutionRatio: number;
  /** Resolved targets that a real product re-reported as a problem. */
  reopenedTargets: string[];
  reopenRate: number;
  /** Resolved targets with no external `works` confirmation. */
  unverifiedResolutions: string[];
};

export type MetaAlarmCode =
  | "self-congratulation"
  | "metric-divergence"
  | "resolution-churn"
  | "unverified-resolution";

export type MetaAlarm = {
  code: MetaAlarmCode;
  severity: FeedbackSeverity;
  detail: string;
  evidence: string[];
};

export type MetaProposalKind =
  | "reweight-fitness"
  | "add-invariant"
  | "tighten-gate"
  | "freeze-auto-promotion";

export type MetaProposal = {
  id: string;
  kind: MetaProposalKind;
  detail: string;
  /** Meta-proposals are human-gated by construction — never auto-applied. */
  tier: "human-gated";
  evidence: string[];
};

export type MetaReview = {
  /** The gameable inner score. */
  fitness: number;
  /** The un-gameable score (real product signal only). */
  holdout: number;
  /** fitness − holdout. Large positive = the loop is inflating its own score. */
  divergence: number;
  signals: MetaSignals;
  alarms: MetaAlarm[];
  metaProposals: MetaProposal[];
  /** Circuit breaker: the closer must NOT auto-promote while this is true. */
  freezeAutoPromotion: boolean;
};

// ─── Holdout (un-gameable) ────────────────────────────────────────────────────

/**
 * Fitness computed only from signal the inner loop cannot manufacture — events
 * from real products, excluding the loop's own resolutions. The inner loop can
 * raise `fitness`; it cannot raise this.
 */
export function holdoutScore(events: FeedbackEvent[], products: ProductProfile[]): number {
  const external = events.filter((e) => e.productId !== LOOP_PRODUCT_ID);
  return computeFitness(external, products).metrics.score;
}

// ─── Signals ──────────────────────────────────────────────────────────────────

export function metaSignals(events: FeedbackEvent[], resolvedTargets: string[]): MetaSignals {
  const works = events.filter((e) => e.kind === "works");
  const selfWorks = works.filter((e) => e.productId === LOOP_PRODUCT_ID).length;
  const productWorks = works.length - selfWorks;
  const totalWorks = works.length;

  const resolved = new Set(resolvedTargets);
  const externalWorkTargets = new Set(
    works.filter((e) => e.productId !== LOOP_PRODUCT_ID).map(targetKey),
  );

  // A real product still reporting a problem on a "resolved" target = hollow fix.
  const reopenedTargets = [
    ...new Set(
      events
        .filter(
          (e) =>
            NEGATIVE_KINDS.has(e.kind) &&
            e.productId !== LOOP_PRODUCT_ID &&
            resolved.has(targetKey(e)),
        )
        .map(targetKey),
    ),
  ];

  const unverifiedResolutions = resolvedTargets.filter((t) => !externalWorkTargets.has(t));

  return {
    totalWorks,
    selfWorks,
    productWorks,
    selfResolutionRatio: totalWorks ? round(selfWorks / totalWorks) : 0,
    reopenedTargets,
    reopenRate: resolved.size ? round(reopenedTargets.length / resolved.size) : 0,
    unverifiedResolutions,
  };
}

// ─── Review ───────────────────────────────────────────────────────────────────

export function metaReview(
  events: FeedbackEvent[],
  products: ProductProfile[],
  resolvedTargets: string[] = [],
): MetaReview {
  const fitness = computeFitness(events, products).metrics.score;
  const holdout = holdoutScore(events, products);
  const divergence = round(fitness - holdout, 1);
  const signals = metaSignals(events, resolvedTargets);

  const alarms: MetaAlarm[] = [];

  if (signals.selfWorks >= 2 && signals.selfResolutionRatio >= SELF_WORKS_THRESHOLD) {
    alarms.push({
      code: "self-congratulation",
      severity: signals.selfResolutionRatio >= 0.75 ? "high" : "medium",
      detail: `${pct(signals.selfResolutionRatio)} of positive signal is loop-generated, not from real products`,
      evidence: [`selfWorks=${signals.selfWorks}`, `totalWorks=${signals.totalWorks}`],
    });
  }

  if (divergence >= DIVERGENCE_THRESHOLD) {
    alarms.push({
      code: "metric-divergence",
      severity: "high",
      detail: `inner fitness ${fitness} exceeds the un-gameable holdout ${holdout} by ${divergence}`,
      evidence: [`fitness=${fitness}`, `holdout=${holdout}`],
    });
  }

  if (signals.reopenedTargets.length > 0) {
    alarms.push({
      code: "resolution-churn",
      severity: "high",
      detail: `${signals.reopenedTargets.length} "resolved" target(s) were re-reported by a real product`,
      evidence: signals.reopenedTargets,
    });
  }

  if (signals.unverifiedResolutions.length >= 3) {
    alarms.push({
      code: "unverified-resolution",
      severity: "low",
      detail: `${signals.unverifiedResolutions.length} resolutions have no external confirmation`,
      evidence: signals.unverifiedResolutions,
    });
  }

  const metaProposals: MetaProposal[] = [];
  const codes = new Set(alarms.map((a) => a.code));

  if (codes.has("self-congratulation") || codes.has("metric-divergence")) {
    metaProposals.push({
      id: "reweight-fitness",
      kind: "reweight-fitness",
      detail: "Discount loop-generated `works` so the system cannot inflate its own score.",
      tier: "human-gated",
      evidence: [...codes],
    });
  }
  if (codes.has("metric-divergence")) {
    metaProposals.push({
      id: "freeze-auto-promotion",
      kind: "freeze-auto-promotion",
      detail: "Halt Stage-4 auto-application until inner fitness reconciles with the holdout.",
      tier: "human-gated",
      evidence: ["metric-divergence"],
    });
  }
  if (codes.has("resolution-churn")) {
    metaProposals.push({
      id: "tighten-resolution-gate",
      kind: "tighten-gate",
      detail: "Require an external product `works` confirmation before a target counts as resolved.",
      tier: "human-gated",
      evidence: signals.reopenedTargets,
    });
  }

  return {
    fitness,
    holdout,
    divergence,
    signals,
    alarms,
    metaProposals,
    freezeAutoPromotion: divergence >= DIVERGENCE_THRESHOLD,
  };
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function round(value: number, dp = 2): number {
  const f = 10 ** dp;
  return Math.round(value * f) / f;
}

function pct(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}
