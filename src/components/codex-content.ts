export type EraKey = "atelier" | "memphis" | "brutalist";

export type Principle = {
  key: string;
  name: string;
  shape: string;
  eyebrow: string;
  blurb: string;
  statement: string;
  status: string;
  accent: string;
  className: string;
};

export const eras: {
  key: EraKey;
  name: string;
  mood: string;
  descriptor: string;
}[] = [
  {
    key: "atelier",
    name: "Atelier",
    mood: "Warm luminous fog",
    descriptor: "The north-star atmosphere pulled from your reference frames.",
  },
  {
    key: "memphis",
    name: "Memphis",
    mood: "Playful voltage",
    descriptor: "The chamber becomes punchier, lighter, and more irreverent.",
  },
  {
    key: "brutalist",
    name: "Cyber-Brutalist",
    mood: "Wireframe tension",
    descriptor: "Sharper geometry, deeper shadows, and a colder electric pulse.",
  },
];

export const principles: Principle[] = [
  {
    key: "balance",
    name: "Balance",
    shape: "Sphere",
    eyebrow: "Foundational principle",
    blurb: "Symmetry gives way to controlled fracture, then restores itself with intent.",
    statement: "Dynamic equilibrium achieved.",
    status: "Live scene sequence ready for interaction.",
    accent: "var(--color-aura)",
    className: "left-[2%] top-[15%] md:left-[8%] md:top-[19%]",
  },
  {
    key: "contrast",
    name: "Contrast",
    shape: "Torus",
    eyebrow: "Second sequence",
    blurb: "Light and shadow collide so hierarchy feels physical, not decorative.",
    statement: "Opposition sharpened into clarity.",
    status: "Lighting and position response wired into the chamber.",
    accent: "var(--color-spark)",
    className: "right-[0%] top-[12%] md:right-[6%] md:top-[17%]",
  },
  {
    key: "rhythm",
    name: "Rhythm",
    shape: "Cube",
    eyebrow: "Narrative motion",
    blurb: "Repetition, pulse, and pause give the codex its breathing cadence.",
    statement: "Motion tuned into a visual metronome.",
    status: "Pulse behavior and orbital timing are now active in the live scene.",
    accent: "#8de8ff",
    className: "right-[4%] bottom-[20%] md:right-[10%] md:bottom-[21%]",
  },
  {
    key: "unity",
    name: "Unity",
    shape: "Prism",
    eyebrow: "System logic",
    blurb: "Every piece feels related, even while materials and eras mutate around it.",
    statement: "One organism, many expressions.",
    status: "Scene-wide cohesion response and shared palette logic are in place.",
    accent: "#f2d8b4",
    className: "left-[4%] bottom-[22%] md:left-[12%] md:bottom-[20%]",
  },
];

export const milestones = [
  {
    title: "Milestone 1",
    body: "Codex foundation: typography, color system, chamber shell, and the first responsive atmosphere that already felt like the brand.",
  },
  {
    title: "Milestone 2",
    body: "Interaction system: principle selection, era switching, and the first full chamber choreography around Balance.",
  },
  {
    title: "Milestone 3",
    body: "Scene fidelity: React Three Fiber hero, particle field, post-processing, and a shader-driven aura tied to scroll depth.",
  },
  {
    title: "Milestone 4",
    body: "Narrative expansion: chapter-aware editorial flow, richer principle exhibits, and the path toward CMS-backed evolving codex entries.",
  },
];
