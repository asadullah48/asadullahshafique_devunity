# Asadullah Shafique — Agentic AI Portfolio & Platform

[![Frontend CI](https://github.com/asadullah48/asadullahshafique_devunity/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/asadullah48/asadullahshafique_devunity/actions/workflows/frontend-ci.yml)
[![Backend CI](https://github.com/asadullah48/asadullahshafique_devunity/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/asadullah48/asadullahshafique_devunity/actions/workflows/backend-ci.yml)
[![Docker Build](https://github.com/asadullah48/asadullahshafique_devunity/actions/workflows/docker-build.yml/badge.svg)](https://github.com/asadullah48/asadullahshafique_devunity/actions/workflows/docker-build.yml)

Live site → https://asadullahshafique-devunity.vercel.app • API docs → https://asadullahshafique-devunity.onrender.com/docs

TL;DR
A production-grade portfolio and demo platform combining a Next.js frontend with a FastAPI backend that runs a real multi-agent system (MCP server, agent orchestration, and agent evals). Try the live demo or run locally in <10 minutes.

Key features
- Multi-agent orchestration (triage + specialists)
- Real MCP server (/mcp/server) and REST shims
- AI-powered Error Solver, Learn & Teach tools
- Video library, Blog, Global Search
- Docker, Kubernetes manifests and GitHub Actions CI

Quick try
- Live demo: https://asadullahshafique-devunity.vercel.app
- API docs (Swagger): https://asadullahshafique-devunity.onrender.com/docs
- MCP tools (REST shim): https://asadullahshafique-devunity.onrender.com/mcp/tools

Quick start — local (one-liners)
1. Clone: git clone https://github.com/asadullah48/asadullahshafique_devunity.git
2. Frontend: npm install && cp .env.example .env.local && npm run dev (http://localhost:3000)
3. Backend: cd backend && pip install -r requirements.txt && cp .env.example .env && uvicorn main:app --reload --port 8000 (http://localhost:8000/docs)
4. Or run both with: docker-compose up

Why this repo
- Demonstrates production patterns for agentic systems (guardrails, traceable evals, MCP interoperability)
- Full dev-to-prod path (local dev, Docker, Kubernetes manifests, CI)
- Designed so core features degrade gracefully when provider API keys are absent

Contributing & developer docs
- Full technical documentation, architecture diagrams, and detailed quick start are preserved in README-FULL.md on this branch. See that file for env vars, CI, evals, and API examples.
- To contribute: fork, branch, run tests, open a PR. CI must pass.

Contact
- GitHub: https://github.com/asadullah48
- Discord: https://discord.gg/kXfEYVGX
- Contact form (site): use the contact page on the live demo to avoid spam

License: MIT — see LICENSE
