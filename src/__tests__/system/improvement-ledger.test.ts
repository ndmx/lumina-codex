import { describe, it, expect } from "vitest";
import { recordFeedback } from "@/system/feedback";
import {
  serializeEvent,
  appendEvent,
  parseLedger,
  parseLedgerStrict,
  summarize,
  targetKey,
} from "@/system/improvement-ledger";

function ev(productId: string, kind: Parameters<typeof recordFeedback>[0]["kind"], ref: string) {
  return recordFeedback({
    productId,
    kind,
    target: { kind: "concept", ref },
    detail: "test",
    at: "2026-05-30T00:00:00.000Z",
  });
}

describe("serialize / append / parse roundtrip", () => {
  it("round-trips events through JSONL", () => {
    const a = ev("p1", "gap", "Reminder");
    const b = ev("p2", "works", "Reminder");
    let ledger = "";
    ledger = appendEvent(ledger, a);
    ledger = appendEvent(ledger, b);
    const parsed = parseLedger(ledger);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].id).toBe(a.id);
    expect(parsed[1].id).toBe(b.id);
  });

  it("serializeEvent produces single-line JSON", () => {
    const line = serializeEvent(ev("p", "gap", "X"));
    expect(line).not.toContain("\n");
    expect(JSON.parse(line).productId).toBe("p");
  });

  it("a corrupt line never poisons the rest of the ledger", () => {
    const good = serializeEvent(ev("p", "gap", "X"));
    const text = `${good}\n{ not json\n{"id":"x"}\n${good}\n`;
    const { events, skipped } = parseLedgerStrict(text);
    expect(events).toHaveLength(2); // two good lines
    expect(skipped).toBe(2); // malformed + non-event
  });

  it("ignores blank lines", () => {
    expect(parseLedger("\n\n  \n")).toHaveLength(0);
  });
});

describe("summarize", () => {
  it("counts by kind, product, and distinct products per target", () => {
    const events = [
      ev("p1", "gap", "Reminder"),
      ev("p2", "gap", "Reminder"),
      ev("p1", "works", "Reminder"),
      ev("p1", "override", "Accent"),
    ];
    const s = summarize(events);
    expect(s.total).toBe(4);
    expect(s.byKind.gap).toBe(2);
    expect(s.byKind.works).toBe(1);
    expect(s.byProduct.p1).toBe(3);
    // Reminder was reported by two distinct products
    expect(s.productsPerTarget["concept:Reminder"].size).toBe(2);
    expect(s.productsPerTarget["concept:Accent"].size).toBe(1);
  });
});

describe("targetKey", () => {
  it("builds a stable kind:ref key, defaulting ref to *", () => {
    expect(targetKey(ev("p", "gap", "Reminder"))).toBe("concept:Reminder");
    const noRef = recordFeedback({
      productId: "p",
      kind: "gap",
      target: { kind: "token" },
      detail: "x",
    });
    expect(targetKey(noRef)).toBe("token:*");
  });
});
