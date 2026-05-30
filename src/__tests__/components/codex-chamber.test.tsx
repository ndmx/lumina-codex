import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodexChamber } from "@/components/codex-chamber";
import { type EraKey } from "@/components/codex-content";

vi.mock("@/components/codex-scene", () => ({
  CodexScene: () => <div data-testid="codex-scene" />,
}));

function makeProps(overrides: Partial<Parameters<typeof CodexChamber>[0]> = {}) {
  return {
    selectedEra: "atelier" as EraKey,
    onSelectEra: vi.fn(),
    activePrincipleKey: "balance",
    onSelectPrinciple: vi.fn(),
    balanceCycle: 1,
    transitionCycle: 0,
    sceneMode: "preview" as const,
    sceneCue: "Test scene cue",
    chapterOverlayOpen: false,
    ...overrides,
  };
}

describe("CodexChamber", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("era tab controls", () => {
    it("renders the era tablist", () => {
      render(<CodexChamber {...makeProps()} />);
      expect(
        screen.getByRole("tablist", { name: "Select an era for the chamber" }),
      ).toBeInTheDocument();
    });

    it("renders all 3 era tabs", () => {
      render(<CodexChamber {...makeProps()} />);
      expect(screen.getByRole("tab", { name: "Atelier" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Memphis" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Cyber-Brutalist" })).toBeInTheDocument();
    });

    it("marks the selected era tab as aria-selected='true'", () => {
      render(<CodexChamber {...makeProps({ selectedEra: "memphis" })} />);
      expect(screen.getByRole("tab", { name: "Memphis" })).toHaveAttribute("aria-selected", "true");
    });

    it("marks non-selected era tabs as aria-selected='false'", () => {
      render(<CodexChamber {...makeProps({ selectedEra: "atelier" })} />);
      expect(screen.getByRole("tab", { name: "Memphis" })).toHaveAttribute(
        "aria-selected",
        "false",
      );
      expect(screen.getByRole("tab", { name: "Cyber-Brutalist" })).toHaveAttribute(
        "aria-selected",
        "false",
      );
    });

    it("calls onSelectEra with the era key when a tab is clicked", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<CodexChamber {...props} />);
      await user.click(screen.getByRole("tab", { name: "Memphis" }));
      expect(props.onSelectEra).toHaveBeenCalledWith("memphis");
    });

    it("calls onSelectEra with brutalist for Cyber-Brutalist tab", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<CodexChamber {...props} />);
      await user.click(screen.getByRole("tab", { name: "Cyber-Brutalist" }));
      expect(props.onSelectEra).toHaveBeenCalledWith("brutalist");
    });
  });

  describe("principle satellite buttons", () => {
    it("renders all 4 principle satellite buttons", () => {
      render(<CodexChamber {...makeProps()} />);
      expect(screen.getByRole("button", { name: "Balance satellite" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Contrast satellite" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Rhythm satellite" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Unity satellite" })).toBeInTheDocument();
    });

    it("marks the active principle satellite as aria-pressed='true'", () => {
      render(<CodexChamber {...makeProps({ activePrincipleKey: "rhythm" })} />);
      expect(screen.getByRole("button", { name: "Rhythm satellite" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });

    it("marks inactive satellites as aria-pressed='false'", () => {
      render(<CodexChamber {...makeProps({ activePrincipleKey: "balance" })} />);
      expect(screen.getByRole("button", { name: "Contrast satellite" })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });

    it("calls onSelectPrinciple with the principle key when a satellite is clicked", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<CodexChamber {...props} />);
      await user.click(screen.getByRole("button", { name: "Contrast satellite" }));
      expect(props.onSelectPrinciple).toHaveBeenCalledWith("contrast");
    });

    it("calls onSelectPrinciple with unity when Unity satellite is clicked", async () => {
      const user = userEvent.setup();
      const props = makeProps();
      render(<CodexChamber {...props} />);
      await user.click(screen.getByRole("button", { name: "Unity satellite" }));
      expect(props.onSelectPrinciple).toHaveBeenCalledWith("unity");
    });
  });

  describe("3D scene", () => {
    it("renders the CodexScene (mocked)", () => {
      render(<CodexChamber {...makeProps()} />);
      expect(screen.getByTestId("codex-scene")).toBeInTheDocument();
    });
  });

  describe("era class names", () => {
    it("applies atelier class when atelier era is selected", () => {
      const { container } = render(<CodexChamber {...makeProps({ selectedEra: "atelier" })} />);
      expect(container.querySelector(".lumina-chamber--atelier")).toBeInTheDocument();
    });

    it("applies memphis class when memphis era is selected", () => {
      const { container } = render(<CodexChamber {...makeProps({ selectedEra: "memphis" })} />);
      expect(container.querySelector(".lumina-chamber--memphis")).toBeInTheDocument();
    });

    it("applies brutalist class when brutalist era is selected", () => {
      const { container } = render(<CodexChamber {...makeProps({ selectedEra: "brutalist" })} />);
      expect(container.querySelector(".lumina-chamber--brutalist")).toBeInTheDocument();
    });
  });

  describe("scene mode", () => {
    it("sets data-scene-mode to preview", () => {
      const { container } = render(<CodexChamber {...makeProps({ sceneMode: "preview" })} />);
      const section = container.querySelector("section");
      expect(section).toHaveAttribute("data-scene-mode", "preview");
    });

    it("sets data-scene-mode to theater", () => {
      const { container } = render(<CodexChamber {...makeProps({ sceneMode: "theater" })} />);
      const section = container.querySelector("section");
      expect(section).toHaveAttribute("data-scene-mode", "theater");
    });
  });

  describe("status footer", () => {
    it("shows the active principle name", () => {
      render(<CodexChamber {...makeProps({ activePrincipleKey: "rhythm" })} />);
      expect(screen.getByRole("heading", { name: "Rhythm" })).toBeInTheDocument();
    });

    it("shows the era mood when in preview mode", () => {
      render(<CodexChamber {...makeProps({ selectedEra: "atelier", sceneMode: "preview" })} />);
      expect(screen.getByText("Warm luminous fog")).toBeInTheDocument();
    });

    it("shows 'Exhibit mode engaged' when in theater mode", () => {
      render(<CodexChamber {...makeProps({ sceneMode: "theater" })} />);
      expect(screen.getByText("Exhibit mode engaged")).toBeInTheDocument();
    });

    it("shows the scene cue when in theater mode", () => {
      render(<CodexChamber {...makeProps({ sceneMode: "theater", sceneCue: "Test scene cue" })} />);
      expect(screen.getByText("Test scene cue")).toBeInTheDocument();
    });
  });

  describe("live announcement region", () => {
    it("has an aria-live polite region", () => {
      const { container } = render(<CodexChamber {...makeProps()} />);
      const liveRegion = container.querySelector("[aria-live='polite']");
      expect(liveRegion).toBeInTheDocument();
    });

    it("live region mentions the active principle name", () => {
      const { container } = render(<CodexChamber {...makeProps({ activePrincipleKey: "unity" })} />);
      const liveRegion = container.querySelector("[aria-live='polite']");
      expect(liveRegion?.textContent).toContain("Unity");
    });
  });

  describe("pointer interaction", () => {
    it("resets pointer position on pointer leave", () => {
      const { container } = render(<CodexChamber {...makeProps()} />);
      const section = container.querySelector("section")!;
      section.dispatchEvent(new MouseEvent("pointerleave", { bubbles: true }));
    });
  });
});
