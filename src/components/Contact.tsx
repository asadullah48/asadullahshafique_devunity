"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle, AlertCircle, Loader2, MessageCircle } from "lucide-react";
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
    "w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#9CE630]/50 transition-colors";

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
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t("contact.title")} <span className="text-[#9CE630]">{t("contact.titleHighlight")}</span>
          </h2>
          <div className="w-20 h-1 bg-[#9CE630] mx-auto rounded-full mb-6" />
          <p className="text-zinc-400 max-w-xl mx-auto">
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
              <h3 className="text-2xl font-bold text-white mb-4">
                {t("contact.buildTogether")}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {t("contact.buildDesc")}
              </p>
            </div>

            <a
              href="mailto:asadullahshafique@hotmail.com"
              className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-[#9CE630]/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#9CE630]/10 flex items-center justify-center group-hover:bg-[#9CE630]/20 transition-colors">
                <Mail className="w-5 h-5 text-[#9CE630]" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">{t("contact.emailLabel")}</p>
                <p className="text-sm text-white">asadullahshafique@hotmail.com</p>
              </div>
            </a>

            <a
              href="https://wa.me/923213771445"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-[#25D366]/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">{t("contact.whatsappLabel")}</p>
                <p className="text-sm text-white">+92 321 3771445</p>
                <p className="text-xs text-zinc-500 mt-0.5">{t("contact.whatsappHint")}</p>
              </div>
            </a>

            <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <p className="text-sm font-semibold text-white mb-3">{t("contact.preferOther")}</p>
              <div className="space-y-2 text-sm text-zinc-400">
                <p>
                  GitHub:{" "}
                  <a
                    href="https://github.com/asadullah48"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9CE630] hover:underline"
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
                  <span className="text-zinc-500"> {t("contact.whatsappRegion")}</span>
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
                  <label className="block text-sm text-zinc-400 mb-1.5">{t("contact.nameLabel")}</label>
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
                  <label className="block text-sm text-zinc-400 mb-1.5">{t("contact.emailFieldLabel")}</label>
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
                <label className="block text-sm text-zinc-400 mb-1.5">{t("contact.subjectLabel")}</label>
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
                <label className="block text-sm text-zinc-400 mb-1.5">{t("contact.messageLabel")}</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                  placeholder={t("contact.messagePlaceholder")}
                />
              </div>

              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full h-12 bg-[#9CE630] text-black font-semibold hover:bg-[#8BD520] transition-all duration-300 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("contact.sending")}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
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
