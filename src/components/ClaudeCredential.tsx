"use client";

import { Award, ExternalLink } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

const credentials = [
  {
    title: "Claude Code 101",
    verifyCode: "64b43e3f91ee11516e562d2c35801e3a",
  },
  {
    title: "AI Fluency for builders",
    verifyCode: "2cfb8dd802a841177aba39028ef6cf4e",
  },
  {
    title: "AI capabilities and limitations",
    verifyCode: "e5f7a0e1a35e7d3e6626241402d556be",
  },
  {
    title: "Claude 101",
    verifyCode: "6d808a4f90c00a98b326959280f5c280",
  },
];

export function ClaudeCredential() {
  const { locale } = useLocale();
  const ar = locale === "ar";

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {credentials.map((credential) => (
        <div key={credential.verifyCode} className="rounded-xl border border-brand/30 bg-surface-1/60 p-6">
          <div className="flex items-start gap-4">
            <Award className="h-7 w-7 shrink-0 text-brand" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                {ar ? "شارة إتمام موثّقة" : "Verified completion badge"}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-foreground" dir="ltr">{credential.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {ar ? "Claude Academy · منصة التعلّم من Anthropic" : "Claude Academy · Anthropic’s learning platform"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {ar ? "أسد الله شفيق · صدرت في 18 سبتمبر 2026" : "Asadullah Shafique · Issued September 18, 2026"}
              </p>
              <a
                href={`https://academy.claude.com/verify/${credential.verifyCode}`}
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
      ))}
    </div>
  );
}
