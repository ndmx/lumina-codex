"use client";

/**
 * ProximityDock — distance-driven scaling, the right way.
 *
 * The idea (via x.com): instead of binary hover, nearby items react to how
 * *close* the pointer is, scaling and lightening with distance. It makes a row
 * feel alive and continuous rather than on/off.
 *
 * Two corrections over the original snippet:
 *
 *  1. Cache geometry. The naive version calls getBoundingClientRect() for every
 *     item on every pointermove — a forced synchronous layout (reflow) per item
 *     per frame. We measure once, cache the centers, and only re-measure when
 *     geometry can actually change (resize + scroll via ResizeObserver and a
 *     passive scroll listener). pointermove then does pure math against the
 *     cached array, batched into a single requestAnimationFrame.
 *
 *  2. Honor the medium. On coarse pointers (touch) there is no hovering pointer
 *     to be "near", and prefers-reduced-motion users opted out of this kind of
 *     movement — in both cases we render a plain, accessible row and skip the
 *     effect entirely. See the writeup for why proximity is a pointer idiom.
 */

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

export type ProximityDockItem = {
  id: string;
  label: string;
  glyph: ReactNode;
};

export type ProximityDockProps = {
  items: ProximityDockItem[];
  /** Falloff radius in px — how far the influence reaches. */
  radius?: number;
  /** Peak extra scale at zero distance (0.5 => up to 1.5x). */
  maxScale?: number;
  /** Layout axis. Vertical docks read distance on Y, horizontal on X. */
  orientation?: "horizontal" | "vertical";
  onActivate?: (id: string) => void;
};

type Center = { x: number; y: number };

export function ProximityDock({
  items,
  radius = 120,
  maxScale = 0.5,
  orientation = "horizontal",
  onActivate,
}: ProximityDockProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Cached element centers — recomputed only when geometry changes, never per move.
  const centersRef = useRef<Center[]>([]);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    // ── The one place getBoundingClientRect runs: on real geometry change. ──
    function measure() {
      centersRef.current = itemRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    }

    function reset() {
      itemRefs.current.forEach((el) => {
        if (el) el.style.removeProperty("--p");
      });
    }

    function applyFromPointer(clientX: number, clientY: number) {
      const centers = centersRef.current;
      for (let i = 0; i < itemRefs.current.length; i++) {
        const el = itemRefs.current[i];
        const c = centers[i];
        if (!el || !c) continue;
        const dist =
          orientation === "horizontal"
            ? Math.abs(clientX - c.x)
            : Math.abs(clientY - c.y);
        // t: 1 at the pointer, 0 at/after the falloff radius.
        const t = Math.max(0, 1 - dist / radius);
        el.style.setProperty("--p", t.toFixed(3));
      }
    }

    function onPointerMove(event: PointerEvent) {
      if (reduceMotion.matches || coarsePointer.matches) return;
      const { clientX, clientY } = event;
      if (frameRef.current !== null) return; // coalesce to one write per frame
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        applyFromPointer(clientX, clientY);
      });
    }

    measure();

    // Geometry only changes on resize and scroll — re-measure there, not on move.
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(dock);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });

    if (!reduceMotion.matches && !coarsePointer.matches) {
      dock.addEventListener("pointermove", onPointerMove);
      dock.addEventListener("pointerleave", reset);
    }

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      dock.removeEventListener("pointermove", onPointerMove);
      dock.removeEventListener("pointerleave", reset);
    };
  }, [items.length, radius, orientation]);

  const style = {
    ["--ls-dock-radius" as string]: `${radius}px`,
    ["--ls-dock-max-scale" as string]: String(maxScale),
  } as CSSProperties;

  return (
    <div
      ref={dockRef}
      className="ls-dock"
      data-orientation={orientation}
      style={style}
      role="toolbar"
      aria-label="Proximity dock"
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className="ls-dock__item"
          onClick={() => onActivate?.(item.id)}
          aria-label={item.label}
        >
          <span className="ls-dock__glyph" aria-hidden="true">
            {item.glyph}
          </span>
          <span className="ls-dock__label">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
