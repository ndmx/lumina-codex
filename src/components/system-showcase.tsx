"use client";

/**
 * SystemShowcase — a live proof of the scheme + grid + variation systems.
 *
 * Everything here is painted only from `--ls-*` custom properties produced by
 * resolveSchemeVars / resolveGridVars / resolveVariationVars. No color is
 * hardcoded in the markup, which is exactly why the same tree renders correctly
 * in light and dark and at every device width.
 */

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  resolveSchemeVars,
  schemeList,
  eraList,
  resolveGridVars,
  spanColumns,
  createVariation,
  resolveVariationVars,
  shiftHue,
  type Scheme,
  type EraKey,
  type DeviceClass,
} from "@xlumina/system";
import { ProximityDock, type ProximityDockItem } from "@/components/proximity-dock";
import {
  ScrollProximityRail,
  type ScrollProximityItem,
} from "@/components/scroll-proximity-rail";

const dockItems: ProximityDockItem[] = [
  { id: "home", label: "Home", glyph: "◐" },
  { id: "grid", label: "Grid", glyph: "▦" },
  { id: "scheme", label: "Scheme", glyph: "◑" },
  { id: "vary", label: "Vary", glyph: "✦" },
  { id: "scene", label: "Scene", glyph: "❖" },
  { id: "ship", label: "Ship", glyph: "➔" },
];

const railItems: ScrollProximityItem[] = [
  { id: "atelier", label: "Atelier", glyph: "✶" },
  { id: "memphis", label: "Memphis", glyph: "✦" },
  { id: "brutalist", label: "Brutalist", glyph: "◆" },
  { id: "light", label: "Light", glyph: "☀" },
  { id: "dark", label: "Dark", glyph: "☾" },
  { id: "grid", label: "Grid", glyph: "▦" },
  { id: "seed", label: "Seed", glyph: "❖" },
  { id: "motion", label: "Motion", glyph: "➳" },
];

// Each preview frame stands in for a device class on the shared grid.
const frames: { device: DeviceClass; label: string; width: number }[] = [
  { device: "mobile", label: "Mobile", width: 390 },
  { device: "desktop", label: "Web / desktop", width: 1024 },
];

export function SystemShowcase() {
  const [scheme, setScheme] = useState<Scheme>("dark");
  const [era, setEra] = useState<EraKey>("atelier");
  const [seed, setSeed] = useState("lumina-01");
  const [showGrid, setShowGrid] = useState(false);

  const variation = useMemo(() => createVariation(seed), [seed]);

  // The era accent, nudged by the seed — same era, unique fingerprint.
  const accent = useMemo(() => {
    const base = eraList.find((e) => e.key === era) ?? eraList[0];
    return shiftHue(base.accent.primary, variation.accentHueShift);
  }, [era, variation.accentHueShift]);

  function shuffle() {
    setSeed(`lumina-${Math.random().toString(36).slice(2, 8)}`);
  }

  return (
    <div className="ls-showcase" data-show-grid={showGrid ? "true" : "false"}>
      <header className="ls-showcase__head">
        <p className="ls-showcase__eyebrow">Lumina system · scheme × grid × variation</p>
        <h1>One brain, every surface.</h1>
        <p className="ls-showcase__lede">
          The same component tree, rendered in light and dark, on mobile and web. Layout rides one
          column model so spans stay proportional; a seeded variation gives each instance a
          fingerprint without breaking the brand.
        </p>

        <div className="ls-showcase__controls">
          <div className="ls-control" role="group" aria-label="Scheme">
            {schemeList.map((s) => (
              <button
                key={s.scheme}
                type="button"
                className={s.scheme === scheme ? "is-active" : ""}
                onClick={() => setScheme(s.scheme)}
              >
                {s.scheme}
              </button>
            ))}
          </div>

          <div className="ls-control" role="group" aria-label="Era">
            {eraList.map((e) => (
              <button
                key={e.key}
                type="button"
                className={e.key === era ? "is-active" : ""}
                onClick={() => setEra(e.key)}
              >
                {e.name}
              </button>
            ))}
          </div>

          <div className="ls-control" role="group" aria-label="Options">
            <button type="button" onClick={shuffle}>
              ✦ Shuffle seed
            </button>
            <button
              type="button"
              className={showGrid ? "is-active" : ""}
              onClick={() => setShowGrid((v) => !v)}
            >
              ▦ Grid overlay
            </button>
            <code className="ls-showcase__seed">{seed}</code>
          </div>
        </div>
      </header>

      <div className="ls-frames">
        {frames.map((frame) => {
          const frameStyle = {
            ...resolveSchemeVars(scheme, era),
            ...resolveGridVars(frame.device),
            ...resolveVariationVars(variation),
            ["--ls-accent"]: accent,
            ["--ls-frame-width"]: `${frame.width}px`,
          } as CSSProperties;

          return (
            <figure key={frame.device} className="ls-frame" data-device={frame.device}>
              <figcaption className="ls-frame__caption">
                {frame.label} · {scheme} · {frame.width}px · {/* live grid facts */}
                <span>
                  {resolveGridVars(frame.device)["--ls-grid-columns"]} cols
                </span>
              </figcaption>

              <div className="ls-device" style={frameStyle}>
                <div className="ls-device__grid-overlay" aria-hidden="true" />
                <DeviceContent device={frame.device} />
              </div>
            </figure>
          );
        })}
      </div>

      <section className="ls-dock-stage" aria-label="Proximity interaction demos">
        <div className="ls-dock-stage__col">
          <p className="ls-showcase__eyebrow">Pointer · proximity, not just hover</p>
          <p className="ls-dock-stage__note">
            Move a pointer across the dock — items scale and lighten by distance, measured against
            cached geometry. On touch or reduced-motion it stays a plain row.
          </p>
          <ProximityDock items={dockItems} />
        </div>

        <div className="ls-dock-stage__col">
          <p className="ls-showcase__eyebrow">Touch · scroll-proximity</p>
          <p className="ls-dock-stage__note">
            The mobile analog: drag or wheel the rail. Distance is measured from the rail&apos;s
            center, not a pointer — so the same alive feel works on touch. Reads only scrollLeft per
            frame.
          </p>
          <ScrollProximityRail items={railItems} />
        </div>
      </section>
    </div>
  );
}

function DeviceContent({ device }: { device: DeviceClass }) {
  // Semantic spans — "half" and "third" resolve to real columns per device,
  // so proportions hold from phone to desktop.
  const half = spanColumns(device, 1 / 2);
  const third = spanColumns(device, 1 / 3);
  const full = spanColumns(device, 1);

  return (
    <div className="ls-screen">
      <div className="ls-screen__bar">
        <span className="ls-screen__brand">Lumina</span>
        <span className="ls-screen__chip">{device}</span>
      </div>

      <div className="ls-screen__hero" style={cell(full)}>
        <p className="ls-screen__kicker">Atelier of light</p>
        <h2>Design that maps to every screen.</h2>
        <p className="ls-screen__body">
          One grid, two schemes, infinite seeds. Consistent, never identical.
        </p>
        <div className="ls-screen__actions">
          <button type="button" className="ls-btn ls-btn--primary">
            Enter
          </button>
          <button type="button" className="ls-btn">
            Tokens
          </button>
        </div>
      </div>

      <div className="ls-screen__grid">
        <article className="ls-card" style={cell(half)}>
          <span className="ls-card__tag">Scheme</span>
          <strong>Light + dark</strong>
          <p>Surface foundation, orthogonal to era.</p>
        </article>
        <article className="ls-card" style={cell(half)}>
          <span className="ls-card__tag">Grid</span>
          <strong>4 · 8 · 12</strong>
          <p>Columns scale, spans stay proportional.</p>
        </article>
        <article className="ls-card" style={cell(third)}>
          <span className="ls-card__tag">Seed</span>
          <strong>Bounded</strong>
          <p>Hue, radius, density flex slightly.</p>
        </article>
        <article className="ls-card" style={cell(third)}>
          <span className="ls-card__tag">Motion</span>
          <strong>Proximity</strong>
          <p>Distance, not binary hover.</p>
        </article>
        <article className="ls-card" style={cell(third)}>
          <span className="ls-card__tag">Native</span>
          <strong>Mappable</strong>
          <p>Web today, SwiftUI tomorrow.</p>
        </article>
      </div>
    </div>
  );
}

function cell(span: number): CSSProperties {
  return { ["--ls-span" as string]: String(span) } as CSSProperties;
}
