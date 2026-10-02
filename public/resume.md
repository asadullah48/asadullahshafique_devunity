# Asadullah Shafique
**Agentic AI Systems Engineer — multi-agent orchestration, MCP, deterministic guardrails, evaluation**

Karachi, Pakistan · open to remote and UAE roles · +92 321 3771445 · asadullahshafique@hotmail.com
[Portfolio](https://asadullahshafique-devunity.vercel.app) · [GitHub](https://github.com/asadullah48) · [LinkedIn](https://www.linkedin.com/in/asadullah-shafique-a00679325/)

<!-- Markdown twin of public/resume.pdf. Source of truth for the PDF is
     scripts/resume/resume.html (`npm run resume:short`); keep the two in step. -->

## Summary

Agentic AI engineer who builds multi-agent systems that can be audited: typed orchestration with a recorded route, a written constitution enforced *before* any model call, and evaluations that read the execution trace instead of trusting the prose. Every flagship project below is open source, runs its tests without an API key, and has a live demo or repository a reviewer can check. Brings 25+ years in textile manufacturing and sourcing, including founding and running a 30–35 person production unit, so the systems are built for real operating constraints, not demos.

## Core Skills

- **Agent engineering:** OpenAI Agents SDK (handoffs, guardrails), LangGraph, Claude Code / Claude API, MCP servers (FastMCP, Streamable HTTP), A2A, tool contracts, context engineering, RAG
- **Reliability & safety:** deterministic pre-model guardrails, eval harnesses (trace checks + LLM judge), hash-chained audit logs, provider fallback ladders, human-in-the-loop approvals
- **Backend & data:** Python, FastAPI, SQLAlchemy 2, Alembic, PostgreSQL (row-level security, concurrency tests), Pydantic, pytest
- **Frontend:** TypeScript, Next.js 15/16, React 19, Tailwind CSS, bilingual EN/AR with RTL
- **Cloud & ops:** Docker, Kubernetes, Dapr, Kafka, Helm, GitHub Actions, Prometheus/Grafana/Jaeger, Vercel, Render

## Selected Projects

### FinAgent-Nexus — multi-agent financial compliance
[Live](https://finagent-nexus.vercel.app) · [Code](https://github.com/asadullah48/finagent-nexus)

- Three specialists (market analyst, compliance officer, wealth strategist) on a fixed Plan-Act-Verify state machine; no agent holds two of data, weighting and verdict, and no graph edge lets a draft approve itself.
- Settles 8 of 14 compliance principles by arithmetic: a full screen in under 2 ms with zero model calls; 94 tests pass offline with no API key. Every run writes a hash-chained, tamper-evident audit trail.

*LangGraph · Claude · Constitutional AI · Python · Pydantic · pytest*

### Agent governance trio — OrchestratorX · ProtoBridge · GuardrailAI
[Architecture reviews](https://asadullahshafique-devunity.vercel.app/systems/orchestratorx)

- **OrchestratorX:** supervisor-pattern framework where routing is typed state, not prompt text; 41 tests with no API key or network; FastAPI trace endpoint, Docker, CI on Python 3.11–3.13.
- **ProtoBridge:** MCP × A2A interoperability layer with a normalized envelope; 62 tests; the live demo recomputes SHA-256 ledger digests in the visitor's browser.
- **GuardrailAI:** deterministic compliance layer with a hash-chained audit ledger; 17 tests.

### AI TradeFlow — inventory, accounting and an AI assistant for wholesalers
[Live](https://ai-tradeflow-demo.vercel.app) · [Code](https://github.com/asadullah48/ai-tradeflow)

- 142 backend tests, including two-business leak tests on every endpoint and PostgreSQL concurrency races in CI (12 parallel sales against 5 units in stock sell exactly 5).
- "Munshi" assistant: five read-only tools behind an Agents SDK input guardrail, a compiled-regex constitution screened before any model call, and an offline tool-grounded fallback. Exact NUMERIC money, idempotent payments, reversing-entry voids.

*OpenAI Agents SDK · FastAPI · SQLAlchemy 2 · PostgreSQL · Next.js 16*

### Portfolio platform — the site as its own proof
[Live](https://asadullahshafique-devunity.vercel.app) · [Code](https://github.com/asadullah48/asadullahshafique_devunity)

- Triage orchestrator over four specialist agents, a real MCP server (six read-only tools) on the official SDK, and a written constitution verified blocking 4 of 4 violations with no model reachable; every agent path degrades gracefully without an API key.

*Next.js 15 · FastAPI · OpenAI Agents SDK · FastMCP · bilingual EN/AR*

### Textile ERP Platform — multi-tenant ERP for fabric mills
[Live](https://textile-erp-platform.vercel.app) · [Code](https://github.com/asadullah48/textile-erp-platform)

- Module 1 (Fabric Mill) complete: tenant isolation enforced by PostgreSQL row-level security, row-locked roll issuance, append-only yarn ledger, landed-cost LC imports, 7 deterministic alerts; 42 tests against real PostgreSQL. Later modules are specified, not yet built.

### CMT Stitching & Packing System · Paid Growth, Measured
[CMT code](https://github.com/asadullah48/cmt-stitching-system) · [PGM code](https://github.com/asadullah48/paid-growth-measured) · [PGM demo](https://paid-growth-measured.vercel.app)

- **CMT system:** production and billing for my own stitching unit, in daily use there: order lifecycle to dispatch, QC sessions, four bill series, party ledgers, 24 migrations.
- **Paid Growth, Measured** (read-only live demo): ad-agency workspace where ad copy is built only from client-approved facts and every report number is a frozen, sourced snapshot; 29 tests, also run against PostgreSQL 16.

### 21 open-source multi-agent reference implementations
[Repositories](https://github.com/asadullah48?tab=repositories)

Distinct domains (legacy-code transpilation, zero-trust MCP security, DAG workflows with approvals, inventory forecasting, and more), each with its own FastAPI gateway, Docker/Kubernetes configs and test suite: 736 test functions in aggregate (6 of the 21 run them in CI). Twenty run on synthetic data; they demonstrate architecture, not production traffic.

## Experience

### Agentic AI Engineer — independent, open source · 2024 – Present
- Designed and shipped the systems above end to end: specification, agents, APIs, databases, frontends, tests, CI and deployment, using a spec-first, four-session build cycle.
- Made governance structural rather than prompt-based: separation of powers between agents, pre-model constitutional screens, read-only tool contracts and trace-reading evaluations.

### Founder & CEO — Texcot Embroidery Sourcing House (CMT stitching unit), Karachi · 2020 – Present
- Founded and run a CMT stitching unit of 30–35 staff across the full lifecycle: sample and design analysis, machine allocation, bulk production and inspection.
- Built and run the unit's own production and billing software (CMT system above); lead the business's digital marketing.

### Marketing Manager — JK Embroidery, Karachi · 2016 – 2020
- Directed marketing and production planning; led 30–35 staff and rebuilt staff and machine scheduling to clear bottlenecks under peak order flow.

### Country Manager / Buying Agent — Steven Berry (international) · 2003 – 2005
- Coordinated international garment and textile shipments end to end; ran pre-production, in-line and final inspections to international quality standards.

## Hackathons

**Panaversity hackathon series — six consecutive completions (2024–2025):** Personal AI CTO (Bronze) → Course Companion FTE (Silver) → AI-Powered Todo (Silver, 89 tests) → Advanced Todo (Gold, 149 tests, triple-layer Constitutional AI) → Cloud-Native Deployment (Platinum: Kubernetes, Dapr, Kafka, Prometheus/Grafana/Jaeger) → Agent Factory (Platinum: a general agent that builds custom agents; SKILL.md as portable units).

## Certifications

- **Agent Foundations** — Cognizant AI Lab, Agent Academy · Sep 2026 · [certificate](https://asadullahshafique-devunity.vercel.app/certificates/agent-foundations-asadullah-shafique.png)
- **Anthropic Claude Academy** — six verified badges, Sep 2026: AI Fluency: Framework and Foundations; AI Fluency for Builders; AI Capabilities and Limitations; Claude 101; Claude Code 101; Introduction to Claude Cowork · [verify links](https://asadullahshafique-devunity.vercel.app/#certifications)
- **In progress:** Claude Code in Action and Introduction to Model Context Protocol (Claude Academy, completed, badges pending); Panaversity Forward Deployed Engineer training (Track B); PCAR-F and Claude Certified Associate – Foundations (not yet awarded)

## Education

- **Governor Sindh Initiative for AI & Computing (Panaversity)** — Agentic and Generative AI · 2024 – Present
- **Associate Degree, Textile Technology** — Textile Institute of Pakistan (APTMA project), Karachi · 1997
- HSC Pre-Engineering, Pakistan Shipowners' Government College, 1994 · Alim (5-year Islamic studies), Burooj Institute, Karachi
