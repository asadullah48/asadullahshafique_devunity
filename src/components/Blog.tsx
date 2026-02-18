"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const blogPosts = [
  {
    title: "Why Spec-First Development Changes Everything",
    excerpt:
      "How the SpecifyKit methodology transformed my approach to building AI applications. From chaos to clarity in every project.",
    date: "Feb 2026",
    readTime: "5 min",
    tags: ["SpecifyKit", "Methodology", "AI"],
    featured: true,
  },
  {
    title: "Building RAG Chatbots: Lessons from Panaversity Hackathon",
    excerpt:
      "Deep dive into building a comprehensive textbook platform with RAG chatbot during the Physical AI & Humanoid Robotics Hackathon.",
    date: "Jan 2026",
    readTime: "8 min",
    tags: ["RAG", "Hackathon", "Python"],
    featured: true,
  },
  {
    title: "Learning from AI Mistakes: A New Paradigm",
    excerpt:
      "Exploring an innovative approach — instead of avoiding AI errors, what if we embraced them as learning opportunities?",
    date: "Jan 2026",
    readTime: "6 min",
    tags: ["AI Research", "Innovation"],
    featured: false,
  },
  {
    title: "Next.js + FastAPI: The Ultimate Full-Stack Combo",
    excerpt:
      "My go-to architecture for production AI apps. Why this stack works and how to set it up properly.",
    date: "Dec 2025",
    readTime: "10 min",
    tags: ["Next.js", "FastAPI", "Full-Stack"],
    featured: false,
  },
  {
    title: "MCP Servers: Supercharging Claude Desktop",
    excerpt:
      "How I configured MCP servers to enhance my AI development workflow with Claude Desktop for maximum productivity.",
    date: "Dec 2025",
    readTime: "7 min",
    tags: ["MCP", "Claude", "Productivity"],
    featured: false,
  },
  {
    title: "From Student to Agentic AI Developer: My Journey",
    excerpt:
      "The path from learning basics to building autonomous AI agents. Resources, tools, and mindset shifts that made the difference.",
    date: "Nov 2025",
    readTime: "12 min",
    tags: ["Career", "Agentic AI", "Journey"],
    featured: false,
  },
];

const Blog = () => {
  return (
    <section id="blog" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Latest <span className="text-[#9CE630]">Blog Posts</span>
          </h2>
          <div className="w-20 h-1 bg-[#9CE630] mx-auto rounded-full mb-6" />
          <p className="text-zinc-400 max-w-xl mx-auto">
            Sharing my learnings, experiments, and insights from the world of AI development.
          </p>
        </motion.div>

        {/* Featured Posts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-5xl mx-auto">
          {blogPosts
            .filter((p) => p.featured)
            .map((post, index) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-6 rounded-xl bg-zinc-900/50 border border-[#9CE630]/20 hover:border-[#9CE630]/50 transition-all duration-300"
              >
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#9CE630]/10 text-[#9CE630] rounded-full">
                    Featured
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 pr-20 group-hover:text-[#9CE630] transition-colors">
                  {post.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-zinc-800 text-zinc-400 rounded-md"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
        </div>

        {/* Regular Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {blogPosts
            .filter((p) => !p.featured)
            .map((post, index) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
              >
                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-[#9CE630] transition-colors">
                  {post.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-zinc-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
              </motion.article>
            ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-zinc-500 text-sm mb-4">
            More articles coming soon. Stay tuned by joining the Discord!
          </p>
          <Link href="https://discord.gg/kXfEYVGX" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:border-[#9CE630] hover:text-[#9CE630]"
            >
              Get Notified
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
