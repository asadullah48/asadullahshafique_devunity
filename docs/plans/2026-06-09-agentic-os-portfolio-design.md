# Agentic OS Portfolio — Design Document
**Date:** 2026-06-09  
**Branch:** feat/bazaar-project-card  
**Status:** Approved → In Implementation

---

## Vision

Transform asadullahshafique.dev from a standard developer portfolio into an **Agentic OS Portfolio** — a portfolio that *looks and feels like it was built by someone who builds AI agents*. Every design choice signals expertise in agentic AI systems.

---

## Section 1: Hero — Agent Identity Card

### Goal
Replace generic "Hi I'm X" hero with an **agent profile card** that communicates agentic identity at first glance.

### Elements
- **Status badge**: `● ONLINE — General Agent` with animated pulse
- **Agent capabilities row**: pill badges for `[python]` `[next.js]` `[fastapi]` `[docker]` `[langgraph]` with hover effects
- **Live counters**: Projects delivered, Hackathons, GitHub stars (animated count-up on scroll-into-view)
- **Terminal cursor**: Blinking cursor effect after the main title/tagline
- **Agent uptime**: Subtle "uptime" display (days since first commit or founding date)

### Tech
- Framer Motion count-up animation
- CSS blinking cursor (`animate-pulse` or `@keyframes blink`)
- Existing brand color: `#9CE630` lime green for status indicator

---

## Section 2: AI Chat → Dual-Mode Agent

### Goal
Upgrade `AIChatAgent.tsx` to demonstrate multi-agent architecture expertise by *being* a multi-agent system.

### Modes
| Mode | Label | System Context |
|------|-------|----------------|
| General | `Portfolio Guide` | Full knowledge of Asadullah: skills, projects, hackathons, contact |
| Python/FastAPI | `Backend Specialist` | Deep dive: FastAPI, Python, Render deployments, API design |
| Next.js/UI | `Frontend Architect` | Next.js 15, TypeScript, Tailwind, Framer Motion expertise |
| AI Agents | `Agent Builder` | LangGraph, Claude API, streaming, MCP, agentic patterns |

### UI Changes
- **Mode selector**: Horizontal pill tabs at the top of the chat window
- **Agent thinking indicator**: When loading, show step-by-step tool-use hints
- **Mode badge** in header updates when mode switches
- Each mode sends `{ message, mode }` to backend; backend selects system prompt by mode

### API Change
`POST /api/agent/chat/stream` body: `{ message: string, mode: "general" | "python" | "nextjs" | "agents" }`

---

## Section 3: Skills → Agent Capabilities Panel

### Goal
Reframe Skills section as an **OS capability manifest** grouped by agent role.

### Groups
| Agent Role | Skills |
|------------|--------|
| `AI Agent Layer` | LangGraph, Claude API, LangChain, MCP, Streaming SSE |
| `Backend Runtime` | Python, FastAPI, Docker, Render, PostgreSQL |
| `Frontend Interface` | Next.js 15, TypeScript, React, Tailwind, Framer Motion |
| `Infrastructure` | Git, GitHub Actions, Vercel, WSL/Linux |

---

## Implementation Order

1. **Hero revamp** — highest visual impact, sets the tone
2. **Chat dual-mode upgrade** — showcases agentic expertise
3. **Skills capabilities panel** — reframe existing content
4. **Polish pass** — spacing, typography, hover states

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/Hero.tsx` | Full revamp — agent identity card |
| `src/components/AIChatAgent.tsx` | Add mode switcher + thinking steps |
| `src/components/Skills.tsx` | Reframe as capabilities panel |
| `src/app/api/agent/chat/stream/route.ts` | Accept `mode` param, route system prompts |
