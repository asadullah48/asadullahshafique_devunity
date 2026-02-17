"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code2, Brain, Rocket, Terminal, GraduationCap, Zap } from "lucide-react";

const highlights = [
  {
        icon: Brain,
        title: "Agentic AI",
        description: "Building autonomous AI agents using SpecifyKit SDK and modern LLM frameworks.",
  },
  {
        icon: Code2,
        title: "Full-Stack Dev",
        description: "Next.js, React, TypeScript, FastAPI - end-to-end application development.",
  },
  {
        icon: Rocket,
        title: "Hackathon Builder",
        description: "Completed Panaversity's Physical AI & Humanoid Robotics Hackathon with distinction.",
  },
  {
        icon: Terminal,
        title: "Spec-First Development",
        description: "Advocate for specification-first methodology using Spec-Kit Plus approach.",
  },
  {
        icon: GraduationCap,
        title: "Continuous Learner",
        description: "Pursuing Agentic AI development, exploring MCP servers and innovative AI paradigms.",
  },
  {
        icon: Zap,
        title: "Open Source",
        description: "Active contributor to AI development community and open source projects.",
  },
  ];

const About = () => {
    return (
          <section id="about" className="py-24 relative">
                <div className="container mx-auto px-4">
                        <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="text-center mb-16"
                                  >
                                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                              About <span className="text-[#9CE630]">Me</span>span>
                                  </h2>h2>
                                  <div className="w-20 h-1 bg-[#9CE630] mx-auto rounded-full mb-6" />
                                  <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                                              A student pursuing Agentic AI development, passionate about building
                                              intelligent systems that push the boundaries of what&apos;s possible.
                                  </p>p>
                        </motion.div>motion.div>
                
                  {/* Bio Card */}
                        <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="max-w-3xl mx-auto mb-16 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm"
                                  >
                                  <pre className="text-sm text-zinc-300 font-mono overflow-x-auto">
                                              <code>{`{
                                                "name": "Asadullah Shafique",
                                                  "github": "@asadullah48",
                                                    "role": "Agentic AI Developer",
                                                      "education": "Pursuing AI Development",
                                                        "focus": [
                                                            "Generative AI",
                                                                "Agentic AI",
                                                                    "Full-Stack Development"
                                                                      ],
                                                                        "tools": [
                                                                            "Next.js", "TypeScript", "Python",
                                                                                "FastAPI", "Docker", "Claude Pro"
                                                                                  ],
                                                                                    "methodology": "Spec-Kit Plus (Spec-First)",
                                                                                      "status": "Open to collaborate"
                                                                                      }`}</code>code>
                                  </pre>pre>
                        </motion.div>motion.div>
                
                  {/* Highlights Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                          {highlights.map((item, index) => (
                        <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="group p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-[#9CE630]/30 transition-all duration-300 hover:bg-zinc-900/80"
                                      >
                                      <item.icon className="w-10 h-10 text-[#9CE630] mb-4 group-hover:scale-110 transition-transform" />
                                      <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>h3>
                                      <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>p>
                        </motion.div>motion.div>
                      ))}
                        </div>div>
                </div>div>
          </section>section>
        );
};

export default About;</section>
