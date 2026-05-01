"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const skillCategories = [
    {
        name: "Languages",
        skills: ["TypeScript", "JavaScript", "Python", "HTML/CSS"],
    },
    {
        name: "Frameworks",
        skills: ["Next.js", "React", "FastAPI", "Tailwind CSS"],
    },
    {
        name: "Agent Foundation",
        skills: ["Claude Code (General Agent)", "OpenAI SDK (Custom Agent)", "MCP Server Integration", "Constitutional AI"],
    },
    {
        name: "AI & Tools",
        skills: ["Generative AI", "SpecifyKit SDK", "Docker", "Claude Pro / LLMs"],
    },
    {
        name: "Platforms",
        skills: ["Git / GitHub", "Vercel", "Ubuntu WSL", "AWS (Learning)"],
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
                        Tech <span className="text-[#9CE630]">Stack</span>
                    </h2>
                    <div className="w-20 h-1 bg-[#9CE630] mx-auto rounded-full mb-6" />
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Technologies and tools I work with to build production-ready applications.
                    </p>
                </motion.div>

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
                        </button>
                    ))}
                </div>

                {/* Skills Badge Grid */}
                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto"
                >
                    {skillCategories[activeCategory].skills.map((skill, index) => (
                        <motion.div
                            key={skill}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-medium text-sm hover:border-[#9CE630]/50 hover:text-[#9CE630] hover:bg-zinc-900/80 transition-all duration-200 cursor-default"
                        >
                            {skill}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Tech Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <h3 className="text-lg font-semibold text-zinc-400 mb-6">Also working with</h3>
                    <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                        {[
                            "OpenAI API", "Gemini API", "Radix UI", "shadcn/ui",
                            "Framer Motion", "MCP Servers", "Ubuntu WSL", "PostgreSQL",
                            "REST APIs", "RAG Systems", "Prompt Engineering", "Lucide Icons",
                            "OpenClaw", "SKILL.md", "Kubernetes", "Dapr", "Kafka", "Helm", "GitHub Actions",
                        ].map((tech) => (
                            <span
                                key={tech}
                                className="px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full hover:border-[#9CE630]/30 hover:text-[#9CE630] transition-all duration-300 cursor-default"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;
