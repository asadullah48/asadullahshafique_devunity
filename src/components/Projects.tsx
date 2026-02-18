"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Star, GitFork } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const projects = [
  {
        title: "DevUnity Platform",
        description:
                "Open-source developer community platform with Q&A, blogs, and collaboration features. Built with Next.js 15, TypeScript, and shadcn/ui.",
        tags: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
        github: "https://github.com/asadullah48/asadullahshafique_devunity",
        demo: "https://asadullahshafique-devunity.vercel.app",
        featured: true,
  },
  {
        title: "RAG Textbook Platform",
        description:
                "Comprehensive textbook platform with RAG chatbot built during Panaversity Hackathon using specification-first development (Spec-Kit Plus).",
        tags: ["Python", "FastAPI", "RAG", "SpecifyKit"],
        github: "https://github.com/asadullah48",
        featured: true,
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
  },
  ];

const Projects = () => {
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
                                              Featured <span className="text-[#9CE630]">Projects</span>span>
                                  </h2>h2>
                                  <div className="w-20 h-1 bg-[#9CE630] mx-auto rounded-full mb-6" />
                                  <p className="text-zinc-400 max-w-xl mx-auto">
                                              A collection of projects showcasing my work in AI, full-stack development, and innovation.
                                  </p>p>
                        </motion.div>motion.div>
                
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
                                                                                              <Star className="w-3 h-3 mr-1" />
                                                                                              Featured
                                                                          </Badge>Badge>
                                                        </div>div>
                                      )}
                        
                                      <h3 className="text-xl font-semibold text-white mb-3 mt-1">
                                        {project.title}
                                      </h3>h3>
                                      <p className="text-zinc-400 text-sm leading-relaxed mb-4 flex-grow">
                                        {project.description}
                                      </p>p>
                        
                                      <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tags.map((tag) => (
                                                          <span
                                                                                key={tag}
                                                                                className="px-2 py-1 text-xs bg-zinc-800 text-zinc-400 rounded-md"
                                                                              >
                                                            {tag}
                                                          </span>span>
                                                        ))}
                                      </div>div>
                        
                                      <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                                                      <Link href={project.github} target="_blank" rel="noopener noreferrer">
                                                                        <Button
                                                                                              variant="ghost"
                                                                                              size="sm"
                                                                                              className="text-zinc-400 hover:text-[#9CE630] h-8 px-3"
                                                                                            >
                                                                                            <Github className="w-4 h-4 mr-1" />
                                                                                            Code
                                                                        </Button>Button>
                                                      </Link>Link>
                                        {project.demo && (
                                                          <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                                                                              <Button
                                                                                                      variant="ghost"
                                                                                                      size="sm"
                                                                                                      className="text-zinc-400 hover:text-[#9CE630] h-8 px-3"
                                                                                                    >
                                                                                                    <ExternalLink className="w-4 h-4 mr-1" />
                                                                                                    Demo
                                                                              </Button>Button>
                                                          </Link>Link>
                                                      )}
                                      </div>div>
                        </motion.div>motion.div>
                      ))}
                        </div>div>
                
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
                                              </Button>Button>
                                  </Link>Link>
                        </motion.div>motion.div>
                </div>div>
          </section>section>
        );
};

export default Projects;</section>
