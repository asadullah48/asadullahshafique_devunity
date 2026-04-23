"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, MapPin, Award } from "lucide-react";

const tierStyles: Record<string, string> = {
  "Agent Factory": "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  "Platinum":      "bg-sky-500/20    text-sky-400    border border-sky-500/30",
  "Gold":          "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  "Silver":        "bg-zinc-400/20   text-zinc-300   border border-zinc-400/30",
  "Bronze":        "bg-orange-500/20 text-orange-400 border border-orange-500/30",
};

const hackathons = [
  {
    tier: "Agent Factory",
    title: "H5 — Agent Factory",
    organizer: "Panaversity Hackathon Series",
    date: "2025",
    location: "Online",
    achievement: "Completed",
    description: "Two-tier architecture: General Agent (Claude Code) builds Custom Agent (OpenAI Agents SDK). SKILL.md files as portable, monetizable intelligence units. Digital FTE model priced and deployed on Kubernetes + Dapr. Distribution targets OpenAI Apps ecosystem (800M users). 117-slide presentation mastered.",
    technologies: ["Claude Code", "OpenAI Agents SDK", "SKILL.md", "MCP", "Kubernetes", "Dapr"],
    highlight: true,
  },
  {
    tier: "Platinum",
    title: "H4 — Cloud-Native Deployment",
    organizer: "Panaversity Hackathon Series",
    date: "2025",
    location: "Online",
    achievement: "Platinum (in progress)",
    description: "Containerized H3 with multi-stage Docker builds. Kubernetes manifests: namespace, ConfigMap, Secrets, Deployments, StatefulSets, PVCs. Dapr service mesh, Kafka event-driven pub/sub, Prometheus + Grafana + Jaeger observability stack, Helm charts, GitHub Actions CI/CD.",
    technologies: ["Kubernetes", "Docker", "Dapr", "Kafka", "Prometheus", "Grafana", "Helm"],
    highlight: true,
  },
  {
    tier: "Gold",
    title: "H3 — Advanced Todo",
    organizer: "Panaversity Hackathon Series",
    date: "2025",
    location: "Online",
    achievement: "Gold",
    description: "149 tests passing. Recurring todos, templates, team collaboration, AI suggestions, calendar integration. Triple-layer Constitutional AI: 7 BLOCK patterns (academic dishonesty, illegal activity, harmful content), 5 FLAG patterns. 85% code reuse from H2.",
    technologies: ["Next.js", "FastAPI", "PostgreSQL", "Constitutional AI", "TypeScript"],
    highlight: true,
  },
  {
    tier: "Silver",
    title: "H2 — AI-Powered Todo",
    organizer: "Panaversity Hackathon Series",
    date: "2025",
    location: "Online",
    achievement: "Silver",
    description: "89 tests passing. Full-stack AI-powered todo with Constitutional AI integration. 70% code reuse from H1. Spec-first four-session methodology.",
    technologies: ["Next.js", "TypeScript", "FastAPI", "Constitutional AI"],
    highlight: false,
  },
  {
    tier: "Silver",
    title: "H1 — Course Companion FTE",
    organizer: "Panaversity Hackathon Series",
    date: "2024",
    location: "Online",
    achievement: "Silver",
    description: "Zero-Backend-LLM architecture. Course companion built as a Digital Full-Time Employee (FTE) model. 70% code reuse from H0.",
    technologies: ["Next.js", "TypeScript", "OpenAI API", "Zero-Backend Architecture"],
    highlight: false,
  },
  {
    tier: "Bronze",
    title: "H0 — Personal AI CTO",
    organizer: "Panaversity Hackathon Series",
    date: "2024",
    location: "Online",
    achievement: "Bronze",
    description: "Constitutional AI foundation. Established the spec-first methodology and constitutional constraint patterns that persist across all 6 subsequent hackathons.",
    technologies: ["TypeScript", "Constitutional AI", "LLMs"],
    highlight: false,
  },
];

const Hackathons = () => {
    return (
          <section id="hackathons" className="py-24 relative">
                <div className="container mx-auto px-4">
                        <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="text-center mb-16"
                                  >
                                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                              Hackathons & <span className="text-[#9CE630]">Achievements</span>
                                  </h2>
                                  <div className="w-20 h-1 bg-[#9CE630] mx-auto rounded-full mb-6" />
                                  <p className="text-zinc-400 max-w-xl mx-auto">
                                              6 consecutive Panaversity hackathons — Bronze through Agent Factory. Zero failures, 85% code reuse.
                                  </p>
                        </motion.div>

                  {/* Timeline */}
                        <div className="max-w-3xl mx-auto relative">
                          {/* Timeline line */}
                                  <div className="absolute left-8 top-0 bottom-0 w-px bg-zinc-800 hidden md:block" />

                                  <div className="space-y-8">
                                    {hackathons.map((hackathon, index) => (
                          <motion.div
                                            key={hackathon.title}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            viewport={{ once: true }}
                                            className="relative"
                                          >
                            {/* Timeline dot */}
                                          <div className="absolute left-6 top-6 w-5 h-5 rounded-full border-2 border-[#9CE630] bg-zinc-950 hidden md:block z-10" />

                                          <div
                                                              className={`md:ml-20 p-6 rounded-xl border transition-all duration-300 ${
                                                                                    hackathon.highlight
                                                                                      ? "bg-zinc-900/70 border-[#9CE630]/30 hover:border-[#9CE630]/60"
                                                                                      : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                                                              }`}
                                                            >
                                                            <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                                                                                <div>
                                                                                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                                                    {hackathon.highlight && (
                                                                                      <Trophy className="w-5 h-5 text-[#9CE630]" />
                                                                                    )}
                                                                                    {hackathon.title}
                                                                                  </h3>
                                                                                  <p className="text-sm text-zinc-500 mt-1">{hackathon.organizer}</p>
                                                                                </div>
                                                                                <div className="flex flex-wrap gap-2">
                                                                                  {/* Tier pill — always shown */}
                                                                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${tierStyles[hackathon.tier] ?? ""}`}>
                                                                                    {hackathon.tier}
                                                                                  </span>
                                                                                  {/* Achievement badge — highlighted only */}
                                                                                  {hackathon.highlight && (
                                                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#9CE630]/10 text-[#9CE630] text-xs font-medium">
                                                                                      <Award className="w-3 h-3" />
                                                                                      {hackathon.achievement}
                                                                                    </span>
                                                                                  )}
                                                                                </div>
                                                            </div>

                                                            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                                              {hackathon.description}
                                                            </p>

                                                            <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                                                                                <span className="flex items-center gap-1">
                                                                                  <Calendar className="w-3 h-3" />
                                                                                  {hackathon.date}
                                                                                </span>
                                                                                <span className="flex items-center gap-1">
                                                                                  <MapPin className="w-3 h-3" />
                                                                                  {hackathon.location}
                                                                                </span>
                                                            </div>

                                                            <div className="flex flex-wrap gap-2">
                                                              {hackathon.technologies.map((tech) => (
                                                                <span
                                                                  key={tech}
                                                                  className="px-2 py-1 text-xs bg-zinc-800 text-zinc-400 rounded-md"
                                                                >
                                                                  {tech}
                                                                </span>
                                                              ))}
                                                            </div>
                                          </div>
                          </motion.div>
                        ))}
                                  </div>
                        </div>
                </div>
          </section>
        );
};

export default Hackathons;
