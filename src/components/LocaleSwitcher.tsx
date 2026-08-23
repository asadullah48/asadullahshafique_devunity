"use client";

import { useLocale } from "@/context/LocaleContext";

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useLocale();

  const toggle = () => setLocale(locale === "en" ? "ar" : "en");

  return (
    <button
      onClick={toggle}
      // `active:` is the CSS equivalent of whileTap and needs no runtime. The
      // existing `transition-all duration-200` already animates the scale back
      // out on release, so the press reads the same as the framer version.
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 hover:border-brand/50 text-muted-foreground hover:text-brand text-xs font-medium transition-all duration-200 select-none active:scale-[0.92]"
      title={t("common.switchLanguage")}
    >
      {/* Flag emoji */}
      <span className="text-sm leading-none">
        {locale === "en" ? "🇦🇪" : "🇺🇸"}
      </span>
      <span className="font-mono tracking-wide">
        {locale === "en" ? "AR" : "EN"}
      </span>
    </button>
  );
}
