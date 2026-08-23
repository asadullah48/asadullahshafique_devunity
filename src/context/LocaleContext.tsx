"use client";

import React, { createContext, useContext, useEffect, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import en from "@/i18n/en.json";
import ar from "@/i18n/ar.json";

type Locale = "en" | "ar";

type TranslationDict = Record<string, unknown>;

const translations: Record<Locale, TranslationDict> = { en, ar };

function resolve(dict: TranslationDict, path: string): string {
  const parts = path.split(".");
  let current: unknown = dict;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return path;
    current = (current as TranslationDict)[part];
  }
  return typeof current === "string" ? current : path;
}

interface LocaleContextValue {
  locale: Locale;
  t: (key: string) => string;
  /** True when the active locale is right-to-left. */
  isRTL: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/** "/ar" and "/ar/..." are Arabic. Everything else is English. */
function localeFromPath(pathname: string | null): Locale {
  if (!pathname) return "en";
  return pathname === "/ar" || pathname.startsWith("/ar/") ? "ar" : "en";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // THE URL IS THE ONLY SOURCE OF LOCALE.
  //
  // This used to be React state restored from localStorage, which meant "/"
  // could render Arabic while its canonical, hreflang and og:locale all said
  // English. The first attempt at this refactor kept the stored preference as
  // a fallback and reintroduced the same bug by a longer route: visiting /ar
  // persisted "ar", and the next navigation to "/" restored it, putting
  // Arabic content back under the English canonical.
  //
  // There is no stored preference now, so no stored value can contradict the
  // address bar. Language is changed by navigating (see LocaleSwitcher), which
  // is also what makes it linkable, shareable and crawlable.
  const pathname = usePathname();
  const locale = localeFromPath(pathname);

  // Keyed on `locale`, not buried inside a setter as it once was. In the old
  // shape any state path that skipped the setter left `dir` silently desynced
  // from the rendered language — and soft-navigating away from /ar would have
  // left documentElement stuck at rtl, since the route's inline script cannot
  // "un-run".
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const t = useCallback(
    (key: string) => resolve(translations[locale] as TranslationDict, key),
    [locale]
  );

  // Memoised so the 17 consumers do not all re-render whenever the root
  // layout happens to re-render.
  const value = useMemo(
    () => ({ locale, t, isRTL: locale === "ar" }),
    [locale, t]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
