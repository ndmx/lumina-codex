import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrincipleChapterOverlay } from "@/components/principle-chapter-overlay";
import {
  principles,
  principleExhibits,
  principleDossiers,
  type EraKey,
} from "@/components/codex-content";

const balancePrinciple = principles.find((p) => p.key === "balance")!;
const balanceExhibit = principleExhibits.find((e) => e.principleKey === "balance")!;
const balanceDossier = principleDossiers.find((d) => d.principleKey === "balance")!;

const contrastPrinciple = principles.find((p) => p.key === "contrast")!;
const contrastExhibit = principleExhibits.find((e) => e.principleKey === "contrast")!;

function makeProps(overrides: Partial<Parameters<typeof PrincipleChapterOverlay>[0]> = {}) {
  return {
    activeEra: "atelier" as EraKey,
    activeExhibit: balanceExhibit,
    activePrinciple: balancePrinciple,
    sceneMode: "preview" as const,
    onClose: vi.fn(),
    onSetPreview: vi.fn(),
    onSetTheater: vi.fn(),
    onSelectChapter: vi.fn(),
    onPreviousChapter: vi.fn(),
    onNextChapter: vi.fn(),
    ...overrides,
  };
}

describe("PrincipleChapterOverlay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("dialog accessibility", () => {
    it("renders as a dialog element", () => {
      render(<PrincipleChapterOverlay {...makeProps()} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has aria-modal='true'", () => {
      render(<PrincipleChapterOverlay {...makeProps()} />);
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    });

    it("has aria-labelledby pointing to the chapter title", () => {
      render(<PrincipleChapterOverlay {...makeProps()} />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-labelledby", "lumina-chapter-overlay-title");
    });

    it("sets data-principle to the active principle key", () => {
      render(<PrincipleChapterOverlay {...makeProps()} />);
      expect(screen.getByRole("dialog")).toHaveAttribute("data-principle", "balance");
    });

    it("sets data-scene-mode correctly", () => {
      render(<PrincipleChapterOverlay {...makeProps({ sceneMode: "theater" })} />);
      expect(screen.getByRole("dialog")).toHaveAttribute("data-scene-mode", "theater");
    });
  });

  describe("content", () => {
    it("shows the dossier chapter name as title", () => {
      render(<PrincipleChapterOverlay {...makeProps()} />);
      expect(screen.getByText(balanceDossier.chapterName)).toBeInTheDocument();
    });

    it("shows 'Chapter 1 of 4' for balance (first principle)", () => {
      render(<PrincipleChapterOverlay {...makeProps()} />);
      expect(screen.getByText("Chapter 1 of 4")).toBeInTheDocument();
    });

    it("shows correct chapter index for contrast (second principle)", () => {
      render(
        <PrincipleChapterOverlay
          {...makeProps({ activePrinciple: contrastPrinciple, activeExhibit: contrastExhibit })}
        />,
      );
      expect(screen.getByText("Chapter 2 of 4")).toBeInTheDocument();
    });

    it("shows the exhibit lede as the description", () => {
      render(<PrincipleChapterOverlay {...makeProps()} />);
      expect(screen.getByText(balanceExhibit.lede)).toBeInTheDocument();
    });

    it("shows the dossier opening paragraph", () => {
      render(<PrincipleChapterOverlay {...makeProps()} />);
      expect(screen.getByText(balanceDossier.opening)).toBeInTheDocument();
    });

    it("shows the active era name in the live state card", () => {
      render(<PrincipleChapterOverlay {...makeProps({ activeEra: "memphis" })} />);
      expect(screen.getByText("Memphis")).toBeInTheDocument();
    });

    it("shows 'Preview' for preview sceneMode in live state card", () => {
      render(<PrincipleChapterOverlay {...makeProps({ sceneMode: "preview" })} />);
      expect(screen.getByText("Preview")).toBeInTheDocument();
    });

    it("shows 'Theater' for theater sceneMode in live state card", () => {
      render(<PrincipleChapterOverlay {...makeProps({ sceneMode: "theater" })} />);
      expect(screen.getByText("Theater")).toBeInTheDocument();
    });

    it("shows scene behaviors list", () => {
      render(<PrincipleChapterOverlay {...makeProps()} />);
      for (const behavior of balanceDossier.sceneBehaviors) {
        expect(screen.getByText(behavior)).toBeInTheDocument();
      }
    });

    it("shows conduct notes list", () => {
      render(<PrincipleChapterOverlay {...makeProps()} />);
      for (const note of balanceDossier.conductNotes) {
        expect(screen.getByText(note)).toBeInTheDocument();
      }
    });
  });

  describe("principle chapter sequence nav", () => {
    it("renders all 4 principle chips", () => {
      render(<PrincipleChapterOverlay {...makeProps()} />);
      const nav = screen.getByRole("navigation", { name: "Principle chapter sequence" });
      const chips = within(nav).getAllByRole("button");
      expect(chips).toHaveLength(principles.length);
    });

    it("marks the active principle chip as pressed", () => {
      render(<PrincipleChapterOverlay {...makeProps()} />);
      const nav = screen.getByRole("navigation", { name: "Principle chapter sequence" });
      const balanceChip = within(nav).getByRole("button", { name: /Balance/i });
      expect(balanceChip).toHaveAttribute("aria-pressed", "true");
    });

    it("does not mark inactive chips as pressed", () => {
      render(<PrincipleChapterOverlay {...makeProps()} />);
      const nav = screen.getByRole("navigation", { name: "Principle chapter sequence" });
      const contrastChip = within(nav).getByRole("button", { name: /Contrast/i });
      expect(contrastChip).toHaveAttribute("aria-pressed", "false");
    });

    it("calls onSelectChapter with the principle key when a chip is clicked", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<PrincipleChapterOverlay {...props} />);
      const nav = screen.getByRole("navigation", { name: "Principle chapter sequence" });
      await user.click(within(nav).getByRole("button", { name: /Contrast/i }));
      expect(props.onSelectChapter).toHaveBeenCalledWith("contrast");
    });

    it("chips show 2-digit padded numbers", () => {
      render(<PrincipleChapterOverlay {...makeProps()} />);
      const nav = screen.getByRole("navigation", { name: "Principle chapter sequence" });
      expect(within(nav).getByText("01")).toBeInTheDocument();
      expect(within(nav).getByText("02")).toBeInTheDocument();
      expect(within(nav).getByText("03")).toBeInTheDocument();
      expect(within(nav).getByText("04")).toBeInTheDocument();
    });
  });

  describe("close behavior", () => {
    it("calls onClose when the close button is clicked", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<PrincipleChapterOverlay {...props} />);
      await user.click(screen.getByRole("button", { name: "Close chapter" }));
      expect(props.onClose).toHaveBeenCalledOnce();
    });

    it("calls onClose when the backdrop is clicked", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<PrincipleChapterOverlay {...props} />);
      await user.click(screen.getByRole("button", { name: "Close chapter overlay" }));
      expect(props.onClose).toHaveBeenCalledOnce();
    });

    it("calls onClose when Escape key is pressed", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<PrincipleChapterOverlay {...props} />);
      await user.keyboard("{Escape}");
      expect(props.onClose).toHaveBeenCalledOnce();
    });
  });

  describe("keyboard chapter navigation", () => {
    it("calls onNextChapter when ArrowRight is pressed", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<PrincipleChapterOverlay {...props} />);
      await user.keyboard("{ArrowRight}");
      expect(props.onNextChapter).toHaveBeenCalledOnce();
    });

    it("calls onPreviousChapter when ArrowLeft is pressed", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<PrincipleChapterOverlay {...props} />);
      await user.keyboard("{ArrowLeft}");
      expect(props.onPreviousChapter).toHaveBeenCalledOnce();
    });
  });

  describe("footer action buttons", () => {
    it("calls onPreviousChapter when 'Previous chapter' is clicked", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<PrincipleChapterOverlay {...props} />);
      await user.click(screen.getByRole("button", { name: "Previous chapter" }));
      expect(props.onPreviousChapter).toHaveBeenCalledOnce();
    });

    it("calls onNextChapter when 'Next chapter' is clicked", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<PrincipleChapterOverlay {...props} />);
      await user.click(screen.getByRole("button", { name: "Next chapter" }));
      expect(props.onNextChapter).toHaveBeenCalledOnce();
    });

    it("calls onSetPreview when 'Return to preview' is clicked", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<PrincipleChapterOverlay {...props} />);
      await user.click(screen.getByRole("button", { name: "Return to preview" }));
      expect(props.onSetPreview).toHaveBeenCalledOnce();
    });

    it("calls onSetTheater with no era arg when 'Intensify this chapter' is clicked", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<PrincipleChapterOverlay {...props} />);
      await user.click(screen.getByRole("button", { name: "Intensify this chapter" }));
      expect(props.onSetTheater).toHaveBeenCalledOnce();
      expect(props.onSetTheater.mock.calls[0]).toHaveLength(0);
    });

    it("calls onSetTheater with recommendedEra when 'Run in [era]' is clicked", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<PrincipleChapterOverlay {...props} />);
      const runButton = screen.getByRole("button", {
        name: `Run in ${balanceExhibit.recommendedEraLabel}`,
      });
      await user.click(runButton);
      expect(props.onSetTheater).toHaveBeenCalledWith(balanceExhibit.recommendedEra);
    });
  });

  describe("body scroll lock", () => {
    it("sets body overflow to hidden when mounted", () => {
      render(<PrincipleChapterOverlay {...makeProps()} />);
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("restores previous body overflow when unmounted", () => {
      document.body.style.overflow = "auto";
      const { unmount } = render(<PrincipleChapterOverlay {...makeProps()} />);
      unmount();
      expect(document.body.style.overflow).toBe("auto");
    });

    it("restores empty overflow when previous state was empty", () => {
      document.body.style.overflow = "";
      const { unmount } = render(<PrincipleChapterOverlay {...makeProps()} />);
      unmount();
      expect(document.body.style.overflow).toBe("");
    });
  });
});
