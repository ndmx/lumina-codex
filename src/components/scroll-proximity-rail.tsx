"use client";

/**
 * ScrollProximityRail — the mobile-native answer to the proximity dock.
 *
 * Touch has no hovering pointer to be "near", so we change what *distance*
 * means: each item reacts to how close it is to the rail's focal point (its
 * horizontal center) as the user scrolls. It is the same analog, distance-driven
 * feel as ProximityDock — the centered item scales and brightens — but the input
 * is scroll position, which exists on every device. This is the iOS wheel-picker
 * / cover-flow idiom.
 *
 * Same performance discipline as the dock: we never call getBoundingClientRect
 * on scroll. Item geometry is cached as layout-relative offsets (offsetLeft +
 * width), re-measured only on resize. Each scroll frame reads just `scrollLeft`
 * (cheap, no forced reflow) and does pure math, batched into one rAF.
 *
 * Works with touch, trackpad, and mouse-wheel alike, and degrades to a plain
 * snapping row under prefers-reduced-motion.
 */

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

export type ScrollProximityItem = {
  id: string;
  label: string;
  glyph: ReactNode;
};

export type ScrollProximityRailProps = {
  items: ScrollProximityItem[];
  /** Falloff distance in px from the rail center. */
  radius?: number;
  /** Peak extra scale for the centered item (0.5 => 1.5x). */
  maxScale?: number;
  onActivate?: (id: string) => void;
};

type Metric = { center: number; width: number };

export function ScrollProximityRail({
  items,
  radius = 160,
  maxScale = 0.4,
  onActivate,
}: ScrollProximityRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Layout-relative geometry (independent of scroll position).
  const metricsRef = useRef<Metric[]>([]);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // The only place layout is read: offsetLeft/offsetWidth are scroll-invariant,
    // so this runs on mount and resize — never on scroll.
    function measure() {
      metricsRef.current = itemRefs.current.map((el) =>
        el
          ? { center: el.offsetLeft + el.offsetWidth / 2, width: el.offsetWidth }
          : { center: 0, width: 0 },
      );
      apply();
    }

    function apply() {
      if (!rail) return;
      // Focal point: the center of the visible rail, in content coordinates.
      const focus = rail.scrollLeft + rail.clientWidth / 2;
      const metrics = metricsRef.current;
      for (let i = 0; i < itemRefs.current.length; i++) {
        const el = itemRefs.current[i];
        const m = metrics[i];
        if (!el || !m) continue;
        const t = reduceMotion.matches
          ? 0
          : Math.max(0, 1 - Math.abs(m.center - focus) / radius);
        el.style.setProperty("--p", t.toFixed(3));
      }
    }

    function onScroll() {
      if (frameRef.current !== null) return; // one write per frame
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        apply();
      });
    }

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(rail);
    rail.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
      rail.removeEventListener("scroll", onScroll);
    };
  }, [items.length, radius]);

  const style = {
    ["--ls-rail-radius" as string]: `${radius}px`,
    ["--ls-rail-max-scale" as string]: String(maxScale),
  } as CSSProperties;

  return (
    <div
      ref={railRef}
      className="ls-prail"
      style={style}
      role="toolbar"
      aria-label="Scroll proximity rail"
      aria-orientation="horizontal"
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className="ls-prail__item"
          onClick={() => onActivate?.(item.id)}
          aria-label={item.label}
        >
          <span className="ls-prail__glyph" aria-hidden="true">
            {item.glyph}
          </span>
          <span className="ls-prail__label">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
