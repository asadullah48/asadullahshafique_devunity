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

const competencies = [
  {
    title: "Agentic AI & Agents",
    items: "OpenAI Agents SDK, MCP Servers, Constitutional AI, RAG",
  },
  {
    title: "Cloud-Native & DevOps",
    items: "Kubernetes, Dapr, Kafka, Docker, Helm, GitHub Actions",
  },
  {
    title: "Full-Stack SaaS",
    items: "Next.js 15, React 19, FastAPI, PostgreSQL, Tailwind v4",
  },
  {
    title: "Domain Expertise",
    items: "Textile ERP, CMT Operations, Supply Chain, Digital Marketing",
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
      "Founded and operate a CMT stitching unit with 30–35 employees including supervisors and production leads",
      "Oversee full manufacturing lifecycle: sample fabric, design analysis, machine allocation, bulk production, fabric inspection",
      "Building Textile ERP Platform to digitize and scale operations across Pakistan's textile industry",
      "Lead digital marketing strategy: social media, property portals, and lead generation for textile clients",
    ],
  },
  {
    role: "Marketing Manager",
    company: "JK Embroidery",
    period: "2016 – 2020",
    location: "Karachi, Pakistan",
    bullets: [
      "Managed marketing and production planning for embroidery manufacturing operations",
      "Optimized staff and equipment scheduling; resolved production bottlenecks and implemented process improvements",
      "Led team of 30–35 staff; determined priorities based on resources and work order flow",
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
            <Reveal className="mb-8">
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
                <p className="text-brand font-medium text-lg mb-4 ml-11">
                  Agentic AI Developer | CMT Industry Founder | Digital Strategist
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

              <Reveal className="flex flex-col gap-2 flex-shrink-0">
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
            Agentic AI Developer and CMT Industry Founder with <span className="text-foreground font-medium">25+ years</span> of deep textile domain expertise,
            now building AI-powered SaaS for Pakistan&apos;s textile value chain. Founder of Texcot Embroidery Sourcing House and creator of the{" "}
            <span className="text-brand font-medium">Textile ERP Platform</span>, a full-scale system targeting fabric mills, CMT units, and garment
            exporters across Faisalabad, Sialkot, Gujranwala, Karachi, and Lahore.
          </p>
          <p className="text-foreground/80 leading-relaxed mt-3">
            Completed <span className="text-foreground font-medium">6 consecutive Panaversity Hackathons</span> (Bronze → Silver → Silver → Gold → Platinum → Agent Factory)
            with <span className="text-brand font-medium">85% code reusability</span> and <span className="text-brand font-medium">zero failed attempts</span>.
            Combines manufacturing operations mastery with modern AI engineering to digitize one of Pakistan&apos;s core industries.
          </p>
        </Section>

        {/* Core Competencies */}
        <Section title="Core Competencies" icon={<Code2 className="w-5 h-5" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {competencies.map((c) => (
              <Card key={c.title} className="bg-surface-1/60 border-border">
                <CardContent className="p-4">
                  <p className="text-brand text-xs font-semibold uppercase tracking-wider mb-1.5">{c.title}</p>
                  <p className="text-foreground/80 text-sm">{c.items}</p>
                </CardContent>
              </Card>
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
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="flex items-center gap-3 sm:w-56 flex-shrink-0">
                        <span className="text-xl">{h.emoji}</span>
                        <div>
                          <Badge variant="outline" className={`text-xs mb-1 ${tierColor[h.tier]}`}>
                            {h.tier}
                          </Badge>
                          <p className="text-muted-foreground text-xs">{h.year}</p>
                        </div>
                      </div>
                      <div className="flex-1">
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
