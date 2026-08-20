// Streaming route for the AI chat agent.
// Calls Gemini directly (serverless — no separate backend to keep alive) and
// re-emits the model stream in the SSE shape AIChatAgent.tsx already parses:
//   data: {"token": "..."}   per chunk
//   data: {"done": true}     terminal event
// Without a GEMINI_API_KEY the route degrades to streaming an instant
// keyword-routed answer that is labeled as such — never a dead widget.

import { NextResponse } from "next/server";
import { buildSystemPrompt, offlineAnswer } from "@/lib/agent-knowledge";

// flash-lite answers in ~2s. The full flash models are reasoning models: they
// spend most of the token budget on thinking and can exceed 15s, which blows
// the serverless function limit and truncates the reply.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

// Bound the time to first byte so a slow model degrades to the instant answer
// rather than leaving the widget spinning into a platform timeout.
const UPSTREAM_TIMEOUT_MS = 8000;

export const maxDuration = 30;

const encoder = new TextEncoder();

function sse(payload: object): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(payload)}\n\n`);
}

function streamOfflineAnswer(message: string): Response {
  const words = offlineAnswer(message).split(" ");
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(sse({ token: word + " " }));
        await new Promise((r) => setTimeout(r, 25));
      }
      controller.enqueue(sse({ done: true }));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}

export async function POST(request: Request) {
  let message = "";
  let mode = "general";
  try {
    const body = await request.json();
    message = typeof body.message === "string" ? body.message.trim() : "";
    mode = typeof body.mode === "string" ? body.mode : "general";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  // Keep prompts bounded — this is a public endpoint.
  message = message.slice(0, 2000);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return streamOfflineAnswer(message);
  }

  const controller = new AbortController();
  const abortTimer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: { parts: [{ text: buildSystemPrompt(mode) }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.7,
          thinkingConfig: { thinkingLevel: "low" },
        },
      }),
    }
  ).catch(() => null);

  if (!upstream || !upstream.ok || !upstream.body) {
    // Model unreachable (bad key, quota, outage): degrade, don't die.
    clearTimeout(abortTimer);
    return streamOfflineAnswer(message);
  }
  // First byte arrived; the stream itself is no longer on the clock.
  clearTimeout(abortTimer);

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      let emittedAny = false;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const chunk = JSON.parse(line.slice(6));
              const text: string =
                chunk?.candidates?.[0]?.content?.parts
                  ?.map((p: { text?: string }) => p.text ?? "")
                  .join("") ?? "";
              if (text.length > 0) {
                emittedAny = true;
                controller.enqueue(sse({ token: text }));
              }
            } catch {
              // Skip malformed upstream lines
            }
          }
        }
      } finally {
        // A stream that yielded no text (safety block, token budget spent on
        // reasoning) would leave an empty bubble; answer from the facts instead.
        if (!emittedAny) {
          controller.enqueue(sse({ token: offlineAnswer(message) }));
        }
        controller.enqueue(sse({ done: true }));
        controller.close();
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}
