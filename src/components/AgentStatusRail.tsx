"use client";

import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Agent Status Dashboard.
 *
 * EVERY NUMBER HERE IS REAL. Backend state and latency come from an actual
 * probe of the FastAPI `/health` endpoint via /api/health; render time comes
 * from the browser's Navigation Timing entry; uptime is wall-clock since
 * mount. Nothing is simulated.
 *
 * That constraint is the whole point: this sits on a portfolio that claims
 * agent engineering, so a status light driven by `setTimeout` and wishful
 * thinking is the single worst detail to be caught inventing.
 *
 * On colour — there is deliberately no red or amber. The palette is cyan-only,
 * and more importantly the backend runs on a free tier that sleeps: a cold
 * start is normal operation, not an outage. State is encoded as cyan
 * INTENSITY (full → dim → grey), the same device Projects.tsx uses for
 * Problem → Solution → Impact.
 */

type AgentState = "checking" | "online" | "waking" | "degraded" | "offline";

const AGENT_TOKENS: Record<AgentState, { label: string; dot: string; text: string }> = {
  checking: { label: "Probing",  dot: "bg-muted-foreground/40", text: "text-muted-foreground" },
  online:   { label: "Active",   dot: "bg-brand",               text: "text-brand" },
  waking:   { label: "Waking",   dot: "bg-brand/45",            text: "text-brand-soft" },
  degraded: { label: "Degraded", dot: "bg-brand/25",            text: "text-muted-foreground" },
  offline:  { label: "Offline",  dot: "bg-muted-foreground/40", text: "text-muted-foreground/70" },
};

/** Thresholds are Core Web Vitals-ish, not invented: sub-1.5s is genuinely good. */
function systemLabel(renderMs: number | null): string {
  if (renderMs === null) return "—";
  if (renderMs < 1500) return "Optimal";
  if (renderMs < 3000) return "Nominal";
  return "Degraded";
}

function Readout({
  label,
  tip,
  children,
}: {
  label: string;
  tip: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* A div, not a button: this is a readout, not a control. `tabIndex`
            still makes the explanation reachable by keyboard. */}
        <div tabIndex={0} className="flex flex-col gap-0.5 rounded-sm outline-none">
          <span className="text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground/50">
            {label}
          </span>
          <span className="flex items-center gap-1.5 tabular-nums">{children}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>{tip}</TooltipContent>
    </Tooltip>
  );
}

export default function AgentStatusRail() {
  const [agent, setAgent] = useState<AgentState>("checking");
  const [latency, setLatency] = useState<number | null>(null);
  const [renderMs, setRenderMs] = useState<number | null>(null);

  // Uptime is derived from a stored timestamp rather than accumulated by the
  // ticker below. The ticker pauses while the tab is hidden, and an
  // accumulating counter would silently lose every backgrounded second.
  const [mountedAt] = useState(() => Date.now());
  const [uptime, setUptime] = useState(0);

  // --- Real backend probe.
  useEffect(() => {
    let alive = true;
    fetch("/api/health")
      .then((r) => r.json())
      .then((d: { agent: AgentState; latency: number }) => {
        if (!alive) return;
        setAgent(d.agent);
        setLatency(d.latency);
      })
      .catch(() => {
        if (alive) setAgent("offline");
      });
    return () => {
      alive = false;
    };
  }, []);

  // --- Real page load time from Navigation Timing.
  useEffect(() => {
    const read = () => {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      // loadEventEnd stays 0 until the load event has actually fired, so a
      // naive read during hydration reports a nonsense negative duration.
      if (nav && nav.loadEventEnd > 0) {
        setRenderMs(Math.round(nav.loadEventEnd - nav.startTime));
      }
    };
    if (document.readyState === "complete") {
      read();
      return;
    }
    window.addEventListener("load", read, { once: true });
    return () => window.removeEventListener("load", read);
  }, []);

  // --- Uptime ticker, paused while the tab is in the background.
  useEffect(() => {
    let id = 0;
    const tick = () => setUptime(Math.floor((Date.now() - mountedAt) / 1000));
    const start = () => {
      if (!id) id = window.setInterval(tick, 1000);
    };
    const stop = () => {
      if (id) {
        window.clearInterval(id);
        id = 0;
      }
    };
    const onVisibility = () => {
      // Re-sync immediately on return, before the next interval fires.
      tick();
      if (document.hidden) stop();
      else start();
    };

    tick();
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mountedAt]);

  const tone = AGENT_TOKENS[agent];
  const mm = String(Math.floor(uptime / 60)).padStart(2, "0");
  const ss = String(uptime % 60).padStart(2, "0");

  return (
    <TooltipProvider delayDuration={150}>
      <div
        className="flex flex-wrap items-center gap-x-8 gap-y-4 rounded-panel border border-border bg-surface-1/60 px-5 py-4 font-mono text-xs"
        aria-label="Agent status"
      >
        <Readout label="System" tip="Derived from this page's actual load time.">
          <span className="text-foreground">{systemLabel(renderMs)}</span>
        </Readout>

        <Readout
          label="Agent"
          tip="Live probe of the FastAPI backend. 'Waking' means the free-tier container is cold-starting."
        >
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${tone.dot} ${
              agent === "online" || agent === "waking" ? "animate-think-pulse" : ""
            }`}
          />
          <span className={tone.text}>{tone.label}</span>
        </Readout>

        <Readout label="Latency" tip="Round-trip time of the backend health probe.">
          <span className="text-foreground">
            {latency === null ? "—" : `${latency}ms`}
          </span>
        </Readout>

        <Readout label="Render" tip="Navigation Timing: load event minus navigation start.">
          <span className="text-foreground">
            {renderMs === null ? "—" : `${renderMs}ms`}
          </span>
        </Readout>

        <Readout label="Session" tip="Wall-clock time since this page was opened.">
          <span className="text-foreground">
            {mm}:{ss}
          </span>
        </Readout>
      </div>
    </TooltipProvider>
  );
}
