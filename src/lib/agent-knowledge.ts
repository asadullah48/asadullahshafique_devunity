// Knowledge base for the portfolio AI agent routes.
//
// Facts are NOT defined here. They come from backend/knowledge/portfolio.json,
// the single source of truth shared with the Python backend
// (backend/knowledge/__init__.py). This module's only job is rendering those
// facts into the prose an LLM reads, and into the offline fallback answers.
//
// Why the import reaches into backend/: that directory is the intersection of
// all three build contexts. The backend image is built with context ./backend
// (docker-compose.yml) and Render's root dir is "backend", so a repo-root
// knowledge/ would not exist inside it. The frontend builds from the repo root
// with no .vercelignore, so it can read down into backend/. See CLAUDE.md §2.
//
// Before this, the same facts lived in three places and had drifted apart.
// Add a renderer here; never re-add a literal list of projects or skills.

import portfolio from "../../backend/knowledge/portfolio.json";

const { identity, contact, skills, agentEngineering, projects, hackathons, thisPortfolio } = portfolio;

/** Every skill as one ordered list, de-duplicated. Mirrors the Python `_flat_skills`. */
const ALL_SKILLS: string[] = Array.from(
  new Set([...skills.languages, ...skills.frameworks, ...skills.data, ...skills.ai, ...skills.devops])
);

/** "H0 — Bronze, H1 — Silver, ..." */
const HACKATHON_LINE: string = hackathons.results.map((r) => `${r.id} — ${r.result}`).join(", ");

function renderProject(p: (typeof projects)[number]): string {
  const label = "hackathon" in p && p.hackathon ? `Hackathon ${p.hackathon}` : p.status;
  const metrics = p.metrics.length > 0 ? ` ${p.metrics.join(", ")}.` : "";
  return `- ${p.name} (${label}): ${p.summary}${metrics} Tech: ${p.tech.join(", ")}.`;
}

/**
 * The fact sheet handed to the model. Rendered from portfolio.json so it can
 * never disagree with what the backend agent and MCP tools report.
 */
export const PORTFOLIO_FACTS: string = [
  `Name: ${identity.name} — ${identity.roles.join(", ")} (${identity.location})`,
  `Positioning: ${identity.tagline}`,
  `Contact: ${contact.email} | WhatsApp ${contact.whatsapp} | GitHub ${contact.github} | Discord ${contact.discord}`,
  `Focus: ${identity.focus}`,
  ``,
  `Skills: ${ALL_SKILLS.join(", ")}.`,
  `Methodology: ${skills.methodology}.`,
  ``,
  `Agent engineering framework (three disciplines):`,
  ...agentEngineering.disciplines.map((d) => `- ${d.name}: ${d.detail}`),
  ``,
  `Featured projects:`,
  ...projects.map(renderProject),
  ``,
  `Hackathons: ${hackathons.summary} Results: ${HACKATHON_LINE}. Methodology: ${hackathons.methodology}`,
  ``,
  `This portfolio: ${thisPortfolio}`,
].join("\n");

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
    `You are the AI portfolio assistant for ${identity.name}. ` +
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
//
// These are composed from portfolio.json rather than written out, so a project
// added to the JSON shows up here too. The previous version hardcoded the
// project names and would silently go stale.
export function offlineAnswer(question: string): string {
  const q = question.toLowerCase();
  let core: string;

  if (/skill|tech|stack|language|framework/.test(q)) {
    core = `Asadullah works across ${ALL_SKILLS.join(", ")}.`;
  } else if (/project|built|work|bazaar|tradeflow|erp/.test(q)) {
    const headline = projects
      .filter((p) => p.status === "flagship" || p.status === "in development")
      .slice(0, 3)
      .map((p) => p.name)
      .join(", ");
    core = `Flagship and active projects: ${headline}. Scroll to the Projects section for case studies.`;
  } else if (/contact|email|reach|hire|whatsapp|discord/.test(q)) {
    core = `Reach Asadullah at ${contact.email}, WhatsApp ${contact.whatsapp}, or Discord (${contact.discord}).`;
  } else if (/hackathon|panaversity|award|medal/.test(q)) {
    core = `${hackathons.summary} Results: ${HACKATHON_LINE}.`;
  } else if (/agent|mcp|harness|loop|graph/.test(q)) {
    const disciplines = agentEngineering.disciplines.map((d) => d.name.replace(" engineering", "")).join(", ");
    core = `His agent engineering framework has three disciplines: ${disciplines}. See the Agent Engineering section.`;
  } else {
    core =
      "I can tell you about Asadullah's skills, projects, hackathons, agent engineering, or how to contact him — try one of those topics.";
  }

  return core + " (Instant answer — the live AI model is currently offline.)";
}
