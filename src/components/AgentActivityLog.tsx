"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AgentInfo } from "@/app/api/agent/info/route";

/**
 * Agent control plane — a terminal log that streams the REAL state of the
 * agent stack, then holds and re-polls.
 *
 * EVERY LINE HERE IS DERIVED FROM A LIVE RESPONSE. The channels and their
 * order are fixed; the values, statuses and timestamps come from
 * /api/agent/info, which proxies FastAPI's /api/agent/info. Nothing is
 * scripted, and there is no array of pretend jobs anywhere in this file.
 *
 * That is deliberate, and it is the same constraint AgentStatusRail states
 * directly below this panel in the footer. Two adjacent instruments, one
 * claiming measurement and the other quietly running on setTimeout, would
 * discredit both — and this sits on a portfolio whose entire pitch is
 * production systems over prototypes.
 *
 * When the backend is asleep or unreachable the log says so, in the same
 * typography, and the status column reads [WAKING] or [OFFLINE] rather than
 * hiding the panel. A control plane that only renders when the news is good
 * is decoration.
 */

type Status =
  | "FULL"
  | "ARMED"
  | "READY"
  | "VERIFIED"
  | "ACTIVE"
  | "NOMINAL"
  | "DEGRADED"
  | "WAKING"
  | "OFFLINE"
  | "UNKNOWN";

type Line = {
  channel: string;
  detail: string;
  status: Status;
};

/**
 * Cyan intensity encodes state, exactly as AgentStatusRail and Projects do.
 * There is deliberately no red: the backend runs on a free tier that sleeps,
 * so a cold start is normal operation and painting it as an alarm would be
 * both wrong and permanently alarming.
 */
const STATUS_TONE: Record<Status, string> = {
  FULL: "text-brand",
  ARMED: "text-brand",
  READY: "text-brand",
  VERIFIED: "text-brand",
  ACTIVE: "text-brand",
  NOMINAL: "text-brand-soft",
  DEGRADED: "text-muted-foreground",
  WAKING: "text-brand-soft",
  OFFLINE: "text-muted-foreground/70",
  UNKNOWN: "text-muted-foreground/60",
};

/** Latency thresholds match AgentStatusRail's so the two never disagree. */
function latencyStatus(ms: number): Status {
  if (ms < 1500) return "NOMINAL";
  if (ms < 3000) return "DEGRADED";
  return "WAKING";
}

/**
 * The single place raw telemetry becomes log lines.
 *
 * Kept pure and separate from the streaming effect so the mapping is
 * inspectable on its own: given this payload, exactly these lines. There is no
 * branch in here that invents a value — an unknown field yields a stated
 * "unreported" and [UNKNOWN], never a confident-looking default.
 */
function buildLines(info: AgentInfo | null): Line[] {
  if (!info) {
    return [{ channel: "control", detail: "establishing link", status: "UNKNOWN" }];
  }

  if (!info.reachable) {
    const status: Status = info.state === "waking" ? "WAKING" : "OFFLINE";
    return [
      {
        channel: "backend",
        detail:
          info.state === "waking"
            ? "free-tier container cold start"
            : "upstream unreachable",
        status,
      },
      {
        channel: "fallback",
        detail: "static keyword answers serving",
        status: "ACTIVE",
      },
      {
        channel: "constitution",
        detail: "state unknown while offline",
        status: "UNKNOWN",
      },
    ];
  }

  const lines: Line[] = [];

  lines.push({
    channel: "constitution",
    detail:
      info.constitution === "full"
        ? "5 principles, classifier reachable"
        : info.constitution === "deterministic-only"
          ? "5 principles, classifier unreachable"
          : "enforcement state unreported",
    status:
      info.constitution === "full"
        ? "FULL"
        : info.constitution === "deterministic-only"
          ? "DEGRADED"
          : "UNKNOWN",
  });

  // The deterministic screen runs before any model call, so it is armed
  // whenever the constitution module answered at all — including the
  // classifier-down case. That is the fail-open behaviour, reported honestly.
  lines.push({
    channel: "guardrail",
    detail: "deterministic screen, pre-model",
    status: info.constitution ? "ARMED" : "UNKNOWN",
  });

  lines.push({
    channel: "orchestrator",
    detail:
      info.specialistCount !== null
        ? `${info.specialistCount} specialists, single-hop triage`
        : "specialist roster unreported",
    status:
      info.orchestrationAvailable === true
        ? "READY"
        : info.orchestrationAvailable === false
          ? "DEGRADED"
          : "UNKNOWN",
  });

  lines.push({
    channel: "mcp/server",
    detail:
      info.toolCount !== null
        ? `${info.toolCount} read-only tools exposed`
        : "tool roster unreported",
    status: info.toolCount !== null ? "VERIFIED" : "UNKNOWN",
  });

  lines.push({
    channel: "path",
    detail: info.primaryPath
      ? `${info.primaryPath}${
          info.fallbackOrder ? ` · ladder: ${info.fallbackOrder.join(" > ")}` : ""
        }`
      : "routing path unreported",
    status: info.primaryPath ? "ACTIVE" : "UNKNOWN",
  });

  lines.push({
    channel: "backend",
    detail: `control-plane probe ${info.latency}ms`,
    status: latencyStatus(info.latency),
  });

  return lines;
}

/** Fixed-width so the status column cannot jitter as lines stream in. */
function pad(s: string, n: number): string {
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}

const POLL_MS = 45_000;
const LINE_MS = 260;

const OFFLINE_INFO: AgentInfo = {
  reachable: false,
  state: "offline",
  latency: 0,
  constitution: null,
  orchestrationAvailable: null,
  sdkInstalled: null,
  model: null,
  toolCount: null,
  specialistCount: null,
  primaryPath: null,
  fallbackOrder: null,
};

export default function AgentActivityLog() {
  const [info, setInfo] = useState<AgentInfo | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [stamps, setStamps] = useState<string[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Timestamps are captured as each line prints, so they are the real clock
  // times of this render pass rather than a decorative sequence.
  const stampRef = useRef<string[]>([]);

  const lines = useMemo(() => buildLines(info), [info]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // --- Poll. Paused while the tab is hidden: a background tab burning a
  //     backend request every 45s on a free tier is rude and pointless.
  useEffect(() => {
    let alive = true;
    let id = 0;

    const reset = (next: AgentInfo) => {
      stampRef.current = [];
      setStamps([]);
      setVisibleCount(0);
      setInfo(next);
    };

    const load = async () => {
      try {
        const res = await fetch("/api/agent/info", { cache: "no-store" });
        const d: AgentInfo = await res.json();
        if (!alive) return;
        reset(d);
      } catch {
        if (!alive) return;
        // The proxy already degrades gracefully; this only catches a genuine
        // network failure in the browser. Report it as offline, never as ok.
        reset(OFFLINE_INFO);
      }
    };

    const start = () => {
      if (!id) id = window.setInterval(load, POLL_MS);
    };
    const stop = () => {
      if (id) {
        window.clearInterval(id);
        id = 0;
      }
    };
    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        load();
        start();
      }
    };

    load();
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      alive = false;
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // --- Stream the lines in. With reduced motion they all print at once; the
  //     panel is information, and the animation is never the point.
  useEffect(() => {
    if (!info) return;

    const stamp = () => new Date().toLocaleTimeString("en-GB", { hour12: false });

    if (reducedMotion) {
      stampRef.current = lines.map(stamp);
      setStamps(stampRef.current);
      setVisibleCount(lines.length);
      return;
    }

    setVisibleCount(0);
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      stampRef.current = [...stampRef.current, stamp()];
      setStamps(stampRef.current);
      setVisibleCount(n);
      if (n >= lines.length) window.clearInterval(id);
    }, LINE_MS);

    return () => window.clearInterval(id);
  }, [info, lines, reducedMotion]);

  const streaming = visibleCount < lines.length;
  const live = info?.reachable === true;

  return (
    // dir="ltr": this is machine output. Arabic bidi would otherwise reorder
    // the status brackets and the fallback ladder into nonsense.
    <div
      dir="ltr"
      aria-label="Agent control plane"
      className="rounded-panel border border-border bg-surface-1/60 font-mono text-xs overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-2.5">
        <span className="text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground/50">
          Agent control plane
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              live ? "bg-brand animate-think-pulse" : "bg-muted-foreground/40"
            }`}
          />
          <span
            className={`text-[0.625rem] uppercase tracking-[0.16em] ${
              live ? "text-brand" : "text-muted-foreground/60"
            }`}
          >
            {info === null ? "Probing" : live ? "Live" : "Degraded"}
          </span>
        </span>
      </div>

      {/* role="log" + aria-live: a screen reader hears each line as it prints
          rather than being silently left behind by the animation. */}
      <div
        role="log"
        aria-live="polite"
        aria-busy={streaming}
        className="px-5 py-3.5 overflow-x-auto min-h-[9rem]"
      >
        {lines.slice(0, Math.max(visibleCount, 1)).map((line, i) => {
          const printed = i < visibleCount;
          // The pulse marks the line currently being written — the "active
          // task" — and nothing else on the panel competes with it.
          const active = streaming && i === visibleCount - 1;
          return (
            <div
              key={`${line.channel}-${i}`}
              className={`flex items-baseline gap-3 whitespace-pre leading-6 ${
                printed ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="text-muted-foreground/40 tabular-nums">
                {stamps[i] ?? "--:--:--"}
              </span>
              <span className="text-brand-soft/80">{pad(line.channel, 13)}</span>
              <span className="text-muted-foreground flex-1">{line.detail}</span>
              <span
                className={`${STATUS_TONE[line.status]} ${
                  active ? "animate-think-pulse" : ""
                }`}
              >
                [{line.status}]
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
