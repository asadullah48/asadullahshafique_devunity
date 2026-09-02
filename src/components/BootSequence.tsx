"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * One-shot "System Scanning" overlay — the command centre coming online.
 *
 * Four rules hold this together; breaking any one of them produces a bug that
 * only shows up for a subset of visitors:
 *
 *  1. STATE IS DRIVEN BY TIMERS, NEVER BY `animationend`. The authoritative
 *     reduced-motion block in globals.css sets `animation: none !important`,
 *     so an animation-driven exit would strand those users under a permanent
 *     full-screen overlay.
 *  2. IT RENDERS ONLY AFTER HYDRATION. sessionStorage does not exist on the
 *     server, so a server-rendered overlay would flash for returning visitors
 *     before an effect could tear it down. Costing one frame is the cheaper
 *     trade.
 *  3. THE GATE DECIDES ONCE PER PAGE LOAD, AND CACHES THE DECISION. See
 *     `gateDecision` below — re-deriving it is an actual bug, not a style
 *     preference.
 *  4. IT IS DECORATIVE, SO IT IS SKIPPABLE AND `aria-hidden`. Assistive tech
 *     reads the real page underneath; sighted users can click or press a key
 *     to cut it short.
 *
 * Mounted in layout.tsx, which does NOT re-mount across client-side
 * navigation — that is template.tsx's job. The sessionStorage gate is
 * therefore belt-and-braces against a full reload, not the primary mechanism.
 */

const SESSION_KEY = "acc.boot.v1";

/**
 * Total scan time before the exit begins.
 *
 * Was 1400ms (1820ms total with EXIT_MS). This overlay is `fixed inset-0` and
 * opaque, so Chrome's LCP algorithm — which excludes elements fully covered
 * by another layer — cannot record the real hero content as painted until it
 * is gone. And it plays on EVERY session with no `acc.boot.v1` sessionStorage
 * key, which describes every Lighthouse/PSI run: there is no "returning
 * visitor" to a headless audit. Measured effect: mobile LCP on `/` (3089ms)
 * was ~2.2s worse than desktop (841ms) on the same content, far more than
 * mobile CPU throttling alone explains. 500ms keeps the "system coming
 * online" beat legible while cutting most of that self-inflicted tax.
 */
const BOOT_MS = 500;
/** Must match the boot-dissolve duration in globals.css. */
const EXIT_MS = 420;

/**
 * The boot manifest — what the "system" reports as it comes online.
 *
 * This is the one piece of this component that is pure voice rather than
 * mechanism. Keep each line short enough to never wrap at 30rem, and keep the
 * count small: BOOT_MS is divided evenly across these, so adding lines makes
 * each one flash by faster rather than making the sequence longer.
 */
const BOOT_LINES = [
  "agent runtime",
  "mcp transport",
  "vector index",
  "tool registry",
  "interface",
] as const;

type Phase = "idle" | "scanning" | "exiting" | "done";

/**
 * The gate's verdict, cached for the lifetime of the page load.
 *
 * This exists because the obvious gate — read the session key, then write it —
 * is NOT idempotent, and the effect below does not run exactly once.
 * `reactStrictMode` is on (next.config.js), so React runs effects
 * mount → cleanup → mount; a hydration-driven remount does the same thing in
 * production. The second pass would read back the key the FIRST pass had just
 * written, conclude the visitor had already seen the boot, and return early —
 * leaving `phase` at "idle" forever, so the overlay rendered for nobody.
 *
 * Caching the verdict makes every later pass agree with the first. Module
 * scope is the correct lifetime: it resets on a full page load, which is
 * exactly when a boot sequence is allowed to play again.
 */
let gateDecision: "boot" | "skip" | null = null;

export default function BootSequence() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [revealed, setRevealed] = useState(0);

  const skip = useCallback(() => {
    setPhase((p) => (p === "scanning" ? "exiting" : p));
  }, []);

  // Gate: decide once per page load whether this visitor gets a boot sequence.
  useEffect(() => {
    if (gateDecision === null) {
      let seen = true;
      try {
        seen = sessionStorage.getItem(SESSION_KEY) === "1";
      } catch {
        // Storage blocked (Safari private mode, hardened settings). Defaulting
        // to "seen" means we simply never boot rather than booting on every
        // single page load, which would be far more annoying.
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gateDecision = seen || reduced ? "skip" : "boot";

      // Written immediately, not on completion: a visitor who navigates away
      // mid-scan has still seen it. Safe now only because the verdict above is
      // cached and will not be re-derived from this write.
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* nothing to do — see above */
      }
    }

    if (gateDecision === "skip") return;

    setPhase("scanning");
    const toExit = window.setTimeout(
      () => setPhase((p) => (p === "scanning" ? "exiting" : p)),
      BOOT_MS,
    );
    return () => window.clearTimeout(toExit);
  }, []);

  // Reveal the manifest one line at a time. Keyed on `phase` so the interval
  // is torn down the instant scanning ends — including on an early skip.
  //
  // The divisor is length + 1, NOT length. Dividing by length puts the final
  // tick at exactly BOOT_MS — the same instant the exit begins — so the last
  // line would flash for zero frames and never actually be read. The extra
  // slot lands it at ~5/6 of the run, leaving the completed manifest on screen
  // for a beat before the dissolve.
  useEffect(() => {
    if (phase !== "scanning") return;
    const tick = window.setInterval(
      () => setRevealed((n) => Math.min(n + 1, BOOT_LINES.length)),
      BOOT_MS / (BOOT_LINES.length + 1),
    );
    return () => window.clearInterval(tick);
  }, [phase]);

  // Let the dissolve play, then stop rendering entirely.
  useEffect(() => {
    if (phase !== "exiting") return;
    const toDone = window.setTimeout(() => setPhase("done"), EXIT_MS);
    return () => window.clearTimeout(toDone);
  }, [phase]);

  // Any key cuts the sequence short.
  useEffect(() => {
    if (phase !== "scanning") return;
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, [phase, skip]);

  if (phase === "idle" || phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      onClick={skip}
      style={{ "--boot-ms": `${BOOT_MS}ms` } as React.CSSProperties}
      className={[
        "fixed inset-0 z-boot grid cursor-pointer place-items-center bg-background",
        phase === "exiting" ? "animate-boot-dissolve" : "",
      ].join(" ")}
    >
      {/* Deliberately NOT .glass-panel. That class is a backdrop-filter, and
          the overlay behind it is opaque — the blur would sample a flat fill
          and cost full-viewport compositing during initial load for nothing.
          `shadow-glass` exists for exactly this: the lit glass rim over a fill
          the element supplies itself. */}
      <div className="relative w-[min(92vw,30rem)] overflow-hidden rounded-panel border border-border bg-surface-1 p-6 font-mono shadow-glass">
        {/* The existing "reading/indexing" cue, reused verbatim. It loops
            forever by design; the overlay unmounting is what stops it. */}
        <div
          className="animate-scan-sweep pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-brand/10 to-transparent"
          aria-hidden="true"
        />

        <div className="flex items-center gap-2.5 text-brand">
          <span className="animate-think-pulse inline-block h-1.5 w-1.5 rounded-full bg-brand shadow-neon" />
          <span className="text-eyebrow uppercase">System Scanning</span>
        </div>

        <ul className="mt-5 space-y-2 text-sm">
          {BOOT_LINES.map((line, i) => (
            <li
              key={line}
              /* Every line occupies its slot from the first frame — fading in
                 with opacity instead of mounting avoids any layout shift. */
              className={[
                "flex items-center gap-2.5 transition-opacity duration-200",
                i < revealed ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              <span className="text-brand">›</span>
              <span className="text-muted-foreground">{line}</span>
              <span className="ml-auto text-xs text-brand-soft">ok</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 h-px w-full overflow-hidden bg-surface-3">
          <div className="animate-boot-progress h-full w-full bg-brand" />
        </div>
      </div>
    </div>
  );
}
