import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Scroll-triggered entry animation — the replacement for framer-motion's
 * `whileInView`.
 *
 * NO "use client" AND NO HOOKS, DELIBERATELY.
 *
 * This renders a plain element with a class; all the behaviour lives in the
 * `.reveal` rule in globals.css, driven by `animation-timeline: view()`. That
 * is the entire point. Fifteen components imported the framer-motion runtime
 * (~33 kB gzipped) purely to fade a heading in on scroll, and because a
 * bundler resolves that dependency once for the whole module graph, the cost
 * was paid even by a component using a single `<motion.div>`.
 *
 * Having no hooks, it stays a server component wherever its parent is one.
 * Where the parent must be a client component — most sections here consume
 * LocaleContext and so cannot be server-rendered — it compiles to a bare
 * element with a className. Either way it ships no behaviour of its own.
 *
 * @param step Stagger index within a group (0, 1, 2 …). Pass the map index
 *             directly rather than precomputing a delay; the CSS translates it
 *             differently for the scroll and the fallback path.
 * @param as   Element to render. Prefer a semantic tag over nesting a wrapper
 *             `<div>` that exists only to animate — an extra div inside a grid
 *             becomes an unwanted grid item.
 */
export function Reveal({
  children,
  className,
  step = 0,
  as: Tag = "div",
  style,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  step?: number;
  as?: ElementType;
} & Omit<HTMLAttributes<HTMLElement>, "children">) {
  return (
    <Tag
      className={cn("reveal", className)}
      style={
        {
          // Two properties for two code paths, both derived from one `step` so
          // they cannot drift: --reveal-step shifts the scroll range, while
          // --reveal-delay staggers the time-based fallback.
          "--reveal-step": step,
          "--reveal-delay": `${step * 100}ms`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
