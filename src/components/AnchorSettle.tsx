"use client";

import { useEffect } from "react";

/**
 * Keeps in-page anchor jumps on target.
 *
 * Deep homepage sections use `content-visibility: auto` with a 700px
 * placeholder height (globals.css). That measurably helps mobile performance
 * (Lighthouse, 2026-10-02: 69 with it, 57 without), but a placeholder is not
 * the real height — the Projects grid alone is several thousand px. So after
 * a jump to `#hackathons`, sections that render on the way expand and push
 * the target down: measured ~4,900px off on the live site.
 *
 * This component re-aligns the target while layout settles, and stops the
 * moment the visitor scrolls on their own or the target holds still. It
 * renders nothing and adds no listeners beyond click/hashchange.
 */
const SETTLE_MS = 2500;   // upper bound on how long we keep correcting
const STEP_MS = 120;      // check interval
const TOLERANCE_PX = 8;   // close enough to the scroll-margin target

// A link click also fires hashchange; only the most recent request may run.
let latest = 0;

function settle(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const token = ++latest;

  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const started = performance.now();
  let userMoved = false;
  let stableTicks = 0;

  const stop = () => {
    userMoved = true;
  };
  window.addEventListener("wheel", stop, { passive: true, once: true });
  window.addEventListener("touchstart", stop, { passive: true, once: true });
  window.addEventListener("keydown", stop, { once: true });

  const tick = () => {
    if (token !== latest || userMoved || performance.now() - started > SETTLE_MS) return cleanup();
    const off = el.getBoundingClientRect().top - margin;
    if (Math.abs(off) > TOLERANCE_PX) {
      stableTicks = 0;
      // Instant, not smooth: a smooth correction would be overtaken by the
      // next layout shift and the two would fight.
      window.scrollBy({ top: off, behavior: "instant" as ScrollBehavior });
    } else if (++stableTicks >= 3) {
      return cleanup();
    }
    window.setTimeout(tick, STEP_MS);
  };

  const cleanup = () => {
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
  };

  // Let the browser's own (smooth) scroll start first.
  window.setTimeout(tick, STEP_MS);
}

export default function AnchorSettle() {
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id) settle(id);
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const id = a?.getAttribute("href")?.slice(1);
      if (id) settle(decodeURIComponent(id));
    };

    fromHash(); // direct visits to /#section
    window.addEventListener("hashchange", fromHash);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
