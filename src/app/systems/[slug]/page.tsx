import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import { FLAGSHIP_SYSTEMS, getFlagshipSystem } from "@/lib/flagship-systems";
import { BASE_URL } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return FLAGSHIP_SYSTEMS.map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const system = getFlagshipSystem((await params).slug);
  if (!system) return {};
  const url = `${BASE_URL}/systems/${system.slug}`;
  return {
    title: `${system.name} Case Study — Asadullah Shafique`,
    description: system.summary,
    alternates: { canonical: url },
    openGraph: { title: `${system.name}: ${system.thesis}`, description: system.summary, url, type: "article" }
  };
}

export default async function SystemCaseStudyPage({ params }: Props) {
  const system = getFlagshipSystem((await params).slug);
  if (!system) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${system.name}: ${system.thesis}`,
    description: system.summary,
    author: { "@type": "Person", name: "Asadullah Shafique", url: BASE_URL },
    url: `${BASE_URL}/systems/${system.slug}`
  };

  return (
    <article className="min-h-screen bg-background pb-24 pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto max-w-5xl px-6">
        <Link href="/#projects" className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-brand">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to flagship systems
        </Link>

        <header className="mt-12 border-b border-border pb-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-soft">{system.accent} · Flagship case study</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">{system.name}</h1>
          <p className="mt-5 max-w-3xl text-balance text-2xl font-semibold text-foreground">{system.thesis}</p>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">{system.summary}</p>
          <a href={system.repository} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-lg border border-brand/40 px-5 py-3 font-mono text-sm text-brand-soft transition-colors hover:bg-brand/10 hover:text-brand">
            <Github className="h-4 w-4" aria-hidden="true" /> Inspect repository <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </header>

        <section className="grid gap-px bg-border/50 md:grid-cols-2">
          <div className="bg-background p-8"><p className="font-mono text-xs uppercase tracking-widest text-brand/70">Problem</p><p className="mt-4 leading-relaxed text-muted-foreground">{system.problem}</p></div>
          <div className="bg-background p-8"><p className="font-mono text-xs uppercase tracking-widest text-brand/70">Architectural decision</p><p className="mt-4 leading-relaxed text-muted-foreground">{system.decision}</p></div>
        </section>

        <section className="py-16">
          <p className="font-mono text-xs uppercase tracking-widest text-brand/70">Execution topology</p>
          <ol className="mt-6 grid gap-3 md:grid-cols-5">
            {system.architecture.map((step, index) => (
              <li key={step} className="relative rounded-lg border border-border bg-surface-1 p-4">
                <span className="font-mono text-xs text-brand/60">0{index + 1}</span>
                <p className="mt-2 text-sm font-semibold text-foreground">{step}</p>
                {index < system.architecture.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-raised hidden h-5 w-5 -translate-y-1/2 text-brand md:block" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-8 border-y border-border py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Engineered invariants</h2>
            <ul className="mt-6 space-y-3">{system.invariants.map((item) => <li key={item} className="border-s-2 border-brand/30 ps-4 leading-relaxed text-muted-foreground">{item}</li>)}</ul>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Verification paths</h2>
            <div className="mt-6 space-y-3">{system.verification.map((item) => <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="group block rounded-lg border border-border bg-surface-1 p-5 transition-colors hover:border-brand/40"><span className="inline-flex items-center gap-2 font-semibold text-foreground group-hover:text-brand">{item.label}<ExternalLink className="h-3 w-3" aria-hidden="true" /></span><span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{item.detail}</span></a>)}</div>
          </div>
        </section>

        <section className="grid gap-8 py-16 lg:grid-cols-2">
          <div><h2 className="font-display text-3xl font-bold text-foreground">Boundaries stated plainly</h2><ul className="mt-6 space-y-3">{system.limitations.map((item) => <li key={item} className="leading-relaxed text-muted-foreground">— {item}</li>)}</ul></div>
          <div><h2 className="font-display text-3xl font-bold text-foreground">Enterprise adoption path</h2><ol className="mt-6 space-y-3">{system.enterpriseNext.map((item, index) => <li key={item} className="flex gap-3 leading-relaxed text-muted-foreground"><span className="font-mono text-brand/70">0{index + 1}</span>{item}</li>)}</ol></div>
        </section>

        <footer className="rounded-xl border border-brand/25 bg-brand/5 p-8 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">Need this pattern adapted to a real workflow?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Bring the operational problem, current stack, and constraints. The first conversation is about system boundaries—not model hype.</p>
          <Link href="/#contact" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 font-semibold text-primary-foreground">Discuss an AI system <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </footer>
      </div>
    </article>
  );
}
