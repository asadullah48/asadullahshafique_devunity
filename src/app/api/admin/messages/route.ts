// Admin API Route: Proxy to backend contact messages endpoint.
//
// The caller must prove it knows ADMIN_SECRET by sending it in the
// `X-Admin-Token` header; only then is the request forwarded upstream.
// (Before 2026-09-30 this route injected the secret for ANY caller, which made
// the contact inbox publicly readable — the /admin page's NEXT_PUBLIC gate is
// client-side only and never protected this URL.)
// ADMIN_SECRET must NOT have a NEXT_PUBLIC_ prefix.

import { timingSafeEqual } from "crypto";
import { NextResponse, type NextRequest } from "next/server";

// Allow up to 30s for Render free-tier cold start
export const maxDuration = 30;

// Prefer server-only FASTAPI_BACKEND_URL; fall back to NEXT_PUBLIC_API_URL
const BACKEND_URL = (
  process.env.FASTAPI_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000"
).replace(/\/$/, "");
const ADMIN_SECRET = process.env.ADMIN_SECRET || "";
const UPSTREAM_TIMEOUT_MS = 25_000;

function tokenMatches(supplied: string | null): boolean {
  if (!supplied || !ADMIN_SECRET) return false;
  const a = Buffer.from(supplied.trim());
  const b = Buffer.from(ADMIN_SECRET.trim());
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  if (!ADMIN_SECRET) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }
  if (!tokenMatches(request.headers.get("x-admin-token"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const response = await fetch(`${BACKEND_URL}/api/contact/messages`, {
      headers: { "X-Admin-Token": ADMIN_SECRET },
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: `Backend ${response.status}: ${body?.detail ?? body?.error ?? JSON.stringify(body)}` },
        { status: 502 },
      );
    }
    return NextResponse.json(await response.json(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
