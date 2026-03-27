"use client";

export const codexChapters = [
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

export type CodexChapterId = (typeof codexChapters)[number]["id"];

type CodexScrollRailProps = {
  activeChapterId: CodexChapterId;
  progress: number;
};

export function CodexScrollRail({ activeChapterId, progress }: CodexScrollRailProps) {
  const activeChapter = codexChapters.find((chapter) => chapter.id === activeChapterId) ?? codexChapters[0];

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
        {codexChapters.map((chapter) => {
          const isActive = chapter.id === activeChapterId;

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
