"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient neural field — nodes with signals travelling between them, revealed
 * in a soft pocket around the cursor.
 *
 * WHY SVG AND NOT CANVAS.
 *
 * A canvas version would need a requestAnimationFrame loop running for the
 * entire life of the page, redrawing every node and edge each frame on the
 * main thread — permanent cost on the homepage this refactor is trying to make
 * cheaper. It would also mean reimplementing `data-flow` and `think-ring` in
 * JS while the CSS versions sit unused.
 *
 * Here the graph is static markup. The motion comes from the existing
 * primitives in globals.css, which the compositor runs off the main thread,
 * and the only per-frame JS is two `setProperty` calls — no redraw, no React
 * re-render. rAF is used to throttle, not to drive.
 */

// Hand-placed so the graph reads as a deliberate constellation rather than
// random scatter. viewBox units; `slice` crops rather than distorting.
const NODES: ReadonlyArray<readonly [number, number]> = [
  [120, 180], [340, 90], [560, 240], [820, 130], [1060, 280],
  [200, 470], [470, 560], [760, 430], [1010, 620],
];

const EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [2, 6], [3, 7], [1, 5], [4, 8],
];

// Nodes that emit an expanding "reasoning" ring. Kept sparse — a ring on every
// node reads as noise rather than activity.
const EMITTERS = new Set([1, 6, 4]);

export default function NeuralField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Same guard as Hero.tsx: decorative motion is skipped outright rather
    // than merely slowed. The CSS animations are already neutralised by the
    // reduced-motion block, so this only avoids the pointer work.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      // Coalesce: pointermove can fire many times per frame, but the mask can
      // only be painted once. Dropping the extras is free accuracy.
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--nf-x", `${x}px`);
        el.style.setProperty("--nf-y", `${y}px`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="neural-field pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-70"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {EDGES.map(([a, b], i) => (
          <line
            key={`e${a}-${b}`}
            x1={NODES[a][0]}
            y1={NODES[a][1]}
            x2={NODES[b][0]}
            y2={NODES[b][1]}
            /* 0.30, not the 0.22 this started at: against a content-dense
               homepage the field was verifiably rendering but perceptually
               invisible. Hairlines are exactly what `brand` at full
               saturation is for, so the alpha is the only lever needed. */
            stroke="hsl(var(--brand) / 0.30)"
            strokeWidth={1}
            className="animate-data-flow"
            /* Staggered so signals do not march in lockstep. Fractional
               spacing avoids a visible repeating cycle. */
            style={{ animationDelay: `${(i * 0.37).toFixed(2)}s` }}
          />
        ))}

        {NODES.map(([cx, cy], i) => (
          <g key={`n${i}`}>
            {EMITTERS.has(i) && (
              <circle
                cx={cx}
                cy={cy}
                r={6}
                fill="none"
                stroke="hsl(var(--brand) / 0.5)"
                strokeWidth={1}
                className="animate-think-ring"
                style={{ transformOrigin: `${cx}px ${cy}px`, animationDelay: `${i * 0.6}s` }}
              />
            )}
            <circle
              cx={cx}
              cy={cy}
              r={2.5}
              fill="hsl(var(--brand))"
              className="animate-think-pulse"
              style={{ transformOrigin: `${cx}px ${cy}px`, animationDelay: `${i * 0.28}s` }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
