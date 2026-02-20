// Admin API Route: Proxy to backend contact messages endpoint
// Injects the server-only ADMIN_SECRET header — never exposed to the browser.
// ADMIN_SECRET must NOT have a NEXT_PUBLIC_ prefix.

import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
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
    if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!response.ok) {
      return NextResponse.json({ error: "Backend error" }, { status: 502 });
    }
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
