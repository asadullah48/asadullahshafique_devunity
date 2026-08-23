/**
 * Route transition wrapper.
 *
 * SERVER COMPONENT — deliberately no "use client".
 *
 * `template.tsx` re-mounts on every navigation; `layout.tsx` does not. That is
 * the whole reason this file exists — the animation needs a fresh mount per
 * route to replay, which a layout would never give it. A CSS animation replays
 * on mount for free, so none of that required JavaScript: this used to be a
 * framer-motion wrapper with a `useReducedMotion` hook, which wrapped every
 * single route in the app in a client boundary.
 *
 * TRANSFORM ONLY — DELIBERATELY NO OPACITY FADE.
 *
 * This wraps the LCP element. An `opacity: 0` start ships every page to the
 * browser invisible until the animation runs: it delays LCP on the exact
 * element LCP is measured against, and if anything goes wrong the page is
 * blank. A translate has neither failure mode — worst case the content sits
 * 6px low, fully painted and readable.
 *
 * Reduced motion is handled by the one authoritative block in globals.css
 * rather than by a hook here, which is strictly better: it applies at paint
 * time instead of after hydration, and it cannot disagree with the rest of
 * the site.
 */
export default function Template({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="route-enter">{children}</div>;
}
