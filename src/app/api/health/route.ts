import { NextResponse } from "next/server";

/**
 * Liveness probe for the FastAPI backend, proxied so the browser never needs
 * the upstream origin and never eats a CORS preflight on every page load.
 *
 * The timeout is the important part. The backend runs on Render's free tier,
 * which SLEEPS after inactivity — the first request in a while has to wake the
 * container and can take far longer than any reasonable probe should wait.
 * That state is "waking", not "down", and reporting it as an outage would be
 * wrong roughly every morning.
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const TIMEOUT_MS = 4000;

// A cached liveness probe is a contradiction — it would report the state of
// whenever the cache happened to be filled.
export const dynamic = "force-dynamic";

export type AgentHealth = {
  agent: "online" | "waking" | "degraded" | "offline";
  latency: number;
  upstream?: number;
};

export async function GET() {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${BACKEND}/health`, {
      signal: controller.signal,
      cache: "no-store",
    });
    const latency = Date.now() - started;

    if (!res.ok) {
      const body: AgentHealth = { agent: "degraded", latency, upstream: res.status };
      return NextResponse.json(body);
    }
    const body: AgentHealth = { agent: "online", latency };
    return NextResponse.json(body);
  } catch (error) {
    const latency = Date.now() - started;
    // AbortError means we hit TIMEOUT_MS, which on a sleeping free-tier dyno
    // means a cold start is in progress rather than a failure.
    const cold = error instanceof Error && error.name === "AbortError";
    const body: AgentHealth = { agent: cold ? "waking" : "offline", latency };
    return NextResponse.json(body);
  } finally {
    clearTimeout(timer);
  }
}
