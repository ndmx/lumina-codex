"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { eras, principles, type EraKey } from "@/components/codex-content";
import { CodexScene } from "@/components/codex-scene";

type ChamberStyle = CSSProperties;
type SceneMode = "preview" | "theater";

type CodexChamberProps = {
  selectedEra: EraKey;
  onSelectEra: (era: EraKey) => void;
  activePrincipleKey: string;
  onSelectPrinciple: (principleKey: string) => void;
  balanceCycle: number;
  transitionCycle: number;
  sceneMode: SceneMode;
  sceneCue: string;
  chapterOverlayOpen: boolean;
};

const eraClassMap: Record<EraKey, string> = {
  atelier: "lumina-chamber--atelier",
  memphis: "lumina-chamber--memphis",
  brutalist: "lumina-chamber--brutalist",
};

const interactionNotes: Record<string, string> = {
  balance: "Balance now runs a replayable lock, fracture, restoration, and chapter alignment cycle inside the live scene.",
  contrast: "Contrast pushes the active satellite forward, sharpens chamber opposition, and now cuts a stronger chapter field through the scene.",
  rhythm: "Rhythm turns the satellite field into a pulsing cadence with synchronized vertical motion and chapter-driven loop energy.",
  unity: "Unity draws the system inward so the chamber behaves like one organism instead of isolated objects, especially in full chapter mode.",
};

export function CodexChamber({
  selectedEra,
  onSelectEra,
  activePrincipleKey,
  onSelectPrinciple,
  balanceCycle,
  transitionCycle,
  sceneMode,
  sceneCue,
  chapterOverlayOpen,
}: CodexChamberProps) {
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.32 });
  const [liteMode, setLiteMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activePrinciple =
    principles.find((principle) => principle.key === activePrincipleKey) ?? principles[0];
  const activeEra = eras.find((era) => era.key === selectedEra) ?? eras[0];
  const scrollPercent = Math.round(scrollProgress * 100);

  const chamberStyle = useMemo(
    () =>
      ({
        ["--pointer-x" as string]: String(pointer.x),
        ["--pointer-y" as string]: String(pointer.y),
        ["--accent-color" as string]: activePrinciple.accent,
      }) as ChamberStyle,
    [activePrinciple.accent, pointer.x, pointer.y],
  );

  const liveAnnouncement = useMemo(
    () =>
      `${activePrinciple.name} active in ${activeEra.name}. ${sceneMode === "theater" ? "Theater mode active." : "Preview mode active."} ${chapterOverlayOpen ? "Full chapter open." : "Chapter shell closed."} ${isTransitioning ? "Transition live." : "Transition settled."} ${interactionNotes[activePrincipleKey]} ${
        liteMode ? "Lite scene active." : "Full scene active."
      } Narrative depth ${scrollPercent} percent.`,
    [
      activeEra.name,
      activePrinciple.name,
      activePrincipleKey,
      chapterOverlayOpen,
      isTransitioning,
      liteMode,
      sceneMode,
      scrollPercent,
    ],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateViewportState() {
      const nextLiteMode = media.matches || window.innerWidth < 900;
      const maxScroll = Math.max(window.innerHeight * 1.2, 1);
      const nextProgress = Math.min(window.scrollY / maxScroll, 1);

      startTransition(() => {
        setLiteMode(nextLiteMode);
        setScrollProgress(nextProgress);
      });
    }

    updateViewportState();
    media.addEventListener("change", updateViewportState);
    window.addEventListener("resize", updateViewportState);
    window.addEventListener("scroll", updateViewportState, { passive: true });

    return () => {
      media.removeEventListener("change", updateViewportState);
      window.removeEventListener("resize", updateViewportState);
      window.removeEventListener("scroll", updateViewportState);
    };
  }, []);

  useEffect(() => {
    if (transitionCycle === 0) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIsTransitioning(true);
    });
    const timeout = window.setTimeout(() => setIsTransitioning(false), 1150);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [transitionCycle]);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setPointer({ x, y });
  }

  return (
    <section
      className={[
        "lumina-chamber",
        eraClassMap[selectedEra],
        isTransitioning ? "is-transitioning" : "",
      ].join(" ")}
      style={chamberStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointer({ x: 0.5, y: 0.32 })}
      aria-labelledby="codex-heading"
      data-scene-mode={sceneMode}
      data-transitioning={isTransitioning ? "true" : "false"}
    >
      <p className="lumina-sr-only" aria-live="polite">
        {liveAnnouncement}
      </p>

      <div className="lumina-chamber__glow" />
      <div className="lumina-chamber__mist" />
      <div className="lumina-chamber__grid" />

      <div className="lumina-chamber__panel">
        <div className="lumina-chamber__controls">
          <div>
            <p className="lumina-kicker">Era conductor</p>
            <h2 id="codex-heading" className="lumina-panel-title">
              Codex Chamber
            </h2>
          </div>

          <div className="lumina-toggle-group" role="tablist" aria-label="Select an era for the chamber">
            {eras.map((era) => (
              <button
                key={era.key}
                type="button"
                role="tab"
                aria-selected={selectedEra === era.key}
                className={selectedEra === era.key ? "is-active" : undefined}
                onClick={() => onSelectEra(era.key)}
              >
                {era.name}
              </button>
            ))}
          </div>
        </div>

        <div className="lumina-chamber__viewport">
          <div className="lumina-chamber__hud" aria-hidden="true">
            <span>{sceneMode === "theater" ? "Theater mode" : "Preview mode"}</span>
            <span>{isTransitioning ? "Transition live" : `Depth ${scrollPercent}%`}</span>
            <span>{chapterOverlayOpen ? "Chapter live" : liteMode ? "Lite scene" : "Full scene"}</span>
          </div>

          <CodexScene
            era={selectedEra}
            activePrincipleKey={activePrincipleKey}
            balanceCycle={balanceCycle}
            transitionCycle={transitionCycle}
            liteMode={liteMode}
            pointer={pointer}
            scrollProgress={scrollProgress}
            sceneMode={sceneMode}
            chapterOverlayOpen={chapterOverlayOpen}
          />

          {principles.map((principle) => {
            const isActive = principle.key === activePrincipleKey;
            const buttonClassName = [
              "lumina-satellite",
              principle.className,
              isActive ? "is-active" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={principle.key}
                type="button"
                className={buttonClassName}
                onClick={() => onSelectPrinciple(principle.key)}
                aria-pressed={isActive}
                aria-label={`${principle.name} satellite`}
              >
                <span className="lumina-satellite__shape" />
                <span className="lumina-satellite__meta">
                  <span className="lumina-satellite__name">{principle.name}</span>
                  <span className="lumina-satellite__shape-label">{principle.shape}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="lumina-chamber__footer">
          <div className="lumina-status">
            <p className="lumina-kicker">Current principle</p>
            <h3>{activePrinciple.name}</h3>
            <p>{interactionNotes[activePrincipleKey]}</p>
          </div>

          <div className="lumina-era-note">
            <p className="lumina-kicker">Scene cue</p>
            <h3>{sceneMode === "theater" ? "Exhibit mode engaged" : activeEra.mood}</h3>
            <p>{sceneMode === "theater" ? sceneCue : activeEra.descriptor}</p>
            <p className="lumina-render-note">
              {isTransitioning ? "Transition live" : liteMode ? "Lite scene active" : "Full scene active"} • narrative depth {scrollPercent}%.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
