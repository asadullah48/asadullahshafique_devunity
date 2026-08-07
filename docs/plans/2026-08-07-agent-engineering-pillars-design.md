# Agent Engineering Pillars Section — Design
**Date:** 2026-08-07
**Status:** Implemented

## Goal

Showcase the three-pillar agent-engineering framework (from current Panaversity learning) as a standalone portfolio section. The Skills section shows *what tools* Asadullah uses; this section shows *how he thinks* about building agents.

## Placement

New section `#agent-engineering`, rendered between `<Skills />` and `<Roadmap />` in `src/app/page.tsx`. Navbar anchor "Agent Eng" added between Skills and Expertise.

## The Three Pillars

| # | Pillar | Tag | Core idea |
|---|--------|-----|-----------|
| 01 | Harness Engineering | The Environment | Safety net around the model: tools, memory, permissions, observability. "Agent deleted the wrong file? That's a harness problem, not a model failure." |
| 02 | Loop Engineering | The Feedback | Agent evaluates its own work. Evidence over confidence — stop when tests pass, not when it feels done. |
| 03 | Graph Engineering | The Flow | Orchestration: branching, approvals, retries, parallel tasks. |

## Component Design

`src/components/AgentEngineering.tsx`:
- Follows site conventions: `// agent_engineering` mono label, two-tone heading, `#9CE630` accent bar, Framer Motion `whileInView` animations.
- Three cards, each with: mono number badge (01/02/03, per-pillar accent color), uppercase tag, title, description, terminal-styled callout quote (`> ...` with colored left border), and chips tying the concept to real tools (MCP Servers, TDD, LangGraph, Human-in-the-Loop, ...).
- Transparent background so the fixed grid backdrop shows through, contrasting with the `#0a0a0a` Skills and Roadmap sections around it.

## i18n

All copy behind `t("agentEngineering.*")` keys in `src/i18n/en.json` and `src/i18n/ar.json` (nested: `harness|loop|graph` × `tag|title|desc|callout`). Nav key `nav.agentEng`. Chip labels stay English in both locales (technical terms).

## Files Changed

| File | Change |
|------|--------|
| `src/components/AgentEngineering.tsx` | New — pillar cards section |
| `src/app/page.tsx` | Import + render between Skills and Roadmap |
| `src/components/Navbar.tsx` | Nav item `#agent-engineering` |
| `src/i18n/en.json`, `src/i18n/ar.json` | `agentEngineering` block + `nav.agentEng` |
