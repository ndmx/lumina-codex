/**
 * Lumina feedback — the sensor of the recursive loop.
 *
 * A consuming agent doesn't just *read* Lumina; while it builds a real project
 * it reports back what happened: what worked, what it had to invent, what
 * clashed, what errored. Those reports are the raw signal the system improves
 * from. This module is the agent-facing API for producing normalized feedback
 * events.
 *
 * The package stays framework-agnostic and side-effect-free: `recordFeedback`
 * returns a validated event; *persisting* it (to a JSONL ledger, an HTTP
 * endpoint, etc.) is the host's job via a sink. See `improvement-ledger.ts`.
 */

/** What kind of signal the agent is sending. */
export type FeedbackKind =
  | "works" //      a token/pattern/component did its job cleanly
  | "friction" //   the agent had to infer a rule that should be explicit
  | "clash" //      two rules / tokens / concepts conflicted
  | "error" //      something broke at build or runtime
  | "override" //   the product overrode a system value
  | "gap" //        needed something the system doesn't provide
  | "proposal"; //  a concrete suggested change

export const feedbackKinds: readonly FeedbackKind[] = [
  "works",
  "friction",
  "clash",
  "error",
  "override",
  "gap",
  "proposal",
];

/** Which part of the system the signal is about. */
export type FeedbackTargetKind =
  | "token"
  | "scheme"
  | "grid"
  | "variation"
  | "platform-rule"
  | "concept"
  | "component"
  | "naming"
  | "other";

export type FeedbackSeverity = "info" | "low" | "medium" | "high";

export const severityWeight: Record<FeedbackSeverity, number> = {
  info: 0,
  low: 1,
  medium: 2,
  high: 3,
};

export type FeedbackTarget = {
  kind: FeedbackTargetKind;
  /** A specific reference, e.g. token "aura", concept "Shared Space". */
  ref?: string;
};

/** A normalized, validated feedback event — one entry in the ledger. */
export type FeedbackEvent = {
  id: string;
  at: string; // ISO 8601
  productId: string; // registry id, or "unregistered:<name>"
  kind: FeedbackKind;
  target: FeedbackTarget;
  severity: FeedbackSeverity;
  detail: string;
  suggestedChange?: string;
  agent?: string; // model/agent identifier
  systemVersion?: string; // @xlumina/system version built against
};

/** What a caller supplies — the rest is derived/defaulted. */
export type FeedbackDraft = Omit<FeedbackEvent, "id" | "at" | "severity"> & {
  severity?: FeedbackSeverity;
  at?: string;
};

// ─── Construction ─────────────────────────────────────────────────────────────

// Small content hash (FNV-1a) so an event id is stable for identical content
// and the same instant — handy for dedupe and reproducible tests.
function contentHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

export class FeedbackValidationError extends Error {}

/**
 * Build a validated feedback event from a draft. Throws
 * FeedbackValidationError on malformed input so bad signal never enters the
 * ledger silently.
 */
export function recordFeedback(draft: FeedbackDraft): FeedbackEvent {
  if (!draft || typeof draft !== "object") {
    throw new FeedbackValidationError("feedback draft must be an object");
  }
  if (!feedbackKinds.includes(draft.kind)) {
    throw new FeedbackValidationError(`unknown feedback kind: ${String(draft.kind)}`);
  }
  if (!draft.productId || typeof draft.productId !== "string") {
    throw new FeedbackValidationError("feedback requires a productId");
  }
  if (!draft.detail || typeof draft.detail !== "string") {
    throw new FeedbackValidationError("feedback requires a non-empty detail");
  }
  if (!draft.target || typeof draft.target.kind !== "string") {
    throw new FeedbackValidationError("feedback requires a target.kind");
  }

  const at = draft.at ?? new Date().toISOString();
  const severity = draft.severity ?? defaultSeverity(draft.kind);
  const id = `${draft.kind}-${contentHash(
    `${draft.productId}|${draft.kind}|${draft.target.kind}:${draft.target.ref ?? ""}|${draft.detail}|${at}`,
  )}`;

  return {
    id,
    at,
    productId: draft.productId,
    kind: draft.kind,
    target: { kind: draft.target.kind, ref: draft.target.ref },
    severity,
    detail: draft.detail,
    suggestedChange: draft.suggestedChange,
    agent: draft.agent,
    systemVersion: draft.systemVersion,
  };
}

/** A reasonable default severity per kind when the caller omits one. */
export function defaultSeverity(kind: FeedbackKind): FeedbackSeverity {
  switch (kind) {
    case "error":
      return "high";
    case "clash":
      return "medium";
    case "friction":
    case "gap":
    case "override":
      return "low";
    case "proposal":
    case "works":
    default:
      return "info";
  }
}

/** Type guard for runtime-sourced data (e.g. parsed JSON lines). */
export function isFeedbackEvent(value: unknown): value is FeedbackEvent {
  if (!value || typeof value !== "object") return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.at === "string" &&
    typeof e.productId === "string" &&
    typeof e.kind === "string" &&
    feedbackKinds.includes(e.kind as FeedbackKind) &&
    typeof e.detail === "string" &&
    typeof e.target === "object" &&
    e.target !== null
  );
}
