"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Globe, Code, Users, Heart, GitPullRequest } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  { icon: Github, value: "20+", label: "Repositories" },
  { icon: GitPullRequest, value: "50+", label: "Contributions" },
  { icon: Code, value: "5+", label: "Technologies" },
  { icon: Heart, value: "Open", label: "Source Advocate" },
  ];

const contributions = [
  {
        icon: Globe,
        title: "Global Collaboration",
        description:
                "Contributing to projects that empower the developer community worldwide.",
  },
  {
        icon: Code,
        title: "Quality Code",
        description:
                "Writing clean, documented, and well-tested code following best practices.",
  },
  {
        icon: Users,
        title: "Community Impact",
        description:
                "Sharing knowledge through code, blog posts, and active community engagement.",
  },
  ];

export default function OpenSourceSection() {
    return (
          <section id="opensource" className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#9CE630]/5 to-transparent" />
          
                <div className="container relative z-10 mx-auto px-4">
                        <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="text-center mb-16"
                                  >
                                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                              Open Source <span className="text-[#9CE630]">for All</span>span>
                                  </h2>h2>
                                  <div className="w-20 h-1 bg-[#9CE630] mx-auto rounded-full mb-6" />
                                  <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                                              I believe in the power of community-driven development.
                                              All my projects are open source and contributions are always welcome.
                                  </p>p>
                        </motion.div>motion.div>
                
                  {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-3xl mx-auto">
                          {stats.map((stat, index) => (
                        <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="text-center p-4 rounded-xl bg-zinc-900/50 border border-zinc-800"
                                      >
                                      <stat.icon className="w-6 h-6 text-[#9CE630] mx-auto mb-2" />
                                      <div className="text-2xl font-bold text-white">{stat.value}</div>div>
                                      <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>div>
                        </motion.div>motion.div>
                      ))}
                        </div>div>
                
                  {/* Contribution areas */}
                        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                          {contributions.map((item, index) => (
                        <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-[#9CE630]/30 transition-all duration-300"
                                      >
                                      <item.icon className="w-10 h-10 text-[#9CE630] mb-4" />
                                      <h3 className="text-lg font-semibold text-white mb-2">
                                        {item.title}
                                      </h3>h3>
                                      <p className="text-zinc-400 text-sm leading-relaxed">
                                        {item.description}
                                      </p>p>
                        </motion.div>motion.div>
                      ))}
                        </div>div>
                
                  {/* CTA */}
                        <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    viewport={{ once: true }}
                                    className="text-center"
                                  >
                                  <Link
                                                href="https://github.com/asadullah48"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                              <Button className="bg-[#9CE630] text-black hover:bg-[#8BD520] text-lg px-8 py-6 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#9CE630]/20">
                                                            <Github className="mr-2 h-5 w-5" />
                                                            Contribute on GitHub
                                              </Button>Button>
                                  </Link>Link>
                        </motion.div>motion.div>
                </div>div>
          </section>section>
        );
}</section>
