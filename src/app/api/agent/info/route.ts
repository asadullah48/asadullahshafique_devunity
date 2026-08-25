import { NextResponse } from "next/server";

/**
 * Control-plane readout for the agent stack, proxied from FastAPI's
 * /api/agent/info (backend/main.py:802) so the browser never needs the
 * upstream origin and never eats a CORS preflight.
 *
 * This exists to feed AgentActivityLog, which prints a terminal log in the
 * footer. The whole value of that log is that it is NOT simulated, so this
 * route has one hard rule: never synthesise a healthy field. When the backend
 * is unreachable the response says so and the log prints the outage, because a
 * status panel that shows green while the backend is asleep is worse than no
 * status panel at all.
 *
 * Timeout handling mirrors /api/health for the reason documented there:
 * Render's free tier SLEEPS, so a slow first request is a cold start, not an
 * outage, and reporting it as "offline" would be wrong most mornings.
 */

// Server-only origin preferred, per CLAUDE.md §2 — a new route should not leak
// its upstream into the client bundle just because an older one did.
const BACKEND =
  process.env.FASTAPI_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

const TIMEOUT_MS = 4000;

// A cached control-plane readout would report whenever the cache was filled,
// not the state now. Same contradiction as caching a liveness probe.
export const dynamic = "force-dynamic";

export type AgentInfo = {
  /** False whenever any field below is unknown. The log branches on this. */
  reachable: boolean;
  /** "waking" distinguishes a free-tier cold start from a real outage. */
  state: "online" | "waking" | "degraded" | "offline";
  /** Measured round trip to the backend, in ms. Never estimated. */
  latency: number;
  constitution: string | null;
  orchestrationAvailable: boolean | null;
  sdkInstalled: boolean | null;
  model: string | null;
  toolCount: number | null;
  specialistCount: number | null;
  primaryPath: string | null;
  fallbackOrder: string[] | null;
};

/** Every unknown is null, never a plausible-looking default. */
function unknown(state: AgentInfo["state"], latency: number): AgentInfo {
  return {
    reachable: false,
    state,
    latency,
    constitution: null,
    orchestrationAvailable: null,
    sdkInstalled: null,
    model: null,
    toolCount: null,
    specialistCount: null,
    primaryPath: null,
    fallbackOrder: null,
  };
}

export async function GET() {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${BACKEND}/api/agent/info`, {
      signal: controller.signal,
      cache: "no-store",
    });
    const latency = Date.now() - started;

    if (!res.ok) {
      return NextResponse.json(unknown("degraded", latency));
    }

    const d = await res.json();

    // Read defensively: this shape is owned by main.py and can drift. A missing
    // key becomes null and the log prints "—", rather than throwing and taking
    // the whole footer down over a renamed field.
    const body: AgentInfo = {
      reachable: true,
      state: "online",
      latency,
      constitution: d?.constitution?.enforcement ?? null,
      orchestrationAvailable: d?.orchestration?.available ?? null,
      sdkInstalled: d?.orchestration?.sdk_installed ?? null,
      model: d?.orchestration?.model ?? d?.llm ?? null,
      toolCount: Array.isArray(d?.tools) ? d.tools.length : null,
      specialistCount: Array.isArray(d?.specialists) ? d.specialists.length : null,
      primaryPath: d?.primary_path ?? null,
      fallbackOrder: Array.isArray(d?.fallback_order) ? d.fallback_order : null,
    };
    return NextResponse.json(body);
  } catch (error) {
    const latency = Date.now() - started;
    const cold = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(unknown(cold ? "waking" : "offline", latency));
  } finally {
    clearTimeout(timer);
  }
}
