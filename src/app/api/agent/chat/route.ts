// Non-streaming route for the AI chat agent.
// Same serverless Gemini integration as ./stream/route.ts, for clients that
// want a single JSON response: { response: string }.
// Degrades to a labeled instant answer when no GEMINI_API_KEY is configured.

import { NextResponse } from "next/server";
import { buildSystemPrompt, offlineAnswer } from "@/lib/agent-knowledge";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export async function POST(request: Request) {
  let message = "";
  let mode = "general";
  let session_id: string | undefined;
  try {
    const body = await request.json();
    message = typeof body.message === "string" ? body.message.trim() : "";
    mode = typeof body.mode === "string" ? body.mode : "general";
    session_id = typeof body.session_id === "string" ? body.session_id : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  message = message.slice(0, 2000);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ response: offlineAnswer(message), session_id });
  }

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: buildSystemPrompt(mode) }] },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
        }),
      }
    );

    if (!upstream.ok) {
      return NextResponse.json({ response: offlineAnswer(message), session_id });
    }

    const data = await upstream.json();
    const text: string =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? "")
        .join("") ?? "";

    if (!text) {
      return NextResponse.json({ response: offlineAnswer(message), session_id });
    }
    return NextResponse.json({ response: text, session_id });
  } catch (error) {
    console.error("Agent API error:", error);
    return NextResponse.json({ response: offlineAnswer(message), session_id });
  }
}
