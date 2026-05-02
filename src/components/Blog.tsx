"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Tag } from "lucide-react";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  tags: string[];
  accentColor: string;
};

const POSTS: Post[] = [
  {
    slug: "six-hackathons-one-methodology",
    title: "How I Won 6 Consecutive Hackathons With a Single Methodology",
    excerpt:
      "Panaversity, Bronze → Platinum → Agent Factory. Zero failures across 6 hackathons, 85% code reuse, and a four-session execution model that any developer can copy. Here's the exact playbook.",
    readTime: "8 min read",
    date: "April 2025",
    tags: ["Methodology", "Hackathon", "Spec-First", "CLAUDE.md"],
    accentColor: "#84cc16",
  },
  {
    slug: "constitutional-ai-todo-spec-first",
    title: "Building a Constitutional AI Todo App: The Spec-First Way",
    excerpt:
      "149 tests passing. Triple-layer Constitutional AI with 7 BLOCK and 5 FLAG patterns. Team collaboration, recurring todos, and calendar integration — built in four 3-hour sessions from a single SPEC.md file.",
    readTime: "12 min read",
    date: "March 2025",
    tags: ["Constitutional AI", "FastAPI", "Next.js", "TDD"],
    accentColor: "#3b82f6",
  },
  {
    slug: "agent-factory-claude-builds-openai",
    title: "Agent Factory: How Claude Code Builds OpenAI Agents at Scale",
    excerpt:
      "Two-tier architecture where a General Agent (Claude Code) manufactures Custom Agents (OpenAI Agents SDK) using SKILL.md files as portable, monetizable intelligence units. The Digital FTE model explained.",
    readTime: "15 min read",
    date: "May 2025",
    tags: ["Agentic AI", "SKILL.md", "OpenAI SDK", "Digital FTE"],
    accentColor: "#a855f7",
  },
];

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-[#111111] border border-white/8 rounded-2xl overflow-hidden hover:border-green-500/30 transition-all duration-300 cursor-pointer flex flex-col"
    >
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(to right, transparent, ${post.accentColor}80, transparent)`,
        }}
      />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-gray-500">{post.date}</span>
          <span className="w-1 h-1 rounded-full bg-gray-600" />
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>

        <h3
          className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-green-400 transition-colors duration-200"
          style={{ viewTransitionName: `post-title-${post.slug}` }}
        >
          {post.title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">{post.excerpt}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border"
              style={{
                backgroundColor: `${post.accentColor}12`,
                borderColor: `${post.accentColor}40`,
                color: post.accentColor,
              }}
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        <a
          href={`/blog/${post.slug}`}
          className="flex items-center gap-2 text-sm font-medium transition-all duration-200 group/link w-fit"
          style={{ color: post.accentColor }}
        >
          Read Article
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
        </a>
      </div>
    </motion.article>
  );
}

export function BlogSection() {
  return (
    <section id="blog" className="py-24 bg-[#0d0d0d]">
      <div className="container mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Latest <span className="text-green-400">Articles</span>
          </h2>
          <div className="w-16 h-0.5 bg-green-400 mx-auto mb-5" />
          <p className="text-gray-400 max-w-xl mx-auto">
            Lessons from 6 hackathons, production AI systems, and building real businesses
            with technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POSTS.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-8 bg-[#111111] border border-green-500/20 rounded-2xl text-center"
        >
          <p className="text-gray-400 mb-4">
            New articles drop in the Discord first — along with code snippets, WIP demos, and
            hackathon post-mortems.
          </p>
          <a
            href="https://discord.gg/kXfEYVGX"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            Join Asadullah&apos;s Dev Hub
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default BlogSection;
