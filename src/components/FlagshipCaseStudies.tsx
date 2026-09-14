"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/context/LocaleContext";

const SYSTEMS = ["orchestratorx", "protobridge", "guardrailai"] as const;

export default function FlagshipCaseStudies() {
  const { t } = useLocale();
  return (
    <section id="flagship-case-studies" className="py-24">
      <div className="container mx-auto px-6">
        <Reveal className="mb-12 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand/60">{t("caseStudies.eyebrow")}</p>
          <h2 className="mt-3 font-display text-4xl font-bold text-foreground md:text-5xl">{t("caseStudies.title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t("caseStudies.subtitle")}</p>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-3">
          {SYSTEMS.map((slug, index) => (
            <Reveal key={slug} step={index}>
              <Link href={`/systems/${slug}`} className="group flex h-full flex-col rounded-xl border border-border bg-surface-1/50 p-7 transition-all hover:-translate-y-1 hover:border-brand/40">
                <span className="font-mono text-xs uppercase tracking-widest text-brand/70">0{index + 1} · {t(`caseStudies.${slug}Tag`)}</span>
                <h3 className="mt-5 font-display text-2xl font-bold text-foreground">{t(`caseStudies.${slug}Title`)}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">{t(`caseStudies.${slug}Desc`)}</p>
                <span className="mt-7 inline-flex items-center gap-2 font-mono text-sm text-brand-soft group-hover:text-brand">{t("caseStudies.cta")}<ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
