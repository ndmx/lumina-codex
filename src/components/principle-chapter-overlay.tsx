"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  eras,
  principleDossiers,
  principles,
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
  onSelectChapter: (principleKey: string) => void;
  onPreviousChapter: () => void;
  onNextChapter: () => void;
};

const focusableSelector = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

export function PrincipleChapterOverlay({
  activeEra,
  activeExhibit,
  activePrinciple,
  sceneMode,
  onClose,
  onSetPreview,
  onSetTheater,
  onSelectChapter,
  onPreviousChapter,
  onNextChapter,
}: PrincipleChapterOverlayProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

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

  const activePrincipleIndex = useMemo(
    () => Math.max(0, principles.findIndex((entry) => entry.key === activePrinciple.key)),
    [activePrinciple.key],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    previousActiveElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNextChapter();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPreviousChapter();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusableElements = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) => !element.hasAttribute("disabled"),
      );

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousActiveElementRef.current?.focus();
    };
  }, [activePrinciple.key, onClose, onNextChapter, onPreviousChapter]);

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

      <div ref={panelRef} className="lumina-chapter-overlay__panel">
        <header className="lumina-chapter-overlay__header">
          <div>
            <p className="lumina-kicker">Entered exhibit</p>
            <h2 id="lumina-chapter-overlay-title">{dossier.chapterName}</h2>
            <p className="lumina-chapter-overlay__index">Chapter {activePrincipleIndex + 1} of {principles.length}</p>
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

        <nav className="lumina-chapter-overlay__sequence" aria-label="Principle chapter sequence">
          {principles.map((principle) => {
            const isActive = principle.key === activePrinciple.key;
            return (
              <button
                key={principle.key}
                type="button"
                className={["lumina-chapter-overlay__chip", isActive ? "is-active" : ""].join(" ")}
                aria-pressed={isActive}
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelectChapter(principle.key)}
              >
                <span>{String(principles.findIndex((entry) => entry.key === principle.key) + 1).padStart(2, "0")}</span>
                <strong>{principle.name}</strong>
              </button>
            );
          })}
        </nav>

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
          <div className="lumina-chapter-overlay__nav-actions">
            <button type="button" className="lumina-button lumina-button--secondary" onClick={onPreviousChapter}>
              Previous chapter
            </button>
            <button type="button" className="lumina-button lumina-button--secondary" onClick={onNextChapter}>
              Next chapter
            </button>
          </div>
          <div className="lumina-chapter-overlay__mode-actions">
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
          </div>
        </footer>
      </div>
    </div>
  );
}
