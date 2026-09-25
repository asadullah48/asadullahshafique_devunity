"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, PlugZap } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/context/LocaleContext";

/**
 * Connect via MCP — lets a visitor add this portfolio to their own AI client.
 *
 * EVIDENCE POSTURE. Everything here is checkable by using it: the endpoint is
 * the real FastMCP server mounted by backend/main.py at /mcp/server, and the six
 * tool names below are exactly the @portfolio_mcp.tool() functions in
 * backend/mcp_server.py. Keep MCP_TOOLS in step with that file. The endpoint
 * accepts its public Host header because mcp_server.py allow-lists it; the
 * regression is pinned by backend/tests/test_mcp_transport.py.
 *
 * The free-tier backend sleeps, so the cold-start note is part of the copy,
 * not an afterthought: a visitor whose first call times out should already
 * have been told why.
 */

const MCP_URL = "https://asadullahshafique-devunity.onrender.com/mcp/server";
const CLAUDE_CODE_CMD = `claude mcp add --transport http asadullah-portfolio ${MCP_URL}`;
const SOURCE_URL =
  "https://github.com/asadullah48/asadullahshafique_devunity/blob/main/backend/mcp_server.py";

const MCP_TOOLS = [
  "get_about",
  "get_skills",
  "get_projects",
  "get_hackathons",
  "get_agent_engineering",
  "get_contact",
] as const;

function CopyRow({ label, value }: { label: string; value: string }) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure context, permissions). The value is
      // still selectable on screen, so failing quietly loses nothing.
    }
  };

  return (
    <div>
      <div className="mb-2 text-sm font-medium text-foreground">{label}</div>
      <div className="flex items-stretch gap-2">
        <code
          dir="ltr"
          className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-lg border border-border bg-background/60 px-3 py-2.5 font-mono text-xs text-brand-soft"
        >
          {value}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={`${t("connectMcp.copy")}: ${label}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-brand transition-colors hover:border-brand/40 hover:bg-surface-1"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span aria-live="polite">{copied ? t("connectMcp.copied") : t("connectMcp.copy")}</span>
        </button>
      </div>
    </div>
  );
}

export default function ConnectMcp() {
  const { t } = useLocale();

  return (
    <section id="connect-mcp" className="py-24">
      <div className="container mx-auto px-6">
        <Reveal className="mb-10 text-center">
          <div className="mb-3 font-mono text-eyebrow uppercase tracking-widest text-brand/60">
            {t("connectMcp.eyebrow")}
          </div>
          <h2 className="mb-4 font-display text-4xl font-bold text-foreground lg:text-5xl">
            {t("connectMcp.title")}{" "}
            <span className="text-brand">{t("connectMcp.titleHighlight")}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
            {t("connectMcp.subtitle")}
          </p>
        </Reveal>

        <Reveal
          step={1}
          className="mx-auto max-w-3xl rounded-panel border border-border bg-surface-1/40 p-6"
        >
          <div className="space-y-5">
            <CopyRow label={t("connectMcp.claudeCode")} value={CLAUDE_CODE_CMD} />
            <CopyRow label={t("connectMcp.endpoint")} value={MCP_URL} />
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              {t("connectMcp.otherClients")}
            </p>
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <PlugZap className="h-4 w-4 text-brand" aria-hidden="true" />
              {t("connectMcp.toolsLabel")}
            </div>
            <ul dir="ltr" className="flex flex-wrap gap-2">
              {MCP_TOOLS.map((tool) => (
                <li
                  key={tool}
                  className="rounded-md border border-border bg-background/60 px-2 py-1 font-mono text-[11px] text-brand/80"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <div className="mb-2 text-sm font-medium text-foreground">{t("connectMcp.tryLabel")}</div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>{t("connectMcp.try1")}</li>
              <li>{t("connectMcp.try2")}</li>
            </ul>
          </div>

          <div className="mt-6 space-y-2 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
            <p className="text-pretty">{t("connectMcp.readOnly")}</p>
            <p className="text-pretty">{t("connectMcp.coldStart")}</p>
            <Link
              href={SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-brand hover:underline"
            >
              backend/mcp_server.py ↗
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
