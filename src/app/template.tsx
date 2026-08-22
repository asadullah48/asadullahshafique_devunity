"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Route transition wrapper.
 *
 * `template.tsx` re-mounts on every navigation; `layout.tsx` does not. That is
 * the whole reason this file exists — the animation below needs a fresh mount
 * per route to replay, which a layout would never give it.
 *
 * TRANSFORM ONLY — DELIBERATELY NO OPACITY FADE.
 *
 * framer-motion serialises `initial` into the server-rendered HTML. An
 * `initial={{ opacity: 0 }}` therefore ships every page to the browser
 * invisible, and it stays invisible until hydration finishes: it delays LCP on
 * the exact element LCP is measured against, and if the JS bundle fails or is
 * blocked, the page is permanently blank. A translate has neither failure
 * mode — worst case the content sits 6px low, fully painted and readable.
 * That is the right trade for a portfolio whose homepage is the LCP surface.
 *
 * The visible cost is that navigations slide rather than cross-fade. On a
 * 240ms transition that difference is close to imperceptible; a blank first
 * paint is not.
 */
export default function Template({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const reduced = useReducedMotion();

  // `children` is passed through as a prop, so the pages it holds stay server
  // components — this "use client" boundary does not drag them into the
  // client bundle. Only the wrapper below ships.
  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ y: 6 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
