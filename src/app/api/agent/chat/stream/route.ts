// Streaming proxy route for AI chat agent
// Forwards SSE stream from FastAPI backend to the client

import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const response = await fetch(`${BACKEND_URL}/api/agent/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok || !response.body) {
      return NextResponse.json({ error: "Stream unavailable" }, { status: 503 });
    }

    // Pass the SSE stream through to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch {
    return NextResponse.json({ error: "Stream unavailable" }, { status: 503 });
  }
}
