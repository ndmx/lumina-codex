/**
 * Lumina fitness — the part that makes improvement measurable.
 *
 * You cannot improve what you cannot score. This module reads the ledger of
 * agent feedback and computes a fitness report, then derives bounded,
 * provenance-tagged improvement proposals. Crucially it only *proposes*:
 * promotion is gated by autonomy tier (invariants.ts) and, in a full loop, by
 * an evaluation harness that proves no product regresses.
 *
 * Pure functions over (events, products). No side effects.
 */

import type { FeedbackEvent, FeedbackSeverity } from "./feedback.js";
import { severityWeight } from "./feedback.js";
import { summarize, targetKey } from "./improvement-ledger.js";
import { classifyAutonomy, matchInvariant, type AutonomyTier } from "./invariants.js";
import type { ProductProfile } from "./registry.js";

export type FitnessMetrics = {
  events: number;
  products: number;
  works: number;
  friction: number;
  clash: number;
  error: number;
  override: number;
  gap: number;
  /** Overrides per registered product — high means the system fights products. */
  overrideRate: number;
  /** Targets reported with friction/gap/clash by >= 2 distinct products. */
  duplication: number;
  /** Composite 0..100, higher is healthier. */
  score: number;
};

export type FitnessReport = {
  metrics: FitnessMetrics;
  /** Sorted worst-first: the targets generating the most negative signal. */
  hotspots: Hotspot[];
};

export type Hotspot = {
  target: string; // targetKey, e.g. "token:aura"
  negativeSignal: number; // severity-weighted friction/clash/error/gap/override
  products: number; // distinct products affected
  kinds: string[];
};

const NEGATIVE_KINDS = new Set(["friction", "clash", "error", "override", "gap"]);

function weighted(events: FeedbackEvent[]): number {
  return events.reduce((sum, e) => sum + severityWeight[e.severity as FeedbackSeverity], 0);
}

export function computeFitness(
  events: FeedbackEvent[],
  products: ProductProfile[],
): FitnessReport {
  const s = summarize(events);
  const productCount = Math.max(products.length, 1);

  const overrideRate = round(s.byKind.override / productCount);

  // Duplication: a target that >= 2 distinct products struggled with is, by
  // Lumina's own rule, a system-level gap rather than a product quirk.
  let duplication = 0;
  for (const [, set] of Object.entries(s.productsPerTarget)) {
    if (set.size >= 2) duplication++;
  }

  // Composite score: reward "works", penalize negative signal (severity-weighted),
  // with extra weight on cross-product duplication. Additive (Laplace) smoothing
  // keeps the score monotonic even when there is no positive signal yet — so a
  // worsening change is always a regression, never pinned at a flat 0. This is
  // what makes the evaluation-harness ratchet trustworthy on any ledger. [0, 100].
  const positive = s.byKind.works * 2;
  const negative =
    weighted(events.filter((e) => NEGATIVE_KINDS.has(e.kind))) + duplication * 4;
  const score = round(((positive + 1) / (positive + negative + 1)) * 100, 1);

  const metrics: FitnessMetrics = {
    events: s.total,
    products: products.length,
    works: s.byKind.works,
    friction: s.byKind.friction,
    clash: s.byKind.clash,
    error: s.byKind.error,
    override: s.byKind.override,
    gap: s.byKind.gap,
    overrideRate,
    duplication,
    score,
  };

  return { metrics, hotspots: computeHotspots(events) };
}

function computeHotspots(events: FeedbackEvent[]): Hotspot[] {
  const groups = new Map<string, FeedbackEvent[]>();
  for (const e of events) {
    if (!NEGATIVE_KINDS.has(e.kind)) continue;
    const key = targetKey(e);
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(e);
  }
  const hotspots: Hotspot[] = [];
  for (const [target, group] of groups) {
    hotspots.push({
      target,
      negativeSignal: weighted(group),
      products: new Set(group.map((e) => e.productId)).size,
      kinds: [...new Set(group.map((e) => e.kind))],
    });
  }
  return hotspots.sort((a, b) => b.negativeSignal - a.negativeSignal);
}

// ─── Proposal generation ──────────────────────────────────────────────────────

export type Proposal = {
  id: string;
  target: string; // targetKey
  action: string; // what to do
  motivation: string; // the signal that triggered it
  tier: AutonomyTier; // how much supervision promotion needs
  reversible: true; // every Lumina change must be reversible
  evidence: string[]; // event ids — provenance
};

export type ProposeOptions = {
  /** Min distinct products before a cross-product gap becomes a proposal. */
  duplicationThreshold?: number;
  /** Max proposals returned (kept bounded — a ratchet, not a firehose). */
  limit?: number;
  /**
   * Target keys already resolved (e.g. by a prior closer run). Excluded so the
   * loop advances instead of re-proposing settled questions every cycle.
   */
  resolvedTargets?: string[];
};

/**
 * Derive improvement proposals from the ledger. Bounded and deduped by target.
 * Each proposal carries its provenance (the event ids) and an autonomy tier,
 * and is always reversible — the discipline that separates a ratchet from a
 * random walk.
 */
export function proposeImprovements(
  events: FeedbackEvent[],
  _products: ProductProfile[],
  options: ProposeOptions = {},
): Proposal[] {
  const duplicationThreshold = options.duplicationThreshold ?? 2;
  const limit = options.limit ?? 10;
  const resolved = new Set(options.resolvedTargets ?? []);

  const byTarget = new Map<string, FeedbackEvent[]>();
  for (const e of events) {
    if (e.kind === "works") continue;
    const key = targetKey(e);
    if (resolved.has(key)) continue; // already addressed — don't re-propose
    (byTarget.get(key) ?? byTarget.set(key, []).get(key)!).push(e);
  }

  const proposals: Proposal[] = [];

  for (const [target, group] of byTarget) {
    const products = new Set(group.map((e) => e.productId));
    const kinds = new Set(group.map((e) => e.kind));
    const sample = group[0];
    const inv = matchInvariant(sample.target);
    const tier = classifyAutonomy(sample.target);
    const evidence = group.map((e) => e.id);

    // 1) Errors are always worth a fix proposal.
    if (kinds.has("error")) {
      proposals.push({
        id: `fix-${target}`,
        target,
        action: `Investigate and fix the reported failure on ${target}.`,
        motivation: `${count(group, "error")} error report(s)` + provenanceNote(inv),
        tier,
        reversible: true,
        evidence,
      });
      continue;
    }

    // 2) A gap/friction/clash that >= N distinct products hit is a system gap.
    if (
      products.size >= duplicationThreshold &&
      (kinds.has("gap") || kinds.has("friction") || kinds.has("clash"))
    ) {
      proposals.push({
        id: `canonicalize-${target}`,
        target,
        action: `Make ${target} explicit in the system — ${
          kinds.has("clash") ? "resolve the conflicting rules" : "add the missing rule/token"
        } so agents stop re-inventing it.`,
        motivation: `${products.size} products independently hit this${provenanceNote(inv)}`,
        tier,
        reversible: true,
        evidence,
      });
      continue;
    }

    // 3) A single product overriding a default is a hint the default is wrong.
    if (kinds.has("override")) {
      proposals.push({
        id: `reconsider-${target}`,
        target,
        action: `Reconsider the default behind ${target}; a product felt the need to override it.`,
        motivation: `${count(group, "override")} override(s)${provenanceNote(inv)}`,
        tier,
        reversible: true,
        evidence,
      });
      continue;
    }

    // 4) An explicit agent proposal flows straight into the queue.
    if (kinds.has("proposal")) {
      proposals.push({
        id: `agent-${target}`,
        target,
        action: sample.suggestedChange ?? sample.detail,
        motivation: `agent-submitted proposal${provenanceNote(inv)}`,
        tier,
        reversible: true,
        evidence,
      });
    }
  }

  // Sort: more evidence first, then tighter autonomy last (surface the cheap wins).
  const tierRank: Record<AutonomyTier, number> = { auto: 0, review: 1, "human-gated": 2 };
  proposals.sort(
    (a, b) => b.evidence.length - a.evidence.length || tierRank[a.tier] - tierRank[b.tier],
  );
  return proposals.slice(0, limit);
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function count(events: FeedbackEvent[], kind: string): number {
  return events.filter((e) => e.kind === kind).length;
}

function provenanceNote(inv: ReturnType<typeof matchInvariant>): string {
  return inv ? ` — touches invariant (${inv.reason})` : "";
}

function round(value: number, dp = 2): number {
  const f = 10 ** dp;
  return Math.round(value * f) / f;
}
