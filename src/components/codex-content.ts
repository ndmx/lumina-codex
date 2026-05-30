import type { EraKey } from "@/system/eras";

export type { EraKey };

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

export type PrincipleDossier = {
  principleKey: Principle["key"];
  chapterName: string;
  opening: string;
  atmosphere: string;
  conductNotes: string[];
  sceneBehaviors: string[];
  copyNotes: string[];
  impactNote: string;
};

export { eraList as eras } from "@/system/eras";

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
    lede:
      "Balance should feel alive, not static. The codex starts in perfect alignment, then slips into controlled tension before returning to poise.",
    body:
      "This exhibit is about restraint under pressure. The orb brightens, the satellites tighten their spacing, and the whole system demonstrates that symmetry is most interesting at the moment it nearly breaks.",
    sceneCue: "Lock the chamber, trigger the fracture pulse, and let the aura restore the centerline.",
    narrativeCue: "Use this chapter when the homepage needs to feel ceremonial and exact.",
    recommendedEra: "atelier",
    recommendedEraLabel: "Atelier",
  },
  {
    principleKey: "contrast",
    title: "Hierarchy becomes physical when light starts arguing with shadow.",
    lede:
      "Contrast is not decoration here. It is a directional force that pushes one object forward and casts everything else into sharper relief.",
    body:
      "In this exhibit the chamber behaves more like a stage set than a sculpture. The lighting splits harder, the backdrop carries warmer opposition, and the active satellite becomes an unmistakable focal point.",
    sceneCue:
      "Drive the secondary glow harder, advance the active satellite, and sharpen the luminous split in the chamber.",
    narrativeCue:
      "Use this chapter when the page should feel decisive, graphic, and unmistakably intentional.",
    recommendedEra: "brutalist",
    recommendedEraLabel: "Cyber-Brutalist",
  },
  {
    principleKey: "rhythm",
    title: "Motion becomes structure once repetition finds its cadence.",
    lede:
      "Rhythm is the chapter where the codex stops posing and starts breathing. Timing, recurrence, and suspension become the composition.",
    body:
      "The scene leans into oscillation here: orbital trails feel more musical, the chamber rise becomes more noticeable, and the page itself should feel like it is moving in measured phrases instead of isolated interactions.",
    sceneCue:
      "Increase orbital cadence, pulse the field in waves, and let the chapter feel like a visual metronome.",
    narrativeCue:
      "Use this chapter when you want the experience to feel kinetic without becoming chaotic.",
    recommendedEra: "memphis",
    recommendedEraLabel: "Memphis",
  },
  {
    principleKey: "unity",
    title: "The system resolves when every part agrees to speak as one organism.",
    lede:
      "Unity is where the portfolio stops reading as an arrangement of features and starts reading as a single living point of view.",
    body:
      "This exhibit draws the codex inward. Materials, orbit paths, and copy all reinforce the same idea: variation matters most when it still feels authored by one mind and one atmosphere.",
    sceneCue:
      "Pull the chamber inward, soften the separation between parts, and make the field feel collectively tuned.",
    narrativeCue:
      "Use this chapter when the page should feel mature, coherent, and fully composed.",
    recommendedEra: "atelier",
    recommendedEraLabel: "Atelier",
  },
];

export const principleDossiers: PrincipleDossier[] = [
  {
    principleKey: "balance",
    chapterName: "Axis Chamber",
    opening:
      "Balance opens like a ritual. The room quiets, the geometry holds its line, and the visitor gets one long second to feel how fragile precision actually is.",
    atmosphere:
      "Warm light, suspended dust, and almost perfect alignment. The beauty is in the near-break, not the stillness.",
    conductNotes: [
      "Let the orb lock into center before any fracture energy appears.",
      "Keep camera movement slow so the tension reads as intentional, not cinematic noise.",
      "Restore symmetry with grace instead of a hard reset.",
    ],
    sceneBehaviors: [
      "Tighten orbital spacing and reduce lateral drift.",
      "Run the balance pulse with a clean fracture flash and measured restoration.",
      "Hold bloom at a ceremonial intensity instead of pure spectacle.",
    ],
    copyNotes: [
      "Use language that sounds exact, poised, and slightly reverent.",
      "Keep sentence rhythm calm so the visual break lands harder.",
      "Describe restoration as composure, not correction.",
    ],
    impactNote: "Best for opening the site or resetting the visitor's eye after a louder chapter.",
  },
  {
    principleKey: "contrast",
    chapterName: "Split-Field Stage",
    opening:
      "Contrast turns the atelier into a stage picture. One object insists on being seen, while the rest of the world sharpens around that demand.",
    atmosphere:
      "Hot highlights, denser shadow, and a field that feels divided by intention instead of accident.",
    conductNotes: [
      "Advance the active satellite enough to feel undeniable, but never gimmicky.",
      "Use darker edge falloff so the chamber feels cut by light.",
      "Let the hierarchy stay legible even when the copy gets quieter.",
    ],
    sceneBehaviors: [
      "Increase light separation and push foreground depth harder.",
      "Sharpen the glow split between aura and shadow.",
      "Hold the focal object in front of the scene for an extra beat.",
    ],
    copyNotes: [
      "Use directional verbs and cleaner statements.",
      "Keep the tone decisive and graphic.",
      "Treat contrast as force, not styling.",
    ],
    impactNote: "Best for moments where the site needs conviction, hierarchy, and unmistakable focus.",
  },
  {
    principleKey: "rhythm",
    chapterName: "Cadence Loop",
    opening:
      "Rhythm is where the codex starts breathing in visible phrases. Repetition stops being a pattern and starts acting like a score.",
    atmosphere:
      "Pulse, recurrence, and a suspended sense of forward motion. The chamber should feel musical, never frantic.",
    conductNotes: [
      "Let motion arrive in phrases instead of constant movement.",
      "Use orbital trails as timing marks, not decoration.",
      "Allow pauses so the eye can hear the beat.",
    ],
    sceneBehaviors: [
      "Increase cadence in the field and orbital trails.",
      "Introduce wave-based movement through the chamber floor and backdrop.",
      "Keep the pulse elastic so it feels alive on repeat.",
    ],
    copyNotes: [
      "Write in measured lines with a little momentum.",
      "Use repetition sparingly so the cadence feels intentional.",
      "Favor phrases that suggest tempo over speed.",
    ],
    impactNote: "Best for the middle of the experience when the site should feel kinetic and memorable.",
  },
  {
    principleKey: "unity",
    chapterName: "Convergence Room",
    opening:
      "Unity closes distance. Instead of separate effects competing for attention, the entire room starts behaving like one authored sentence.",
    atmosphere:
      "Softer separation, cohesive material response, and a chamber that feels collectively tuned.",
    conductNotes: [
      "Draw the system inward before increasing any spectacle.",
      "Make coherence visible in spacing, tone, and copy density.",
      "Keep variation alive, but subordinate it to the whole.",
    ],
    sceneBehaviors: [
      "Reduce field separation and pull the satellites into shared orbit logic.",
      "Unify the aura, fog, and trail response so they feel authored by one hand.",
      "Hold camera drift steady and mature.",
    ],
    copyNotes: [
      "Use mature, complete language with less flourish.",
      "Favor coherence over novelty in the prose.",
      "Describe the system as one organism, not many parts.",
    ],
    impactNote: "Best for moments where the page should feel resolved, confident, and complete.",
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
