"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  eras,
  principleDossiers,
  type EraKey,
  type Principle,
  type PrincipleExhibit,
} from "@/components/codex-content";

type SceneMode = "preview" | "theater";

type PrincipleChapterOverlayProps = {
  activeEra: EraKey;
  activeExhibit: PrincipleExhibit;
  activePrinciple: Principle;
  sceneMode: SceneMode;
  onClose: () => void;
  onSetPreview: () => void;
  onSetTheater: (era?: EraKey) => void;
};

export function PrincipleChapterOverlay({
  activeEra,
  activeExhibit,
  activePrinciple,
  sceneMode,
  onClose,
  onSetPreview,
  onSetTheater,
}: PrincipleChapterOverlayProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const activeEraName = useMemo(
    () => eras.find((era) => era.key === activeEra)?.name ?? activeEra,
    [activeEra],
  );

  const dossier = useMemo(
    () =>
      principleDossiers.find((entry) => entry.principleKey === activePrinciple.key) ??
      principleDossiers[0],
    [activePrinciple.key],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="lumina-chapter-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lumina-chapter-overlay-title"
      aria-describedby="lumina-chapter-overlay-description"
      data-principle={activePrinciple.key}
      data-scene-mode={sceneMode}
    >
      <button
        type="button"
        className="lumina-chapter-overlay__backdrop"
        aria-label="Close chapter overlay"
        onClick={onClose}
      />

      <div className="lumina-chapter-overlay__panel">
        <header className="lumina-chapter-overlay__header">
          <div>
            <p className="lumina-kicker">Entered exhibit</p>
            <h2 id="lumina-chapter-overlay-title">{dossier.chapterName}</h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="lumina-chapter-overlay__close"
            onClick={onClose}
          >
            Close chapter
          </button>
        </header>

        <div className="lumina-chapter-overlay__intro">
          <p className="lumina-chapter-overlay__eyebrow">{activePrinciple.name} exhibit</p>
          <p id="lumina-chapter-overlay-description" className="lumina-chapter-overlay__lead">
            {activeExhibit.lede}
          </p>
          <p>{dossier.opening}</p>
        </div>

        <div className="lumina-chapter-overlay__layout">
          <article className="lumina-chapter-overlay__card lumina-chapter-overlay__card--wide">
            <p className="lumina-kicker">Atmosphere</p>
            <h3>{activeExhibit.title}</h3>
            <p>{dossier.atmosphere}</p>
            <p>{activeExhibit.body}</p>
          </article>

          <article className="lumina-chapter-overlay__card">
            <p className="lumina-kicker">Live state</p>
            <dl className="lumina-chapter-overlay__facts">
              <div>
                <dt>Active era</dt>
                <dd>{activeEraName}</dd>
              </div>
              <div>
                <dt>Scene mode</dt>
                <dd>{sceneMode === "theater" ? "Theater" : "Preview"}</dd>
              </div>
              <div>
                <dt>Primary cue</dt>
                <dd>{activeExhibit.sceneCue}</dd>
              </div>
              <div>
                <dt>Impact</dt>
                <dd>{dossier.impactNote}</dd>
              </div>
            </dl>
          </article>

          <article className="lumina-chapter-overlay__card">
            <p className="lumina-kicker">Scene behaviors</p>
            <ul className="lumina-chapter-overlay__list">
              {dossier.sceneBehaviors.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="lumina-chapter-overlay__card">
            <p className="lumina-kicker">Conduct notes</p>
            <ul className="lumina-chapter-overlay__list">
              {dossier.conductNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="lumina-chapter-overlay__card">
            <p className="lumina-kicker">Narrative notes</p>
            <p>{activeExhibit.narrativeCue}</p>
            <ul className="lumina-chapter-overlay__list">
              {dossier.copyNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>

        <footer className="lumina-chapter-overlay__actions">
          <button type="button" className="lumina-button lumina-button--secondary" onClick={onSetPreview}>
            Return to preview
          </button>
          <button type="button" className="lumina-button lumina-button--primary" onClick={() => onSetTheater()}>
            Intensify this chapter
          </button>
          <button
            type="button"
            className="lumina-button lumina-button--secondary"
            onClick={() => onSetTheater(activeExhibit.recommendedEra)}
          >
            Run in {activeExhibit.recommendedEraLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}
