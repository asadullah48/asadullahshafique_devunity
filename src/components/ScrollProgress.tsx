// SERVER COMPONENT — deliberately no "use client".
//
// This used to be framer-motion's useScroll + useSpring driving a motion.div's
// scaleX, which meant a hook, a client boundary, and a spring integrating on
// every scroll frame. `animation-timeline: scroll()` expresses the same thing
// declaratively: the browser maps document scroll progress straight onto the
// animation, off the main thread, with no React involved at all.
//
// The spring's easing is the one thing lost. A progress rail reads as a direct
// readout of scroll position, so `linear` is arguably more honest than a
// spring that lags behind where the user actually is.
//
// Rendered by layout.tsx, so it is on every route: keeping it hook-free means
// it contributes nothing to any route's client bundle. See the .scroll-progress
// rule in globals.css for why the animation is gated behind @supports.
export default function ScrollProgress() {
  return (
    <div
      aria-hidden
      className="scroll-progress fixed top-0 left-0 right-0 h-0.5 z-[60] bg-brand shadow-[0_0_8px_hsl(var(--brand)/0.6)]"
    />
  );
}
