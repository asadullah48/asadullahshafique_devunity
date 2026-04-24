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
} from "lucide-react";

const skills = {
  Languages: ["TypeScript", "JavaScript", "Python", "HTML/CSS"],
  Frontend: ["Next.js 15", "React 19", "Tailwind v4", "shadcn/ui", "Framer Motion"],
  Backend: ["FastAPI", "SQLAlchemy ORM", "PostgreSQL", "RESTful APIs"],
  "Cloud / DevOps": ["Kubernetes", "Docker", "Dapr", "Kafka", "Helm", "GitHub Actions CI/CD"],
  "AI & Agents": ["OpenAI Agents SDK", "MCP Servers", "Constitutional AI", "RAG", "SKILL.md"],
  Observability: ["Prometheus", "Grafana", "Jaeger", "Loki"],
  Platforms: ["Vercel", "Koyeb", "Minikube", "WSL2", "Git"],
};

const experience = [
  {
    role: "Founder & CEO — CMT Stitching Operations",
    company: "Texcot Embroidery Sourcing House",
    period: "2020 – Present",
    location: "Karachi",
    bullets: [
      "Operates stitching unit with 30–35 employees including supervisors and production leads.",
      "Manages complete manufacturing: sample fabric, design analysis, machine allocation, bulk production, QC inspection.",
      "Developing Textile ERP Platform to digitize operations across Pakistan's textile sector.",
    ],
  },
  {
    role: "Digital Marketing Services",
    company: "Independent",
    period: "Concurrent",
    location: "Remote",
    bullets: [
      "Strategy for Dubai real estate, UAE construction, and Pakistani SMEs.",
      "Social media management (Facebook, Instagram, X, LinkedIn) plus paid advertising.",
      "Lead generation funnels and monthly performance reporting.",
    ],
  },
  {
    role: "Marketing Manager",
    company: "JK Embroidery",
    period: "2016 – 2020",
    location: "Karachi",
    bullets: [
      "Managed marketing and production planning; scheduled staff and equipment.",
      "Tracked KPIs; communicated with 30–35 team members on production priorities.",
    ],
  },
  {
    role: "Country Manager / Buying Agent",
    company: "Steven Berry",
    period: "2003 – 2005",
    location: "International",
    bullets: [
      "Managed international shipments; ensured compliance with international quality standards.",
      "Conducted pre-production, in-production, and final inspections of apparel and textiles.",
    ],
  },
];

const projects = [
  {
    name: "Textile ERP Platform",
    period: "2024 – Present",
    role: "Founder / Lead Developer",
    description:
      "Full-stack ERP targeting Pakistan's textile value chain. Module 1: Fabric Mill (roll/lot management, weaving/knitting tracking, yarn inventory). Core: CMT order lifecycle, auto-billing (4 types), BOM inventory, production sessions, dispatch, ledgers, cash flow.",
    stack: ["Next.js 15", "FastAPI", "PostgreSQL", "Vercel", "Koyeb"],
  },
  {
    name: "Agent Factory (H5)",
    period: "2025",
    role: "Panaversity Hackathon",
    description:
      "Two-tier architecture: General Agent (Claude Code) manufactures Custom Agent (OpenAI Agents SDK) at scale. SKILL.md monetization model targeting OpenAI Apps (800M users). Focus: Portable, monetizable intelligence units and Digital FTE pricing.",
    stack: ["Claude Code", "OpenAI SDK", "MCP", "SKILL.md", "Dapr", "Kubernetes"],
  },
];

const hackathons = [
  { tier: "Agent Factory", code: "H5", year: "2025", achievement: "General Agent builds Custom Agent; SKILL.md monetization; Digital FTE on K8s", stack: "Claude Code · OpenAI SDK · MCP · Dapr" },
  { tier: "Platinum", code: "H4", year: "2025", achievement: "Multi-stage Docker, K8s manifests, StatefulSets, PVCs, Dapr, Kafka, monitoring", stack: "K8s · Docker · Dapr · Kafka · Helm" },
  { tier: "Gold", code: "H3", year: "2025", achievement: "149 tests passing; recurring todos, team collaboration, AI suggestions; triple-layer Constitutional AI", stack: "Next.js · FastAPI · PostgreSQL" },
  { tier: "Silver", code: "H2", year: "2025", achievement: "89 tests passing; full-stack Constitutional AI; 70% code reuse from H1", stack: "Next.js · TypeScript · FastAPI" },
  { tier: "Silver", code: "H1", year: "2024", achievement: "Zero-backend-LLM architecture; Digital FTE model; 70% reuse from H0", stack: "Next.js · TypeScript · OpenAI" },
  { tier: "Bronze", code: "H0", year: "2024", achievement: "Constitutional AI foundation; spec-first, 4-session methodology", stack: "TypeScript · Constitutional AI" },
];

const education = [
  { degree: "Agentic AI Specialization", institution: "GIAIC / Panaversity", period: "Sep 2022 – Present" },
  { degree: "Alim — Islamic Studies", institution: "Burooj Institute, Karachi", period: "5-year program" },
  { degree: "Associate Degree — Textile Technology", institution: "Textile Institute of Pakistan (APTMA)", period: "1997" },
  { degree: "H.S.C Pre-Engineering", institution: "Pakistan Shipowner's Government College", period: "1994" },
  { degree: "S.S.C Science", institution: "Ladybird Grammar School", period: "1992" },
];

const tierColor: Record<string, string> = {
  "Agent Factory": "bg-[#9CE630]/20 text-[#9CE630] border-[#9CE630]/40",
  Platinum: "bg-zinc-300/10 text-zinc-300 border-zinc-300/40",
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
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            {/* Back link */}
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
                <div className="flex items-center gap-3 mb-2">
                  <Code2 className="w-8 h-8 text-[#9CE630]" />
                  <h1 className="text-4xl font-bold text-white">Asadullah Shafique</h1>
                </div>
                <p className="text-[#9CE630] font-medium text-lg mb-4">
                  Agentic AI Developer · Digital Marketing Strategist · CMT Industry Founder
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#9CE630]" /> Karachi, Pakistan
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[#9CE630]" /> +92 321 3771445
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#9CE630]" /> asadullahshafique@hotmail.com
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-zinc-400">
                  <Link href="https://github.com/asadullah48" target="_blank" className="flex items-center gap-1.5 hover:text-[#9CE630] transition-colors">
                    <Github className="w-4 h-4" /> github.com/asadullah48
                  </Link>
                  <Link href="https://linkedin.com/in/asadullah-shafique-a00679325" target="_blank" className="flex items-center gap-1.5 hover:text-[#9CE630] transition-colors">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </Link>
                  <Link href="https://asadullahshafique-devunity.vercel.app" target="_blank" className="flex items-center gap-1.5 hover:text-[#9CE630] transition-colors">
                    <Globe className="w-4 h-4" /> Portfolio
                  </Link>
                </div>
              </motion.div>

              <motion.div variants={fade} className="flex-shrink-0">
                <a href="/resume.pdf" download="Asadullah_Shafique_Resume.pdf">
                  <Button className="bg-[#9CE630] text-black font-semibold hover:bg-[#8BD520] h-11 px-6">
                    <FileDown className="w-4 h-4 mr-2" />
                    Download PDF
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
            Developer specializing in AI agents with 25+ years of deep textile and garment domain expertise,
            building SaaS solutions for the industry. Founder of Texcot Embroidery Sourcing House and creator
            of Textile ERP Platform targeting Pakistan&apos;s textile value chain. Completed six consecutive
            hackathons with 85% code reusability and zero failed attempts. Currently focused on agentic AI
            architecture and Digital FTE deployment.
          </p>
        </Section>

        {/* Skills */}
        <Section title="Technical Skills" icon={<Code2 className="w-5 h-5" />}>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category}>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">{category}</p>
                <div className="flex flex-wrap gap-2">
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

        {/* Experience */}
        <Section title="Work Experience" icon={<Briefcase className="w-5 h-5" />}>
          <div className="space-y-6">
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
                      <div className="text-right text-sm text-zinc-500 flex-shrink-0">
                        <p>{job.period}</p>
                        <p>{job.location}</p>
                      </div>
                    </div>
                    <ul className="space-y-1.5">
                      {job.bullets.map((b) => (
                        <li key={b} className="text-sm text-zinc-400 flex gap-2">
                          <span className="text-[#9CE630] mt-1 flex-shrink-0">›</span>
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
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{p.name}</h3>
                        <p className="text-[#9CE630] text-sm">{p.role}</p>
                      </div>
                      <span className="text-sm text-zinc-500 flex-shrink-0">{p.period}</span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-3 leading-relaxed">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.stack.map((t) => (
                        <Badge key={t} variant="outline" className="border-[#9CE630]/30 text-[#9CE630] text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Hackathons */}
        <Section title="Hackathon Series" icon={<Trophy className="w-5 h-5" />}>
          <p className="text-sm text-zinc-500 mb-4">6 consecutive Panaversity hackathons · 85% code reuse · Zero failed attempts</p>
          <div className="space-y-3">
            {hackathons.map((h) => (
              <motion.div
                key={h.code}
                variants={fade}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Card className="bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 transition-colors">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex items-center gap-3 sm:w-40 flex-shrink-0">
                      <Badge variant="outline" className={`text-xs ${tierColor[h.tier]}`}>
                        {h.tier}
                      </Badge>
                      <span className="text-zinc-500 text-sm font-mono">{h.code}</span>
                      <span className="text-zinc-600 text-xs">{h.year}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-zinc-300 mb-1">{h.achievement}</p>
                      <p className="text-xs text-zinc-500">{h.stack}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Education */}
        <Section title="Education" icon={<GraduationCap className="w-5 h-5" />}>
          <div className="space-y-3">
            {education.map((e) => (
              <div key={e.degree} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 border-b border-zinc-800/60 last:border-0">
                <div>
                  <p className="font-medium text-white text-sm">{e.degree}</p>
                  <p className="text-zinc-400 text-sm">{e.institution}</p>
                </div>
                <span className="text-zinc-500 text-sm flex-shrink-0">{e.period}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* CTA Footer */}
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
