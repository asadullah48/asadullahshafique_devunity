"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/context/LocaleContext";

const EVIDENCE = [
  {
    key: "business",
    links: [
      { label: "CMT", href: "https://github.com/asadullah48/cmt-stitching-system" },
      { label: "AI TradeFlow", href: "https://github.com/asadullah48/ai-tradeflow" },
    ],
  },
  {
    key: "integration",
    links: [
      { label: "OpenAI Agents SDK", href: "https://github.com/asadullah48/asadullahshafique_devunity/tree/main/backend/orchestration" },
      { label: "ProtoBridge", href: "/systems/protobridge" },
    ],
  },
  {
    key: "evaluation",
    links: [
      { label: "Atlas", href: "https://asadullah48.github.io/agent-failure-atlas/" },
      { label: "Rehearsal", href: "https://asadullah48.github.io/agent-rehearsal/" },
    ],
  },
] as const;

export default function DeliveryEvidence() {
  const { t } = useLocale();

  return (
    <section id="delivery-evidence" aria-labelledby="delivery-heading" className="border-b border-border py-16">
      <div className="container mx-auto px-6">
        <Reveal className="mb-8 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">{t("delivery.eyebrow")}</p>
          <h2 id="delivery-heading" className="mt-3 font-display text-3xl font-bold text-foreground">{t("delivery.title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("delivery.intro")}</p>
        </Reveal>
        <div className="divide-y divide-border">
          {EVIDENCE.map(({ key, links }, index) => (
            <Reveal key={key} step={index} className="grid gap-4 py-6 md:grid-cols-[1fr_2fr]">
              <h3 className="text-lg font-semibold text-foreground">{t(`delivery.${key}Title`)}</h3>
              <div>
                <p className="leading-relaxed text-muted-foreground">{t(`delivery.${key}Desc`)}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t(`delivery.${key}Limit`)}</p>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  {links.map(({ label, href }) => (
                    <Link key={href} href={href} className="text-sm text-brand underline underline-offset-4">{label}</Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 flex flex-wrap items-center gap-5 border-t border-border pt-6">
          <Link href="/resume" className="text-brand underline underline-offset-4">{t("delivery.resume")}</Link>
          <a href="mailto:asadullahshafique@hotmail.com" className="text-brand underline underline-offset-4">{t("delivery.contact")}</a>
          <a href="https://openai.com/careers/forward-deployed-engineer-uae-abu-dhabi-uae/" className="text-sm text-muted-foreground underline underline-offset-4">{t("delivery.role")}</a>
        </Reveal>
      </div>
    </section>
  );
}
