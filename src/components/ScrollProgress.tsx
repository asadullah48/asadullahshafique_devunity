"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-0.5 z-[60] origin-left bg-[#9CE630] shadow-[0_0_8px_rgba(156,230,48,0.6)]"
      style={{ scaleX }}
    />
  );
}
