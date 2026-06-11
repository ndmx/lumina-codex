/**
 * Lumina responsive grid system.
 *
 * One column model, mapped per device class. This is how the system stays
 * *consistent* across phone, tablet, laptop, and wide desktop: every surface
 * lays out on the same conceptual grid, only the column count, margin, and
 * gutter change as the viewport grows. A card that spans "half" always spans
 * half — on mobile that is 2 of 4 columns, on desktop 6 of 12.
 *
 * Breakpoints come from tokens.ts so there is a single source of truth shared
 * with the CSS media queries in globals.css (sm 720 / md 960 / lg 1280 / xl 1600).
 */

import { breakpoints } from "./tokens.js";

export type DeviceClass = "mobile" | "tablet" | "desktop" | "wide";

export type GridSpec = {
  device: DeviceClass;
  /** Number of layout columns at this device class. */
  columns: number;
  /** Outer page margin (gutter to the viewport edge), in px. */
  margin: number;
  /** Space between columns, in px. */
  gutter: number;
  /** Max content width the grid is allowed to grow to, in px (null = fluid). */
  maxContentWidth: number | null;
  /** Minimum comfortable interactive target on this class, in px. */
  minTarget: number;
  /** Primary input assumption — drives hover vs. press affordances. */
  pointer: "coarse" | "fine";
};

const px = (value: string) => parseInt(value, 10);

// Numeric breakpoint edges, derived from the token strings.
export const breakpointPx = {
  sm: px(breakpoints.sm), // 720
  md: px(breakpoints.md), // 960
  lg: px(breakpoints.lg), // 1280
  xl: px(breakpoints.xl), // 1600
} as const;

// ─── The grid map ─────────────────────────────────────────────────────────────

export const grids: Record<DeviceClass, GridSpec> = {
  mobile: {
    device: "mobile",
    columns: 4,
    margin: 20,
    gutter: 16,
    maxContentWidth: null,
    minTarget: 44, // Lumina constitution target floor
    pointer: "coarse",
  },
  tablet: {
    device: "tablet",
    columns: 8,
    margin: 32,
    gutter: 20,
    maxContentWidth: null,
    minTarget: 44,
    pointer: "coarse",
  },
  desktop: {
    device: "desktop",
    columns: 12,
    margin: 48,
    gutter: 24,
    maxContentWidth: 1360,
    minTarget: 44,
    pointer: "fine",
  },
  wide: {
    device: "wide",
    columns: 12,
    margin: 80,
    gutter: 32,
    maxContentWidth: 1360,
    minTarget: 44,
    pointer: "fine",
  },
};

export const deviceOrder: DeviceClass[] = ["mobile", "tablet", "desktop", "wide"];

// ─── Resolution helpers ───────────────────────────────────────────────────────

/** Which device class a given viewport width belongs to. */
export function deviceForWidth(width: number): DeviceClass {
  if (width < breakpointPx.sm) return "mobile";
  if (width < breakpointPx.md) return "tablet";
  if (width < breakpointPx.xl) return "desktop";
  return "wide";
}

/** The full grid spec for a viewport width. */
export function resolveGrid(width: number): GridSpec {
  return grids[deviceForWidth(width)];
}

/**
 * Translate a semantic span fraction into a concrete column count for a device,
 * so "half" stays "half" everywhere. Always clamps to [1, columns].
 */
export function spanColumns(device: DeviceClass, fraction: number): number {
  const { columns } = grids[device];
  const span = Math.round(columns * fraction);
  return Math.min(columns, Math.max(1, span));
}

/** CSS `grid-template-columns` value for a device class. */
export function gridTemplate(device: DeviceClass): string {
  return `repeat(${grids[device].columns}, minmax(0, 1fr))`;
}

/** Flatten a grid spec into CSS custom properties (`--ls-grid-*`). */
export function resolveGridVars(device: DeviceClass): Record<string, string> {
  const spec = grids[device];
  return {
    "--ls-grid-device": spec.device,
    "--ls-grid-columns": String(spec.columns),
    "--ls-grid-margin": `${spec.margin}px`,
    "--ls-grid-gutter": `${spec.gutter}px`,
    "--ls-grid-target": `${spec.minTarget}px`,
    "--ls-grid-max": spec.maxContentWidth ? `${spec.maxContentWidth}px` : "100%",
    "--ls-grid-template": gridTemplate(spec.device),
  };
}
