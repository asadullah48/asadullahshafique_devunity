# LinkedIn profile kit — aligned to the portfolio

Profile: `https://www.linkedin.com/in/asadullah-shafique-a00679325/`
Portfolio (canonical): `https://asadullahshafique-devunity.vercel.app`

**Source rule.** Every claim below traces to `backend/knowledge/portfolio.json` (facts) or
`src/lib/evidence.ts` (measured, checkable numbers). LinkedIn is where a reviewer starts; GitHub is
where they check. A number that exists on LinkedIn but not in `evidence.ts` is the exact failure the
2026-09-10 audit removed from the site — do not reintroduce it here.

**Deliberately absent:** "Zero failures", "85% code reuse", "149+ tests passing". All three were
removed from the site because nothing a stranger can open supports them.

**Check before posting** (in `portfolio.json`, NOT in `evidence.ts`):
- Bazaar "500+ verified sellers, 10K+ products" — live usage or target? If target, say "built for".
- FinAgent-Nexus "94 tests passing offline" — re-count in the repo before quoting.
- H4 tier — the site shows "Platinum (in progress)". Keep "in progress" until it is awarded.

---

## 0. Audit of the live profile (read in Chrome, 2026-09-13)

| Section | Live today | Problem | Fix |
| --- | --- | --- | --- |
| Headline | "Founder & Agentic AI Systems Engineer at D & N" | "D & N" is not named anywhere on the portfolio; a reader cannot tell what it is | Use a headline from §1 |
| About | **Missing** | The highest-leverage field on the profile is empty | Paste §2 |
| Experience | Texcot described in three overlapping roles (D & N Founder, Texcot Founder, Freelance) | Same story three times, three different start dates | Consolidate to the two roles in §3 |
| Experience | Freelance role: "**Shipped** Textile ERP Platform … deployed on Koyeb + Vercel" | Contradicts the D & N entry on the same profile ("Module 1 in build, targeting a 2026 launch") and `portfolio.json` ("in development") | One status, everywhere — see decision below |
| Experience | JK Embroidery and Steven Berry carry the **identical** description | Copy-paste: a Buying Agent role described as embroidery production planning | Rewrite or trim Steven Berry to one honest line |
| Skills | 9 skills; none are agentic (no Agents SDK, MCP, LangGraph) | The core positioning is invisible to recruiter search | §5 |
| Skills | "DeepLearning.AI", "Certified Python Developer" listed as skills | These are credentials, not skills | Move to Licenses & Certifications |
| Education | "Textile Institue of Pakistan" | Typo | "Institute" |
| Activity | Reposts claim "21+ production multi-agent platforms", "263+ / 180+ tests", "zero failed attempts", "85% code reusability", "40%+ cost-per-lead cut" | None is in `evidence.ts`; "zero failures" and "85% reuse" were **deliberately removed** from the site | Stop echoing them in your own posts; do not repeat in the About |
| Activity | Posts spell both "Texcot" and "Texco" | Brand inconsistency | Pick one |
| Open to work | Visible to everyone (green frame) | Reads as job-seeking next to a "Founder" headline | Recruiters-only, unless job-seeking is the priority |

**Decisions — RESOLVED 2026-09-13 by the profile owner:**
1. **D & N** = the current role: agentic AI architecture and development (OrchestratorX, ProtoBridge,
   GuardrailAI, Agents SDK, LangGraph, MCP). **Texcot** = the earlier textile sourcing / CMT / ERP
   domain work. Two roles, two stories, no overlap.
2. **Textile ERP and CMT Stitching & Packing system** = in development, running locally, **not
   deployed**. `portfolio.json` already says "in development" for both — no site change needed.
   On LinkedIn, remove "Shipped", "live production deployment", "deployed on Koyeb + Vercel" and
   "Built and operate a live …".

---

## 1. Headline (max 220 chars)

Pick one. All three lead with the role and follow with proof, not adjectives.

**A — Engineer-first (recommended for hiring / forward-deployed roles)**
> Agentic AI Engineer · Multi-agent systems on OpenAI Agents SDK, MCP & LangGraph · Constitutional guardrails + evals · Next.js / FastAPI · Panaversity

**B — Builder-for-business (recommended for clients / consulting)**
> I build agentic AI systems for real businesses — textile ERP, wholesale accounting, fintech compliance · OpenAI Agents SDK · MCP · Next.js / FastAPI

**C — Dual identity**
> Agentic AI Architect at D & N · Deterministic multi-agent systems: Agents SDK, MCP, LangGraph · Former founder, Texcot — building ERP for Pakistan's textile value chain

## 2. About (max 2,600 chars)

> Most AI demos answer a question. Very few are safe to leave running.
>
> I build the part around the model that makes the difference: what an agent is allowed to touch,
> how its runs are checked, and how work is routed between agents. I think of it as three
> disciplines — harness, loop and graph engineering — and I publish the source for each.
>
> **What that looks like in code I can show you:**
> → A triage orchestrator routing to four typed specialists on the OpenAI Agents SDK, with a
>   recorded route and tool trace for every run
> → A real MCP server (official SDK, Streamable HTTP) exposing six read-only tools
> → A written constitution — five principles — enforced as guardrails, with a deterministic layer
>   that still blocks violations when no model is reachable
> → Eval suites that score the execution trace, not just the prose, so a fluent answer that never
>   called its tool fails
> → A three-rung fallback (Agents SDK → LangGraph → static answers) so a dead API key degrades the
>   product instead of breaking it
>
> **Where I apply it:**
> • FinAgent-Nexus — multi-agent financial intelligence with Constitutional AI compliance review,
>   deterministic Shari'ah and regulatory screening, and a hash-chained audit trail (MIT, public)
> • AI TradeFlow — bilingual inventory and accounting for Pakistani wholesalers, built around
>   "Munshi", an agent with five read-only tools behind an input guardrail
> • Textile ERP Platform — ERP for Pakistan's textile and garment value chain (2026 target)
> • Bazaar — a unified marketplace with a B2C storefront and a B2B wholesale / RFQ engine
>
> I also run a business: I founded Texcot Embroidery Sourcing House, which is why my projects tend to
> start from a real operational problem rather than a model capability.
>
> I learned the craft through Panaversity's Agentic AI programme and six consecutive hackathon
> builds (H0–H5), each reusing the last — spec-first, evals before shipping.
>
> Stack: TypeScript, Python · Next.js, React, FastAPI · PostgreSQL, Supabase, Redis · Docker,
> Kubernetes, GitHub Actions · OpenAI Agents SDK, MCP, LangGraph, RAG.
>
> Portfolio, articles and source: asadullahshafique-devunity.vercel.app
> GitHub: github.com/asadullah48 — 29 public repositories
>
> Open to agentic AI engineering roles and to building AI systems with businesses in Pakistan
> and the UAE.

## 3. Experience

**Delete** the separate "Agentic AI Developer & Full-Stack SaaS Builder — Freelance" and
"Company Owner — D & N" entries; both fold into the role below. Keep D & N's start date as the one you
consider the practice's real start (the agentic work dates from Jan 2025).

### Agentic AI Architect & Developer — D & N · Jan 2025 – Present · Karachi · Hybrid
> Designing multi-agent systems where the control logic lives in code, not in prompts — and
> publishing the source so every claim can be checked.
>
> • Built a star-topology agent system on the OpenAI Agents SDK: one triage orchestrator, four typed
>   specialists, structured outputs as contracts, and a per-run trace of route and tool calls.
> • Shipped a standards-compliant MCP server (official SDK, Streamable HTTP) with six read-only tools.
> • Implemented Constitutional AI as SDK guardrails with a model-free deterministic layer, so
>   enforcement survives provider outages.
> • Wrote trace-based eval suites (routing, constitution, portfolio) wired into CI.
> • Open-sourced deterministic-control projects: OrchestratorX (model-free routing, 39 tests, no API
>   keys), ProtoBridge (MCP + A2A at the wire level, 61 tests), GuardrailAI (OFAC / AML / HIPAA
>   screening, 17 tests).
>
> Skills: OpenAI Agents SDK · Model Context Protocol · LangGraph · FastAPI · Next.js

### Founder — Texcot Embroidery Sourcing House · Apr 2021 – [end date or Present]
(Use an end date if Texcot is no longer your main work; keep "Present" if the unit still operates.)
> Founded a CMT (Cut-Make-Trim) and textile sourcing business serving Pakistan and the UAE. Running it
> put me inside the problems I now build software for: production status living in someone's phone,
> orders tracked across Excel sheets and WhatsApp groups.
>
> • Designing a Textile ERP Platform for Pakistan's textile value chain — Module 1 (Fabric Mill:
>   roll/lot management, weaving/knitting stage tracking, yarn inventory). In development, running
>   locally; not yet deployed.
> • Building a CMT Stitching & Packing Management System (FastAPI · Next.js · PostgreSQL) — order
>   tracking, production sessions, auto-billing. In development, running locally.
> • Requirements come from working mills and CMT units in Faisalabad, Sialkot and Karachi — the
>   modules are shaped by real production floors, not by guesswork.
> • Digital marketing strategy and paid campaigns for Dubai real estate and UAE construction clients.
>
> Skills: Textile Sourcing · CMT Production · Product Requirements · Digital Marketing

### Earlier roles
- **Marketing Manager — JK Embroidery (2016–2020):** keep the existing text, it fits this role.
- **Buying Agent (Country Manager) — Steven Berry (2003–2005):** replace the copied text with one line
  describing the buying/sourcing work you actually did. Twenty years of textile-sourcing experience is
  a genuine differentiator for textile ERP work — it deserves its own sentence.

### Education fixes
- **GIAIC — AI, Web 3.0 & Metaverse:** add to the description: "Panaversity Agentic AI programme.
  Six consecutive hackathon builds, H0 → H5 (Bronze, Silver, Silver, Gold, Platinum in progress,
  Agent Factory)." Drop "outdoor sports" from Activities; replace with the hackathons.
- **Textile Institute of Pakistan:** fix the "Institue" typo.

### Licenses & Certifications
- Move "DeepLearning.AI" and "Certified Python Developer" here from Skills, with issuer and date.

## 4. Featured (in this order)

1. **Portfolio** — https://asadullahshafique-devunity.vercel.app
2. **Article:** The Architecture of Agentic AI — `/blog/architecture-of-agentic-ai`
3. **Article:** KSOR: The System of Record for Reliable Agentic AI — `/blog/ksor-knowledge-system-of-record`
4. **FinAgent-Nexus** repo (flagship, MIT, live compliance screener)
5. **Live endpoint** — https://asadullahshafique-devunity.onrender.com/api/agent/info
   (a reviewer can check that orchestration is actually running)

## 5. Skills — pin these top 3

1. Agentic AI / Multi-agent systems
2. Model Context Protocol (MCP)
3. FastAPI

Then add: OpenAI Agents SDK, LangGraph, Next.js, TypeScript, Python, RAG, PostgreSQL, Docker,
Kubernetes, GitHub Actions, Spec-driven development.

## 6. Projects section

| Project | One line | Link |
| --- | --- | --- |
| FinAgent-Nexus | Multi-agent financial intelligence with deterministic compliance screening and a hash-chained audit trail | GitHub |
| AI TradeFlow | Bilingual AI inventory and accounting for Pakistani wholesalers, around the Munshi agent | github.com/asadullah48/ai-tradeflow |
| Asadullah.dev portfolio | Agents SDK orchestration, MCP server, Constitutional AI guardrails and trace-based evals, EN/AR | github.com/asadullah48/asadullahshafique_devunity |
| OrchestratorX | Model-free routing in typed state; 39 offline tests | github.com/asadullah48/orchestratorx |
| ProtoBridge | MCP + A2A implemented to the wire; 61 tests | github.com/asadullah48/protobridge |

## 7. Settings checklist

- [ ] Custom URL: `linkedin.com/in/asadullah-shafique` (the `-a00679325` suffix looks auto-generated)
- [ ] Website field → portfolio, labelled "Portfolio"
- [ ] Open to Work → recruiters only, titles: AI Engineer, Agentic AI Engineer, Forward Deployed Engineer
- [ ] Location: pick one primary city — recruiter search filters on it
- [ ] Banner: the site's OG image (`/opengraph-image`) keeps the brand identical across both

## 8. Launch post (after the update)

> I've rewritten my profile around one rule: every claim links to something you can check.
>
> My portfolio had metrics I couldn't prove — so I removed them and replaced them with a live
> endpoint, a real MCP server and eval suites that read the execution trace.
>
> If you're hiring for agentic AI work, the source is one click away:
> https://asadullahshafique-devunity.vercel.app
