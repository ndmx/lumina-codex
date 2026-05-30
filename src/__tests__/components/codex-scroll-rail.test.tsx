import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import {
  CodexScrollRail,
  codexChapters,
  type CodexChapterId,
} from "@/components/codex-scroll-rail";

function renderRail(activeChapterId: CodexChapterId = "entry", progress = 0) {
  return render(<CodexScrollRail activeChapterId={activeChapterId} progress={progress} />);
}

describe("CodexScrollRail", () => {
  describe("progress display", () => {
    it("shows 0% at zero progress", () => {
      renderRail("entry", 0);
      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("shows 75% at 0.75 progress", () => {
      renderRail("entry", 0.75);
      expect(screen.getByText("75%")).toBeInTheDocument();
    });

    it("rounds fractional progress", () => {
      renderRail("entry", 0.333);
      expect(screen.getByText("33%")).toBeInTheDocument();
    });

    it("shows 100% at full progress", () => {
      renderRail("entry", 1);
      expect(screen.getByText("100%")).toBeInTheDocument();
    });
  });

  describe("active chapter display", () => {
    it("shows Entry label when active chapter is entry", () => {
      renderRail("entry");
      // The focus area <h2> shows the active chapter label (spans in nav also contain it)
      expect(screen.getByRole("heading", { name: "Entry" })).toBeInTheDocument();
    });

    it("shows Manifesto label when active chapter is manifesto", () => {
      renderRail("manifesto");
      expect(screen.getByRole("heading", { name: "Manifesto" })).toBeInTheDocument();
    });

    it("shows the active chapter summary in the focus area", () => {
      const { container } = renderRail("entry");
      const focusArea = container.querySelector(".lumina-rail__focus")!;
      expect(focusArea.textContent).toContain(
        "The chamber wakes and establishes the emotional register.",
      );
    });
  });

  describe("chapter navigation", () => {
    it("renders all 4 chapter links", () => {
      renderRail("entry");
      const nav = screen.getByRole("navigation", { name: "Jump to a chapter" });
      const links = within(nav).getAllByRole("link");
      expect(links).toHaveLength(codexChapters.length);
    });

    it("each link href points to its section id", () => {
      renderRail("entry");
      const nav = screen.getByRole("navigation", { name: "Jump to a chapter" });
      const links = within(nav).getAllByRole("link");
      codexChapters.forEach((chapter, index) => {
        expect(links[index]).toHaveAttribute("href", `#${chapter.id}`);
      });
    });

    it("active chapter link has aria-current='location'", () => {
      renderRail("manifesto");
      const nav = screen.getByRole("navigation", { name: "Jump to a chapter" });
      const manifestoLink = within(nav).getByRole("link", { name: /Manifesto/i });
      expect(manifestoLink).toHaveAttribute("aria-current", "location");
    });

    it("inactive chapter links do not have aria-current", () => {
      renderRail("entry");
      const nav = screen.getByRole("navigation", { name: "Jump to a chapter" });
      const roadmapLink = within(nav).getByRole("link", { name: /Roadmap/i });
      expect(roadmapLink).not.toHaveAttribute("aria-current");
    });

    it("only one link has aria-current at a time", () => {
      renderRail("principles");
      const nav = screen.getByRole("navigation", { name: "Jump to a chapter" });
      const allLinks = within(nav).getAllByRole("link");
      const currentLinks = allLinks.filter((l) => l.getAttribute("aria-current") === "location");
      expect(currentLinks).toHaveLength(1);
    });
  });

  describe("accessibility", () => {
    it("has an aria-label on the aside", () => {
      renderRail();
      expect(screen.getByRole("complementary", { name: "Narrative progress" })).toBeInTheDocument();
    });

    it("meter bar is aria-hidden", () => {
      const { container } = renderRail("entry", 0.5);
      const meter = container.querySelector(".lumina-rail__meter");
      expect(meter).toHaveAttribute("aria-hidden", "true");
    });
  });
});
