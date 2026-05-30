import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LuminaHome } from "@/components/lumina-home";
import { principles, principleExhibits } from "@/components/codex-content";

vi.mock("@/components/codex-chamber", () => ({
  CodexChamber: (props: { activePrincipleKey: string; sceneMode: string }) => (
    <div
      data-testid="codex-chamber"
      data-principle={props.activePrincipleKey}
      data-scene-mode={props.sceneMode}
    />
  ),
}));

vi.mock("@/components/codex-scroll-rail", () => ({
  CodexScrollRail: () => <div data-testid="codex-scroll-rail" />,
  codexChapters: [
    { id: "entry", label: "Entry", summary: "Entry summary" },
    { id: "manifesto", label: "Manifesto", summary: "Manifesto summary" },
    { id: "principles", label: "Principles", summary: "Principles summary" },
    { id: "roadmap", label: "Roadmap", summary: "Roadmap summary" },
  ],
}));

describe("LuminaHome", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "";
  });

  describe("initial render", () => {
    it("renders the main element", () => {
      render(<LuminaHome />);
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("shows the brand name", () => {
      render(<LuminaHome />);
      expect(screen.getByText("Lumina Codex")).toBeInTheDocument();
    });

    it("renders the primary navigation", () => {
      render(<LuminaHome />);
      const nav = screen.getByRole("navigation", { name: "Primary" });
      expect(within(nav).getByRole("link", { name: "Manifesto" })).toBeInTheDocument();
      expect(within(nav).getByRole("link", { name: "Principles" })).toBeInTheDocument();
      expect(within(nav).getByRole("link", { name: "Roadmap" })).toBeInTheDocument();
    });

    it("renders the hero heading", () => {
      render(<LuminaHome />);
      expect(
        screen.getByRole("heading", {
          name: "Design should feel like entering a chamber of light, pressure, and intention.",
        }),
      ).toBeInTheDocument();
    });

    it("renders the CodexChamber and CodexScrollRail", () => {
      render(<LuminaHome />);
      expect(screen.getByTestId("codex-chamber")).toBeInTheDocument();
      expect(screen.getByTestId("codex-scroll-rail")).toBeInTheDocument();
    });

    it("starts with balance as the active principle", () => {
      render(<LuminaHome />);
      const chamber = screen.getByTestId("codex-chamber");
      expect(chamber).toHaveAttribute("data-principle", "balance");
    });

    it("starts in preview scene mode", () => {
      render(<LuminaHome />);
      const chamber = screen.getByTestId("codex-chamber");
      expect(chamber).toHaveAttribute("data-scene-mode", "preview");
    });

    it("starts with chapter overlay closed", () => {
      render(<LuminaHome />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("principle cards", () => {
    it("renders all 4 principle cards", () => {
      render(<LuminaHome />);
      for (const principle of principles) {
        expect(
          screen.getByRole("button", {
            name: `Demonstrate ${principle.name} in the chamber`,
          }),
        ).toBeInTheDocument();
      }
    });

    it("balance card is active by default (aria-current='true')", () => {
      render(<LuminaHome />);
      // Navigate from the balance satellite button up to its article card
      const balanceBtn = screen.getByRole("button", {
        name: "Demonstrate Balance in the chamber",
      });
      const balanceCard = balanceBtn.closest("article")!;
      expect(balanceCard).toHaveAttribute("aria-current", "true");
    });

    it("clicking 'Demonstrate' on contrast card switches the active principle", async () => {
      const user = userEvent.setup();
      render(<LuminaHome />);
      await user.click(
        screen.getByRole("button", { name: "Demonstrate Contrast in the chamber" }),
      );
      const chamber = screen.getByTestId("codex-chamber");
      expect(chamber).toHaveAttribute("data-principle", "contrast");
    });

    it("'Demonstrate' button has aria-pressed reflecting active state", () => {
      render(<LuminaHome />);
      const balanceBtn = screen.getByRole("button", {
        name: "Demonstrate Balance in the chamber",
      });
      expect(balanceBtn).toHaveAttribute("aria-pressed", "true");
    });

    it("inactive 'Demonstrate' buttons have aria-pressed='false'", () => {
      render(<LuminaHome />);
      const contrastBtn = screen.getByRole("button", {
        name: "Demonstrate Contrast in the chamber",
      });
      expect(contrastBtn).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("exhibit panel", () => {
    it("shows the balance exhibit title in the exhibit panel by default", () => {
      const { container } = render(<LuminaHome />);
      const balanceExhibit = principleExhibits.find((e) => e.principleKey === "balance")!;
      const exhibitPanel = container.querySelector(".lumina-exhibit-panel")!;
      // The title appears as an h2 in the exhibit panel (also as h3 in chapter stage)
      expect(
        within(exhibitPanel as HTMLElement).getByRole("heading", { name: balanceExhibit.title }),
      ).toBeInTheDocument();
    });

    it("'Open full chapter' button opens the chapter overlay", async () => {
      const user = userEvent.setup();
      render(<LuminaHome />);
      await user.click(screen.getByRole("button", { name: "Open full chapter" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("'Conduct in [era]' button switches to theater scene mode", async () => {
      const user = userEvent.setup();
      render(<LuminaHome />);
      const balanceExhibit = principleExhibits.find((e) => e.principleKey === "balance")!;
      await user.click(
        screen.getByRole("button", { name: `Conduct in ${balanceExhibit.recommendedEraLabel}` }),
      );
      const chamber = screen.getByTestId("codex-chamber");
      expect(chamber).toHaveAttribute("data-scene-mode", "theater");
    });
  });

  describe("chapter overlay lifecycle", () => {
    it("overlay opens when 'Open full chapter' is clicked", async () => {
      const user = userEvent.setup();
      render(<LuminaHome />);
      await user.click(screen.getByRole("button", { name: "Open full chapter" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("overlay closes when the close button inside it is clicked", async () => {
      const user = userEvent.setup();
      render(<LuminaHome />);
      await user.click(screen.getByRole("button", { name: "Open full chapter" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Close chapter" }));
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("main element shows overlay-open state", () => {
      render(<LuminaHome />);
      expect(screen.getByRole("main")).toHaveAttribute("data-overlay-open", "false");
    });

    it("'Next chapter' in overlay moves to the second principle", async () => {
      const user = userEvent.setup();
      render(<LuminaHome />);
      await user.click(screen.getByRole("button", { name: "Open full chapter" }));
      await user.click(screen.getByRole("button", { name: "Next chapter" }));
      const chamber = screen.getByTestId("codex-chamber");
      expect(chamber).toHaveAttribute("data-principle", "contrast");
    });

    it("'Previous chapter' from balance wraps to unity (last principle)", async () => {
      const user = userEvent.setup();
      render(<LuminaHome />);
      await user.click(screen.getByRole("button", { name: "Open full chapter" }));
      await user.click(screen.getByRole("button", { name: "Previous chapter" }));
      const chamber = screen.getByTestId("codex-chamber");
      expect(chamber).toHaveAttribute("data-principle", "unity");
    });

    it("selecting a chapter chip in the overlay switches the principle", async () => {
      const user = userEvent.setup();
      render(<LuminaHome />);
      await user.click(screen.getByRole("button", { name: "Open full chapter" }));
      const nav = screen.getByRole("navigation", { name: "Principle chapter sequence" });
      await user.click(within(nav).getByRole("button", { name: /Rhythm/i }));
      const chamber = screen.getByTestId("codex-chamber");
      expect(chamber).toHaveAttribute("data-principle", "rhythm");
    });
  });

  describe("roadmap section", () => {
    it("renders milestone entries", () => {
      render(<LuminaHome />);
      expect(screen.getByText("Milestone 1")).toBeInTheDocument();
      expect(screen.getByText("Milestone 4")).toBeInTheDocument();
    });
  });

  describe("project facts display", () => {
    it("shows the active principle name in the facts list", () => {
      const { container } = render(<LuminaHome />);
      const facts = container.querySelector(".lumina-facts")!;
      expect(facts.textContent).toContain("Balance");
    });

    it("updates facts when a different principle is selected", async () => {
      const user = userEvent.setup();
      const { container } = render(<LuminaHome />);
      await user.click(
        screen.getByRole("button", { name: "Demonstrate Unity in the chamber" }),
      );
      const facts = container.querySelector(".lumina-facts")!;
      expect(facts.textContent).toContain("Unity");
    });
  });
});
