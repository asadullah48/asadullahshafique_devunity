"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, Code2, Users } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/context/LocaleContext";

const PATHS = [
  { id: "hiring", icon: BriefcaseBusiness, href: "#evidence" },
  { id: "client", icon: Building2, href: "#contact" },
  { id: "developer", icon: Code2, href: "#flagship-case-studies" },
  { id: "community", icon: Users, href: "#discord" }
] as const;

export default function AudiencePaths() {
  const { t } = useLocale();
  return (
    <section aria-labelledby="audience-heading" className="border-b border-border py-16">
      <div className="container mx-auto px-6">
        <Reveal className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand/60">{t("audiences.eyebrow")}</p>
          <h2 id="audience-heading" className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">{t("audiences.title")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t("audiences.subtitle")}</p>
        </Reveal>
        <div className="grid gap-px bg-border/50 md:grid-cols-2 lg:grid-cols-4">
          {PATHS.map(({ id, icon: Icon, href }, index) => (
            <Reveal key={id} step={index}>
              <Link href={href} className="group flex h-full flex-col bg-background p-6 transition-colors hover:bg-surface-1">
                <Icon className="h-6 w-6 text-brand" aria-hidden="true" />
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{t(`audiences.${id}Title`)}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t(`audiences.${id}Desc`)}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs text-brand-soft group-hover:text-brand">{t(`audiences.${id}Cta`)}<ArrowRight className="h-3 w-3" aria-hidden="true" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
