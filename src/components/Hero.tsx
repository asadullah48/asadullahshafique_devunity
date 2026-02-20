"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Github, ArrowDown, Sparkles, Code2, Brain } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GitHubStatsStrip } from "@/components/GitHubStatsStrip";

const Hero = () => {
    const [mounted, setMounted] = useState(false);

    /**
     * Particle positions and animation values are memoized so that Math.random()
     * is called only once (on mount), preventing visible re-randomization on
     * every re-render (e.g. when GitHub stats load and update parent state).
     */
    const particles = useMemo(
      () =>
        Array.from({ length: 20 }, () => ({
          x: Math.random() * 1000,
          y: Math.random() * 800,
          yTarget: Math.random() * -200 - 100,
          duration: Math.random() * 5 + 5,
          delay: Math.random() * 5,
        })),
      []
    );

    useEffect(() => {
          setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
          <section id="home" className="relative min-h-screen overflow-hidden flex items-center justify-center">
            {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#9CE630]/10 via-transparent to-transparent" />
          
            {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {particles.map((p, i) => (
                      <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-[#9CE630]/30 rounded-full"
                                    initial={{
                                                    x: p.x,
                                                    y: p.y,
                                    }}
                                    animate={{
                                                    y: [null, p.yTarget],
                                                    opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                                    duration: p.duration,
                                                    repeat: Infinity,
                                                    delay: p.delay,
                                    }}
                                  />
                    ))}
                </div>
          
                <div className="container relative z-10 mx-auto px-4 py-24 md:py-32 text-center">
                        <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                  >
                          {/* Status badge */}
                                  <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.2, duration: 0.5 }}
                                                className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-[#9CE630]/30 bg-[#9CE630]/5 text-[#9CE630] text-sm"
                                              >
                                              <Sparkles className="w-4 h-4" />
                                              <span>Open to Collaborate on AI Projects</span>
                                              <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9CE630] opacity-75" />
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9CE630]" />
                                              </span>
                                  </motion.div>
                        
                          {/* Main heading */}
                                  <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl lg:text-7xl tracking-tight">
                                              Hi, I&apos;m{" "}
                                              <span className="relative">
                                                            <span className="text-[#9CE630]">Asadullah</span>
                                                            <motion.span
                                                                              className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#9CE630] to-[#9CE630]/0 rounded-full"
                                                                              initial={{ scaleX: 0 }}
                                                                              animate={{ scaleX: 1 }}
                                                                              transition={{ delay: 1, duration: 0.8 }}
                                                                              style={{ transformOrigin: "left" }}
                                                                            />
                                              </span>
                                              <br />
                                              <span className="text-zinc-400 text-3xl md:text-5xl lg:text-6xl">
                                                            Agentic AI Developer
                                              </span>
                                  </h1>
                        
                          {/* Description */}
                                  <p className="mb-10 text-lg text-zinc-400 md:text-xl max-w-2xl mx-auto leading-relaxed">
                                              Building intelligent systems with{" "}
                                              <span className="text-white font-medium">Next.js</span>,{" "}
                                              <span className="text-white font-medium">TypeScript</span>,{" "}
                                              <span className="text-white font-medium">Python</span> &{" "}
                                              <span className="text-white font-medium">FastAPI</span>.
                                              Passionate about Generative AI, spec-first development, and pushing boundaries.
                                  </p>
                        
                          {/* Tech icons row */}
                                  <div className="flex items-center justify-center gap-6 mb-10">
                                    {[
                                    { icon: Code2, label: "Full-Stack" },
                                    { icon: Brain, label: "AI/ML" },
                                    { icon: Sparkles, label: "Gen AI" },
                                                ].map((item, i) => (
                                                                <motion.div
                                                                                  key={item.label}
                                                                                  initial={{ opacity: 0, y: 20 }}
                                                                                  animate={{ opacity: 1, y: 0 }}
                                                                                  transition={{ delay: 0.5 + i * 0.1 }}
                                                                                  className="flex items-center gap-2 text-zinc-500 text-sm"
                                                                                >
                                                                                <item.icon className="w-4 h-4 text-[#9CE630]" />
                                                                                <span>{item.label}</span>
                                                                </motion.div>
                                                              ))}
                                  </div>
                        
                          {/* CTA Buttons */}
                                  <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                                              <Link href="#projects">
                                                            <Button className="h-12 px-8 bg-[#9CE630] text-black font-semibold hover:bg-[#8BD520] transition-all duration-300 hover:shadow-lg hover:shadow-[#9CE630]/20">
                                                                            View My Work
                                                                            <ArrowDown className="ml-2 h-4 w-4 animate-bounce" />
                                                            </Button>
                                              </Link>
                                              <Link
                                                              href="https://github.com/asadullah48"
                                                              target="_blank"
                                                              rel="noopener noreferrer"
                                                            >
                                                            <Button
                                                                              variant="outline"
                                                                              className="h-12 px-8 border-zinc-700 text-zinc-300 hover:border-[#9CE630] hover:text-[#9CE630] transition-all duration-300"
                                                                            >
                                                                            <Github className="mr-2 h-5 w-5" />
                                                                            GitHub Profile
                                                            </Button>
                                              </Link>
                                  </div>
                        
                          {/* Live GitHub Stats */}
                                  <GitHubStatsStrip />

                          {/* Stats */}
                                  <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.8, duration: 0.5 }}
                                                className="flex items-center justify-center gap-8 mt-16 pt-8 border-t border-zinc-800/50"
                                              >
                                    {[
                                                { value: "10+", label: "Projects" },
                                                { value: "5+", label: "Hackathons" },
                                                { value: "Full-Stack", label: "AI Developer" },
                                                            ].map((stat) => (
                                                                            <div key={stat.label} className="text-center">
                                                                                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                                                                                            <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
                                                                            </div>
                                                                          ))}
                                  </motion.div>
                        </motion.div>
                </div>
          
            {/* Scroll indicator */}
                <motion.div
                          className="absolute bottom-8 left-1/2 -translate-x-1/2"
                          animate={{ y: [0, 10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                        <ArrowDown className="w-5 h-5 text-zinc-600" />
                </motion.div>
          </section>
        );
};

export default Hero;
