"use client";

import { Award, BadgeCheck, ExternalLink } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { CREDENTIALS } from "@/lib/credentials";

/**
 * #certifications — completed courses and certificates.
 *
 * Data lives in src/lib/credentials.ts; add new certificates there. This
 * component only renders. It keeps its historical name so the import in
 * page.tsx does not have to change.
 */

// Fixed month names rather than Intl: server and browser ICU data can format
// Arabic dates differently, which would be a hydration mismatch.
const MONTHS = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
};
const formatDate = (iso: string, ar: boolean) => {
  const [y, m, d] = iso.split("-").map(Number);
  return ar ? `${d} ${MONTHS.ar[m - 1]} ${y}` : `${MONTHS.en[m - 1]} ${d}, ${y}`;
};

export function ClaudeCredential() {
  const { t, locale } = useLocale();
  const ar = locale === "ar";
  const issuers = Array.from(new Set(CREDENTIALS.map((c) => c.issuer)));

  return (
    <div id="certifications" className="scroll-mt-24">
      <div className="mb-10 text-center">
        <div dir="ltr" className="mb-3 font-mono text-xs uppercase tracking-widest text-brand/80">
          {"// credentials"}
        </div>
        <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
          {t("credentials.title")} <span className="text-brand">{t("credentials.titleHighlight")}</span>
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          {t("credentials.subtitle")
            .replace("{count}", String(CREDENTIALS.length))
            .replace("{issuers}", issuers.join(ar ? " و " : " & "))}
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CREDENTIALS.map((c) => {
          const href = c.verifyUrl ?? c.certificateUrl;
          const Icon = c.kind === "certificate" ? Award : BadgeCheck;
          const label =
            c.kind === "certificate" ? t("credentials.certificate") : t("credentials.badge");
          const linkText = c.verifyUrl ? t("credentials.verify") : t("credentials.view");
          return (
            <li
              key={href}
              className="flex flex-col rounded-xl border border-brand/30 bg-surface-1/60 p-5"
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-6 w-6 shrink-0 text-brand" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">{label}</p>
                  <h3 className="mt-1.5 text-lg font-semibold leading-snug text-foreground" dir="ltr">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {ar ? c.programme.ar : c.programme.en}
                  </p>
                  {c.date && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {c.kind === "certificate" ? t("credentials.completed") : t("credentials.issued")}{" "}
                      <time dateTime={c.date}>{formatDate(c.date, ar)}</time>
                    </p>
                  )}
                </div>
              </div>
              {href && (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex min-h-[44px] items-center gap-2 self-start pt-3 text-sm font-medium text-brand underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  {linkText}
                  <span className="sr-only">: {c.title}</span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
