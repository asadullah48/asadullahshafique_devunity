// Admin API Route: Proxy to backend contact messages endpoint
// Injects the server-only ADMIN_SECRET header — never exposed to the browser.
// ADMIN_SECRET must NOT have a NEXT_PUBLIC_ prefix.

import { NextResponse } from "next/server";

// Allow up to 30s for Render free-tier cold start
export const maxDuration = 30;

// Prefer server-only FASTAPI_BACKEND_URL; fall back to NEXT_PUBLIC_API_URL
const BACKEND_URL =
  process.env.FASTAPI_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "";

export async function GET() {
  if (!ADMIN_SECRET) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }
  try {
    const response = await fetch(`${BACKEND_URL}/api/contact/messages`, {
      headers: { "X-Admin-Token": ADMIN_SECRET },
      cache: "no-store",
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: `Backend ${response.status}: ${body?.detail ?? body?.error ?? JSON.stringify(body)}` },
        { status: 502 },
      );
    }
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
