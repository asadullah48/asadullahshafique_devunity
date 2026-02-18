"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, MapPin, Award } from "lucide-react";

const hackathons = [
  {
        title: "Physical AI & Humanoid Robotics Hackathon",
        organizer: "Panaversity",
        date: "2025",
        location: "Physical / On-site",
        achievement: "Completed with Distinction",
        description:
                "Built a comprehensive textbook platform with RAG chatbot using specification-first development (Spec-Kit Plus methodology). Demonstrated proficiency in full-stack AI application development.",
        technologies: ["Python", "FastAPI", "RAG", "SpecifyKit SDK", "LLMs"],
        highlight: true,
  },
  {
        title: "AI Development Sprint",
        organizer: "Panaversity Community",
        date: "2024-2025",
        location: "Online",
        achievement: "Active Participant",
        description:
                "Ongoing participation in AI development sprints, building agentic systems and exploring MCP server integrations for enhanced AI workflows.",
        technologies: ["TypeScript", "Next.js", "Claude", "MCP Servers"],
        highlight: false,
  },
  {
        title: "Full-Stack AI Applications",
        organizer: "Self-driven Projects",
        date: "2024-Present",
        location: "Remote",
        achievement: "Multiple Apps Deployed",
        description:
                "Continuous hackathon-style building of production-ready AI applications integrating multiple LLM APIs with modern web frameworks.",
        technologies: ["Next.js", "FastAPI", "OpenAI", "Gemini", "Docker"],
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
                                              Hackathons & <span className="text-[#9CE630]">Achievements</span>span>
                                  </h2>h2>
                                  <div className="w-20 h-1 bg-[#9CE630] mx-auto rounded-full mb-6" />
                                  <p className="text-zinc-400 max-w-xl mx-auto">
                                              Actively participating in hackathons and building under pressure to sharpen my skills.
                                  </p>p>
                        </motion.div>motion.div>
                
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
                                            transition={{ duration: 0.5, delay: index * 0.15 }}
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
                                                                                                        </h3>h3>
                                                                                                      <p className="text-sm text-zinc-500 mt-1">{hackathon.organizer}</p>p>
                                                                                  </div>div>
                                                              {hackathon.highlight && (
                                                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#9CE630]/10 text-[#9CE630] text-xs font-medium">
                                                                                                            <Award className="w-3 h-3" />
                                                                                      {hackathon.achievement}
                                                                                      </span>span>
                                                                                )}
                                                            </div>div>
                                          
                                                            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                                              {hackathon.description}
                                                            </p>p>
                                          
                                                            <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                                                                                <span className="flex items-center gap-1">
                                                                                                      <Calendar className="w-3 h-3" />
                                                                                  {hackathon.date}
                                                                                  </span>span>
                                                                                <span className="flex items-center gap-1">
                                                                                                      <MapPin className="w-3 h-3" />
                                                                                  {hackathon.location}
                                                                                  </span>span>
                                                            </div>div>
                                          
                                                            <div className="flex flex-wrap gap-2">
                                                              {hackathon.technologies.map((tech) => (
                                                                                    <span
                                                                                                              key={tech}
                                                                                                              className="px-2 py-1 text-xs bg-zinc-800 text-zinc-400 rounded-md"
                                                                                                            >
                                                                                      {tech}
                                                                                      </span>span>
                                                                                  ))}
                                                            </div>div>
                                          </div>div>
                          </motion.div>motion.div>
                        ))}
                                  </div>div>
                        </div>div>
                </div>div>
          </section>section>
        );
};

export default Hackathons;</section>
