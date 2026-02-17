"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const skillCategories = [
  {
        name: "Languages",
        skills: [
          { name: "TypeScript", level: 90 },
          { name: "JavaScript", level: 85 },
          { name: "Python", level: 80 },
          { name: "HTML/CSS", level: 90 },
              ],
  },
  {
        name: "Frameworks",
        skills: [
          { name: "Next.js", level: 88 },
          { name: "React", level: 85 },
          { name: "FastAPI", level: 75 },
          { name: "Tailwind CSS", level: 92 },
              ],
  },
  {
        name: "AI & Tools",
        skills: [
          { name: "Generative AI", level: 82 },
          { name: "SpecifyKit SDK", level: 78 },
          { name: "Docker", level: 70 },
          { name: "Claude Pro / LLMs", level: 85 },
              ],
  },
  {
        name: "Platforms",
        skills: [
          { name: "Git / GitHub", level: 88 },
          { name: "Vercel", level: 85 },
          { name: "Windows / WSL", level: 82 },
          { name: "AWS (Learning)", level: 55 },
              ],
  },
  ];

const Skills = () => {
    const [activeCategory, setActiveCategory] = useState(0);

    return (
          <section id="skills" className="py-24 relative">
                <div className="container mx-auto px-4">
                        <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="text-center mb-16"
                                  >
                                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                              Tech <span className="text-[#9CE630]">Stack</span>span>
                                  </h2>h2>
                                  <div className="w-20 h-1 bg-[#9CE630] mx-auto rounded-full mb-6" />
                                  <p className="text-zinc-400 max-w-xl mx-auto">
                                              Technologies and tools I work with to build production-ready applications.
                                  </p>p>
                        </motion.div>motion.div>
                
                  {/* Category Tabs */}
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                          {skillCategories.map((cat, index) => (
                        <button
                                        key={cat.name}
                                        onClick={() => setActiveCategory(index)}
                                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                                          activeCategory === index
                                                            ? "bg-[#9CE630] text-black"
                                                            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                        }`}
                                      >
                          {cat.name}
                        </button>button>
                      ))}
                        </div>div>
                
                  {/* Skills Display */}
                        <motion.div
                                    key={activeCategory}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="max-w-2xl mx-auto space-y-6"
                                  >
                          {skillCategories[activeCategory].skills.map((skill, index) => (
                                                <motion.div
                                                                key={skill.name}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: index * 0.1 }}
                                                                className="space-y-2"
                                                              >
                                                              <div className="flex justify-between items-center">
                                                                              <span className="text-white font-medium">{skill.name}</span>span>
                                                                              <span className="text-[#9CE630] text-sm font-mono">{skill.level}%</span>span>
                                                              </div>div>
                                                              <Progress
                                                                                value={skill.level}
                                                                                className="h-2 bg-zinc-800"
                                                                              />
                                                </motion.div>motion.div>
                                              ))}
                        </motion.div>motion.div>
                
                  {/* Tech Badges */}
                        <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    viewport={{ once: true }}
                                    className="mt-16 text-center"
                                  >
                                  <h3 className="text-lg font-semibold text-zinc-400 mb-6">Also working with</h3>h3>
                                  <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                                    {[
                                                  "OpenAI API", "Gemini API", "Radix UI", "shadcn/ui",
                                                  "Framer Motion", "MCP Servers", "Ubuntu WSL", "PostgreSQL",
                                                  "REST APIs", "RAG Systems", "Prompt Engineering", "Lucide Icons",
                                                ].map((tech) => (
                                                                <span
                                                                                  key={tech}
                                                                                  className="px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full hover:border-[#9CE630]/30 hover:text-[#9CE630] transition-all duration-300 cursor-default"
                                                                                >
                                                                  {tech}
                                                                </span>span>
                                                              ))}
                                  </div>div>
                        </motion.div>motion.div>
                </div>div>
          </section>section>
        );
};

export default Skills;</section>
