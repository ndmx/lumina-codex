/**
 * Lumina variation system — seeded, bounded randomness.
 *
 * The goal: two surfaces built from the same tokens should feel like *siblings*,
 * not clones — yet never drift off-brand. We get there with deterministic,
 * seeded variation rather than chaos:
 *
 *   - Deterministic: same seed → same result. A product's id, a user id, or a
 *     route can be the seed, so the variation is stable across reloads and
 *     reproducible in tests.
 *   - Bounded: every varied value is clamped to a tight, hand-picked range, so
 *     the accent only *breathes* a few degrees, radii only flex slightly, etc.
 *
 * This is the difference between "alive" and "random". The brand holds; the
 * fingerprint changes.
 */

// ─── Seeded PRNG ──────────────────────────────────────────────────────────────

/** Hash an arbitrary string seed into a 32-bit unsigned integer (FNV-1a). */
export function hashSeed(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, well-distributed PRNG. Returns () => [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Variation profile ────────────────────────────────────────────────────────

export type Variation = {
  seed: string;
  /** Accent hue rotation, degrees, range [-12, 12]. */
  accentHueShift: number;
  /** Corner-radius multiplier, range [0.85, 1.15]. */
  radiusScale: number;
  /** Spacing/density multiplier, range [0.92, 1.08]. */
  density: number;
  /** Glow/atmosphere intensity multiplier, range [0.7, 1.25]. */
  glow: number;
  /** Base decorative rotation, degrees, range [-6, 6]. */
  tilt: number;
  /** A handful of stable per-element jitters in [-1, 1] for decorative layout. */
  jitter: number[];
};

const lerp = (min: number, max: number, t: number) => min + (max - min) * t;
const round = (value: number, dp = 3) => {
  const f = 10 ** dp;
  return Math.round(value * f) / f;
};

/**
 * Build a stable variation profile from a seed string. Same seed → identical
 * profile, every time.
 */
export function createVariation(seed: string, jitterCount = 6): Variation {
  const rand = mulberry32(hashSeed(seed));
  return {
    seed,
    accentHueShift: round(lerp(-12, 12, rand())),
    radiusScale: round(lerp(0.85, 1.15, rand())),
    density: round(lerp(0.92, 1.08, rand())),
    glow: round(lerp(0.7, 1.25, rand())),
    tilt: round(lerp(-6, 6, rand())),
    jitter: Array.from({ length: jitterCount }, () => round(lerp(-1, 1, rand()))),
  };
}

// ─── Applying variation to color ──────────────────────────────────────────────

/**
 * Rotate the hue of a hex color by `deg` degrees, preserving its lightness and
 * saturation. Used to nudge an era accent without leaving its family.
 */
export function shiftHue(hex: string, deg: number): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return hex;
  const r = parseInt(m[1], 16) / 255;
  const g = parseInt(m[2], 16) / 255;
  const b = parseInt(m[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  h = (((h + deg) % 360) + 360) % 360;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const mm = l - c / 2;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (h < 60) [rp, gp, bp] = [c, x, 0];
  else if (h < 120) [rp, gp, bp] = [x, c, 0];
  else if (h < 180) [rp, gp, bp] = [0, c, x];
  else if (h < 240) [rp, gp, bp] = [0, x, c];
  else if (h < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];

  const toHex = (v: number) =>
    Math.round((v + mm) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(rp)}${toHex(gp)}${toHex(bp)}`;
}

/** Flatten a variation into CSS custom properties (`--ls-var-*`). */
export function resolveVariationVars(v: Variation): Record<string, string> {
  return {
    "--ls-var-radius-scale": String(v.radiusScale),
    "--ls-var-density": String(v.density),
    "--ls-var-glow": String(v.glow),
    "--ls-var-tilt": `${v.tilt}deg`,
  };
}
