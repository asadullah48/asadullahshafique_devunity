"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, ChevronDown, ChevronUp, Zap, Star, Clock, ShoppingBag } from "lucide-react";

type ProjectStatus = "Featured" | "In Development" | "Completed" | "Research" | "Flagship";

type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  statusColor: string;
  tagline: string;
  problem?: string;
  solution?: string;
  impact?: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  metrics?: { label: string; value: string }[];
  featured?: boolean;
  isNew?: boolean;
};

const PROJECTS: Project[] = [
  {
    id: "bazaar",
    title: "Bazaar — Multi-Vendor Marketplace",
    status: "Flagship",
    statusColor: "#f59e0b",
    tagline: "One-stop marketplace for buyers, vendors & enterprise",
    problem:
      "Local SMEs in Pakistan and the UAE have no unified digital storefront. Buyers juggle multiple platforms, vendors lack analytics, and enterprise clients need white-label flexibility — all three groups are underserved by existing solutions.",
    solution:
      "Bazaar is a modular, multi-vendor marketplace where users shop across categories without friction and vendors access a full-featured growth platform. Architecture: multi-tenant Next.js 15 storefront, FastAPI microservices, Supabase BaaS for auth/realtime, Stripe + local payment gateways, vendor dashboard with analytics, order lifecycle management, AI-powered product recommendations, and a white-label enterprise tier.",
    impact:
      "Designed for three adoption tiers: local SMEs (quick onboarding, low cost), global e-commerce (Stripe, multi-currency, i18n), and enterprise (white-label, custom domains, dedicated infra). Modular design means each tier is additive — one codebase, infinite scale.",
    description:
      "A one-stop marketplace where users shop across categories without friction, while vendors gain access to a robust platform to grow their businesses. Modular design for local SMEs, global e-commerce, and enterprise-level adoption.",
    tech: ["Next.js 15", "FastAPI", "Supabase", "Stripe", "TypeScript", "PostgreSQL", "Redis", "Kubernetes"],
    github: "https://github.com/asadullah48",
    metrics: [
      { label: "Vendor Tiers",   value: "3"       },
      { label: "Architecture",   value: "Modular" },
      { label: "Target Market",  value: "SME → Enterprise" },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: "textile-erp",
    title: "Textile ERP Platform",
    status: "In Development",
    statusColor: "#84cc16",
    tagline: "Full-scale ERP for Pakistan's textile industry",
    problem:
      "Pakistan's textile industry — CMT stitching units, garment factories, fabric mills — runs on WhatsApp messages, Excel sheets, and paper ledgers. Billing errors, zero production visibility, and manual inventory cost real money every day.",
    solution:
      "Multi-tenant SaaS ERP. Module 1 (Fabric Mill): roll/lot management, weaving & knitting stage tracking, yarn inventory, imported fabric. CMT modules: full order lifecycle, auto-billing across 4 bill types, BOM inventory, production sessions, dispatch, party ledgers, and cash tracking.",
    impact:
      "Targeting Faisalabad, Sialkot, Gujranwala, Karachi, and Lahore — Pakistan's full textile heartland. Multi-tenant SaaS on Kubernetes. Launching 2026.",
    description:
      "Full-scale ERP for Pakistan's textile and garment industry — from Fabric Mills to garment exporters.",
    tech: ["Next.js", "FastAPI", "PostgreSQL", "Kubernetes", "Supabase", "TypeScript"],
    github: "https://github.com/asadullah48",
    metrics: [
      { label: "Target Cities", value: "5+"   },
      { label: "Modules",       value: "6+"   },
      { label: "Launch",        value: "2026" },
    ],
    featured: true,
  },
  {
    id: "devunity",
    title: "DevUnity Platform",
    status: "Featured",
    statusColor: "#a855f7",
    tagline: "Open-source developer community hub",
    problem:
      "Pakistani developers lack a local, context-aware Q&A platform. Most alternatives are too generic and not community-driven.",
    solution:
      "Open-source community platform with threaded Q&A, blogs, project collaboration, and AI-powered answer suggestions. Built with Next.js 15 App Router and shadcn/ui.",
    impact:
      "Live with Code + Demo. Modular codebase with 85% reuse for future community products.",
    description:
      "Open-source developer community platform with Q&A, blogs, and collaboration features.",
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "shadcn/ui", "PostgreSQL"],
    github: "https://github.com/asadullah48",
    demo:   "https://asadullahshafique-devunity.vercel.app",
    metrics: [
      { label: "Stack",   value: "Next.js 15"   },
      { label: "Status",  value: "Live"         },
      { label: "License", value: "Open Source"  },
    ],
    featured: true,
  },
  {
    id: "stitching-packing",
    title: "Stitching & Packing ERP",
    status: "In Development",
    statusColor: "#84cc16",
    tagline: "CMT operations management for garment factories",
    description:
      "Specialised ERP for stitching units and packing departments. Order tracking, machine allocation, QC checkpoints, packaging labels, and export documentation — built for Pakistan's garment exporters.",
    tech: ["Next.js", "Supabase", "TypeScript", "PostgreSQL", "FastAPI"],
    github: "https://github.com/asadullah48",
    metrics: [
      { label: "Sector",  value: "CMT/Garment" },
      { label: "Status",  value: "Module 1"    },
      { label: "Target",  value: "Exporters"   },
    ],
  },
  {
    id: "agent-factory",
    title: "Agent Factory",
    status: "Featured",
    statusColor: "#a855f7",
    tagline: "Two-tier agent architecture at enterprise scale",
    description:
      "General Agent (Claude Code) builds Custom Agent (OpenAI Agents SDK). SKILL.md files as portable, monetizable intelligence units. Digital FTE model deployed on Kubernetes + Dapr. Targets OpenAI Apps ecosystem (800M users).",
    tech: ["Claude Code", "OpenAI Agents SDK", "SKILL.md", "MCP", "Kubernetes", "Dapr"],
    github: "https://github.com/asadullah48",
    metrics: [
      { label: "Hackathon", value: "H5 Completed" },
      { label: "Slides",    value: "117"           },
      { label: "Market",    value: "800M users"    },
    ],
  },
  {
    id: "rag-textbook",
    title: "RAG Textbook Platform",
    status: "Completed",
    statusColor: "#3b82f6",
    tagline: "AI-powered textbook chatbot with RAG architecture",
    description:
      "Comprehensive textbook platform with RAG chatbot built during Panaversity Hackathon (H1) using specification-first development and Spec-Kit Plus methodology.",
    tech: ["Python", "FastAPI", "RAG", "SpecifyKit", "OpenAI API", "PostgreSQL"],
    github: "https://github.com/asadullah48",
    metrics: [
      { label: "Hackathon",    value: "H1 Silver"       },
      { label: "Architecture", value: "RAG + FastAPI"   },
      { label: "Reuse",        value: "70%"             },
    ],
  },
];

const STATUS_ICONS: Record<ProjectStatus, React.ReactNode> = {
  Flagship:         <ShoppingBag className="w-3 h-3" />,
  Featured:         <Star className="w-3 h-3" />,
  "In Development": <Clock className="w-3 h-3" />,
  Completed:        <Zap className="w-3 h-3" />,
  Research:         <Zap className="w-3 h-3" />,
};

function StatusBadge({ status, color }: { status: ProjectStatus; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
    >
      {STATUS_ICONS[status]}
      {status}
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const hasCaseStudy = !!(project.problem && project.solution && project.impact);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      className={`group relative bg-[#111111] border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${
        project.status === "Flagship"
          ? "border-amber-500/30 hover:border-amber-500/60 md:col-span-2 lg:col-span-1"
          : "border-white/8 hover:border-green-500/30"
      }`}
    >
      <div
        className="h-0.5 w-full flex-shrink-0"
        style={{
          background: `linear-gradient(to right, transparent, ${project.statusColor}80, transparent)`,
        }}
      />

      {project.isNew && (
        <div className="absolute top-4 right-4 z-10">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
            NEW
          </span>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <StatusBadge status={project.status} color={project.statusColor} />
        <h3 className="text-xl font-bold text-white mt-3 mb-1.5 group-hover:text-green-400 transition-colors duration-200 pr-12">
          {project.title}
        </h3>
        <p
          className="text-sm font-medium mb-4"
          style={{ color: project.statusColor + "cc" }}
        >
          {project.tagline}
        </p>

        <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">
          {project.description}
        </p>

        {project.metrics && (
          <div className="flex gap-6 mb-5 flex-wrap">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <div
                  className="font-bold text-sm"
                  style={{ color: project.statusColor }}
                >
                  {m.value}
                </div>
                <div className="text-gray-600 text-xs mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-400 text-xs rounded-md font-mono hover:border-white/20 transition-colors"
            >
              {t}
            </span>
          ))}
        </div>

        {hasCaseStudy && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-xs font-medium transition-colors duration-200 mb-4 w-fit"
            style={{ color: expanded ? project.statusColor : project.statusColor + "99" }}
          >
            {expanded ? (
              <><ChevronUp className="w-3.5 h-3.5" /> Hide Case Study</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> View Case Study</>
            )}
          </button>
        )}

        <AnimatePresence>
          {expanded && hasCaseStudy && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border border-white/8 rounded-xl p-5 mb-5 space-y-4 bg-[#0d0d0d]">
                {[
                  { label: "Problem",  dot: "bg-red-400",   textColor: "#f87171", body: project.problem  },
                  { label: "Solution", dot: "bg-blue-400",  textColor: "#60a5fa", body: project.solution },
                  { label: "Impact",   dot: "bg-green-400", textColor: "#84cc16", body: project.impact   },
                ].map((row) => (
                  <div key={row.label}>
                    <div
                      className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2"
                      style={{ color: row.textColor }}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${row.dot} inline-block`} />
                      {row.label}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{row.body}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 mt-auto">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm border border-white/10 hover:border-white/30 px-4 py-2 rounded-lg transition-all duration-200"
            >
              <Github className="w-4 h-4" /> Code
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-green-400 text-sm border border-white/10 hover:border-green-500/40 px-4 py-2 rounded-lg transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" /> Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Featured <span className="text-green-400">Projects</span>
          </h2>
          <div className="w-16 h-0.5 bg-green-400 mx-auto mb-5" />
          <p className="text-gray-400 max-w-xl mx-auto">
            Production-grade systems — not prototypes. Click{" "}
            <span className="text-green-400">View Case Study</span> on any card for the
            full problem → solution → impact breakdown.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/asadullah48"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-green-500/40 text-green-400 hover:bg-green-500/10 px-6 py-3 rounded-lg transition-all duration-200"
          >
            <Github className="w-4 h-4" />
            View All 467+ Repositories on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default ProjectsSection;
