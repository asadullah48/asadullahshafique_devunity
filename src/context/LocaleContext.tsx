"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
      document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "en" || saved === "ar") setLocale(saved);
  }, [setLocale]);

  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  const t = useCallback(
    (key: string) => resolve(translations[locale] as TranslationDict, key),
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
