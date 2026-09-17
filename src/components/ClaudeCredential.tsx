"use client";

import { Award, ExternalLink } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

export function ClaudeCredential() {
  const { locale } = useLocale();
  const ar = locale === "ar";

  return (
    <div className="rounded-xl border border-brand/30 bg-surface-1/60 p-6">
      <div className="flex items-start gap-4">
        <Award className="h-7 w-7 shrink-0 text-brand" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            {ar ? "شارة إتمام موثّقة" : "Verified completion badge"}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-foreground" dir="ltr">Claude 101</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {ar ? "Claude Academy · منصة التعلّم من Anthropic" : "Claude Academy · Anthropic’s learning platform"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {ar ? "أسد الله شفيق · صدرت في 18 سبتمبر 2026" : "Asadullah Shafique · Issued September 18, 2026"}
          </p>
          <a
            href="https://academy.claude.com/verify/6d808a4f90c00a98b326959280f5c280"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded text-sm font-medium text-brand underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            {ar ? "التحقق من شارة الإتمام" : "Verify completion badge"}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
