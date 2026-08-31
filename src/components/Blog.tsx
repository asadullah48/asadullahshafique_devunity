"use client";

import { Reveal } from "@/components/Reveal";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  tags: string[];
  accentColor: string;
};

const POSTS_EN: Post[] = [
  // Newest first. The top posts are EN only: content/ar/ has no translation of
  // them, and POSTS_AR must not list a slug whose Arabic markdown does not
  // exist — generateStaticParams reads content/<locale>/, so the /ar route
  // would 404.
  {
    slug: "books-that-shaped-my-thinking",
    title: "10 Books That Shaped How I Think",
    excerpt:
      "People who follow my engineering work rarely see the shelf behind it. Here are the ten books I keep coming back to, split into two piles: what grounds me, and what sharpens me.",
    readTime: "6 min read",
    date: "August 2026",
    tags: ["Reading List", "Books", "Philosophy", "Self-Improvement"],
    accentColor: "#22c55e",
  },
  {
    slug: "the-1-9-1-rule",
    title: "The 1–9–1 Rule: How AI Expands Possibility Before You Decide",
    excerpt:
      "Most people treat AI as a faster way to reach an answer. That's the least interesting thing it does. The real shift is upstream of the answer entirely — in how cheap it has become to see nine paths before committing to one.",
    readTime: "6 min read",
    date: "August 2026",
    tags: ["AI", "Decision-Making", "Agentic Engineering", "Future of Work"],
    accentColor: "#6366f1",
  },
  {
    slug: "closing-the-deployment-gap",
    title:
      "Closing the Deployment Gap: Why the Next Job Is Forward-Deployed, Not Another Demo Agent",
    excerpt:
      "Two groups are stuck for what look like opposite reasons — developers watching their work commoditise, companies watching pilots collapse on contact with real workflows. It is the same wall from two sides. The gap is not talent and not the model; it is deployment, and it closes with a System of Context.",
    readTime: "8 min read",
    date: "August 2026",
    tags: ["Forward-Deployed", "Agent Factory", "System of Context", "AI Engineering"],
    accentColor: "#ec4899",
  },
  {
    slug: "claude-certification-by-job-function",
    title:
      "Which Claude Certification Should You Actually Sit? Pick by Job Function, Not Job Title",
    excerpt:
      "There are four Claude certifications and most people choose the wrong one, because they read the names as a ladder and pick the rung matching their title. The names are a lie about difficulty. Here is what each exam actually tests, and the one question that sorts you into the right room.",
    readTime: "9 min read",
    date: "August 2026",
    tags: ["Claude", "Certification", "AI Engineering", "Career"],
    accentColor: "#14b8a6",
  },
  {
    slug: "graph-engineering-with-claude",
    title: "Graph Engineering with Claude: A 14-Step Roadmap From 0 to Graph Architect",
    excerpt:
      "Most multi-step agents are a straight line — one head, one context, one thing at a time, until the window fills up. This is the 14-step roadmap that turns that line into a graph: one that fans out across a fleet, verifies its own findings, and converges on a result a lone agent could never hold.",
    readTime: "18 min read",
    date: "August 2026",
    tags: ["Graph Engineering", "Claude Code", "Multi-Agent", "Workflows"],
    accentColor: "#f59e0b",
  },
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
      "149 tests passing. Triple-layer Constitutional AI with 7 BLOCK and 5 FLAG patterns. Team collaboration, recurring todos, and calendar integration, built in four 3-hour sessions from a single SPEC.md file.",
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

const POSTS_AR: Post[] = [
  {
    slug: "six-hackathons-one-methodology",
    title: "كيف فزت بـ 6 هاكاثونات متتالية بمنهجية واحدة",
    excerpt:
      "Panaversity، برونزي → بلاتيني → مصنع الوكلاء. صفر إخفاقات عبر 6 هاكاثونات، 85% إعادة استخدام الكود، ونموذج تنفيذ من أربع جلسات يمكن لأي مطور نسخه. هذا هو الدليل التفصيلي بالضبط.",
    readTime: "8 دقائق قراءة",
    date: "أبريل 2025",
    tags: ["المنهجية", "هاكاثون", "Spec-First", "CLAUDE.md"],
    accentColor: "#84cc16",
  },
  {
    slug: "constitutional-ai-todo-spec-first",
    title: "بناء تطبيق مهام بالذكاء الاصطناعي الدستوري: الطريقة Spec-First",
    excerpt:
      "149 اختباراً ناجحاً. ذكاء اصطناعي دستوري ثلاثي الطبقات بـ 7 أنماط BLOCK و5 أنماط FLAG. تعاون جماعي ومهام متكررة وتكامل التقويم، مبني في أربع جلسات من 3 ساعات من ملف SPEC.md واحد.",
    readTime: "12 دقيقة قراءة",
    date: "مارس 2025",
    tags: ["الذكاء الاصطناعي الدستوري", "FastAPI", "Next.js", "TDD"],
    accentColor: "#3b82f6",
  },
  {
    slug: "agent-factory-claude-builds-openai",
    title: "مصنع الوكلاء: كيف يبني Claude Code وكلاء OpenAI على نطاق واسع",
    excerpt:
      "هندسة من طبقتين حيث يصنع وكيل عام (Claude Code) وكلاء مخصصين (OpenAI Agents SDK) باستخدام ملفات SKILL.md كوحدات ذكاء قابلة للنقل والتسييل. نموذج الموظف الرقمي مشروحاً.",
    readTime: "15 دقيقة قراءة",
    date: "مايو 2025",
    tags: ["الذكاء الاصطناعي الوكيل", "SKILL.md", "OpenAI SDK", "Digital FTE"],
    accentColor: "#a855f7",
  },
];

function PostCard({
  post,
  readArticleLabel,
  basePath,
}: {
  post: Post;
  readArticleLabel: string;
  /** "" for English, "/ar" for Arabic. The URL is the only source of locale
   *  (see LocaleContext), so an Arabic card must link to an Arabic URL —
   *  linking to /blog/... would drop the reader back into English. */
  basePath: string;
}) {
  return (
    <Reveal as="article"
      className="group relative bg-surface-2 border border-white/8 rounded-2xl overflow-hidden hover:border-brand/30 transition-all duration-300 cursor-pointer flex flex-col"
    >
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(to right, transparent, ${post.accentColor}80, transparent)`,
        }}
      />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-muted-foreground">{post.date}</span>
          <span className="w-1 h-1 rounded-full bg-muted" />
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>

        <h3
          className="text-lg font-bold text-foreground mb-3 leading-snug group-hover:text-brand transition-colors duration-200"
          style={{ viewTransitionName: `post-title-${post.slug}` }}
        >
          {post.title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">{post.excerpt}</p>

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
          href={`${basePath}/blog/${post.slug}`}
          className="flex items-center gap-2 text-sm font-medium transition-all duration-200 group/link w-fit"
          style={{ color: post.accentColor }}
        >
          {readArticleLabel}
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
        </a>
      </div>
    </Reveal>
  );
}

export function BlogSection() {
  const { t, locale } = useLocale();
  const posts = locale === "ar" ? POSTS_AR : POSTS_EN;

  return (
    <section id="blog" className="py-24 bg-surface-1">
      <div className="container mx-auto px-6">

        <Reveal
          className="text-center mb-14"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("blog.title")} <span className="text-brand">{t("blog.titleHighlight")}</span>
          </h2>
          <div className="w-16 h-0.5 bg-brand mx-auto mb-5" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("blog.subtitle")}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
              readArticleLabel={t("blog.readArticle")}
              basePath={locale === "ar" ? "/ar" : ""}
            />
          ))}
        </div>

        <Reveal step={3}
          className="mt-12 p-8 bg-surface-2 border border-brand/20 rounded-2xl text-center"
        >
          <p className="text-muted-foreground mb-4">
            {t("blog.discordNote")}
          </p>
          <a
            href="https://discord.gg/kXfEYVGX"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-foreground font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            {t("blog.joinHub")}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export default BlogSection;
