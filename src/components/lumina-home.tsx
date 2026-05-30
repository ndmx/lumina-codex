"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { CodexChamber } from "@/components/codex-chamber";
import { PrincipleChapterOverlay } from "@/components/principle-chapter-overlay";
import { PrincipleChapterStage } from "@/components/principle-chapter-stage";
import {
  CodexScrollRail,
  codexChapters,
  type CodexChapterId,
} from "@/components/codex-scroll-rail";
import {
  eras,
  milestones,
  principleExhibits,
  principles,
  type EraKey,
} from "@/components/codex-content";

type SceneMode = "preview" | "theater";
type Scheme = "light" | "dark";

export function LuminaHome() {
  const [scheme, setScheme] = useState<Scheme>("dark");
  const [selectedEra, setSelectedEra] = useState<EraKey>("atelier");
  const [activePrincipleKey, setActivePrincipleKey] = useState("balance");
  const [balanceCycle, setBalanceCycle] = useState(1);
  const [transitionCycle, setTransitionCycle] = useState(0);
  const [activeChapterId, setActiveChapterId] = useState<CodexChapterId>("entry");
  const [pageProgress, setPageProgress] = useState(0);
  const [sceneMode, setSceneMode] = useState<SceneMode>("preview");
  const [chapterOverlayOpen, setChapterOverlayOpen] = useState(false);

  const activePrinciple = useMemo(
    () => principles.find((principle) => principle.key === activePrincipleKey) ?? principles[0],
    [activePrincipleKey],
  );
  const activePrincipleIndex = useMemo(
    () => Math.max(0, principles.findIndex((principle) => principle.key === activePrincipleKey)),
    [activePrincipleKey],
  );
  const activeExhibit = useMemo(
    () =>
      principleExhibits.find((exhibit) => exhibit.principleKey === activePrincipleKey) ??
      principleExhibits[0],
    [activePrincipleKey],
  );
  const activeEra = useMemo(
    () => eras.find((era) => era.key === selectedEra) ?? eras[0],
    [selectedEra],
  );

  const pageStyle = useMemo(
    () =>
      ({
        ["--page-progress" as string]: String(pageProgress),
        ["--active-principle-accent" as string]: activePrinciple.accent,
      }) as CSSProperties,
    [activePrinciple.accent, pageProgress],
  );

  // Initialize scheme from saved preference, falling back to the OS setting.
  // Runs post-mount so SSR (always dark) and first client render agree.
  // Storage access is guarded — it must never crash the page (private mode,
  // disabled storage, or a runtime without localStorage).
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage?.getItem("lumina-scheme") ?? null;
    } catch {
      saved = null;
    }
    const next: Scheme | null =
      saved === "light" || saved === "dark"
        ? saved
        : window.matchMedia?.("(prefers-color-scheme: light)").matches
          ? "light"
          : null;

    if (next) {
      startTransition(() => setScheme(next));
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage?.setItem("lumina-scheme", scheme);
    } catch {
      // Ignore — preference simply won't persist this session.
    }
  }, [scheme]);

  useEffect(() => {
    const observedSections = codexChapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          const nextId = visibleEntries[0].target.id as CodexChapterId;
          startTransition(() => {
            setActiveChapterId(nextId);
          });
        }
      },
      {
        rootMargin: "-20% 0px -45% 0px",
        threshold: [0.2, 0.35, 0.5, 0.65],
      },
    );

    function updateProgress() {
      const scrollableHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const nextProgress = Math.min(window.scrollY / scrollableHeight, 1);

      startTransition(() => {
        setPageProgress(nextProgress);
      });
    }

    observedSections.forEach((section) => observer.observe(section));
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  function focusCodex(
    principleKey: string,
    options?: { era?: EraKey; scrollToEntry?: boolean; sceneMode?: SceneMode },
  ) {
    if (principleKey !== activePrincipleKey) {
      setTransitionCycle((current) => current + 1);
    }

    setActivePrincipleKey(principleKey);

    if (options?.era) {
      setSelectedEra(options.era);
    }

    if (options?.sceneMode) {
      setSceneMode(options.sceneMode);
    }

    if (principleKey === "balance") {
      setBalanceCycle((current) => current + 1);
    }

    if (options?.scrollToEntry) {
      document.getElementById("entry")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function enterChapter(principleKey: string, options?: { era?: EraKey }) {
    focusCodex(principleKey, {
      era: options?.era,
      sceneMode: "theater",
      scrollToEntry: false,
    });
    setChapterOverlayOpen(true);
  }

  function moveChapter(direction: 1 | -1) {
    const total = principles.length;
    const nextIndex = (activePrincipleIndex + direction + total) % total;
    const nextPrinciple = principles[nextIndex];
    enterChapter(nextPrinciple.key);
  }

  function closeChapter() {
    setChapterOverlayOpen(false);
  }

  return (
    <main
      className="lumina-page"
      data-active-chapter={activeChapterId}
      data-scene-mode={sceneMode}
      data-scheme={scheme}
      data-overlay-open={chapterOverlayOpen ? "true" : "false"}
      style={pageStyle}
    >
      <div className="lumina-page__veil" />
      <div className="lumina-page__noise" />

      <div className="lumina-shell">
        <header className="lumina-nav">
          <div>
            <p className="lumina-brand">Lumina Codex</p>
            <p className="lumina-subbrand">
              A living atelier for design systems, motion, atmosphere, and narrative control.
            </p>
          </div>

          <nav className="lumina-nav__links" aria-label="Primary">
            <a href="#manifesto">Manifesto</a>
            <a href="#principles">Principles</a>
            <a href="#roadmap">Roadmap</a>
            <button
              type="button"
              className="lumina-scheme-toggle"
              onClick={() => setScheme((current) => (current === "dark" ? "light" : "dark"))}
              aria-pressed={scheme === "light"}
              aria-label={`Switch to ${scheme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${scheme === "dark" ? "light" : "dark"} mode`}
            >
              <span aria-hidden="true">{scheme === "dark" ? "☀" : "☾"}</span>
              <span>{scheme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </nav>
        </header>

        <CodexScrollRail activeChapterId={activeChapterId} progress={pageProgress} />

        <section id="entry" className={["lumina-hero", activeChapterId === "entry" ? "is-active" : ""].join(" ")}>
          <div className="lumina-hero__copy">
            <p className="lumina-pill">Milestone 5 in motion</p>
            <h1>Design should feel like entering a chamber of light, pressure, and intention.</h1>
            <p className="lumina-lede">
              Lumina Codex is being built as a portfolio where the interface itself becomes the proof of craft.
              Instead of static case studies, the visitor steps into a responsive atelier that teaches design through
              motion, atmosphere, narrative pacing, and controlled tension.
            </p>

            <div className="lumina-actions">
              <a className="lumina-button lumina-button--primary" href="#principles">
                Enter the principle theater
              </a>
              <a className="lumina-button lumina-button--secondary" href="#roadmap">
                Track build phases
              </a>
            </div>

            <dl className="lumina-facts" aria-label="Project focus">
              <div>
                <dt>Focus</dt>
                <dd>{activePrinciple.name}</dd>
              </div>
              <div>
                <dt>Current move</dt>
                <dd>
                  {activeEra.name} {sceneMode === "theater" ? "theater" : "preview"}
                </dd>
              </div>
              <div>
                <dt>Transition system</dt>
                <dd>{chapterOverlayOpen ? "Chapter engaged" : "Chamber live"}</dd>
              </div>
            </dl>
          </div>

          <CodexChamber
            selectedEra={selectedEra}
            onSelectEra={setSelectedEra}
            activePrincipleKey={activePrincipleKey}
            onSelectPrinciple={(principleKey) => focusCodex(principleKey, { sceneMode: "preview" })}
            balanceCycle={balanceCycle}
            transitionCycle={transitionCycle}
            sceneMode={sceneMode}
            sceneCue={activeExhibit.sceneCue}
            chapterOverlayOpen={chapterOverlayOpen}
          />
        </section>

        <section
          id="manifesto"
          className={["lumina-editorial", activeChapterId === "manifesto" ? "is-active" : ""].join(" ")}
        >
          <article className="lumina-editorial__panel">
            <p className="lumina-kicker">Design ethos</p>
            <h2>The site itself is already behaving like the case study.</h2>
            <p>
              The references you shared point toward a precise atmosphere: radiant cloud-light, iridescent cores,
              suspended geometry, and energy filaments that feel equal parts cosmic and architectural. The current
              build has translated those cues into a working scene system, not just a moodboard.
            </p>
          </article>

          <article className="lumina-editorial__panel">
            <p className="lumina-kicker">Narrative strategy</p>
            <h2>Every section should deepen the same spell instead of resetting it.</h2>
            <p>
              The chamber now responds to era, principle, scroll depth, transition state, and chapter mode. The
              homepage is shifting into a real chapter sequence so scroll becomes a form of direction, not just movement
              down the page.
            </p>
          </article>
        </section>

        <section
          id="principles"
          className={["lumina-principles", activeChapterId === "principles" ? "is-active" : ""].join(" ")}
        >
          <div className="lumina-principles__grid">
            {principles.map((principle) => {
              const isActive = principle.key === activePrincipleKey;

              return (
                <article
                  key={principle.key}
                  className={["lumina-principle-card", isActive ? "is-active" : ""].join(" ")}
                  aria-current={isActive ? "true" : undefined}
                >
                  <p className="lumina-kicker">{principle.eyebrow}</p>
                  <h2>{principle.name}</h2>
                  <p>{principle.blurb}</p>
                  <p className="lumina-principle-card__statement">{principle.statement}</p>
                  <div className="lumina-principle-card__footer">
                    <span>{principle.shape}</span>
                    <span>{principle.status}</span>
                  </div>
                  <button
                    type="button"
                    className="lumina-principle-card__trigger"
                    onClick={() =>
                      focusCodex(principle.key, {
                        scrollToEntry: true,
                        sceneMode: "preview",
                      })
                    }
                    aria-pressed={isActive}
                    aria-label={`Demonstrate ${principle.name} in the chamber`}
                  >
                    Demonstrate in chamber
                  </button>
                </article>
              );
            })}
          </div>

          <aside className="lumina-exhibit-panel">
            <div className="lumina-exhibit-panel__copy">
              <p className="lumina-kicker">Principle theater</p>
              <h2>{activeExhibit.title}</h2>
              <p className="lumina-exhibit-panel__lede">{activeExhibit.lede}</p>
              <p>{activeExhibit.body}</p>
            </div>

            <dl className="lumina-exhibit-panel__facts" aria-label="Current exhibit notes">
              <div>
                <dt>Scene cue</dt>
                <dd>{activeExhibit.sceneCue}</dd>
              </div>
              <div>
                <dt>Narrative cue</dt>
                <dd>{activeExhibit.narrativeCue}</dd>
              </div>
              <div>
                <dt>Recommended era</dt>
                <dd>{activeExhibit.recommendedEraLabel}</dd>
              </div>
            </dl>

            <div className="lumina-exhibit-panel__actions">
              <button
                type="button"
                className="lumina-button lumina-button--primary"
                onClick={() =>
                  focusCodex(activeExhibit.principleKey, {
                    era: activeExhibit.recommendedEra,
                    scrollToEntry: true,
                    sceneMode: "theater",
                  })
                }
              >
                Conduct in {activeExhibit.recommendedEraLabel}
              </button>
              <button
                type="button"
                className="lumina-button lumina-button--secondary"
                onClick={() =>
                  focusCodex(activeExhibit.principleKey, {
                    sceneMode: "theater",
                    scrollToEntry: false,
                  })
                }
              >
                Keep this principle live
              </button>
              <button
                type="button"
                className="lumina-button lumina-button--secondary"
                onClick={() => enterChapter(activeExhibit.principleKey, { era: activeExhibit.recommendedEra })}
              >
                Open full chapter
              </button>
            </div>
          </aside>

          <PrincipleChapterStage
            activeEra={selectedEra}
            activeExhibit={activeExhibit}
            activePrinciple={activePrinciple}
            sceneMode={sceneMode}
            onSetPreview={() => focusCodex(activePrinciple.key, { sceneMode: "preview" })}
            onSetTheater={(era) =>
              focusCodex(activePrinciple.key, {
                era,
                sceneMode: "theater",
              })
            }
            onEnterChapter={() => enterChapter(activePrinciple.key)}
          />
        </section>

        <section id="roadmap" className={["lumina-roadmap", activeChapterId === "roadmap" ? "is-active" : ""].join(" ")}>
          <div className="lumina-roadmap__intro">
            <p className="lumina-kicker">Execution path</p>
            <h2>We are building toward the fully immersive codex without losing production discipline.</h2>
          </div>

          <div className="lumina-roadmap__grid">
            {milestones.map((milestone) => (
              <article key={milestone.title} className="lumina-roadmap__item">
                <p className="lumina-kicker">{milestone.title}</p>
                <p>{milestone.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      {chapterOverlayOpen ? (
        <PrincipleChapterOverlay
          activeEra={selectedEra}
          activeExhibit={activeExhibit}
          activePrinciple={activePrinciple}
          sceneMode={sceneMode}
          onClose={closeChapter}
          onSetPreview={() => {
            focusCodex(activePrinciple.key, { sceneMode: "preview" });
            closeChapter();
          }}
          onSetTheater={(era) => {
            focusCodex(activePrinciple.key, { era, sceneMode: "theater" });
          }}
          onSelectChapter={(principleKey) => enterChapter(principleKey)}
          onNextChapter={() => moveChapter(1)}
          onPreviousChapter={() => moveChapter(-1)}
        />
      ) : null}
    </main>
  );
}
