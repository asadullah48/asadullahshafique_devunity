"use client";

// Admin dashboard page at /admin
// UI password gate uses NEXT_PUBLIC_ADMIN_GATE (safe to expose — it only controls
// the client-side gate, not the actual secret injected server-side).
// The real ADMIN_SECRET is injected by the /api/admin/messages route (server-only).

import React, { useState, useEffect } from "react";
import { Reveal } from "@/components/Reveal";
import { Mail, Clock, Lock, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // NEXT_PUBLIC_ prefix is intentional here: this is only a lightweight UI gate,
  // not the real authentication secret (which lives server-side in ADMIN_SECRET).
  const GATE_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_GATE ?? "";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!GATE_PASSWORD) {
      setError("Admin gate not configured. Set NEXT_PUBLIC_ADMIN_GATE.");
      return;
    }
    if (password.trim() === GATE_PASSWORD.trim()) {
      setAuthed(true);
    } else {
      setError("Wrong password");
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/admin/messages");
      const data = await r.json();
      if (!r.ok) throw new Error(`${r.status}: ${data?.error ?? r.statusText}`);
      setMessages(Array.isArray(data) ? data : data.messages || []);
    } catch (err) {
      setError(`Failed to load messages: ${err instanceof Error ? err.message : "unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch after the UI gate is passed
  useEffect(() => {
    if (authed) fetchMessages();
  }, [authed]);

  // ---- Login gate ----
  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Reveal
          className="w-full max-w-sm p-8 rounded-xl bg-surface-1 border border-border"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-brand" />
            <h1 className="text-foreground font-semibold text-lg">Admin Access</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-brand text-primary-foreground hover:bg-brand/90"
            >
              Login
            </Button>
          </form>
        </Reveal>
      </div>
    );
  }

  // ---- Messages dashboard ----
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-brand" />
            <h1 className="text-2xl font-bold text-foreground">Contact Messages</h1>
            <span className="px-2 py-0.5 text-xs bg-brand/10 text-brand rounded-full">
              {messages.length} total
            </span>
          </div>
          <Button
            onClick={fetchMessages}
            variant="outline"
            className="border-border text-foreground/80 hover:border-brand"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading spinner */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No messages yet.</div>
        ) : (
          /* Message cards — keyed by stable id from the backend */
          <div className="space-y-4">
            {messages.map((msg) => (
              <Reveal
                key={msg.id}
                className={`p-6 rounded-xl border ${
                  msg.read
                    ? "bg-surface-1/50 border-border"
                    : "bg-surface-1 border-brand/30"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-foreground font-medium">{msg.name}</h3>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-brand text-sm hover:underline"
                    >
                      {msg.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.timestamp).toLocaleString()}
                    {!msg.read && (
                      <span className="ml-2 px-2 py-0.5 bg-brand/10 text-brand rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-foreground/80 text-sm font-medium mb-2">{msg.subject}</p>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
