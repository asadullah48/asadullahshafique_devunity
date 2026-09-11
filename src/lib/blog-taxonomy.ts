/**
 * Blog taxonomy — categories and curated reading paths.
 *
 * Pure data, no Node imports, so both the server routes and the client
 * homepage section can import it. Articles opt into a category through their
 * frontmatter (`category: reliability`); content.ts rejects an unknown id at
 * build time, so a typo fails the build instead of silently dropping a post
 * out of every category listing.
 *
 * ORDER IS EDITORIAL. The hub renders categories in this order, and only the
 * ones that currently hold at least one article — an empty "Strategy" heading
 * would be a promise the site has not kept.
 */

export const CATEGORIES = [
  {
    id: "architecture",
    label: "Architecture",
    ar: "البنية المعمارية",
    description:
      "How agentic systems are structured: the layers, the boundaries, and where the model actually sits inside them.",
  },
  {
    id: "reliability",
    label: "Reliability",
    ar: "الموثوقية",
    description:
      "State, provenance, guardrails and evaluation — the properties that decide whether an agent can be trusted in production.",
  },
  {
    id: "agentic-ai",
    label: "Agentic AI",
    ar: "الذكاء الاصطناعي الوكيل",
    description: "Building, orchestrating and shipping agents that use real tools.",
  },
  {
    id: "decision-science",
    label: "Decision Science",
    ar: "علم القرار",
    description:
      "How people and systems choose under uncertainty — and how to choose better.",
  },
  {
    id: "psychology",
    label: "Psychology",
    ar: "علم النفس",
    description:
      "Attention, persuasion and trust: the human side of technical communication.",
  },
  {
    id: "strategy",
    label: "Strategy",
    ar: "الاستراتيجية",
    description: "Careers, markets and methods — where AI engineering work is heading.",
  },
  {
    id: "perspective",
    label: "Perspective",
    ar: "منظور",
    description: "The reading and ideas behind the work.",
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
export type Category = (typeof CATEGORIES)[number];

export function isCategoryId(value: unknown): value is CategoryId {
  return CATEGORIES.some((c) => c.id === value);
}

export function getCategory(id: CategoryId | null): Category | null {
  return CATEGORIES.find((c) => c.id === id) ?? null;
}

/**
 * Curated sequences through the archive. Each one is an argument that builds:
 * read the first article and the second one has something to stand on.
 *
 * Slugs that do not exist (yet) are filtered out at render time, so a path is
 * never shown with a dead step — but a path shorter than two steps is not a
 * path, and the hub drops it.
 */
export const READING_PATHS = [
  {
    id: "trustworthy-agents",
    title: "Building agents that can be trusted",
    description:
      "From what makes a system agentic, to what it may treat as true, to how its work is structured and governed.",
    slugs: [
      "architecture-of-agentic-ai",
      "ksor-knowledge-system-of-record",
      "graph-engineering-with-claude",
      "constitutional-ai-todo-spec-first",
    ],
  },
  {
    id: "decisions-and-communication",
    title: "Deciding, negotiating, communicating",
    description:
      "How options get generated, how agreements get made, and how ideas earn attention long enough to be understood.",
    slugs: [
      "the-1-9-1-rule",
      "negotiation-and-competitive-decision-making",
      "psychology-of-hooks-and-storytelling",
    ],
  },
] as const;
