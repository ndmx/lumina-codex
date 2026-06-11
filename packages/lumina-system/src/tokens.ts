/**
 * Lumina design token primitives.
 *
 * This file is the single canonical source for all design values.
 * The CSS custom properties in globals.css must mirror these values.
 *
 * Any project in the Lumina system derives its base from here.
 * To extend: import what you need and override in a public design variation or
 * private consuming app.
 */

// ─── Color Primitives ────────────────────────────────────────────────────────

export const colorPrimitives = {
  void: "#06070a",
  ink: "#101217",
  ivory: "#f5eee5",
  aura: "#3c9b91",
  auraElectric: "#73f2df",
  spark: "#ff7d60",
  mist: "rgba(255, 243, 230, 0.5)",
  cyan: "#8de8ff",
  sand: "#f2d8b4",
  pearl: "#f8f5ef",
  chrome: "#cfd6dc",
  steel: "#8e98a3",
  marble: "#e7e2da",
  graphite: "#111619",
} as const;

// Semantic aliases — describes intent, not appearance
export const colorSemantic = {
  background: colorPrimitives.void,
  surface: colorPrimitives.ink,
  text: {
    primary: colorPrimitives.ivory,
    muted: "rgba(245, 238, 229, 0.55)",
    subtle: "rgba(245, 238, 229, 0.48)",
    faint: "rgba(245, 238, 229, 0.32)",
  },
  accent: {
    primary: colorPrimitives.aura,
    secondary: colorPrimitives.spark,
  },
  border: {
    subtle: "rgba(255, 255, 255, 0.08)",
    visible: "rgba(255, 255, 255, 0.12)",
    strong: "rgba(255, 255, 255, 0.28)",
  },
  overlay: {
    light: "rgba(255, 255, 255, 0.04)",
    medium: "rgba(255, 255, 255, 0.08)",
    heavy: "rgba(255, 255, 255, 0.16)",
  },
} as const;

// Material cues for image-led surfaces. These are not a mandate to use literal
// textures; they are stable names for the families Lumina has learned from
// shipped apps: chrome/steel/pearl/marble surfaces behind nearly-clear blocks.
export const materialColors = {
  pearl: {
    base: colorPrimitives.pearl,
    wash: "rgba(248, 245, 239, 0.58)",
    line: "rgba(55, 62, 68, 0.14)",
  },
  chrome: {
    base: colorPrimitives.chrome,
    wash: "rgba(255, 255, 255, 0.34)",
    line: "rgba(80, 92, 104, 0.18)",
  },
  steel: {
    base: colorPrimitives.steel,
    wash: "rgba(255, 255, 255, 0.24)",
    line: "rgba(30, 38, 46, 0.22)",
  },
  marble: {
    base: colorPrimitives.marble,
    wash: "rgba(255, 252, 247, 0.44)",
    line: "rgba(72, 62, 48, 0.14)",
  },
  graphiteGlass: {
    base: colorPrimitives.graphite,
    wash: "rgba(255, 255, 255, 0.08)",
    line: "rgba(239, 248, 248, 0.18)",
  },
} as const;

// Functional colors are domain roles, not brand accents. Safety/reporting
// interfaces need vivid alert/status language while the Lumina brand accent
// stays calm and non-alarming.
export const roleColors = {
  brand: {
    primary: colorPrimitives.aura,
    secondary: colorPrimitives.spark,
    electric: colorPrimitives.auraElectric,
  },
  status: {
    success: "#1e7a4d",
    warning: "#b07d14",
    danger: "#c8102e",
    info: "#2f6f9f",
  },
  content: {
    memory: "#4f75b8",
    place: colorPrimitives.aura,
    people: "#8a72b8",
    plan: "#6f7f9b",
  },
} as const;

export const shadows = {
  atmosphere: "0 32px 120px rgba(0, 0, 0, 0.42)",
  glow: {
    aura: "0 14px 42px rgba(60, 155, 145, 0.18)",
    auraElectric: "0 14px 50px rgba(115, 242, 223, 0.18)",
    spark: "0 14px 50px rgba(255, 125, 96, 0.20)",
  },
} as const;

// ─── Spacing Scale (4px base) ─────────────────────────────────────────────────

export const spacing = {
  "0": "0",
  "1": "0.25rem",
  "2": "0.5rem",
  "3": "0.75rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",
  "10": "2.5rem",
  "12": "3rem",
  "14": "3.5rem",
  "16": "4rem",
  "20": "5rem",
  "24": "6rem",
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const typography = {
  family: {
    display: '"Cormorant Garamond", "Times New Roman", Georgia, serif',
    body: '"Manrope", "Segoe UI", system-ui, sans-serif',
  },
  size: {
    "2xs": "0.625rem",
    xs: "0.72rem",
    sm: "0.875rem",
    base: "1rem",
    md: "1.05rem",
    lg: "1.15rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  weight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  leading: {
    compressed: "0.92",
    tight: "1.1",
    snug: "1.25",
    normal: "1.5",
    relaxed: "1.625",
    loose: "1.95",
  },
  tracking: {
    tight: "-0.04em",
    normal: "0",
    wide: "0.2em",
    wider: "0.24em",
    widest: "0.28em",
  },
} as const;

// ─── Motion ───────────────────────────────────────────────────────────────────

export const motion = {
  duration: {
    instant: "80ms",
    fast: "160ms",
    normal: "220ms",
    slow: "480ms",
    slower: "760ms",
    slowest: "1200ms",
  },
  easing: {
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

// ─── Layout ───────────────────────────────────────────────────────────────────

export const radii = {
  none: "0",
  sm: "0.375rem",
  base: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.4rem",
  "2xl": "2.25rem",
  pill: "999px",
} as const;

export const breakpoints = {
  sm: "720px",
  md: "960px",
  lg: "1280px",
  xl: "1600px",
} as const;

export const layers = {
  base: 0,
  raised: 1,
  dropdown: 50,
  overlay: 100,
  modal: 200,
  toast: 300,
  tooltip: 400,
} as const;

// ─── Convenience re-export ────────────────────────────────────────────────────

export const tokens = {
  color: { ...colorPrimitives, semantic: colorSemantic, material: materialColors, role: roleColors },
  shadows,
  spacing,
  typography,
  motion,
  radii,
  breakpoints,
  layers,
} as const;

export type Tokens = typeof tokens;
