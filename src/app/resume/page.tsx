"use client";

import React from "react";
import { Reveal } from "@/components/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  FileDown,
  MapPin,
  Phone,
  Mail,
  Github,
  Linkedin,
  Globe,
  Trophy,
  Briefcase,
  GraduationCap,
  Code2,
  ArrowLeft,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

/**
 * Agentic AI Mastery Matrix — the SAME twelve competencies rendered by
 * Skills.tsx and tabulated in README.md. Three surfaces, one set of claims.
 * If a row changes, it changes in all three, or a reader who checks two of
 * them catches us disagreeing with ourselves.
 *
 * Every row carries `evidence`: a path that demonstrates it. A competency
 * that cannot cite one does not belong on a résumé either — twelve rows
 * that survive an audit beat twenty that do not.
 *
 * `ar` rides along because Gulf clients read this page and there is no
 * /ar/resume route. A footnote that cannot drift beats a second page that
 * silently will.
 */
const mastery = [
  {
    category: "Agentic Orchestration",
    ar: "تنسيق الوكلاء",
    items: [
      { name: "Engineering Multi-Agent Ecosystem Design (MAS)", evidence: "backend/orchestration/" },
      { name: "Designing Graph-Based Agent Workflows", evidence: "LangGraph · Plan-Act-Verify" },
      { name: "Implementing Agentic Coding & SDLC Standardization", evidence: "CLAUDE.md · spec-first" },
    ],
  },
  {
    category: "Connectivity & Protocols",
    ar: "الاتصال والبروتوكولات",
    items: [
      { name: "Engineering MCP Interoperability Layers", evidence: "/mcp/server · FastMCP" },
      { name: "Standardizing Read-Only Agent Tool Contracts", evidence: "6 tools, read-only" },
      { name: "Architecting Provider-Agnostic Fallback Ladders", evidence: "SDK → LangGraph → static" },
    ],
  },
  {
    category: "Enterprise & Scale",
    ar: "المؤسسات والتوسّع",
    items: [
      { name: "Engineering Domain-Specific Intelligence (Finance)", evidence: "FinAgent-Nexus · 94 tests" },
      { name: "Architecting Domain-Specific ERP Intelligence (Textile)", evidence: "CMT · live" },
      { name: "Implementing Cloud-Native Scale-Out", evidence: "k8s/ · 11 manifests" },
    ],
  },
  {
    category: "Reliability & Safety",
    ar: "الموثوقية والأمان",
    items: [
      { name: "Implementing Deterministic Guardrails", evidence: "constitution/ · 4-of-4 blocked" },
      { name: "Designing Feedback-Driven Evaluation Loops", evidence: "evals/ · 3 suites" },
      { name: "Engineering Context Integrity & Trace Auditability", evidence: "orchestration/context.py" },
    ],
  },
];

/**
 * Flagship projects. Every impact line is transcribed from the project's own
 * verified figures — never rounded up, never invented. A résumé metric a
 * reader cannot reproduce is worth less than no metric at all, because the
 * one they check is the one they remember.
 */
const flagship = [
  {
    name: "FinAgent-Nexus",
    tagline: "Multi-Agent Financial Intelligence",
    impact:
      "Settles 8 of 14 compliance principles by arithmetic — a full screen in under 2ms with zero model calls, and 94 tests that pass with no API key and no network.",
    href: "https://github.com/asadullah48/finagent-nexus",
    stack: ["LangGraph", "Constitutional AI", "Python 3.12"],
    shipped: true,
  },
  {
    name: "AI TradeFlow",
    tagline: "Inventory & Accounting for Wholesalers",
    impact:
      "90 automated tests including full-trade-cycle integration and agent golden-question suites with tool-citation assertions. Munshi AI ships 5 read-only tools behind a deterministic constitutional screen.",
    href: "https://github.com/asadullah48/ai-tradeflow",
    stack: ["OpenAI Agents SDK", "FastAPI", "PostgreSQL"],
    shipped: true,
  },
  {
    name: "DevUnity Platform",
    tagline: "This portfolio — and its own proof",
    impact:
      "A triage orchestrator over four specialists, a real MCP server on the official SDK, and a written constitution verified blocking 4 of 4 violations with no model reachable.",
    href: "https://github.com/asadullah48/asadullahshafique_devunity",
    stack: ["Agents SDK", "FastMCP", "Next.js 15"],
    shipped: true,
  },
  {
    name: "Bazaar",
    tagline: "Unified B2B + B2C Marketplace",
    impact:
      "500+ verified sellers and 10K+ products across one codebase serving both retail checkout and a wholesale RFQ engine. PKR-native, three languages.",
    href: "https://github.com/asadullah48/bazaar",
    stack: ["Next.js 15", "FastAPI", "Supabase"],
    shipped: true,
  },
  {
    name: "Textile ERP Platform",
    tagline: "Multi-tenant SaaS for Pakistan's textile heartland",
    impact:
      "Targets Faisalabad, Sialkot, Gujranwala, Karachi and Lahore. Order lifecycle, four auto-billing types, party ledgers and BOM inventory. Launching 2026.",
    href: "https://cmt-stitching-asadullah-shafiques-projects.vercel.app",
    stack: ["Kubernetes", "FastAPI", "PostgreSQL"],
    shipped: false,
  },
  {
    name: "Agent Factory (H5)",
    tagline: "A General Agent that manufactures Custom Agents",
    impact:
      "Two-tier architecture where Claude Code manufactures OpenAI Agents SDK agents; SKILL.md as portable intelligence units. Platinum tier, deployed on Kubernetes + Dapr.",
    href: "https://github.com/asadullah48",
    stack: ["Claude Code", "SKILL.md", "Dapr"],
    shipped: true,
  },
];

const skills = {
  Languages: ["TypeScript", "JavaScript", "Python", "HTML/CSS"],
  Frontend: ["Next.js 15", "React 19", "Tailwind CSS v4", "shadcn/ui"],
  Backend: ["FastAPI", "SQLAlchemy ORM", "PostgreSQL", "REST APIs"],
  "AI & Agents": ["OpenAI Agents SDK", "MCP Servers", "Constitutional AI", "RAG", "OpenAI API"],
  "Cloud & DevOps": ["Kubernetes", "Docker", "Dapr", "Kafka", "Helm", "GitHub Actions", "Vercel", "Koyeb", "Minikube"],
  Observability: ["Prometheus", "Grafana", "Jaeger", "Loki"],
  "Platforms & Tools": ["Git", "Windows 11", "WSL2"],
};

const hackathons = [
  {
    emoji: "🏭",
    name: "Agent Factory (H5)",
    year: "2025",
    tier: "Platinum",
    description: "General Agent (Claude Code) manufactures Custom Agents (OpenAI Agents SDK). SKILL.md monetization. Digital FTE deployed on Kubernetes + Dapr. 117-slide deck.",
    stack: ["Claude Code", "OpenAI SDK", "MCP", "SKILL.md", "Dapr", "K8s"],
  },
  {
    emoji: "🏆",
    name: "Cloud-Native Deployment (H4)",
    year: "2025",
    tier: "Platinum",
    description: "Full K8s stack: Kubernetes + Docker + Dapr + Kafka + Prometheus/Grafana/Jaeger + Helm + GitHub Actions CI/CD.",
    stack: ["K8s", "Docker", "Dapr", "Kafka", "Helm", "Prometheus"],
  },
  {
    emoji: "🥇",
    name: "Advanced Todo (H3)",
    year: "2025",
    tier: "Gold",
    description: "149 tests passing. Recurring todos, team collaboration, AI suggestions, triple-layer Constitutional AI (7 BLOCK + 5 FLAG patterns).",
    stack: ["Next.js", "FastAPI", "PostgreSQL"],
  },
  {
    emoji: "🥈",
    name: "AI-Powered Todo (H2)",
    year: "2025",
    tier: "Silver",
    description: "89 tests passing. Full-stack Constitutional AI todo. 70% code reuse from H1.",
    stack: ["Next.js", "TypeScript", "FastAPI"],
  },
  {
    emoji: "🥈",
    name: "Course Companion FTE (H1)",
    year: "2024",
    tier: "Silver",
    description: "Zero-Backend-LLM architecture. Digital FTE model. 70% code reuse from H0.",
    stack: ["Next.js", "TypeScript", "OpenAI"],
  },
  {
    emoji: "🥉",
    name: "Personal AI CTO (H0)",
    year: "2024",
    tier: "Bronze",
    description: "Constitutional AI foundation. Established spec-first, four-session methodology.",
    stack: ["TypeScript", "Constitutional AI"],
  },
];

const projects = [
  {
    name: "Textile ERP Platform (Pakistan)",
    status: "In Development",
    role: "Founder",
    period: "2024 – Present",
    description:
      "Full-scale ERP targeting Pakistan's textile and garment industry, from Fabric Mills to CMT units to garment exporters.",
    bullets: [
      "Fabric Mill Module: Roll/lot management, weaving & knitting stage tracking, yarn inventory, imported fabric handling",
      "CMT Core: Order lifecycle management, auto-billing (4 bill types), inventory with BOM, production sessions, dispatch tracking",
      "Financial: Party ledgers, cash flow tracking, financial accounts for multi-city hubs (Faisalabad, Sialkot, Gujranwala, Karachi, Lahore)",
    ],
    demo: "https://cmt-stitching-asadullah-shafiques-projects.vercel.app",
    stack: ["Next.js 15", "FastAPI", "PostgreSQL", "Vercel", "Koyeb"],
  },
  {
    name: "Agent Factory (H5)",
    status: "Panaversity Hackathon 2025",
    role: "Lead Developer",
    period: "2025",
    description: "Two-tier agentic architecture: General Agent manufactures Custom Agents at scale.",
    bullets: [
      "General Agent (Claude Code) manufactures Custom Agent (OpenAI Agents SDK)",
      "SKILL.md files as portable, reusable, monetizable intelligence units",
      "Digital FTE pricing model targeting OpenAI Apps ecosystem (800M users)",
      "Deployed on Kubernetes + Dapr",
    ],
    demo: null,
    stack: ["Claude Code", "OpenAI SDK", "MCP", "SKILL.md", "Dapr", "Kubernetes"],
  },
];

const experience = [
  {
    role: "Founder & CEO, CMT Stitching Operations",
    company: "Texcot Embroidery Sourcing House",
    period: "2020 – Present",
    location: "Karachi, Pakistan",
    bullets: [
      "Engineered a multi-agent orchestration layer for financial-services research and Shari'ah screening, with separation of powers enforced structurally — no agent holds two of market data, weighting and verdict — rather than by prompt",
      "Implemented MCP interoperability so agent capability is exposed as read-only tools on a protocol server, verified against a live client, instead of as bespoke HTTP endpoints",
      "Architected deterministic guardrails from a written constitution, screened before any model call — verified blocking 4 of 4 violations with no model reachable, so enforcement survives a provider outage",
      "Architected the Textile ERP Platform — order lifecycle, four auto-billing types, party ledgers and BOM inventory — to digitize Pakistan's textile value chain",
      "Founded and operate a CMT stitching unit of 30–35 staff, running the full manufacturing lifecycle from sample fabric and design analysis through machine allocation, bulk production and inspection",
      "Directed digital marketing across social channels, property portals and lead-generation funnels for textile and GCC real-estate clients",
    ],
  },
  {
    role: "Marketing Manager",
    company: "JK Embroidery",
    period: "2016 – 2020",
    location: "Karachi, Pakistan",
    bullets: [
      "Directed marketing and production planning for embroidery manufacturing operations",
      "Engineered staff and equipment scheduling to clear production bottlenecks, implementing process improvements that held under peak order flow",
      "Led a team of 30–35 staff, setting priorities against available resources and work-order flow",
    ],
  },
  {
    role: "Country Manager / Buying Agent",
    company: "Steven Berry",
    period: "2003 – 2005",
    location: "International",
    bullets: [
      "Managed and organized international shipments, providing clients guidance throughout procurement processes",
      "Ensured products met established international quality standards across garment and textile categories",
      "Conducted pre-production, in-production, and final inspection of apparel, accessories, and textile products",
    ],
  },
];

const education = [
  { degree: "Alim (5-Year Islamic Studies Course)", institution: "Burooj Institute, Karachi", period: "" },
  { degree: "Associate Degree in Textile Technology", institution: "Textile Institute of Pakistan (APTMA)", period: "1997" },
  { degree: "H.S.C Pre-Engineering", institution: "Pakistan Shipowner's Government College, Karachi", period: "1994" },
  { degree: "S.S.C Science", institution: "Ladybird Grammar School, Karachi", period: "1992" },
];

const tierColor: Record<string, string> = {
  Platinum: "bg-zinc-300/10 text-foreground border-zinc-300/40",
  Gold: "bg-yellow-400/10 text-yellow-400 border-yellow-400/40",
  Silver: "bg-muted/10 text-muted-foreground border-border/40",
  Bronze: "bg-amber-700/10 text-amber-500 border-amber-500/40",
};

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-gradient-to-br from-background via-surface-1 to-background border-b border-border">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div>
            {/* data-print="hide": public/resume.pdf is printed from this very
                page, so anything that only does something when clicked would
                otherwise become dead furniture inside the PDF. */}
            <Reveal className="mb-8" data-print="hide">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
              </Link>
            </Reveal>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <Reveal >
                <div className="flex items-center gap-3 mb-1">
                  <Code2 className="w-8 h-8 text-brand" />
                  <h1 className="text-4xl font-bold text-foreground">Asadullah Shafique</h1>
                </div>
                <p className="text-brand font-medium text-lg mb-1 ml-11">
                  Agentic AI Engineer | Multi-Agent Systems Architect | Enterprise AI Strategist
                </p>
                <p className="text-muted-foreground text-sm mb-4 ml-11 max-w-2xl leading-relaxed">
                  Bridging AI potential with financial services reality through orchestration,
                  compliance, and scalable adoption.
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground ml-11">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand" /> Karachi, Pakistan
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand" /> +92-321-3771445
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-brand" /> asadullahshafique@hotmail.com
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-2 text-sm text-muted-foreground ml-11">
                  <Link href="https://github.com/asadullah48" target="_blank" className="flex items-center gap-1.5 hover:text-brand transition-colors">
                    <Github className="w-3.5 h-3.5" /> github.com/asadullah48
                  </Link>
                  <Link href="https://linkedin.com/in/asadullah-shafique-a00679325" target="_blank" className="flex items-center gap-1.5 hover:text-brand transition-colors">
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </Link>
                  <Link href="https://asadullahshafique-devunity.vercel.app" target="_blank" className="flex items-center gap-1.5 hover:text-brand transition-colors">
                    <Globe className="w-3.5 h-3.5" /> Portfolio
                  </Link>
                  <Link href="https://medium.com/@texcotembroiderysourcinghouse" target="_blank" className="flex items-center gap-1.5 hover:text-brand transition-colors">
                    Medium
                  </Link>
                </div>
              </Reveal>

              <Reveal className="flex flex-col gap-2 flex-shrink-0" data-print="hide">
                <a href="/resume.pdf" download="Asadullah_Shafique_Resume_2025.pdf">
                  <Button className="w-full bg-brand text-primary-foreground font-semibold hover:bg-brand/90 h-11 px-6">
                    <FileDown className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </a>
                <a href="/Asadullah_Shafique_Resume_2025.md" download>
                  <Button variant="outline" className="w-full border-border text-muted-foreground hover:border-brand/50 hover:text-brand h-9 px-6 text-sm">
                    <FileDown className="w-3.5 h-3.5 mr-2" />
                    Download Markdown
                  </Button>
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">

        {/* Summary */}
        <Section title="Professional Summary" icon={<Briefcase className="w-5 h-5" />}>
          <p className="text-foreground/80 leading-relaxed">
            Agentic AI Engineer building multi-agent systems for regulated industries, backed by{" "}
            <span className="text-foreground font-medium">25+ years</span> of operating a manufacturing business.
            Most agentic pilots in financial services die at the compliance review — not because the models are
            weak, but because a system that cannot show <em>why</em> it reached a conclusion cannot be signed off
            by a second line of defence. My work makes that reviewable: typed orchestration with an auditable
            route, a written constitution screened deterministically before any model call, and evaluation that
            reads the execution trace rather than trusting the prose.
          </p>
          <p className="text-foreground/80 leading-relaxed mt-3">
            Founder of Texcot Embroidery Sourcing House and creator of the{" "}
            <span className="text-brand font-medium">Textile ERP Platform</span>, targeting fabric mills, CMT
            units and garment exporters across Faisalabad, Sialkot, Gujranwala, Karachi and Lahore — so the
            domain intelligence is built from inside an industry rather than modelled from outside one.
            Completed <span className="text-foreground font-medium">6 consecutive Panaversity Hackathons</span>{" "}
            (Bronze → Silver → Silver → Gold → Platinum → Agent Factory) with{" "}
            <span className="text-brand font-medium">85% code reusability</span> and{" "}
            <span className="text-brand font-medium">zero failed attempts</span>.
          </p>
        </Section>

        {/* Two-column body. Left rail is what he KNOWS (competencies, stack,
            credentials); right rail is what he BUILT and where. On lg the
            5-column split gives the left rail 2 and the evidence 3, because a
            reviewer skims capability and then reads proof — not the reverse.
            Below lg it stacks in source order, which is already that order. */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="lg:col-span-2 space-y-12">

        {/* Core Competencies — the Agentic AI Mastery Matrix */}
        <Section title="Agentic AI Mastery" icon={<Code2 className="w-5 h-5" />}>
          <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
            Twelve competencies, four categories. Each cites the path that demonstrates it.
          </p>
          <div className="space-y-5">
            {mastery.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <p className="text-brand text-xs font-semibold uppercase tracking-wider">
                    {cat.category}
                  </p>
                  {/* The bilingual footnote, inlined per category so a Gulf
                      reader meets the Arabic beside the claim rather than
                      hunting for it at the foot of the page. dir/lang are
                      required: without them the bidi algorithm hands Arabic
                      to an LTR run and the punctuation migrates. */}
                  <span dir="rtl" lang="ar" className="text-[11px] text-muted-foreground/70 flex-shrink-0">
                    {cat.ar}
                  </span>
                </div>
                <ul className="space-y-2">
                  {cat.items.map((it) => (
                    <li key={it.name} className="flex flex-col gap-0.5">
                      <span className="text-sm text-foreground/80 flex gap-2">
                        <span className="text-brand mt-0.5 flex-shrink-0">›</span>
                        {it.name}
                      </span>
                      {/* Gold = provenance, the same meaning it carries
                          everywhere else on this site. Never clickable. */}
                      <span dir="ltr" className="ml-4 text-[10px] font-mono text-gold/70 break-all">
                        {it.evidence}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Technical Skills */}
        <Section title="Technical Skills" icon={<Code2 className="w-5 h-5" />}>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-border text-foreground/80 hover:border-brand/50 hover:text-brand transition-colors text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Hackathons */}
        <Section title="Hackathon Achievements" icon={<Trophy className="w-5 h-5" />}>
          <p className="text-sm text-muted-foreground mb-5">
            Panaversity Hackathon Series: <span className="text-foreground/80">6 Consecutive Wins</span> · 85% Code Reuse · Zero Failed Attempts
          </p>
          <div className="space-y-3">
            {hackathons.map((h) => (
              <Reveal
                key={h.name}
              >
                <Card className="bg-surface-1/60 border-border hover:border-border transition-colors">
                  <CardContent className="p-4">
                    {/* Always stacked, never a side rail. This card used
                        `sm:flex-row` with a fixed `sm:w-56` badge column, and
                        that broke the moment the résumé became two-column:
                        `sm:` is a VIEWPORT query, not a container query, so on
                        a wide screen it still applied inside a 2/5-width
                        column — a 224px rail against a ~360px container left
                        ~140px for the body, and the longest stack line spilled
                        past the card edge. Container width is what matters
                        here, so the rail is gone rather than re-tuned. */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xl">{h.emoji}</span>
                        <Badge variant="outline" className={`text-xs ${tierColor[h.tier]}`}>
                          {h.tier}
                        </Badge>
                        <span className="text-muted-foreground text-xs">{h.year}</span>
                      </div>
                      <div>
                        <p className="text-foreground font-medium text-sm mb-1">{h.name}</p>
                        <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{h.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {h.stack.map((t) => (
                            <Badge key={t} variant="outline" className="border-brand/25 text-brand/80 text-xs">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>

          </div>
          <div className="lg:col-span-3 space-y-12">

        {/* Flagship Projects — the evidence column's opening argument. */}
        <Section title="Flagship Projects" icon={<Trophy className="w-5 h-5" />}>
          <div className="grid gap-3 sm:grid-cols-2">
            {flagship.map((p) => (
              <Card key={p.name} className="bg-surface-1/60 border-border hover:border-brand/30 transition-colors">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Link
                      href={p.href}
                      target="_blank"
                      className="font-semibold text-foreground text-sm hover:text-brand transition-colors flex items-center gap-1"
                    >
                      {p.name}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </Link>
                    {/* "Shipped" is a claim about the world, so it only goes
                        on a project whose code or deployment answers for it.
                        Textile ERP is deliberately not shipped — it launches
                        2026, and a badge that lies here poisons the other five. */}
                    <Badge
                      variant="outline"
                      className={`text-[10px] flex-shrink-0 ${
                        p.shipped
                          ? "border-brand/40 text-brand"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {p.shipped ? "Shipped ✅" : "In build"}
                    </Badge>
                  </div>
                  <p className="text-brand/80 text-xs mb-2">{p.tagline}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-grow">{p.impact}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {p.stack.map((s) => (
                      <Badge key={s} variant="outline" className="border-border text-muted-foreground text-[10px]">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* Projects */}
        <Section title="Key Projects" icon={<Code2 className="w-5 h-5" />}>
          <div className="space-y-4">
            {projects.map((p) => (
              <Reveal
                key={p.name}
              >
                <Card className="bg-surface-1/60 border-border hover:border-border transition-colors">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">{p.name}</h3>
                          <Badge variant="outline" className="text-xs border-border text-muted-foreground">{p.status}</Badge>
                        </div>
                        <p className="text-brand text-sm">{p.role}</p>
                      </div>
                      <span className="text-sm text-muted-foreground flex-shrink-0">{p.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{p.description}</p>
                    <ul className="space-y-1.5 mb-3">
                      {p.bullets.map((b) => (
                        <li key={b} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-brand mt-0.5 flex-shrink-0">›</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap items-center gap-2">
                      {p.stack.map((t) => (
                        <Badge key={t} variant="outline" className="border-brand/30 text-brand text-xs">
                          {t}
                        </Badge>
                      ))}
                      {p.demo && (
                        <Link
                          href={p.demo}
                          target="_blank"
                          className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-brand transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" /> Live Demo
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section title="Professional Experience" icon={<Briefcase className="w-5 h-5" />}>
          <div className="space-y-4">
            {experience.map((job) => (
              <Reveal
                key={job.role}
              >
                <Card className="bg-surface-1/60 border-border hover:border-border transition-colors">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{job.role}</h3>
                        <p className="text-brand text-sm">{job.company}</p>
                      </div>
                      <div className="text-sm text-muted-foreground flex-shrink-0 sm:text-right">
                        <p>{job.period}</p>
                        <p>{job.location}</p>
                      </div>
                    </div>
                    <ul className="space-y-1.5">
                      {job.bullets.map((b) => (
                        <li key={b} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-brand mt-0.5 flex-shrink-0">›</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>

          </div>
        </div>

        {/* Digital Marketing */}
        <Section title="Digital Marketing Services" icon={<TrendingUp className="w-5 h-5" />}>
          <Card className="bg-surface-1/60 border-border">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                Full-spectrum digital marketing strategy for Dubai real estate, UAE construction, and Pakistani SMEs:
              </p>
              <ul className="space-y-1.5">
                {[
                  "Social media management (Facebook, Instagram, X/Twitter, LinkedIn) + paid advertising campaigns",
                  "Property portal listings, lead generation funnels, and monthly performance reporting",
                  "Tailored strategies for GCC/expat/Pakistani diaspora investors; AED-priced service packages",
                ].map((b) => (
                  <li key={b} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-brand mt-0.5 flex-shrink-0">›</span>
                    {b}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Section>

        {/* Education */}
        <Section title="Education" icon={<GraduationCap className="w-5 h-5" />}>
          <div className="space-y-0">
            {education.map((e) => (
              <div
                key={e.degree}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3.5 border-b border-border/60 last:border-0"
              >
                <div>
                  <p className="font-medium text-foreground text-sm">{e.degree}</p>
                  <p className="text-muted-foreground text-sm">{e.institution}</p>
                </div>
                {e.period && <span className="text-muted-foreground text-sm flex-shrink-0">{e.period}</span>}
              </div>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <Reveal
          className="border border-border rounded-xl p-8 text-center bg-surface-1/40"
          data-print="hide"
        >
          <h3 className="text-xl font-bold text-foreground mb-2">Let&apos;s Work Together</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Open to collaborating on AI projects, digital marketing strategy, or textile tech.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="mailto:asadullahshafique@hotmail.com">
              <Button variant="outline" className="border-border text-foreground/80 hover:border-brand hover:text-brand">
                <Mail className="w-4 h-4 mr-2" /> Email Me
              </Button>
            </Link>
            <Link href="https://wa.me/923213771445" target="_blank">
              <Button variant="outline" className="border-border text-foreground/80 hover:border-brand hover:text-brand">
                WhatsApp
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-brand text-primary-foreground font-semibold hover:bg-brand/90">
                View Portfolio
              </Button>
            </Link>
          </div>
        </Reveal>

      </div>
    </main>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="section">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-brand">{icon}</span>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <div className="flex-1 h-px bg-surface-2" />
      </div>
      {children}
    </Reveal>
  );
}
