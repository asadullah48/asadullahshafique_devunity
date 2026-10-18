import { parse } from "yaml";

/** Read the YAML metadata used by our checked-in Markdown articles. */
export function readFrontmatter(source: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const match = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (!match) return { data: {}, content: source };
  const data: unknown = parse(match[1], { maxAliasCount: 100 });
  if (data !== null && (typeof data !== "object" || Array.isArray(data))) {
    throw new Error("Article frontmatter must be a YAML mapping");
  }
  return {
    data: (data ?? {}) as Record<string, unknown>,
    content: source.slice(match[0].length),
  };
}
