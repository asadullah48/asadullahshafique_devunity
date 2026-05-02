"use client";

import { useLocale } from "@/context/LocaleContext";
import { motion } from "framer-motion";

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useLocale();

  const toggle = () => setLocale(locale === "en" ? "ar" : "en");

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.92 }}
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 hover:border-[#9CE630]/50 text-zinc-400 hover:text-[#9CE630] text-xs font-medium transition-all duration-200 select-none"
      title={t("common.switchLanguage")}
    >
      {/* Flag emoji */}
      <span className="text-sm leading-none">
        {locale === "en" ? "🇦🇪" : "🇺🇸"}
      </span>
      <span className="font-mono tracking-wide">
        {locale === "en" ? "AR" : "EN"}
      </span>
    </motion.button>
  );
}
