"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle, AlertCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/context/LocaleContext";

const Contact = () => {
  const { t } = useLocale();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        const data = await res.json();
        setErrorMessage(data.error || t("contact.errorGeneric"));
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch {
      setErrorMessage(t("contact.errorNetwork"));
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-surface-1/50 border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-brand/50 transition-colors";

  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="text-xs font-mono text-green-400/60 uppercase tracking-widest mb-3">
            {"// contact"}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("contact.title")} <span className="text-brand">{t("contact.titleHighlight")}</span>
          </h2>
          <div className="w-20 h-1 bg-brand mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("contact.subheadline")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {t("contact.buildTogether")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("contact.buildDesc")}
              </p>
            </div>

            <a
              href="mailto:asadullahshafique@hotmail.com"
              className="flex items-center gap-4 p-4 rounded-xl bg-surface-1/50 border border-border hover:border-brand/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                <Mail className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("contact.emailLabel")}</p>
                <p className="text-sm text-foreground">asadullahshafique@hotmail.com</p>
              </div>
            </a>

            <a
              href="https://wa.me/923213771445"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-surface-1/50 border border-border hover:border-[#25D366]/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("contact.whatsappLabel")}</p>
                <p className="text-sm text-foreground">+92 321 3771445</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("contact.whatsappHint")}</p>
              </div>
            </a>

            <div className="p-6 rounded-xl bg-surface-1/50 border border-border">
              <p className="text-sm font-semibold text-foreground mb-3">{t("contact.preferOther")}</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  GitHub:{" "}
                  <a
                    href="https://github.com/asadullah48"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline"
                  >
                    @asadullah48
                  </a>
                </p>
                <p>
                  Discord:{" "}
                  <a
                    href="https://discord.gg/kXfEYVGX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5865F2] hover:underline"
                  >
                    {t("contact.discordJoin")}
                  </a>
                </p>
                <p>
                  WhatsApp:{" "}
                  <a
                    href="https://wa.me/923213771445"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] hover:underline"
                  >
                    {t("contact.whatsappChat")}
                  </a>
                  <span className="text-muted-foreground"> {t("contact.whatsappRegion")}</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">{t("contact.nameLabel")}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                    placeholder={t("contact.namePlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">{t("contact.emailFieldLabel")}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass}
                    placeholder={t("contact.emailPlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">{t("contact.subjectLabel")}</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={inputClass}
                  placeholder={t("contact.subjectPlaceholder")}
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">{t("contact.messageLabel")}</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                  placeholder={t("contact.messagePlaceholder")}
                />
              </div>

              {/* `thinking` supplies the busy state, the aura, disabling and
                  aria-busy. The old hardcoded `hover:bg-[#8BD520]` was the
                  RETIRED LIME brand — a stray literal that outlived the token
                  migration; `variant="neon"` replaces it with the real one. */}
              <Button
                type="submit"
                variant="neon"
                thinking={status === "loading"}
                className="w-full h-12"
              >
                {status === "loading" ? (
                  t("contact.sending")
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t("contact.send")}
                  </>
                )}
              </Button>

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
                >
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {t("contact.successFull")}
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMessage}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
