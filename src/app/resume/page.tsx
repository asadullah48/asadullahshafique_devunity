"use client";

import React from "react";
import { motion } from "framer-motion";
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
    name: "Textile ERP Platform — Pakistan",
    status: "In Development",
    role: "Founder",
    period: "2024 – Present",
    description:
      "Full-scale ERP targeting Pakistan's textile and garment industry — from Fabric Mills to CMT units to garment exporters.",
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
    role: "Founder & CEO — CMT Stitching Operations",
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
  { degree: "Alim — 5-Year Islamic Studies Course", institution: "Burooj Institute, Karachi", period: "" },
  { degree: "Associate Degree — Textile Technology", institution: "Textile Institute of Pakistan (APTMA)", period: "1997" },
  { degree: "H.S.C Pre-Engineering", institution: "Pakistan Shipowner's Government College, Karachi", period: "1994" },
  { degree: "S.S.C Science", institution: "Ladybird Grammar School, Karachi", period: "1992" },
];

const tierColor: Record<string, string> = {
  Platinum: "bg-zinc-300/10 text-zinc-200 border-zinc-300/40",
  Gold: "bg-yellow-400/10 text-yellow-400 border-yellow-400/40",
  Silver: "bg-zinc-400/10 text-zinc-400 border-zinc-400/40",
  Bronze: "bg-amber-700/10 text-amber-500 border-amber-500/40",
};

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.div variants={fade} className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#9CE630] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
              </Link>
            </motion.div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <motion.div variants={fade}>
                <div className="flex items-center gap-3 mb-1">
                  <Code2 className="w-8 h-8 text-[#9CE630]" />
                  <h1 className="text-4xl font-bold text-white">Asadullah Shafique</h1>
                </div>
                <p className="text-[#9CE630] font-medium text-lg mb-4 ml-11">
                  Agentic AI Developer | CMT Industry Founder | Digital Strategist
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-400 ml-11">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#9CE630]" /> Karachi, Pakistan
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#9CE630]" /> +92-321-3771445
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#9CE630]" /> asadullahshafique@hotmail.com
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-2 text-sm text-zinc-400 ml-11">
                  <Link href="https://github.com/asadullah48" target="_blank" className="flex items-center gap-1.5 hover:text-[#9CE630] transition-colors">
                    <Github className="w-3.5 h-3.5" /> github.com/asadullah48
                  </Link>
                  <Link href="https://linkedin.com/in/asadullah-shafique-a00679325" target="_blank" className="flex items-center gap-1.5 hover:text-[#9CE630] transition-colors">
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </Link>
                  <Link href="https://asadullahshafique-devunity.vercel.app" target="_blank" className="flex items-center gap-1.5 hover:text-[#9CE630] transition-colors">
                    <Globe className="w-3.5 h-3.5" /> Portfolio
                  </Link>
                  <Link href="https://medium.com/@texcotembroiderysourcinghouse" target="_blank" className="flex items-center gap-1.5 hover:text-[#9CE630] transition-colors">
                    Medium
                  </Link>
                </div>
              </motion.div>

              <motion.div variants={fade} className="flex flex-col gap-2 flex-shrink-0">
                <a href="/resume.pdf" download="Asadullah_Shafique_Resume_2025.pdf">
                  <Button className="w-full bg-[#9CE630] text-black font-semibold hover:bg-[#8BD520] h-11 px-6">
                    <FileDown className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </a>
                <a href="/Asadullah_Shafique_Resume_2025.md" download>
                  <Button variant="outline" className="w-full border-zinc-700 text-zinc-400 hover:border-[#9CE630]/50 hover:text-[#9CE630] h-9 px-6 text-sm">
                    <FileDown className="w-3.5 h-3.5 mr-2" />
                    Download Markdown
                  </Button>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">

        {/* Summary */}
        <Section title="Professional Summary" icon={<Briefcase className="w-5 h-5" />}>
          <p className="text-zinc-300 leading-relaxed">
            Agentic AI Developer and CMT Industry Founder with <span className="text-white font-medium">25+ years</span> of deep textile domain expertise,
            now building AI-powered SaaS for Pakistan&apos;s textile value chain. Founder of Texcot Embroidery Sourcing House and creator of the{" "}
            <span className="text-[#9CE630] font-medium">Textile ERP Platform</span> — a full-scale system targeting fabric mills, CMT units, and garment
            exporters across Faisalabad, Sialkot, Gujranwala, Karachi, and Lahore.
          </p>
          <p className="text-zinc-300 leading-relaxed mt-3">
            Completed <span className="text-white font-medium">6 consecutive Panaversity Hackathons</span> (Bronze → Silver → Silver → Gold → Platinum → Agent Factory)
            with <span className="text-[#9CE630] font-medium">85% code reusability</span> and <span className="text-[#9CE630] font-medium">zero failed attempts</span>.
            Combines manufacturing operations mastery with modern AI engineering to digitize one of Pakistan&apos;s core industries.
          </p>
        </Section>

        {/* Core Competencies */}
        <Section title="Core Competencies" icon={<Code2 className="w-5 h-5" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {competencies.map((c) => (
              <Card key={c.title} className="bg-zinc-900/60 border-zinc-800">
                <CardContent className="p-4">
                  <p className="text-[#9CE630] text-xs font-semibold uppercase tracking-wider mb-1.5">{c.title}</p>
                  <p className="text-zinc-300 text-sm">{c.items}</p>
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
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">{category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-zinc-700 text-zinc-300 hover:border-[#9CE630]/50 hover:text-[#9CE630] transition-colors text-xs"
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
          <p className="text-sm text-zinc-500 mb-5">
            Panaversity Hackathon Series — <span className="text-zinc-300">6 Consecutive Wins</span> · 85% Code Reuse · Zero Failed Attempts
          </p>
          <div className="space-y-3">
            {hackathons.map((h) => (
              <motion.div
                key={h.name}
                variants={fade}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Card className="bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="flex items-center gap-3 sm:w-56 flex-shrink-0">
                        <span className="text-xl">{h.emoji}</span>
                        <div>
                          <Badge variant="outline" className={`text-xs mb-1 ${tierColor[h.tier]}`}>
                            {h.tier}
                          </Badge>
                          <p className="text-zinc-500 text-xs">{h.year}</p>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm mb-1">{h.name}</p>
                        <p className="text-sm text-zinc-400 mb-2 leading-relaxed">{h.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {h.stack.map((t) => (
                            <Badge key={t} variant="outline" className="border-[#9CE630]/25 text-[#9CE630]/80 text-xs">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Projects */}
        <Section title="Key Projects" icon={<Code2 className="w-5 h-5" />}>
          <div className="space-y-4">
            {projects.map((p) => (
              <motion.div
                key={p.name}
                variants={fade}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Card className="bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-white">{p.name}</h3>
                          <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-500">{p.status}</Badge>
                        </div>
                        <p className="text-[#9CE630] text-sm">{p.role}</p>
                      </div>
                      <span className="text-sm text-zinc-500 flex-shrink-0">{p.period}</span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-3 leading-relaxed">{p.description}</p>
                    <ul className="space-y-1.5 mb-3">
                      {p.bullets.map((b) => (
                        <li key={b} className="text-sm text-zinc-400 flex gap-2">
                          <span className="text-[#9CE630] mt-0.5 flex-shrink-0">›</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap items-center gap-2">
                      {p.stack.map((t) => (
                        <Badge key={t} variant="outline" className="border-[#9CE630]/30 text-[#9CE630] text-xs">
                          {t}
                        </Badge>
                      ))}
                      {p.demo && (
                        <Link
                          href={p.demo}
                          target="_blank"
                          className="ml-auto flex items-center gap-1 text-xs text-zinc-500 hover:text-[#9CE630] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" /> Live Demo
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section title="Professional Experience" icon={<Briefcase className="w-5 h-5" />}>
          <div className="space-y-4">
            {experience.map((job) => (
              <motion.div
                key={job.role}
                variants={fade}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Card className="bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{job.role}</h3>
                        <p className="text-[#9CE630] text-sm">{job.company}</p>
                      </div>
                      <div className="text-sm text-zinc-500 flex-shrink-0 sm:text-right">
                        <p>{job.period}</p>
                        <p>{job.location}</p>
                      </div>
                    </div>
                    <ul className="space-y-1.5">
                      {job.bullets.map((b) => (
                        <li key={b} className="text-sm text-zinc-400 flex gap-2">
                          <span className="text-[#9CE630] mt-0.5 flex-shrink-0">›</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Digital Marketing */}
        <Section title="Digital Marketing Services" icon={<TrendingUp className="w-5 h-5" />}>
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-5">
              <p className="text-sm text-zinc-400 mb-3 leading-relaxed">
                Full-spectrum digital marketing strategy for Dubai real estate, UAE construction, and Pakistani SMEs:
              </p>
              <ul className="space-y-1.5">
                {[
                  "Social media management (Facebook, Instagram, X/Twitter, LinkedIn) + paid advertising campaigns",
                  "Property portal listings, lead generation funnels, and monthly performance reporting",
                  "Tailored strategies for GCC/expat/Pakistani diaspora investors; AED-priced service packages",
                ].map((b) => (
                  <li key={b} className="text-sm text-zinc-400 flex gap-2">
                    <span className="text-[#9CE630] mt-0.5 flex-shrink-0">›</span>
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
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3.5 border-b border-zinc-800/60 last:border-0"
              >
                <div>
                  <p className="font-medium text-white text-sm">{e.degree}</p>
                  <p className="text-zinc-400 text-sm">{e.institution}</p>
                </div>
                {e.period && <span className="text-zinc-500 text-sm flex-shrink-0">{e.period}</span>}
              </div>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="border border-zinc-800 rounded-xl p-8 text-center bg-zinc-900/40"
        >
          <h3 className="text-xl font-bold text-white mb-2">Let&apos;s Work Together</h3>
          <p className="text-zinc-400 text-sm mb-6">
            Open to collaborating on AI projects, digital marketing strategy, or textile tech.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="mailto:asadullahshafique@hotmail.com">
              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:border-[#9CE630] hover:text-[#9CE630]">
                <Mail className="w-4 h-4 mr-2" /> Email Me
              </Button>
            </Link>
            <Link href="https://wa.me/923213771445" target="_blank">
              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:border-[#9CE630] hover:text-[#9CE630]">
                WhatsApp
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-[#9CE630] text-black font-semibold hover:bg-[#8BD520]">
                View Portfolio
              </Button>
            </Link>
          </div>
        </motion.div>

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
    <motion.section
      variants={fade}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[#9CE630]">{icon}</span>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>
      {children}
    </motion.section>
  );
}
