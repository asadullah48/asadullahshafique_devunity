# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 0. Ground Truth Before Narrative

This repo is the flagship artifact behind a public claim: *Agentic AI engineer, production systems, not prototypes.* The live site at
`https://asadullahshafique-devunity.vercel.app` advertises capabilities this codebase does not yet contain.

**Verified gaps as of 2026-08-23 — do not repeat these claims in code, comments, or copy until the code backs them:**

| Site / README claims | Repository reality |
| --- | --- |
| ~~"OpenAI Agents SDK, MCP servers, Constitutional AI"~~ | **RESOLVED.** Agents SDK: real (`backend/orchestration/`). MCP: real (`/mcp/server`). Constitutional AI: real (`backend/constitution/`) — a written constitution enforced as SDK guardrails, verified blocking 4/4 violations with no model reachable. |
| "Munshi AI — 5 read-only tools, constitutionally guarded" | `backend/agent.py:98` → `TOOLS = [get_portfolio_info]`. One tool. Not in this repo. |
| ~~README: "LangGraph AI agents (4 agents)"~~ | **RESOLVED — Phase 3.** There are now four real specialist agents plus a triage orchestrator, on the Agents SDK, with handoffs and typed shared state. The old LangGraph graph and the prompt-function trio survive as fallback rungs. |
| ~~`mcp_server.py` is not a real MCP server~~ | **RESOLVED — Phase 2.** `portfolio_mcp` is a real `FastMCP` server on the official SDK, mounted at `/mcp/server` over Streamable HTTP. Verified with a live client: `initialize` → `tools/list` (6 tools) → `tools/call`, protocol `2025-11-25`. The `/mcp/*` REST paths remain a shim and are still not MCP. |
| ~~Split-brain portfolio facts across three diverged copies~~ | **RESOLVED — Phase 1.** All three consumers now read `backend/knowledge/portfolio.json`. See §2. |

**The Reality Rule — the highest-priority instruction in this file.** Never write a capability claim the repo cannot demonstrate on
request. When asked to add agentic language to copy, README, or docstrings, first confirm the code exists. If it does not, say so and
offer to build it. A portfolio that overstates its own substrate fails the exact audit it is meant to pass.

---

## 1. Commands

Verified against `package.json` and `backend/`. Do not invent scripts that are not listed here.

### Frontend

```bash
npm run dev                      # Next.js dev server → http://localhost:3000
npm run build                    # Production build. Type errors FAIL it (see §5).
npm run lint                     # next lint — advisory only, not enforced in build
npx tsc --noEmit                 # Type check without building — fastest correctness gate

npm run e2e                      # Playwright, all specs
npm run e2e:ui                   # Playwright interactive UI mode
npm run e2e:headed               # Playwright with a visible browser
npx playwright test e2e/home.spec.ts -g "substring of test name"   # single E2E test
```

**There is no `npm test`.** `jest.config.js`, `jest.setup.js`, and `src/__tests__/` exist but jest and
`@testing-library/react` are **not installed** and no `test` script is defined. That suite cannot run. See §5 before "fixing" it.

### Backend

```bash
cd backend
pip install -r requirements.txt
pip install -r requirements-test.txt
uvicorn main:app --reload --port 8000        # → http://localhost:8000/docs (Swagger)

# Tests. The DATABASE_URL override is usually required — see §5; an async
# driver URL in your shell makes every test error with MissingGreenlet.
DATABASE_URL="sqlite:///./devunity.db" pytest -q      # all backend tests
pytest tests/test_agent_mcp.py -v             # one file
pytest tests/test_agent_mcp.py::test_name -v  # one test
pytest -k "mcp" -v                            # by keyword

# 8 tests fail on a clean tree (contact/github/health). That is the known
# baseline, not something you broke. Compare counts before and after a change.

alembic upgrade head                          # apply migrations
alembic revision --autogenerate -m "message"  # new migration
```

### Agent evals (run from the repo root, not `backend/`)

```bash
python evals/run.py --no-judge         # deterministic checks, no model spend
python evals/run.py --strict           # full run; exit 1 on failure
python evals/run.py --suite routing    # one suite
```

`portfolio-contact` is expected to FAIL — see Rule 4. With no model key the runner prints SKIPPED and exits 0.

Backend `PORT` defaults to `7860` in deployment (Hugging Face Spaces convention); local dev uses `8000`, which is what
`NEXT_PUBLIC_API_URL` falls back to.

### Full stack

```bash
docker-compose up                # frontend + backend together
```

---

## 2. Architecture

### The shape that matters

A **single-page portfolio** (`src/app/page.tsx`, section anchors: `#about`, `#skills`, `#agent-engineering`, `#projects`,
`#hackathons`, `#blog`, `#opensource`, `#discord`, `#contact`) sitting on top of **13 full legacy "DevUnity community platform"
routes** that were never removed.

**No page in `src/app/` calls `redirect()`.** Any note claiming these are redirect stubs is stale. `about/`, `blogs/`, `community/`,
`explore/`, `dashboard/` (482 lines), `videos/` (391), `ai-tools/` (597), `backendless/` (465), `resume/` (533), `privacy/` (359),
`login/`, `signup/`, `question/` all render real pages. `src/app/about/page.tsx` pitches "Vibrant Community — Connect with
developers from around the world," which directly contradicts the agentic-engineer positioning on `/`. Treat this split identity as
a known defect, not as intent.

### Request path

Browser → Next.js route handler in `src/app/api/*/route.ts` → FastAPI on Render → external services.

The Next API routes are **thin proxies**, not logic. Their entire job is forwarding and injecting server-only secrets. All eight:
`admin/messages`, `agent/chat`, `agent/chat/stream`, `blog`, `contact`, `github/contributions`, `github/stats`, `health`.

Backend resolution is **not uniform** — check the route before assuming:
`blog`, `contact`, and `health` use `process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"`, while `admin/messages` prefers
the server-only `FASTAPI_BACKEND_URL` and falls back to `NEXT_PUBLIC_API_URL`. Prefer `FASTAPI_BACKEND_URL` for any new route that
must not leak its origin to the client bundle.

**The chat widget does not use the FastAPI backend at all.** `src/components/AIChatAgent.tsx:81` posts to
`/api/agent/chat/stream`, which calls **Google Gemini** (`gemini-3.5-flash-lite`, overridable via `GEMINI_MODEL`) directly from
Vercel serverless and re-emits the model stream as SSE (`data: {token}` frames, terminated by `data: {done: true}`). It reads its
facts from `src/lib/agent-knowledge.ts`. There is a *second*, separate agent implementation in `backend/agent.py` (LangGraph +
Anthropic) behind `/api/agent/chat` on FastAPI — showcased in the repo, not on the live path.

Two deliberate timeouts guard the serverless route: `UPSTREAM_TIMEOUT_MS = 8000` bounds time-to-first-byte only (the stream is off
the clock once it starts), and `maxDuration = 30`. The comment at `route.ts:12` records why `flash-lite` is pinned — the full flash
models are reasoning models that spend the token budget thinking and blow the function limit. Do not "upgrade" that model without
re-measuring.

`/api/admin/messages` injects the `X-Admin-Token: $ADMIN_SECRET` header server-side so the secret never reaches the client. The
`/admin` page itself is gated client-side by `NEXT_PUBLIC_ADMIN_GATE`, which is a UI convenience, **not** a security boundary — the
real check is the header the proxy adds.

### Backend

`backend/main.py` is **1,283 lines and ~30 endpoints spanning 8 unrelated domains** (contact, blog, github, agent, learning, video,
privacy, backendless). This is the single largest structural problem in the repo and the direct target of Rule 1 below. It does use
SQLAlchemy sessions via `Depends(get_db)` and Alembic migrations correctly — persistence is real, the organization is not.

| File | Role |
| --- | --- |
| `main.py` | FastAPI app, all routes, CORS, rate limiting (`slowapi`) |
| `agent.py` | One LangGraph graph + three prompt functions + static fallbacks |
| `mcp_server.py` | `/mcp` router — MCP-shaped, not MCP (see §0) |
| `models.py`, `database.py`, `db_helpers.py` | SQLAlchemy models, session factory, query helpers |
| `alembic/` | Migrations |

**Every agent path degrades gracefully without an API key — on both sides. This is a load-bearing property; preserve it.**
Backend: `LANGGRAPH_AVAILABLE` guards the import, `_build_graph()` returns `None` when `ANTHROPIC_API_KEY` is unset, and
`get_static_response()` / `get_static_error_solution()` serve keyword-matched canned answers. Frontend: no `GEMINI_API_KEY`, an
unreachable model, a non-OK response, or a stream that yields zero text all fall through to `offlineAnswer()`, which is streamed
word-by-word and labeled *"(Instant answer — the live AI model is currently offline.)"*. The deployed site must never 500 or hang
on a spinner because a key is missing.

### Portfolio facts: one source, three renderers

**`backend/knowledge/portfolio.json` is the single source of truth. Edit it and nowhere else.**

| Consumer | Reads via | Renders |
| --- | --- | --- |
| `backend/agent.py` | `from knowledge import PORTFOLIO_DATA` | LangGraph tool answers + static fallbacks |
| `backend/mcp_server.py` | `from knowledge import MCP_TOOL_RESULTS as TOOL_RESULTS` | MCP tool results |
| `src/lib/agent-knowledge.ts` | `import portfolio from "../../backend/knowledge/portfolio.json"` | Gemini system prompt + `offlineAnswer()` |

`backend/knowledge/__init__.py` is the Python loader. It deliberately exposes **compat shapes** — `PORTFOLIO_DATA` carries exactly
the 11 keys `agent.py` already read, and `MCP_TOOL_RESULTS` the keys `mcp_server.py` already served — so adopting the source was a
definition swap, not a rewrite. Removing a key from those dicts breaks its consumer silently.

**Why the JSON lives under `backend/` rather than at the repo root:** `docker-compose.yml:41` builds the backend with context
`./backend`, and `render.yaml:5` documents Render's root directory as `backend`. A repo-root `knowledge/` simply would not exist
inside the backend image. The frontend builds from the repo root with no `.vercelignore`, so it can read *down* into `backend/`.
That directory is the intersection of all three build contexts. **Moving it up breaks production silently** — the frontend would
still compile while the backend image lost its data file.

Until Phase 1 these facts lived in three literals that had drifted apart: the backend copies still named "Textbook RAG Chatbot" as
current work while the live site led with Bazaar. **Do not add a fourth copy.** Add a renderer, never a literal.

One duplicate remains, deliberately out of Phase 1 scope: `src/components/Projects.tsx` holds `PROJECTS_EN` / `PROJECTS_AR` with
its own project list plus Arabic translations. It is presentational (images, links, case-study copy) and bilingual, so folding it in
needs an i18n story for the JSON first. Treat it as known debt, not as license to add more.

### Constitutional AI

`backend/constitution/principles.json` is the written constitution — five principles, three on input (academic dishonesty,
illegal activity, harmful content) and two on output (no fabricated credentials, no prompt disclosure). Edit it and nowhere else.

Enforced as SDK guardrails: `constitutional_input_guardrail` on the **orchestrator** (one entry point, so nothing slips past by
taking a different route) and `constitutional_output_guardrail` on the **Portfolio Specialist** only — the one agent emitting free
prose about a real person, where a fabricated employer or client would do real damage. The other three return structured objects
already constrained by their `output_type`.

**Two layers, ORed, deterministic first:**

| Layer | Needs a model? | Character |
| --- | --- | --- |
| `deterministic_patterns` substring screen | No | High precision, low recall — deliberately narrow |
| LLM classifier against each principle's `rule` | Yes | Broad recall, costs a call |

The deterministic layer is why this is not decoration. It trips the guardrail **before** any model call, so the constitution stayed
enforced during development while every provider was out of quota — verified: 4/4 violations blocked with nothing reachable.

**Fail-open is deliberate.** A classifier outage degrades enforcement to deterministic-only and lets the request through, rather
than refusing everything and taking the site down in front of the audience it exists to impress. `constitution_status()`
(surfaced at `/api/agent/info`) reports `"full"` or `"deterministic-only"` so the degradation is visible, not silent.

**Never widen `deterministic_patterns` casually.** A pattern that fires on a legitimate question is worse than one that misses —
over-blocking a portfolio assistant is a visible failure. `evals/cases/constitution.json` carries explicit *allow* cases
(explaining a concept mentioning "homework", defensive-security questions) precisely to catch that.

**A tripwire is a result, not an error.** `orchestrator._run` re-raises `InputGuardrailTripwireTriggered` /
`OutputGuardrailTripwireTriggered` instead of swallowing them, and `run_orchestrated_chat` converts them to
`{"mode": "refused"}`. If they were collapsed to `None` like other failures, `agent.py` would read that as "drop a rung" and
answer the refused request via the unguarded LangGraph or static path — **the ladder would silently bypass the constitution.**
This is verified by an eval case; do not refactor that exception handling without re-running it.

### Frontend conventions

- Design tokens live in `src/app/globals.css`. `:root` **is** dark ("Midnight Carbon"); `.light` is the opt-in override. Retheming
  means editing the token block, never the components.
- Do not reintroduce literal hex or `zinc-*` in components. Use `brand` / `brand-soft` / `surface-N` / `muted-foreground`.
  `--brand` (`#00F2FF`) is for fills, hairlines, glows and short labels; `--brand-soft` (`#57DEEB`) is for sustained body copy —
  full-saturation cyan vibrates in paragraph-length text on near-black.
- `--violet` (`#8B5CF6`) is **ambient only** (aurora, glow, mesh). Never on a clickable control. Cyan is the only interactive color.
- Two files intentionally keep literal hex: `opengraph-image.tsx` (Satori/Edge cannot resolve CSS custom properties) and
  `GitHubHeatmap.tsx` (5-step ramp).
- Every token defined in `:root` must have a `.light` counterpart. A missing one silently inherits the dark value.
- `Button` has 8 semantic variants; call sites must not pass color classes.
- **Eight files style a light base with `dark:` overrides** (dashboard, `question/[id]`, SearchDialog, login, signup, Discord,
  skeleton). Their bare neutrals must **not** be codemodded onto tokens — it breaks each light/dark pair.
- shadcn/ui is configured to the **"new-york"** style (`components.json`). Merge classes with the `cn()` helper from
  `src/lib/utils.ts`.
- **i18n:** `useLocale()` from `src/context/LocaleContext.tsx` exposes exactly `{ locale, setLocale, t }` — translate with
  `t("hero.greeting")` against `src/i18n/en.json` / `ar.json`. It does **not** export `isRTL`; older notes claiming
  `const { t, isRTL } = useLocale()` are wrong. RTL comes from `tailwindcss-rtl` plus `dir` on `<html>`, and locale persists in
  `localStorage` under the key `locale`.
- **Hydration:** client-state components use a mounted check before rendering theme-dependent output, and `<html>`/`<body>` carry
  `suppressHydrationWarning` for theme mismatches. Browser extensions (Grammarly and similar) inject attributes that produce
  warnings which can be ignored.
- **ESLint is deliberately permissive** (`.eslintrc.json`): `no-unused-vars`, `no-explicit-any`, `no-unescaped-entities`, and
  `no-empty-object-type` are all `off`. Lint passing therefore says very little — `npx tsc --noEmit` is the real gate.

---

## 3. The Four Agentic Rules

These govern **the agent and backend surface** (`backend/`, `src/app/api/`, `evals/`). They do **not** govern presentational
frontend work — a `Reveal` component or a Tailwind token fix does not need an orchestration layer or an OODA loop. Stating this
boundary explicitly is deliberate: rules applied where they do not fit get ignored everywhere.

### Rule 1 — Architecture: Agent-First, multi-agent orchestration

**Substrate: the OpenAI Agents SDK.** Chosen over LangGraph deliberately — the public positioning already claims it, and the
flagship repo must demonstrate what its author teaches. Built in Phase 3; lives in **`backend/orchestration/`**.

```
Portfolio Orchestrator (triage, owns ALL routing)
    ├── Portfolio Specialist      6 knowledge tools
    ├── Error Solver Specialist   structured: ErrorSolution
    ├── Learning Specialist       structured: Lesson
    └── Teaching Specialist       structured: TeachingResult
```

| File | Role |
| --- | --- |
| `context.py` | `PortfolioContext` — the typed shared state. Records `route` and `tool_calls` so a run can be explained afterwards. |
| `runtime.py` | SDK availability, model resolution, `orchestration_status()` |
| `specialists.py` | The four domain agents, their tools, and their structured output models |
| `orchestrator.py` | The triage agent and the four entry points |

**Invariants — breaking any of these breaks the design, not just the code:**

- **Specialists hold no handoffs.** Only the orchestrator routes. That keeps the graph a star, guarantees one hop, and makes
  `route` meaningful. Adding a specialist→specialist handoff turns it into a mesh where no run is explainable.
- **Typed state, never dicts.** `PortfolioContext` is the shared state. The SDK never serializes it into the prompt — it is for
  your code (tools, hooks, callbacks), so put dependencies and audit trails there and nothing the model must read.
- **Structured output is a contract, not decoration.** `ErrorSolution` / `Lesson` / `TeachingResult` mirror `main.py`'s
  `ErrorSolverResponse` (line 605), `LearnResponse` (629), `TeachResponse` (653). Change one, change both.
- **Every entry point returns `None`, never raises.** `agent.py` reads `None` as "drop a rung".

**The fallback ladder, in `agent.py`:** `Agents SDK → LangGraph → static keyword answers`. Each rung degrades on a dead key or an
exhausted quota. This is the load-bearing availability property; do not collapse it into a single path.

**Triage is not applied where the URL already decided.** `/api/agent/chat` runs the orchestrator, because a visitor question could
be about anything. `/api/agent/solve-error`, `/api/learn` and `/api/teach` invoke their specialist directly — re-routing an
already-routed request is a wasted model call, not extra rigour.

Still outstanding: decompose `main.py` by domain. Do not add new endpoints to it; new surface goes in its own router. New
capability belongs to an agent with a stated responsibility, not to a new `@app.post` in a 1,283-line file.

### Rule 2 — Tooling: MCP-first

External capability is exposed as an **MCP tool**, not a bespoke endpoint. Before writing an HTTP integration, ask whether it should
be an MCP tool the orchestrator calls.

`backend/mcp_server.py` is the reference implementation. Since Phase 2 it holds **two surfaces that must not be confused**:

- **`portfolio_mcp`** — a real `FastMCP` server (official `mcp` SDK, `requirements.txt`) serving Streamable HTTP, mounted by
  `main.py` at **`/mcp/server`**. Six read-only tools: `get_skills`, `get_projects`, `get_contact`, `get_about`,
  `get_hackathons`, `get_agent_engineering`. This is the URL to give an MCP client.
- **`router`** — the legacy `/mcp/*` REST shim. **Not MCP**: no handshake, no capability negotiation. Kept only because the README
  documents it and `tests/test_agent_mcp.py` pins it. Never call it an MCP server in user-facing copy.

Two settings on `portfolio_mcp` are load-bearing:

- **`stateless_http=True`** — `backend/Dockerfile:48` runs `uvicorn --workers 2`. Streamable HTTP session state is in-process, so
  with two workers and no sticky routing a client could `initialize` on one worker and have the next request hit the other.
  Turning this off requires a shared `EventStore` or sticky sessions at the load balancer.
- **`streamable_http_path="/"`** — the app is mounted *at* `/mcp/server`, so its internal route is the root. Both `/mcp/server`
  and `/mcp/server/` were verified working.

**The session manager must be started by the host lifespan.** A mounted ASGI sub-app never runs its own lifespan, so
`main.py`'s `lifespan` enters `portfolio_mcp.session_manager.run()`. Without it every `/mcp/server` request dies with a task-group
error. It also **can only be run once per instance** — which is why `tests/conftest.py`'s `client` fixture is `scope="session"`.
A function-scoped client fails every test after the first with
`RuntimeError: StreamableHTTPSessionManager .run() can only be called once per instance`.

New capability is added as a tool on `portfolio_mcp`, not as another REST route. Tools must be **read-only by default**; a
write-capable tool requires an explicit, stated reason.

### Rule 3 — Reasoning: Plan-Act-Verify (OODA)

Every agent-surface feature runs an explicit loop:

1. **Plan** — state the goal and the success condition *before* acting. The success condition must be checkable, not a vibe.
2. **Act** — take the smallest step that can be verified.
3. **Verify** — check the result against the condition from step 1. Run the command. Read the output.
4. **Loop or stop** — on failure, revise the plan; do not retry the same action.

This binds the assistant's own working method too: **do not report an agent behavior as working without having run it.** "The build
should pass" is not verification; `npm run build` exiting 0 is.

### Rule 4 — Evaluation: `evals/`

**Built in Phase 4. Lives in `evals/`** (repo root — dev tooling, ships in neither image). See `evals/README.md`.

```bash
python evals/run.py                    # every suite
python evals/run.py --no-judge         # deterministic only, no model spend
python evals/run.py --strict           # exit 1 on failure — what CI runs
```

**Two layers, and a case passes only if both pass:**

| Layer | Reads | Catches |
| --- | --- | --- |
| Deterministic | `PortfolioContext.trace()` — route, tools, substrings | Wrong specialist; **tool skipped**; banned content |
| Judged | An LLM scoring prose against the full `portfolio.json` | Vague, unfaithful, or invented answers |

The deterministic layer is the one that earns its keep. The failure mode that actually bites is **the agent answering fluently
from memory instead of calling its tool** — a judge scoring only prose passes a confident, plausible, unsourced answer. `trace()`
does not. This is why Phase 3 put `route` and `tool_calls` in the context in the first place.

**`portfolio-contact` is committed RED on purpose.** The Portfolio Specialist answered "use the contact form" with an empty
`tool_calls` trace while holding the real email, phone and Discord link. A fix landed in `specialists.py`
(`PORTFOLIO_INSTRUCTIONS` now names each tool trigger and forbids that evasion) but is **UNVERIFIED** — all providers were
quota-exhausted. **Run `python evals/run.py --suite portfolio` to find out.** Fix the agent, never the case: deleting or loosening
a red case to get a green suite defeats the whole point.

**Rubrics** (`evals/judge.py`) each state explicitly what a 5 and a 1 look like. Vague rubrics produce judges that score everything
4 and detect nothing. Threshold is 4/5. The judge is handed the full `portfolio.json` as reference facts and must give a reason
before a score — a judge without ground truth is a second opinion with the same blind spots. Set `JUDGE_MODEL` to grade with a
different provider than the agents use; a model is a lenient judge of its own family.

**Rate limits are a first-class concern.** A suite is a burst of requests, which is exactly what trips free-tier per-minute quotas.
The runner retries (`--attempts`) and paces (`--delay`). Unpaced, it scored a run 2/6 that was genuinely 6/6 — it was measuring its
own throttling. `no result after N attempts` means suspect quota before suspecting the agent.

Wired into `.github/workflows/backend-ci.yml`. That step **can** fail the build, but only when a model key exists; with no key it
emits a GitHub warning and exits 0 rather than reporting a green run that measured nothing. An agent whose quality is unmeasured is
a demo — but a CI step that reports success without measuring is worse.

---

## 4. Deployment

| Surface | Host | Notes |
| --- | --- | --- |
| Frontend | Vercel, auto-deploys on push to `main` | `https://asadullahshafique-devunity.vercel.app` |
| Backend | Render | `https://asadullahshafique-devunity.onrender.com` (`/docs` for Swagger) |
| Backup backend | Hugging Face Spaces | Currently stuck; not a live fallback |

Required Vercel environment variables:

| Key | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | **Powers the live chat widget.** Absent → the widget streams `offlineAnswer()` instead. |
| `GEMINI_MODEL` | Optional override; defaults to `gemini-3.5-flash-lite`. See the pinning note in §2. |
| `NEXT_PUBLIC_API_URL` | FastAPI origin for the proxy routes (blog, contact, health) |
| `FASTAPI_BACKEND_URL` | Server-only backend origin; preferred by `/api/admin/messages`. Use for new non-public routes. |
| `ADMIN_SECRET` | Server-only; must match the Render value. Injected by `/api/admin/messages`. |
| `NEXT_PUBLIC_ADMIN_GATE` | Client-side UI gate for `/admin` — not a security control |

Backend env: `DISCORD_WEBHOOK_URL`, `GITHUB_TOKEN`, `ANTHROPIC_API_KEY`, `ADMIN_SECRET`. All optional; absence degrades features
rather than breaking the app.

CI lives in `.github/workflows/`: `frontend-ci`, `backend-ci`, `code-quality`, `docker-build`, `k8s-deploy`.

---

## 5. Constraints that already cost a real bug

Each of these was learned the expensive way. Do not undo them without reading the reason.

- **`typescript.ignoreBuildErrors` is `false` and must stay false.** It was `true` during an earlier Vercel firefight, which meant
  `strict: true` in `tsconfig.json` bought nothing — the compiler complained and shipped anyway. Two real errors sat in `main` for
  months because of it. ESLint stays advisory *for now*; tighten it separately after auditing what it actually reports.

- **`src/__tests__` is excluded in `tsconfig.json` on purpose.** Including it would disable type enforcement for the entire app to
  accommodate code that cannot compile and never executes. Fix it properly (install jest + testing-library, add a `test` script) or
  delete it. Do not "fix" it by re-including it.

- **framer-motion is removed. Do not reintroduce it.** Scroll reveals use the `.reveal` class / `<Reveal>` component; enter
  animations use `tailwindcss-animate` (`animate-in fade-in-0 zoom-in-95 …`), already a dependency. Exit animations and
  shared-element (`layoutId`) flights are gone by choice. Removing it took the homepage from 211 kB to 171 kB First Load JS.

- **`useLocale()` (`src/context/LocaleContext.tsx`) forces `"use client"` on 17 components.** This is the single largest remaining
  bundle constraint: no section consuming it can become a server component until i18n moves to cookies or route segments.

- **Source files are CRLF.** A codemod regex written against `\n` silently no-ops on `;\r\n`. Normalise → transform → restore the
  line ending on write.

- **Both `next.config.js` and `next.config.ts` exist.** `.js` is authoritative; `.ts` is intentionally emptied to a comment to avoid
  a dual-config conflict. Edit the `.js`.

- **Never create `backend/agents/`.** The `openai-agents` wheel installs a **top-level module named `agents`**. The backend runs
  with its own directory first on `sys.path`, so a package at `backend/agents/` would shadow the SDK and
  `from agents import Agent` would import your own package. That is why the Phase 3 code lives in `backend/orchestration/`.
  Renaming it back reintroduces the bug. (`backend/agent.py`, singular, is the legacy module and does not collide.)

- **Agents SDK tracing uploads to OpenAI by default; it is disabled here on purpose.** `orchestration/runtime.py` calls
  `set_tracing_disabled(True)` unless `AGENTS_TRACING=on`. Left at the default, every visitor question to the portfolio agent
  would be shipped to OpenAI's platform. Turn it on only deliberately.

- **`DATABASE_URL` must name a SYNC driver. An async driver crashes the app at startup.** `backend/database.py:42` uses
  synchronous `create_engine()` with a synchronous `Session`. Point `DATABASE_URL` at `postgresql+asyncpg://…` (a Neon connection
  string, for instance) and startup dies with
  `sqlalchemy.exc.MissingGreenlet: greenlet_spawn has not been called`, from deep inside `dialects/postgresql/asyncpg.py`. The
  traceback names greenlet and looks like an environment problem; it is not. Use `postgresql://` or `postgresql+psycopg2://`, or
  convert `database.py` to `create_async_engine` + `AsyncSession` throughout — not one or the other half-way.

  This bites locally too: if a `postgresql+asyncpg` `DATABASE_URL` is exported in your shell, **every backend test errors** and
  `uvicorn` exits with code 3. Run the suite with the SQLite default forced:
  `DATABASE_URL="sqlite:///./devunity.db" python -m pytest -q`.

- **Known and unfixed:** several buttons pair `bg-brand` with a literal `text-black`. In light mode `--brand` resolves to a dark
  teal, so that renders black on teal — poor contrast. It lives in the eight deferred light/dark files listed in §2 and needs its
  own careful pass, not a find-and-replace.

---

## 6. Environment notes

- Windows 11. Two shells are available and take different syntax: PowerShell (primary) and Git Bash. PowerShell here-strings
  (`@'...'@`) do **not** parse in the Bash tool and leak a literal `@` into output — use a heredoc or `-F <file>` for multi-line
  git messages. This permanently corrupted one commit subject line already.
- `TaskStop` on `npx next start` kills the npx wrapper but not the node child, so the port stays bound. Free it with PowerShell:
  `Get-NetTCPConnection -LocalPort <port> -State Listen`.
- `gh` returns 404 on write operations because a scopeless `GITHUB_TOKEN` env var shadows the keyring token that has `repo` scope.
  Work around it per-command with `env -u GITHUB_TOKEN -u GITHUB_PERSONAL_ACCESS_TOKEN gh …`. `gh auth refresh` does not fix it.
