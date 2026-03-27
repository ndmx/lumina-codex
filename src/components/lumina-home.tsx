"use client";

import { useMemo, useState } from "react";
import { CodexChamber } from "@/components/codex-chamber";
import { CodexScrollRail } from "@/components/codex-scroll-rail";
import { milestones, principles, type EraKey } from "@/components/codex-content";

export function LuminaHome() {
  const [selectedEra, setSelectedEra] = useState<EraKey>("atelier");
  const [activePrincipleKey, setActivePrincipleKey] = useState("balance");
  const [balanceCycle, setBalanceCycle] = useState(1);

  const activePrinciple = useMemo(
    () => principles.find((principle) => principle.key === activePrincipleKey) ?? principles[0],
    [activePrincipleKey],
  );

  function activatePrinciple(principleKey: string, options?: { scrollToEntry?: boolean }) {
    setActivePrincipleKey(principleKey);

    if (principleKey === "balance") {
      setBalanceCycle((current) => current + 1);
    }

    if (options?.scrollToEntry) {
      document.getElementById("entry")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <main className="lumina-page">
      <div className="lumina-page__veil" />
      <div className="lumina-page__noise" />

      <div className="lumina-shell">
        <header className="lumina-nav">
          <div>
            <p className="lumina-brand">Lumina Codex</p>
            <p className="lumina-subbrand">A living atelier for design systems, motion, atmosphere, and narrative control.</p>
          </div>

          <nav className="lumina-nav__links" aria-label="Primary">
            <a href="#manifesto">Manifesto</a>
            <a href="#principles">Principles</a>
            <a href="#roadmap">Roadmap</a>
          </nav>
        </header>

        <CodexScrollRail />

        <section id="entry" className="lumina-hero">
          <div className="lumina-hero__copy">
            <p className="lumina-pill">Milestone 3 in motion</p>
            <h1>Design should feel like entering a chamber of light, pressure, and intention.</h1>
            <p className="lumina-lede">
              Lumina Codex is being built as a portfolio where the interface itself becomes the proof of craft.
              Instead of static case studies, the visitor steps into a responsive atelier that teaches design through
              motion, atmosphere, narrative pacing, and controlled tension.
            </p>

            <div className="lumina-actions">
              <a className="lumina-button lumina-button--primary" href="#roadmap">
                Track build phases
              </a>
              <a className="lumina-button lumina-button--secondary" href="#principles">
                See principle system
              </a>
            </div>

            <dl className="lumina-facts" aria-label="Project focus">
              <div>
                <dt>Focus</dt>
                <dd>{activePrinciple.name}</dd>
              </div>
              <div>
                <dt>Current move</dt>
                <dd>Shader-driven chamber</dd>
              </div>
              <div>
                <dt>Next upgrade</dt>
                <dd>Connected chapter exhibits</dd>
              </div>
            </dl>
          </div>

          <CodexChamber
            selectedEra={selectedEra}
            onSelectEra={setSelectedEra}
            activePrincipleKey={activePrincipleKey}
            onSelectPrinciple={activatePrinciple}
            balanceCycle={balanceCycle}
          />
        </section>

        <section id="manifesto" className="lumina-editorial">
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
              The chamber now responds to era, principle, and scroll depth. The editorial shell is being tuned to the
              same cadence so the homepage reads like one continuous composition rather than a spectacular hero sitting
              on top of generic content blocks.
            </p>
          </article>
        </section>

        <section id="principles" className="lumina-principles">
          {principles.map((principle) => {
            const isActive = principle.key === activePrincipleKey;

            return (
              <article key={principle.key} className={["lumina-principle-card", isActive ? "is-active" : ""].join(" ")}>
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
                  onClick={() => activatePrinciple(principle.key, { scrollToEntry: true })}
                >
                  Demonstrate in chamber
                </button>
              </article>
            );
          })}
        </section>

        <section id="roadmap" className="lumina-roadmap">
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
    </main>
  );
}
