# Full-Stack Portfolio Polish — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wire the live Render.com FastAPI backend to the Next.js frontend, add an admin contact dashboard, and polish the AI chat widget into a production-quality feature.

**Architecture:** Three phases. Phase 1 connects existing proxy routes (`/api/github/stats`, `/api/blog`, `/api/contact`) to the live backend via `NEXT_PUBLIC_API_URL` env var; the GitHub stats card and Blog section fetch live data. Phase 2 adds a password-protected `/admin` page that reads contact messages from the backend. Phase 3 upgrades the AI chat widget with streaming SSE responses and Claude + LangGraph branding.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion, FastAPI on Render (`https://asadullahshafique-devunity.onrender.com`), SQLite via SQLAlchemy on backend, Claude via langchain-anthropic.

**Backend URL:** `https://asadullahshafique-devunity.onrender.com`

---

## Pre-flight: Set env vars on Vercel

Before any code changes, set these in Vercel Dashboard → Project → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://asadullahshafique-devunity.onrender.com` |

The existing proxy routes (`src/app/api/github/stats/route.ts`, `src/app/api/agent/chat/route.ts`, `src/app/api/contact/route.ts`) already read `process.env.NEXT_PUBLIC_API_URL` — so setting this single env var wires everything to the live backend.

---

## Phase 1 — Wire Frontend to Live Backend

### Task 1: Fix env var name in proxy routes

The proxy routes use `process.env.NEXT_PUBLIC_API_URL` but the contact route uses `process.env.NEXT_PUBLIC_API_URL` via a different fallback. Confirm consistency and fix any mismatch.

**Files:**
- Modify: `src/app/api/contact/route.ts:6`
- Modify: `src/app/api/github/stats/route.ts:6`
- Modify: `src/app/api/agent/chat/route.ts:6`

**Step 1: Read contact route and check env var name**

Currently `src/app/api/contact/route.ts` line 6:
```typescript
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

All three proxy routes currently use `NEXT_PUBLIC_API_URL`. They're consistent. No change needed.

**Step 2: Verify the blog proxy route exists (create if missing)**

Check: does `src/app/api/blog/route.ts` exist?

Run: `ls src/app/api/`

If it does NOT exist, create it:

Create: `src/app/api/blog/route.ts`
```typescript
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/blog`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: response.status });
    }
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

**Step 3: Commit**

```bash
git add src/app/api/blog/route.ts
git commit -m "feat: add blog proxy route to forward requests to FastAPI backend"
```

---

### Task 2: GitHub stats card in Hero section

Add a live GitHub stats strip (repos, followers, stars) to the Hero section that fetches from `/api/github/stats`.

**Files:**
- Create: `src/hooks/useGitHubStats.ts`
- Modify: `src/components/Hero.tsx`

**Step 1: Create the hook**

Create: `src/hooks/useGitHubStats.ts`
```typescript
"use client";

import { useState, useEffect } from "react";

interface GitHubStats {
  public_repos: number;
  followers: number;
  following: number;
  total_stars: number;
  top_languages: string[];
}

export function useGitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github/stats")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
```

**Step 2: Read current Hero.tsx to find insertion point**

Read `src/components/Hero.tsx` in full. Locate the bottom of the hero content (after the CTA buttons, before the closing `</section>`). Insert a stats strip there.

**Step 3: Add stats strip to Hero.tsx**

After the existing CTA buttons block, add (before the closing `</div>` of the container):
```tsx
{/* Live GitHub Stats */}
<GitHubStatsStrip />
```

And import at top of Hero.tsx:
```typescript
import { GitHubStatsStrip } from "@/components/GitHubStatsStrip";
```

**Step 4: Create GitHubStatsStrip component**

Create: `src/components/GitHubStatsStrip.tsx`
```tsx
"use client";

import { useGitHubStats } from "@/hooks/useGitHubStats";
import { Github, Star, Users, GitFork } from "lucide-react";
import { motion } from "framer-motion";

export function GitHubStatsStrip() {
  const { stats, loading } = useGitHubStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-8 mt-12 text-zinc-600">
        <span className="text-xs animate-pulse">Loading GitHub stats…</span>
      </div>
    );
  }

  if (!stats) return null;

  const items = [
    { icon: GitFork, label: "Repos", value: stats.public_repos },
    { icon: Star, label: "Stars", value: stats.total_stars },
    { icon: Users, label: "Followers", value: stats.followers },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="flex items-center justify-center gap-8 mt-12"
    >
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-2 text-zinc-400">
          <Icon className="w-4 h-4 text-[#9CE630]" />
          <span className="text-sm font-medium text-white">{value}</span>
          <span className="text-xs text-zinc-500">{label}</span>
        </div>
      ))}
    </motion.div>
  );
}
```

**Step 5: Build check**

Run: `npm run build`
Expected: Compiles without TypeScript errors.

**Step 6: Commit**

```bash
git add src/hooks/useGitHubStats.ts src/components/GitHubStatsStrip.tsx src/components/Hero.tsx
git commit -m "feat: add live GitHub stats strip to Hero section"
```

---

### Task 3: Wire Blog section to live API

Replace the hardcoded `blogPosts` array in `Blog.tsx` with live data from `/api/blog`.

**Files:**
- Modify: `src/components/Blog.tsx`

**Step 1: Read Blog.tsx in full**

Confirm the shape used: `{ title, excerpt, date, readTime, tags, featured }`.

The backend returns: `{ id, title, excerpt, date, read_time, tags, slug, featured }`.

**Step 2: Rewrite Blog.tsx to fetch live data**

Replace the static `blogPosts` array with a `useBlogPosts` hook pattern. Key changes:
- Remove `const blogPosts = [...]` hardcoded array
- Add `useState` and `useEffect` to fetch from `/api/blog`
- Show skeleton loading state while fetching
- Fall back gracefully if fetch fails (show empty state, not crash)
- Map `read_time` → `readTime` for display

Updated `Blog.tsx` top section:
```typescript
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  read_time: string;
  tags: string[];
  featured: boolean;
  slug: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
        else if (Array.isArray(data.posts)) setPosts(data.posts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="blog" className="py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#9CE630]" />
      </section>
    );
  }

  const featured = posts.filter((p) => p.featured);
  const regular = posts.filter((p) => !p.featured);
  // ... rest of render using `featured` and `regular` instead of `blogPosts.filter(...)`
};
```

Replace all references `blogPosts.filter(p => p.featured)` → `featured`, `blogPosts.filter(p => !p.featured)` → `regular`, and `post.readTime` → `post.read_time`.

**Step 3: Build check**

Run: `npm run build`
Expected: No errors.

**Step 4: Commit**

```bash
git add src/components/Blog.tsx
git commit -m "feat: wire Blog section to live FastAPI backend"
```

---

## Phase 2 — Admin Dashboard

### Task 4: Backend — add admin auth header check to contact messages endpoint

The backend already has `GET /api/contact/messages` in `db_helpers.py`. We need to protect it with a simple secret header check.

**Files:**
- Modify: `backend/main.py` (find the GET contact messages endpoint)

**Step 1: Read main.py — find the GET /api/contact/messages endpoint**

Search for `get_contact_messages` in `backend/main.py`. Locate the route handler.

**Step 2: Add a dependency for admin auth**

Add to `backend/main.py` (near the top, after imports):
```python
ADMIN_SECRET = os.getenv("ADMIN_SECRET", "")

def require_admin(request: Request):
    token = request.headers.get("X-Admin-Token", "")
    if not ADMIN_SECRET or token != ADMIN_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")
```

**Step 3: Apply dependency to the messages route**

Modify the route signature from:
```python
@app.get("/api/contact/messages")
async def list_messages(db: Session = Depends(get_db)):
```
to:
```python
@app.get("/api/contact/messages")
async def list_messages(
    request: Request,
    db: Session = Depends(get_db),
    _: None = Depends(require_admin),
):
```

**Step 4: Add ADMIN_SECRET to render.yaml env vars**

Modify `render.yaml` to add:
```yaml
      - key: ADMIN_SECRET
        sync: false
```

**Step 5: Commit backend changes**

```bash
git add backend/main.py render.yaml
git commit -m "feat: protect contact messages endpoint with admin secret header"
```

---

### Task 5: Next.js — Admin page at /admin

Replace the existing `/dashboard` page (which has old DevUnity mock data) with a clean `/admin` page for Asadullah to view contact messages.

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/app/api/admin/messages/route.ts`

**Step 1: Create the Next.js API proxy for admin messages**

Create: `src/app/api/admin/messages/route.ts`
```typescript
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
    if (!response.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
```

Note: `ADMIN_SECRET` is a server-only env var (no `NEXT_PUBLIC_` prefix) — it's never exposed to the browser.

**Step 2: Create the admin page**

Create: `src/app/admin/page.tsx`
```tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Clock, Lock, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Simple client-side password gate (the real auth is on the server via ADMIN_SECRET)
  const GATE_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_GATE || "admin";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === GATE_PASSWORD) {
      setAuthed(true);
    } else {
      setError("Wrong password");
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/admin/messages");
      if (!r.ok) throw new Error("Failed");
      const data = await r.json();
      setMessages(Array.isArray(data) ? data : data.messages || []);
    } catch {
      setError("Failed to load messages. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) fetchMessages();
  }, [authed]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm p-8 rounded-xl bg-zinc-900 border border-zinc-800"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-[#9CE630]" />
            <h1 className="text-white font-semibold text-lg">Admin Access</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#9CE630]"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-[#9CE630] text-black hover:bg-[#8BD520]">
              Login
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-[#9CE630]" />
            <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
            <span className="px-2 py-0.5 text-xs bg-[#9CE630]/10 text-[#9CE630] rounded-full">
              {messages.length} total
            </span>
          </div>
          <Button
            onClick={fetchMessages}
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:border-[#9CE630]"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#9CE630]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">No messages yet.</div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl border ${
                  msg.read
                    ? "bg-zinc-900/50 border-zinc-800"
                    : "bg-zinc-900 border-[#9CE630]/30"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium">{msg.name}</h3>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-[#9CE630] text-sm hover:underline"
                    >
                      {msg.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 text-xs">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.created_at).toLocaleString()}
                    {!msg.read && (
                      <span className="ml-2 px-2 py-0.5 bg-[#9CE630]/10 text-[#9CE630] rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-zinc-300 text-sm font-medium mb-2">{msg.subject}</p>
                <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 3: Add env vars to Vercel**

In Vercel Dashboard, add:
- `ADMIN_SECRET` = (same value set in Render) — server-only, NOT prefixed with NEXT_PUBLIC
- `NEXT_PUBLIC_ADMIN_GATE` = a simple UI password (e.g., your own password) — this is the client-side gate

**Step 4: Build check**

Run: `npm run build`
Expected: Compiles without errors.

**Step 5: Commit**

```bash
git add src/app/admin/page.tsx src/app/api/admin/messages/route.ts
git commit -m "feat: add admin dashboard at /admin to view contact messages"
```

---

## Phase 3 — AI Chat Widget Polish

### Task 6: Backend — add streaming endpoint for chat

Add a `GET /api/agent/chat/stream` (Server-Sent Events) endpoint to `backend/main.py` that streams the AI response token by token.

**Files:**
- Modify: `backend/main.py`

**Step 1: Read current agent chat endpoint in main.py**

Search for `@app.post("/api/agent/chat")` in `backend/main.py`. Understand current response format.

**Step 2: Add streaming endpoint**

After the existing `POST /api/agent/chat`, add:
```python
from fastapi.responses import StreamingResponse
import asyncio

@app.post("/api/agent/chat/stream")
async def chat_stream(request: Request, body: dict):
    """Stream AI agent response as Server-Sent Events."""
    message = body.get("message", "")
    session_id = body.get("session_id", "default")

    async def generate():
        try:
            # Run agent and stream response
            result = await asyncio.get_event_loop().run_in_executor(
                None, run_agent, message, session_id
            )
            answer = result.get("answer", "I'm not sure. Please contact Asadullah directly!")
            # Stream word by word for effect
            words = answer.split(" ")
            for i, word in enumerate(words):
                chunk = word + (" " if i < len(words) - 1 else "")
                yield f"data: {json.dumps({'token': chunk})}\n\n"
                await asyncio.sleep(0.03)
            yield f"data: {json.dumps({'done': True})}\n\n"
        except Exception as e:
            logger.error(f"Stream error: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
```

**Step 3: Commit backend**

```bash
git add backend/main.py
git commit -m "feat: add streaming SSE endpoint for AI chat agent"
```

---

### Task 7: Frontend — upgrade AI chat widget with streaming

Upgrade `AIChatAgent.tsx` to use the streaming endpoint and improve visual design.

**Files:**
- Modify: `src/components/AIChatAgent.tsx`
- Modify: `src/app/api/agent/chat/route.ts` (add streaming proxy)

**Step 1: Add streaming proxy route**

Add a new streaming proxy: `src/app/api/agent/chat/stream/route.ts`
```typescript
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
    // Pass through the stream
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return NextResponse.json({ error: "Stream unavailable" }, { status: 503 });
  }
}
```

**Step 2: Update AIChatAgent.tsx to use streaming**

Key changes in `AIChatAgent.tsx`:
1. Change `handleSubmit` to use EventSource / fetch with streaming
2. Add streaming state: `const [streamingContent, setStreamingContent] = useState("")`
3. While streaming, render a temporary "assistant" bubble that grows as tokens arrive
4. On `done` event, move streamingContent into messages array
5. Update header branding: "Powered by Claude + LangGraph"
6. Add a `Zap` icon next to the chat button to signal AI capability

Streaming fetch pattern:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!input.trim() || isLoading) return;

  const userMsg = input.trim();
  setMessages((prev) => [...prev, { role: "user", content: userMsg, timestamp: new Date() }]);
  setInput("");
  setIsLoading(true);
  setStreamingContent("");

  try {
    const response = await fetch("/api/agent/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.token) {
                accumulated += data.token;
                setStreamingContent(accumulated);
              }
              if (data.done) {
                setMessages((prev) => [...prev, {
                  role: "assistant",
                  content: accumulated,
                  timestamp: new Date(),
                }]);
                setStreamingContent("");
              }
            } catch {}
          }
        }
      }
    }
  } catch {
    setMessages((prev) => [...prev, {
      role: "assistant",
      content: "Sorry, I encountered an error. Please try again!",
      timestamp: new Date(),
    }]);
  } finally {
    setIsLoading(false);
    setStreamingContent("");
  }
};
```

In the messages render, add after the messages list:
```tsx
{streamingContent && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-start gap-3"
  >
    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <div className="max-w-[80%] p-3 rounded-lg text-sm bg-zinc-800 text-white">
      {streamingContent}
      <span className="inline-block w-1 h-3 ml-0.5 bg-[#9CE630] animate-pulse" />
    </div>
  </motion.div>
)}
```

**Step 3: Update header branding**

In AIChatAgent.tsx header, change:
```tsx
<p className="text-xs text-black/80">Powered by LangGraph AI</p>
```
to:
```tsx
<p className="text-xs text-black/80">Claude + LangGraph Agent</p>
```

**Step 4: Build check**

Run: `npm run build`
Expected: No errors.

**Step 5: Commit**

```bash
git add src/components/AIChatAgent.tsx src/app/api/agent/chat/stream/route.ts
git commit -m "feat: upgrade AI chat widget with streaming SSE and Claude branding"
```

---

## Final: Deploy to Vercel

**Step 1: Push all commits**

```bash
git push origin main
```

**Step 2: Set env vars in Vercel (if not done)**

| Key | Value | Notes |
|-----|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://asadullahshafique-devunity.onrender.com` | Client+server visible |
| `ADMIN_SECRET` | `<same as Render>` | Server-only |
| `NEXT_PUBLIC_ADMIN_GATE` | `<your UI password>` | Client visible (UI gate only) |

**Step 3: Verify live**

- Visit `https://asadullahshafique-devunity.vercel.app` → Hero should show live GitHub stats
- Blog section → shows live posts from API
- Contact form → submits and appears in `/admin`
- `/admin` → enter password → see contact messages
- Chat widget → streaming AI responses

**Step 4: Final commit if any fixes needed**

```bash
git add -p
git commit -m "fix: post-deploy corrections"
git push origin main
```

---

## Summary of Files Changed

| File | Action | Phase |
|------|--------|-------|
| `src/app/api/blog/route.ts` | Create | 1 |
| `src/hooks/useGitHubStats.ts` | Create | 1 |
| `src/components/GitHubStatsStrip.tsx` | Create | 1 |
| `src/components/Hero.tsx` | Modify | 1 |
| `src/components/Blog.tsx` | Modify | 1 |
| `backend/main.py` | Modify (admin auth + streaming) | 2, 3 |
| `render.yaml` | Modify (add ADMIN_SECRET) | 2 |
| `src/app/api/admin/messages/route.ts` | Create | 2 |
| `src/app/admin/page.tsx` | Create | 2 |
| `src/app/api/agent/chat/stream/route.ts` | Create | 3 |
| `src/components/AIChatAgent.tsx` | Modify | 3 |
