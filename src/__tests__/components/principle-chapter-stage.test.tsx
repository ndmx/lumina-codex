import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrincipleChapterStage } from "@/components/principle-chapter-stage";
import { principles, principleExhibits, type EraKey } from "@/components/codex-content";

const balancePrinciple = principles.find((p) => p.key === "balance")!;
const balanceExhibit = principleExhibits.find((e) => e.principleKey === "balance")!;
const contrastPrinciple = principles.find((p) => p.key === "contrast")!;
const contrastExhibit = principleExhibits.find((e) => e.principleKey === "contrast")!;

function makeProps(overrides: Partial<Parameters<typeof PrincipleChapterStage>[0]> = {}) {
  return {
    activeEra: "atelier" as EraKey,
    activeExhibit: balanceExhibit,
    activePrinciple: balancePrinciple,
    sceneMode: "preview" as const,
    onSetPreview: vi.fn(),
    onSetTheater: vi.fn(),
    onEnterChapter: vi.fn(),
    ...overrides,
  };
}

describe("PrincipleChapterStage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("structure and aria", () => {
    it("renders a region with the principle name in the aria-label", () => {
      render(<PrincipleChapterStage {...makeProps()} />);
      expect(screen.getByRole("region", { name: "Balance chapter stage" })).toBeInTheDocument();
    });

    it("sets data-principle to the active principle key", () => {
      const { container } = render(<PrincipleChapterStage {...makeProps()} />);
      const section = container.querySelector("section");
      expect(section).toHaveAttribute("data-principle", "balance");
    });

    it("sets data-scene-mode to preview when in preview mode", () => {
      const { container } = render(<PrincipleChapterStage {...makeProps({ sceneMode: "preview" })} />);
      const section = container.querySelector("section");
      expect(section).toHaveAttribute("data-scene-mode", "preview");
    });

    it("sets data-scene-mode to theater when in theater mode", () => {
      const { container } = render(
        <PrincipleChapterStage {...makeProps({ sceneMode: "theater" })} />,
      );
      const section = container.querySelector("section");
      expect(section).toHaveAttribute("data-scene-mode", "theater");
    });
  });

  describe("chapter content", () => {
    it("shows the chapter label for balance", () => {
      render(<PrincipleChapterStage {...makeProps()} />);
      expect(screen.getByRole("heading", { name: "Ceremonial alignment" })).toBeInTheDocument();
    });

    it("shows the chapter label for contrast", () => {
      render(
        <PrincipleChapterStage
          {...makeProps({ activePrinciple: contrastPrinciple, activeExhibit: contrastExhibit })}
        />,
      );
      expect(screen.getByRole("heading", { name: "Directional opposition" })).toBeInTheDocument();
    });

    it("shows the exhibit title", () => {
      render(<PrincipleChapterStage {...makeProps()} />);
      expect(screen.getByRole("heading", { name: balanceExhibit.title })).toBeInTheDocument();
    });

    it("shows the exhibit body text", () => {
      render(<PrincipleChapterStage {...makeProps()} />);
      expect(screen.getByText(balanceExhibit.body)).toBeInTheDocument();
    });

    it("shows the narrative cue", () => {
      render(<PrincipleChapterStage {...makeProps()} />);
      expect(screen.getByText(balanceExhibit.narrativeCue)).toBeInTheDocument();
    });

    it("shows the scene cue in the controls card", () => {
      render(<PrincipleChapterStage {...makeProps()} />);
      expect(screen.getByText(balanceExhibit.sceneCue)).toBeInTheDocument();
    });
  });

  describe("metrics card", () => {
    it("shows the metric label and value for balance", () => {
      render(<PrincipleChapterStage {...makeProps()} />);
      expect(screen.getByText("Axis fidelity")).toBeInTheDocument();
      expect(screen.getByText("99% aligned")).toBeInTheDocument();
    });

    it("shows the tension label and value for balance", () => {
      render(<PrincipleChapterStage {...makeProps()} />);
      expect(screen.getByText("Release curve")).toBeInTheDocument();
      expect(screen.getByText("Measured")).toBeInTheDocument();
    });

    it("shows the active era name", () => {
      render(<PrincipleChapterStage {...makeProps({ activeEra: "memphis" })} />);
      expect(screen.getByText("Memphis")).toBeInTheDocument();
    });

    it("shows 'Preview' for preview sceneMode", () => {
      render(<PrincipleChapterStage {...makeProps({ sceneMode: "preview" })} />);
      expect(screen.getByText("Preview")).toBeInTheDocument();
    });

    it("shows 'Theater' for theater sceneMode", () => {
      render(<PrincipleChapterStage {...makeProps({ sceneMode: "theater" })} />);
      expect(screen.getByText("Theater")).toBeInTheDocument();
    });
  });

  describe("chapter beats", () => {
    it("renders balance beats as an ordered list", () => {
      render(<PrincipleChapterStage {...makeProps()} />);
      expect(screen.getByText("Lock the system into symmetry.")).toBeInTheDocument();
      expect(screen.getByText("Introduce a precise fracture moment.")).toBeInTheDocument();
      expect(screen.getByText("Let the chamber resolve without losing tension.")).toBeInTheDocument();
    });
  });

  describe("action buttons", () => {
    it("calls onEnterChapter when 'Enter full chapter' is clicked", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<PrincipleChapterStage {...props} />);
      await user.click(screen.getByRole("button", { name: "Enter full chapter" }));
      expect(props.onEnterChapter).toHaveBeenCalledOnce();
    });

    it("calls onSetPreview when 'Return to Preview' is clicked", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<PrincipleChapterStage {...props} />);
      await user.click(screen.getByRole("button", { name: "Return to Preview" }));
      expect(props.onSetPreview).toHaveBeenCalledOnce();
    });

    it("calls onSetTheater with no era arg when 'Intensify This Chapter' is clicked", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<PrincipleChapterStage {...props} />);
      await user.click(screen.getByRole("button", { name: "Intensify This Chapter" }));
      expect(props.onSetTheater).toHaveBeenCalledOnce();
      expect(props.onSetTheater.mock.calls[0]).toHaveLength(0);
    });

    it("calls onSetTheater with recommendedEra when 'Run in [era]' is clicked", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<PrincipleChapterStage {...props} />);
      const runButton = screen.getByRole("button", {
        name: `Run in ${balanceExhibit.recommendedEraLabel}`,
      });
      await user.click(runButton);
      expect(props.onSetTheater).toHaveBeenCalledWith(balanceExhibit.recommendedEra);
    });
  });
});
