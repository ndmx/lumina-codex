/**
 * Lumina era/theme system.
 *
 * Eras are the top-level atmosphere modes that every Lumina product can adopt.
 * Each era maps to a complete token override set — accent colors, glow tints,
 * and background tone — that shifts the whole product's mood without replacing
 * the underlying primitive palette.
 *
 * New products: pick a defaultEra in your registry entry. If your product needs
 * a tone that doesn't exist here, propose a new era by adding to this file and
 * logging the decision in docs/system/improvement-log.md.
 */

import { colorPrimitives } from "./tokens.js";

export type EraKey = "atelier" | "memphis" | "brutalist";

export type Era = {
  key: EraKey;
  name: string;
  mood: string;
  descriptor: string;
  backgroundTone: "warm" | "neutral" | "cool";
  accent: {
    primary: string;
    secondary: string;
    onPrimary: string;
  };
  glow: {
    top: string;
    mid: string;
  };
};

export const eras: Record<EraKey, Era> = {
  atelier: {
    key: "atelier",
    name: "Atelier",
    mood: "Warm luminous fog",
    descriptor: "The north-star atmosphere pulled from your reference frames.",
    backgroundTone: "warm",
    accent: {
      primary: colorPrimitives.aura,
      secondary: colorPrimitives.spark,
      onPrimary: "#071010",
    },
    glow: {
      top: "rgba(255, 244, 232, 0.56)",
      mid: "rgba(115, 242, 223, 0.18)",
    },
  },
  memphis: {
    key: "memphis",
    name: "Memphis",
    mood: "Playful voltage",
    descriptor: "The chamber becomes punchier, lighter, and more irreverent.",
    backgroundTone: "neutral",
    accent: {
      primary: "#fff878",
      secondary: "#ffb9e3",
      onPrimary: "#1a1200",
    },
    glow: {
      top: "rgba(255, 185, 227, 0.26)",
      mid: "rgba(255, 248, 120, 0.18)",
    },
  },
  brutalist: {
    key: "brutalist",
    name: "Cyber-Brutalist",
    mood: "Wireframe tension",
    descriptor: "Sharper geometry, deeper shadows, and a colder electric pulse.",
    backgroundTone: "cool",
    accent: {
      primary: colorPrimitives.aura,
      secondary: "#d6e3ff",
      onPrimary: "#071010",
    },
    glow: {
      top: "rgba(214, 227, 255, 0.12)",
      mid: "rgba(115, 242, 223, 0.10)",
    },
  },
} as const;

export const eraList: Era[] = Object.values(eras);

export const defaultEra: EraKey = "atelier";
