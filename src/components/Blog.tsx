"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/** Shape returned by the FastAPI /api/blog endpoint */
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  read_time: string;
  tags: string[];
  featured: boolean;
  slug: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/blog", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        // Backend may return a plain array or an object with a posts key
        if (Array.isArray(data)) {
          setPosts(data);
        } else if (Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      })
      .catch((err) => {
        // Suppress abort errors that fire on unmount; ignore other fetch failures silently
        if (err.name !== "AbortError") {
          // silently ignore
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  // Show a centered spinner while the fetch is in-flight
  if (loading) {
    return (
      <section id="blog" className="py-24 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#9CE630]" />
      </section>
    );
  }

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
          {posts
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
                    {post.read_time}
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
          {posts
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
                    {post.read_time}
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
