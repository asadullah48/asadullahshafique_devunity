"use client";

import dynamic from "next/dynamic";

// The floating chat + WhatsApp widgets are interaction-only: keeping them
// out of the server HTML and initial hydration path (ssr: false) trims the
// first-load JS without any SEO cost.
const AIChatAgent = dynamic(() => import("@/components/AIChatAgent"), {
  ssr: false,
});
const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"), {
  ssr: false,
});

export function FloatingWidgets() {
  return (
    <>
      <AIChatAgent />
      <WhatsAppButton />
    </>
  );
}

export default FloatingWidgets;
