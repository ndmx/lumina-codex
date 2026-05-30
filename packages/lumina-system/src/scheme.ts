/**
 * Lumina scheme system — light and dark.
 *
 * A scheme is the *canvas* a product is painted on (paper vs. void). It is an
 * axis that is orthogonal to `eras` (eras.ts): an era supplies the accent mood,
 * a scheme supplies the surface/text/border foundation. Any era can render in
 * any scheme, which is why they are kept separate instead of baking "dark" into
 * the era definitions.
 *
 *   tokens.ts   →  raw primitives (single source of truth)
 *   scheme.ts   →  light | dark surface foundation (this file)
 *   eras.ts     →  accent + glow mood
 *   resolveSchemeVars(scheme, era)  →  flat CSS custom properties
 *
 * Output variables are prefixed `--ls-` (lumina-system) so they never collide
 * with the legacy `--color-*` properties used by the original dark globals.css.
 */

import { colorPrimitives } from "./tokens.js";
import { eras, type Era, type EraKey } from "./eras.js";

export type Scheme = "light" | "dark";

export type SchemeSurface = {
  scheme: Scheme;
  /** The page backdrop. */
  background: string;
  /** A raised card/panel surface. */
  surface: string;
  /** A further-raised surface (popover, active card). */
  surfaceRaised: string;
  text: {
    primary: string;
    muted: string;
    subtle: string;
    faint: string;
  };
  border: {
    subtle: string;
    visible: string;
    strong: string;
  };
  /** Translucent fills layered on top of surfaces. */
  overlay: {
    light: string;
    medium: string;
    heavy: string;
  };
  /** Atmospheric drop shadow tuned for the scheme. */
  shadow: string;
};

// ─── The two canonical schemes ────────────────────────────────────────────────

export const schemes: Record<Scheme, SchemeSurface> = {
  dark: {
    scheme: "dark",
    background: colorPrimitives.void,
    surface: "rgba(16, 18, 23, 0.92)",
    surfaceRaised: "rgba(255, 255, 255, 0.05)",
    text: {
      primary: colorPrimitives.ivory,
      muted: "rgba(245, 238, 229, 0.72)",
      subtle: "rgba(245, 238, 229, 0.55)",
      faint: "rgba(245, 238, 229, 0.34)",
    },
    border: {
      subtle: "rgba(255, 255, 255, 0.08)",
      visible: "rgba(255, 255, 255, 0.14)",
      strong: "rgba(255, 255, 255, 0.28)",
    },
    overlay: {
      light: "rgba(255, 255, 255, 0.04)",
      medium: "rgba(255, 255, 255, 0.08)",
      heavy: "rgba(255, 255, 255, 0.16)",
    },
    shadow: "0 32px 120px rgba(0, 0, 0, 0.42)",
  },
  light: {
    scheme: "light",
    // Warm paper, not clinical white — keeps the brand's ivory warmth.
    background: "#f3ece1",
    surface: "rgba(255, 252, 247, 0.92)",
    surfaceRaised: "rgba(255, 255, 255, 0.74)",
    text: {
      primary: "#15140f",
      muted: "rgba(21, 20, 15, 0.74)",
      subtle: "rgba(21, 20, 15, 0.56)",
      faint: "rgba(21, 20, 15, 0.36)",
    },
    border: {
      subtle: "rgba(21, 20, 15, 0.10)",
      visible: "rgba(21, 20, 15, 0.16)",
      strong: "rgba(21, 20, 15, 0.32)",
    },
    overlay: {
      light: "rgba(21, 20, 15, 0.03)",
      medium: "rgba(21, 20, 15, 0.06)",
      heavy: "rgba(21, 20, 15, 0.12)",
    },
    shadow: "0 28px 90px rgba(58, 44, 24, 0.18)",
  },
};

export const schemeList: SchemeSurface[] = Object.values(schemes);

export const defaultScheme: Scheme = "dark";

/** The opposite scheme — handy for toggles. */
export function invertScheme(scheme: Scheme): Scheme {
  return scheme === "dark" ? "light" : "dark";
}

// ─── Resolution ───────────────────────────────────────────────────────────────

export type SchemeVarMap = Record<`--ls-${string}`, string>;

/**
 * Flatten a (scheme × era) pair into the CSS custom properties the Lumina
 * system components read. This is the single bridge between the TS token brain
 * and the rendered surface — components never hardcode colors, they read these.
 */
export function resolveSchemeVars(scheme: Scheme, eraKey: EraKey): SchemeVarMap {
  const surface: SchemeSurface = schemes[scheme] ?? schemes[defaultScheme];
  const era: Era = eras[eraKey] ?? eras.atelier;

  return {
    "--ls-scheme": scheme,
    "--ls-era": era.key,

    "--ls-bg": surface.background,
    "--ls-surface": surface.surface,
    "--ls-surface-raised": surface.surfaceRaised,

    "--ls-text": surface.text.primary,
    "--ls-text-muted": surface.text.muted,
    "--ls-text-subtle": surface.text.subtle,
    "--ls-text-faint": surface.text.faint,

    "--ls-border": surface.border.subtle,
    "--ls-border-visible": surface.border.visible,
    "--ls-border-strong": surface.border.strong,

    "--ls-overlay": surface.overlay.light,
    "--ls-overlay-medium": surface.overlay.medium,
    "--ls-overlay-heavy": surface.overlay.heavy,

    "--ls-accent": era.accent.primary,
    "--ls-accent-2": era.accent.secondary,
    "--ls-on-accent": era.accent.onPrimary,

    "--ls-glow-top": era.glow.top,
    "--ls-glow-mid": era.glow.mid,

    "--ls-shadow": surface.shadow,
  };
}
