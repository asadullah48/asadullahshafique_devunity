"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MessageCircle, Loader2 } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";

function ChatLauncher({ onClick, loading = false }: { onClick?: () => void; loading?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      aria-label={loading ? "Loading portfolio assistant" : "Open portfolio assistant"}
      aria-busy={loading}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-primary-foreground shadow-lg transition-transform hover:scale-105"
    >
      {loading ? <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" /> : <MessageCircle className="h-6 w-6" aria-hidden="true" />}
    </button>
  );
}

// Import the assistant only when someone requests it, rather than downloading
// and hydrating its conversation UI during the homepage's initial load.
const AIChatAgent = dynamic(() => import("@/components/AIChatAgent"), {
  ssr: false,
  loading: () => <ChatLauncher loading />,
});

export function FloatingWidgets() {
  const [requested, setRequested] = useState(false);
  return (
    <>
      {requested ? <AIChatAgent initiallyOpen /> : <ChatLauncher onClick={() => setRequested(true)} />}
      <WhatsAppButton />
    </>
  );
}

export default FloatingWidgets;
