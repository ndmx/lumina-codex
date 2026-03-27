"use client";

import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";

const chapters = [
  {
    id: "entry",
    label: "Entry",
    summary: "The chamber wakes and establishes the emotional register.",
  },
  {
    id: "manifesto",
    label: "Manifesto",
    summary: "Atmosphere, restraint, and interaction become the argument.",
  },
  {
    id: "principles",
    label: "Principles",
    summary: "Each satellite turns a design principle into a felt behavior.",
  },
  {
    id: "roadmap",
    label: "Roadmap",
    summary: "The codex expands in deliberate production-grade phases.",
  },
] as const;

export function CodexScrollRail() {
  const [activeChapterId, setActiveChapterId] = useState<(typeof chapters)[number]["id"]>("entry");
  const [progress, setProgress] = useState(0);
  const deferredActiveChapterId = useDeferredValue(activeChapterId);

  useEffect(() => {
    const observed = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          const nextId = visibleEntries[0].target.id as (typeof chapters)[number]["id"];
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
        setProgress(nextProgress);
      });
    }

    observed.forEach((element) => observer.observe(element));
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const activeChapter = useMemo(
    () => chapters.find((chapter) => chapter.id === deferredActiveChapterId) ?? chapters[0],
    [deferredActiveChapterId],
  );

  return (
    <aside className="lumina-rail" aria-label="Narrative progress">
      <div className="lumina-rail__header">
        <p className="lumina-kicker">Narrative sync</p>
        <p className="lumina-rail__percent">{Math.round(progress * 100)}%</p>
      </div>

      <div className="lumina-rail__meter" aria-hidden="true">
        <span style={{ transform: `scaleX(${Math.max(progress, 0.04)})` }} />
      </div>

      <div className="lumina-rail__focus">
        <p className="lumina-kicker">Chapter in focus</p>
        <h2>{activeChapter.label}</h2>
        <p>{activeChapter.summary}</p>
      </div>

      <nav className="lumina-rail__chapters" aria-label="Jump to a chapter">
        {chapters.map((chapter) => {
          const isActive = chapter.id === deferredActiveChapterId;

          return (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              className={isActive ? "is-active" : undefined}
              aria-current={isActive ? "location" : undefined}
            >
              <span>{chapter.label}</span>
              <span>{chapter.summary}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
