"use client";

import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/context/LocaleContext";

/**
 * The Forward Deployed Engineering model: seven disciplines between a customer
 * problem and a system running in production.
 *
 * The whole point of this section is the third line of each step — the
 * EVIDENCE. Anyone can list seven disciplines; the section earns its place by
 * naming, for each one, the directory in this repository that demonstrates it.
 * That is the same move the engagement models make in #contact, and it is the
 * only reason a framework section is worth shipping on a portfolio at all.
 *
 * Consequently the Reality Rule (CLAUDE.md section 0) binds this file harder
 * than most: every `ev` string below must point at something a reader can
 * actually open. Two deliberate omissions, so they are not silently re-added:
 *
 *   - Step 4 does NOT claim observability. The backend has bare `logger`
 *     calls and no OpenTelemetry, Prometheus or Sentry, so the evidence line
 *     stops at cloud, IaC, CI/CD and network policy — all of which are real.
 *   - Step 4 does NOT claim human approval gates. There are none, because
 *     every tool is read-only by design (Rule 2). Ship one write-capable tool
 *     and this step needs revisiting.
 *
 * Steps 5-7 cite artefacts rather than paths because their evidence is
 * editorial, not code. That is honest, not weaker: the Problem/Solution/Impact
 * structure and the code-reuse figure are both checkable on this same page.
 */

// `ev` is untranslated on purpose for the path-shaped steps: a directory name
// is an identifier, not prose, and "backend/constitution/" is the same string
// in every locale. Steps whose evidence IS prose take a translated key.
const STEPS = [
  { key: "s1", ev: "src/app/ · backend/main.py · alembic/" },
  { key: "s2", ev: "backend/orchestration/ · the fallback ladder in agent.py" },
  { key: "s3", ev: "backend/constitution/ · evals/ · /mcp/server" },
  { key: "s4", ev: "k8s/ · .github/workflows/ · backend/Dockerfile" },
  { key: "s5", ev: null },
  { key: "s6", ev: null },
  { key: "s7", ev: null },
] as const;

export function ForwardDeployedSection() {
  const { t } = useLocale();

  return (
    <section id="forward-deployed" className="py-24 bg-surface-1">
      <div className="container mx-auto px-6">
        <Reveal className="text-center mb-14">
          <div
            dir="ltr"
            className="text-xs font-mono text-brand/60 uppercase tracking-widest mb-3"
          >
            {"// forward_deployed"}
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("fde.title")}{" "}
            <span className="text-brand">{t("fde.titleHighlight")}</span>
          </h2>
          <div className="w-16 h-0.5 bg-brand mx-auto mb-5" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("fde.subtitle")}
          </p>
        </Reveal>

        {/* A numbered rail rather than a card grid: seven is an awkward grid
            (3/3/1) and, more importantly, these are a sequence — each step
            assumes the one above it. The connecting hairline says that; three
            rows of boxes would not. */}
        <ol className="max-w-3xl mx-auto">
          {STEPS.map((step, i) => (
            <Reveal
              as="li"
              key={step.key}
              step={i}
              className="relative flex gap-5 pb-8 last:pb-0"
            >
              <div className="flex flex-col items-center flex-shrink-0">
                {/* Zero-padded to match AgentEngineering's 01/02/03. Two
                    numbered rails on one page reading "1" and "01" looks
                    accidental rather than deliberate. */}
                <span
                  dir="ltr"
                  className="grid place-items-center w-8 h-8 rounded-full border border-brand/30 bg-surface-2 font-mono text-xs text-brand tabular-nums"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i < STEPS.length - 1 && (
                  <span
                    className="w-px flex-1 mt-2 bg-brand/15"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="pt-1 pb-1">
                <h3 className="text-foreground font-semibold mb-1.5">
                  {t(`fde.${step.key}Title`)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(`fde.${step.key}Desc`)}
                </p>
                <div
                  dir={step.ev ? "ltr" : undefined}
                  className="mt-2.5 font-mono text-[11px] leading-relaxed text-brand/70"
                >
                  {"└ "}
                  {step.ev ?? t(`fde.${step.key}Ev`)}
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default ForwardDeployedSection;
