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

export type PrincipleExhibit = {
  principleKey: Principle["key"];
  title: string;
  lede: string;
  body: string;
  sceneCue: string;
  narrativeCue: string;
  recommendedEra: EraKey;
  recommendedEraLabel: string;
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

export const principleExhibits: PrincipleExhibit[] = [
  {
    principleKey: "balance",
    title: "The chamber holds its breath before it fractures.",
    lede: "Balance should feel alive, not static. The codex starts in perfect alignment, then slips into controlled tension before returning to poise.",
    body: "This exhibit is about restraint under pressure. The orb brightens, the satellites tighten their spacing, and the whole system demonstrates that symmetry is most interesting at the moment it nearly breaks.",
    sceneCue: "Lock the chamber, trigger the fracture pulse, and let the aura restore the centerline.",
    narrativeCue: "Use this chapter when the homepage needs to feel ceremonial and exact.",
    recommendedEra: "atelier",
    recommendedEraLabel: "Atelier",
  },
  {
    principleKey: "contrast",
    title: "Hierarchy becomes physical when light starts arguing with shadow.",
    lede: "Contrast is not decoration here. It is a directional force that pushes one object forward and casts everything else into sharper relief.",
    body: "In this exhibit the chamber behaves more like a stage set than a sculpture. The lighting splits harder, the backdrop carries warmer opposition, and the active satellite becomes an unmistakable focal point.",
    sceneCue: "Drive the secondary glow harder, advance the active satellite, and sharpen the luminous split in the chamber.",
    narrativeCue: "Use this chapter when the page should feel decisive, graphic, and unmistakably intentional.",
    recommendedEra: "brutalist",
    recommendedEraLabel: "Cyber-Brutalist",
  },
  {
    principleKey: "rhythm",
    title: "Motion becomes structure once repetition finds its cadence.",
    lede: "Rhythm is the chapter where the codex stops posing and starts breathing. Timing, recurrence, and suspension become the composition.",
    body: "The scene leans into oscillation here: orbital trails feel more musical, the chamber rise becomes more noticeable, and the page itself should feel like it is moving in measured phrases instead of isolated interactions.",
    sceneCue: "Increase orbital cadence, pulse the field in waves, and let the chapter feel like a visual metronome.",
    narrativeCue: "Use this chapter when you want the experience to feel kinetic without becoming chaotic.",
    recommendedEra: "memphis",
    recommendedEraLabel: "Memphis",
  },
  {
    principleKey: "unity",
    title: "The system resolves when every part agrees to speak as one organism.",
    lede: "Unity is where the portfolio stops reading as an arrangement of features and starts reading as a single living point of view.",
    body: "This exhibit draws the codex inward. Materials, orbit paths, and copy all reinforce the same idea: variation matters most when it still feels authored by one mind and one atmosphere.",
    sceneCue: "Pull the chamber inward, soften the separation between parts, and make the field feel collectively tuned.",
    narrativeCue: "Use this chapter when the page should feel mature, coherent, and fully composed.",
    recommendedEra: "atelier",
    recommendedEraLabel: "Atelier",
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
