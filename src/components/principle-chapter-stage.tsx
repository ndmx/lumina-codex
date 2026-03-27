import { eras, type EraKey, type Principle, type PrincipleExhibit } from "@/components/codex-content";

type SceneMode = "preview" | "theater";

type PrincipleChapterStageProps = {
  activeEra: EraKey;
  activeExhibit: PrincipleExhibit;
  activePrinciple: Principle;
  sceneMode: SceneMode;
  onSetPreview: () => void;
  onSetTheater: (era?: EraKey) => void;
};

const chapterDetails: Record<
  Principle["key"],
  {
    chapterLabel: string;
    beats: string[];
    metricLabel: string;
    metricValue: string;
    tensionLabel: string;
    tensionValue: string;
  }
> = {
  balance: {
    chapterLabel: "Ceremonial alignment",
    beats: [
      "Lock the system into symmetry.",
      "Introduce a precise fracture moment.",
      "Let the chamber resolve without losing tension.",
    ],
    metricLabel: "Axis fidelity",
    metricValue: "99% aligned",
    tensionLabel: "Release curve",
    tensionValue: "Measured",
  },
  contrast: {
    chapterLabel: "Directional opposition",
    beats: [
      "Separate foreground from supporting field.",
      "Push the focal object closer to the visitor.",
      "Hold the split long enough to feel undeniable.",
    ],
    metricLabel: "Focal pull",
    metricValue: "+42 depth",
    tensionLabel: "Light split",
    tensionValue: "Hard edge",
  },
  rhythm: {
    chapterLabel: "Kinetic cadence",
    beats: [
      "Repeat the orbital phrase.",
      "Let the chamber breathe in visible intervals.",
      "Keep the pulse musical, never frantic.",
    ],
    metricLabel: "Cadence",
    metricValue: "3.4 bpm",
    tensionLabel: "Wave spacing",
    tensionValue: "Elastic",
  },
  unity: {
    chapterLabel: "System convergence",
    beats: [
      "Reduce the distance between parts.",
      "Make every surface feel authored by one hand.",
      "Leave variation intact without breaking coherence.",
    ],
    metricLabel: "Cohesion",
    metricValue: "Single voice",
    tensionLabel: "Field separation",
    tensionValue: "Softened",
  },
};

export function PrincipleChapterStage({
  activeEra,
  activeExhibit,
  activePrinciple,
  sceneMode,
  onSetPreview,
  onSetTheater,
}: PrincipleChapterStageProps) {
  const details = chapterDetails[activePrinciple.key];
  const eraName = eras.find((era) => era.key === activeEra)?.name ?? activeEra;

  return (
    <section
      className="lumina-chapter-stage"
      data-principle={activePrinciple.key}
      data-scene-mode={sceneMode}
      aria-label={`${activePrinciple.name} chapter stage`}
    >
      <div className="lumina-chapter-stage__intro">
        <p className="lumina-kicker">Authored chapter state</p>
        <h2>{details.chapterLabel}</h2>
        <p>{activeExhibit.narrativeCue}</p>
      </div>

      <div className="lumina-chapter-stage__layout">
        <article className="lumina-stage-card lumina-stage-card--primary">
          <p className="lumina-kicker">Chapter lead</p>
          <h3>{activeExhibit.title}</h3>
          <p>{activeExhibit.body}</p>
        </article>

        <article className="lumina-stage-card lumina-stage-card--metrics">
          <p className="lumina-kicker">System reading</p>
          <div className="lumina-stage-card__metric-grid">
            <div>
              <span>{details.metricLabel}</span>
              <strong>{details.metricValue}</strong>
            </div>
            <div>
              <span>{details.tensionLabel}</span>
              <strong>{details.tensionValue}</strong>
            </div>
            <div>
              <span>Active era</span>
              <strong>{eraName}</strong>
            </div>
            <div>
              <span>Scene mode</span>
              <strong>{sceneMode === "theater" ? "Theater" : "Preview"}</strong>
            </div>
          </div>
        </article>

        <article className="lumina-stage-card lumina-stage-card--beats">
          <p className="lumina-kicker">Chapter beats</p>
          <ol>
            {details.beats.map((beat) => (
              <li key={beat}>{beat}</li>
            ))}
          </ol>
        </article>

        <article className="lumina-stage-card lumina-stage-card--controls">
          <p className="lumina-kicker">Conduct this chapter</p>
          <p>{activeExhibit.sceneCue}</p>
          <div className="lumina-stage-card__controls">
            <button type="button" className="lumina-button lumina-button--secondary" onClick={onSetPreview}>
              Return to Preview
            </button>
            <button type="button" className="lumina-button lumina-button--primary" onClick={() => onSetTheater()}>
              Intensify This Chapter
            </button>
            <button
              type="button"
              className="lumina-button lumina-button--secondary"
              onClick={() => onSetTheater(activeExhibit.recommendedEra)}
            >
              Run in {activeExhibit.recommendedEraLabel}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
