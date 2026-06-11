import { describe, it, expect } from "vitest";
import {
  grids,
  deviceOrder,
  breakpointPx,
  deviceForWidth,
  resolveGrid,
  spanColumns,
  gridTemplate,
  resolveGridVars,
} from "@/system/grid";

describe("grids", () => {
  it("defines all four device classes", () => {
    expect(deviceOrder).toEqual(["mobile", "tablet", "desktop", "wide"]);
    for (const d of deviceOrder) {
      expect(grids[d]).toBeDefined();
    }
  });

  it("uses the canonical 4 / 8 / 12 column progression", () => {
    expect(grids.mobile.columns).toBe(4);
    expect(grids.tablet.columns).toBe(8);
    expect(grids.desktop.columns).toBe(12);
    expect(grids.wide.columns).toBe(12);
  });

  it("every device class meets the 44px constitution target floor", () => {
    for (const d of deviceOrder) {
      expect(grids[d].minTarget).toBeGreaterThanOrEqual(44);
    }
  });

  it("margins grow with device size", () => {
    const margins = deviceOrder.map((d) => grids[d].margin);
    for (let i = 1; i < margins.length; i++) {
      expect(margins[i]).toBeGreaterThanOrEqual(margins[i - 1]);
    }
  });

  it("pointer assumption flips fine on desktop", () => {
    expect(grids.mobile.pointer).toBe("coarse");
    expect(grids.desktop.pointer).toBe("fine");
  });
});

describe("breakpointPx", () => {
  it("derives numeric edges from the token strings", () => {
    expect(breakpointPx.sm).toBe(720);
    expect(breakpointPx.md).toBe(960);
    expect(breakpointPx.xl).toBe(1600);
  });
});

describe("deviceForWidth", () => {
  it("maps widths to the right class at the boundaries", () => {
    expect(deviceForWidth(375)).toBe("mobile");
    expect(deviceForWidth(719)).toBe("mobile");
    expect(deviceForWidth(720)).toBe("tablet");
    expect(deviceForWidth(959)).toBe("tablet");
    expect(deviceForWidth(960)).toBe("desktop");
    expect(deviceForWidth(1599)).toBe("desktop");
    expect(deviceForWidth(1600)).toBe("wide");
    expect(deviceForWidth(2560)).toBe("wide");
  });
});

describe("resolveGrid", () => {
  it("returns the full spec for a width", () => {
    expect(resolveGrid(390).columns).toBe(4);
    expect(resolveGrid(1280).columns).toBe(12);
  });
});

describe("spanColumns", () => {
  it("keeps proportions across devices — half is half", () => {
    expect(spanColumns("mobile", 1 / 2)).toBe(2); // 2 of 4
    expect(spanColumns("desktop", 1 / 2)).toBe(6); // 6 of 12
  });

  it("clamps to at least 1 and at most the column count", () => {
    expect(spanColumns("mobile", 0)).toBe(1);
    expect(spanColumns("mobile", 5)).toBe(4);
  });

  it("rounds a third sensibly", () => {
    expect(spanColumns("desktop", 1 / 3)).toBe(4); // 4 of 12
  });
});

describe("gridTemplate / resolveGridVars", () => {
  it("builds a repeat() template for the column count", () => {
    expect(gridTemplate("desktop")).toBe("repeat(12, minmax(0, 1fr))");
  });

  it("exposes --ls-grid- custom properties", () => {
    const vars = resolveGridVars("mobile");
    expect(vars["--ls-grid-columns"]).toBe("4");
    expect(vars["--ls-grid-margin"]).toBe("20px");
    expect(vars["--ls-grid-template"]).toContain("repeat(4");
    for (const key of Object.keys(vars)) {
      expect(key.startsWith("--ls-grid-")).toBe(true);
    }
  });

  it("desktop caps content width, mobile is fluid", () => {
    expect(resolveGridVars("desktop")["--ls-grid-max"]).toBe("1360px");
    expect(resolveGridVars("mobile")["--ls-grid-max"]).toBe("100%");
  });
});
