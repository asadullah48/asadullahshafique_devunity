// Shared knowledge base for the portfolio AI agent routes.
// Mirrors backend/agent.py's PORTFOLIO_DATA so the serverless agent and the
// showcased FastAPI/LangGraph implementation stay consistent.

export const PORTFOLIO_FACTS = `
Name: Asadullah Shafique — Agentic AI Developer (Pakistan · UAE)
Contact: asadullahshafique@hotmail.com | WhatsApp +92 321 3771445 | GitHub github.com/asadullah48 | Discord discord.gg/kXfEYVGX
Focus: Agentic AI development, full-stack engineering, spec-first development with Claude Code.

Skills: TypeScript, JavaScript, Python, Next.js, React, FastAPI, PostgreSQL, Supabase, Redis, Docker, Kubernetes, OpenAI Agents SDK, Claude MCP, LangGraph, RAG.

Agent engineering framework (three disciplines):
- Harness engineering: tools, memory, permissions around the model.
- Loop engineering: testing, evals, iteration until zero failures.
- Graph engineering: multi-agent orchestration.

Featured projects:
- Bazaar (flagship): Pakistan's unified B2C + B2B wholesale/RFQ marketplace. Next.js 15, FastAPI, Supabase, PostgreSQL, Redis, Docker.
- AI TradeFlow (in development): bilingual AI inventory & accounting platform for Pakistani wholesalers with the "Munshi" AI agent. FastAPI, Next.js, OpenAI Agents SDK, Expo.
- Agent Factory (Hackathon H5): two-tier agent architecture — a General Agent (Claude Code) that builds Custom Agents (OpenAI SDK), with SKILL.md files as portable units, deployed on Kubernetes + Dapr.
- DevUnity Platform: open-source developer community hub (this portfolio's sibling project).
- RAG Textbook Platform (Hackathon H1, Silver): AI chatbot with RAG architecture.
- Stitching & Packing ERP and a full Textile ERP Platform (2026 launch) for garment exporters.

Hackathons: six consecutive Panaversity hackathons (H0–H5): Bronze → Silver → Silver → Gold → Platinum → Agent Factory. Methodology: spec-first, heavy code reuse, evals before shipping.

This portfolio itself: Next.js App Router, TypeScript, Tailwind, shadcn/ui, Framer Motion, EN/AR localization, and a FastAPI + LangGraph backend showcased in the repo. The live chat agent runs serverless on Vercel.
`.trim();

export type AgentMode = "general" | "python" | "nextjs" | "agents";

export const MODE_FLAVORS: Record<AgentMode, string> = {
  general: "Answer questions about Asadullah's skills, projects, hackathons, and contact info.",
  python: "Focus on Asadullah's Python work: FastAPI backends, streaming SSE endpoints, testing, and tooling.",
  nextjs: "Focus on Asadullah's Next.js/TypeScript work: App Router, shadcn/ui, localization, and this portfolio's architecture.",
  agents: "Focus on Asadullah's agent engineering: the harness/loop/graph framework, MCP, spec-first development, and shipped agents.",
};

export function buildSystemPrompt(mode: string): string {
  const key: AgentMode = mode === "python" || mode === "nextjs" || mode === "agents" ? mode : "general";
  return (
    "You are the AI portfolio assistant for Asadullah Shafique. " +
    MODE_FLAVORS[key] +
    " Be concise (under 4 sentences unless asked for detail), friendly, and factual. " +
    "Use only the facts below. Never invent awards, metrics, clients, or dates: if a " +
    "detail isn't listed, say you don't have it and point to the contact options. " +
    "State the hackathon results exactly as written; do not summarise them as a medal count.\n\n" +
    PORTFOLIO_FACTS
  );
}

// Keyword-routed answers served when no LLM API key is configured, so the
// widget degrades to instant factual answers instead of an error. Each reply
// is honest about being a static answer.
export function offlineAnswer(question: string): string {
  const q = question.toLowerCase();
  let core: string;
  if (/skill|tech|stack|language|framework/.test(q)) {
    core =
      "Asadullah works across TypeScript, Python, Next.js, FastAPI, PostgreSQL/Supabase, Docker, Kubernetes, and agentic AI (OpenAI Agents SDK, Claude MCP, LangGraph).";
  } else if (/project|built|work|bazaar|tradeflow|erp/.test(q)) {
    core =
      "Flagship projects: Bazaar (B2C+B2B marketplace), AI TradeFlow (bilingual AI inventory platform with the Munshi agent), and Agent Factory (two-tier agent architecture on Kubernetes). Scroll to the Projects section for case studies.";
  } else if (/contact|email|reach|hire|whatsapp|discord/.test(q)) {
    core =
      "Reach Asadullah at asadullahshafique@hotmail.com, WhatsApp +92 321 3771445, or Discord (discord.gg/kXfEYVGX).";
  } else if (/hackathon|panaversity|award|medal/.test(q)) {
    core =
      "Asadullah completed six consecutive Panaversity hackathons (H0–H5): Bronze → Silver → Silver → Gold → Platinum → Agent Factory.";
  } else if (/agent|mcp|harness|loop|graph/.test(q)) {
    core =
      "His agent engineering framework has three disciplines: harness (tools/memory/permissions), loop (testing/evals), and graph (multi-agent orchestration). See the Agent Engineering section.";
  } else {
    core =
      "I can tell you about Asadullah's skills, projects, hackathons, agent engineering, or how to contact him — try one of those topics.";
  }
  return core + " (Instant answer — the live AI model is currently offline.)";
}
