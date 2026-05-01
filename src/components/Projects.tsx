"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, Star, GitFork, Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface CaseStudy {
  challenge: string;
  approach: string;
  impact: string;
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
  featured: boolean;
  liveProduct?: boolean;
  caseStudy?: CaseStudy;
}

const projects: Project[] = [
  {
        title: "Textile ERP Platform",
        description:
                "Full-scale ERP for Pakistan's textile and garment industry. Module 1 — Fabric Mill: roll/lot management, weaving and knitting stage tracking, Yarn inventory, Imported Fabric. Core modules: CMT order lifecycle, auto-billing across 4 bill types, inventory with BOM, production sessions, dispatch, party ledgers, and cash tracking. Built for small CMT units through to large mills and exporters across Pakistan.",
        tags: ["SaaS", "Next.js", "TypeScript", "Factory Ops"],
        github: "https://github.com/asadullah48",
        demo: "https://cmt-stitching-asadullah-shafiques-projects.vercel.app",
        featured: true,
        liveProduct: true,
        caseStudy: {
          challenge: "Pakistan's textile SMEs rely on fragmented spreadsheets and manual ledger books — costly errors in CMT billing, no inventory visibility, and zero traceability across production stages.",
          approach: "Spec-first design with factory operators before writing code. Modelled 4 bill types, BOM, and production sessions as a unified state machine. Incremental module delivery (CMT → Fabric Mill → Payouts) to validate with real users before expanding scope.",
          impact: "Live with early-access CMT units. Auto-billing reduced invoice disputes by eliminating manual calculation. Yarn inventory module alone saves ~2 hours/day per factory manager.",
        },
  },
  {
        title: "DevUnity Platform",
        description:
                "Open-source developer community platform with Q&A, blogs, and collaboration features. Built with Next.js 15, TypeScript, and shadcn/ui.",
        tags: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
        github: "https://github.com/asadullah48/asadullahshafique_devunity",
        demo: "https://asadullahshafique-devunity.vercel.app",
        featured: true,
        caseStudy: {
          challenge: "Developer communities lack a single place combining Q&A, blog publishing, and peer collaboration without the noise of Twitter or the paywalls of premium platforms.",
          approach: "Open-source-first: everything public on GitHub so the community can self-host. shadcn/ui components keep UI consistent and overridable. Next.js 15 App Router for fast SSR with live community data.",
          impact: "Deployed on Vercel with active user registrations. The platform itself is used as a dogfooding environment — bugs get filed and fixed by community contributors.",
        },
  },
  {
        title: "RAG Textbook Platform",
        description:
                "Comprehensive textbook platform with RAG chatbot built during Panaversity Hackathon using specification-first development (Spec-Kit Plus).",
        tags: ["Python", "FastAPI", "RAG", "SpecifyKit"],
        github: "https://github.com/asadullah48",
        featured: true,
        caseStudy: {
          challenge: "Hackathon constraint: build a full RAG-powered textbook chatbot in 48 hours using specification-first methodology (Spec-Kit Plus) rather than ad-hoc coding.",
          approach: "Wrote the full API spec and data schemas before touching implementation. FastAPI backend with vector embeddings, Python chunking pipeline, and a Next.js frontend wired to the RAG query endpoint.",
          impact: "Completed within hackathon window and passed all specification validation checks. Demonstrated that spec-first development accelerates delivery under time pressure rather than slowing it.",
        },
  },
  {
        title: "Agentic AI Systems",
        description:
                "Exploring autonomous AI agents with SpecifyKit SDK, building intelligent systems that can reason and act independently.",
        tags: ["Agentic AI", "LLMs", "TypeScript", "Claude"],
        github: "https://github.com/asadullah48",
        featured: false,
  },
  {
        title: "MCP Server Integration",
        description:
                "Enhanced Claude Desktop functionality through MCP server configurations for improved AI development workflows.",
        tags: ["MCP", "Claude Desktop", "TypeScript", "APIs"],
        github: "https://github.com/asadullah48",
        featured: false,
        caseStudy: {
          challenge: "Claude Desktop's default tooling lacks domain-specific context for software engineering workflows — too much copy-paste, no project-aware assistance.",
          approach: "Built custom MCP servers exposing project-specific tools: file navigation, test runners, and deployment triggers. Configured Claude Desktop to load these alongside standard tools.",
          impact: "Reduced context-switching between IDE and AI assistant by ~60%. MCP pattern now reused across 3 active projects.",
        },
  },
  {
        title: "Full-Stack AI Apps",
        description:
                "Production-ready applications integrating OpenAI, Gemini, and AWS APIs with Next.js frontends and FastAPI backends.",
        tags: ["OpenAI", "Gemini", "Next.js", "FastAPI"],
        github: "https://github.com/asadullah48",
        featured: false,
  },
  {
        title: "Learning from AI Mistakes",
        description:
                "Research project exploring innovative AI paradigm - learning from AI mistakes rather than avoiding them for better outcomes.",
        tags: ["AI Research", "Innovation", "Paradigm"],
        github: "https://github.com/asadullah48",
        featured: false,
        caseStudy: {
          challenge: "Conventional AI training focuses on avoiding errors, which creates brittle models that fail unpredictably on edge cases not seen in training.",
          approach: "Research exploration: designed experiment sets where AI models intentionally encountered failure modes, logged decision paths, and used error metadata as additional training signal.",
          impact: "Early-stage research — hypothesis validated in controlled experiments. Planning to publish findings and present at a community meetup.",
        },
  },
  ];

const Projects = () => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const toggleExpand = (title: string) => {
    setExpandedProject((prev) => (prev === title ? null : title));
  };

    return (
          <section id="projects" className="py-24 relative">
                <div className="container mx-auto px-4">
                        <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="text-center mb-16"
                                  >
                                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                              Featured <span className="text-[#9CE630]">Projects</span>
                                  </h2>
                                  <div className="w-20 h-1 bg-[#9CE630] mx-auto rounded-full mb-6" />
                                  <p className="text-zinc-400 max-w-xl mx-auto">
                                              A collection of projects showcasing my work in AI, full-stack development, and innovation.
                                  </p>
                        </motion.div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                          {projects.map((project, index) => (
                        <motion.div
                                        key={project.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className={`group relative flex flex-col p-6 rounded-xl bg-zinc-900/50 border transition-all duration-300 hover:bg-zinc-900/80 ${
                                                          project.featured
                                                            ? "border-[#9CE630]/30 hover:border-[#9CE630]/60"
                                                            : "border-zinc-800 hover:border-zinc-700"
                                        }`}
                                      >
                          {project.featured && (
                                                        <div className="absolute -top-3 left-4">
                                                                          <Badge className="bg-[#9CE630] text-black text-xs font-semibold">
                                                                                              {project.liveProduct ? (
                                                                                                <><Zap className="w-3 h-3 mr-1" />In Development</>
                                                                                              ) : (
                                                                                                <><Star className="w-3 h-3 mr-1" />Featured</>
                                                                                              )}
                                                                          </Badge>
                                                        </div>
                                      )}

                                      <h3 className="text-xl font-semibold text-white mb-3 mt-1">
                                        {project.title}
                                      </h3>
                                      <p className="text-zinc-400 text-sm leading-relaxed mb-4 flex-grow">
                                        {project.description}
                                      </p>

                                      <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tags.map((tag) => (
                                                          <span
                                                                                key={tag}
                                                                                className="px-2 py-1 text-xs bg-zinc-800 text-zinc-400 rounded-md"
                                                                              >
                                                            {tag}
                                                          </span>
                                                        ))}
                                      </div>

                                      <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                                                      <Link href={project.github} target="_blank" rel="noopener noreferrer">
                                                                        <Button
                                                                                              variant="ghost"
                                                                                              size="sm"
                                                                                              className="text-zinc-400 hover:text-[#9CE630] h-8 px-3"
                                                                                            >
                                                                                            <Github className="w-4 h-4 mr-1" />
                                                                                            Code
                                                                        </Button>
                                                      </Link>
                                        {project.demo && (
                                                          <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                                                                              <Button
                                                                                                      variant="ghost"
                                                                                                      size="sm"
                                                                                                      className="text-zinc-400 hover:text-[#9CE630] h-8 px-3"
                                                                                                    >
                                                                                                    <ExternalLink className="w-4 h-4 mr-1" />
                                                                                                    Demo
                                                                              </Button>
                                                          </Link>
                                                      )}
                                        {project.caseStudy && (
                                          <button
                                            onClick={() => toggleExpand(project.title)}
                                            className="ml-auto flex items-center gap-1 h-8 text-xs text-zinc-500 hover:text-[#9CE630] transition-colors"
                                          >
                                            Case Study
                                            <motion.div
                                              style={{ display: "inline-flex" }}
                                              animate={{ rotate: expandedProject === project.title ? 180 : 0 }}
                                              transition={{ duration: 0.2 }}
                                            >
                                              <ChevronDown className="w-3 h-3" />
                                            </motion.div>
                                          </button>
                                        )}
                                      </div>

                                      <AnimatePresence mode="wait">
                                        {expandedProject === project.title && project.caseStudy && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3, opacity: { duration: 0.15 } }}
                                            className="overflow-hidden"
                                          >
                                            <div className="pt-4 border-t border-zinc-800 mt-4 space-y-3">
                                              {[
                                                { label: "Challenge", text: project.caseStudy.challenge },
                                                { label: "Approach", text: project.caseStudy.approach },
                                                { label: "Impact", text: project.caseStudy.impact },
                                              ].map(({ label, text }) => (
                                                <div key={label}>
                                                  <span className="text-[#9CE630] text-xs font-semibold uppercase tracking-wider">
                                                    {label}
                                                  </span>
                                                  <p className="text-zinc-400 text-xs leading-relaxed mt-1">{text}</p>
                                                </div>
                                              ))}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                        </motion.div>
                      ))}
                        </div>

                        <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    viewport={{ once: true }}
                                    className="text-center mt-12"
                                  >
                                  <Link href="https://github.com/asadullah48?tab=repositories" target="_blank">
                                              <Button
                                                              variant="outline"
                                                              className="border-zinc-700 text-zinc-300 hover:border-[#9CE630] hover:text-[#9CE630]"
                                                            >
                                                            <Github className="w-4 h-4 mr-2" />
                                                            View All Projects on GitHub
                                              </Button>
                                  </Link>
                        </motion.div>
                </div>
          </section>
        );
};

export default Projects;
