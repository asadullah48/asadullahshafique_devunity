/**
 * Completed courses and certificates — the single list behind the
 * #certifications section and the `hasCredential` entries in the Person
 * JSON-LD (src/app/layout.tsx).
 *
 * TO ADD A NEW CERTIFICATE: append one object below. Nothing else changes —
 * the section heading count, the grid and the structured data all derive
 * from this array.
 *
 * Rules (CLAUDE.md §0, the Reality Rule):
 *  - Every entry must link to something a stranger can open: the issuer's
 *    verification page (`verifyUrl`) or the certificate file committed under
 *    public/certificates (`certificateUrl`).
 *  - `issued: false` means the course is completed but the issuer has not yet
 *    issued a dated badge. The card then omits the date rather than inventing
 *    one, and the entry is left out of `hasCredential`.
 *  - Dates are ISO (YYYY-MM-DD) so they sort and serialise unambiguously.
 */

export type Credential = {
  title: string;
  issuer: string;
  /** Learning platform or programme, shown under the title. */
  programme: { en: string; ar: string };
  kind: "certificate" | "badge";
  /** ISO date the credential was issued/completed. Omit when not issued. */
  date?: string;
  issued?: boolean;
  verifyUrl?: string;
  certificateUrl?: string;
};

const CLAUDE_ACADEMY = {
  en: "Claude Academy · Anthropic’s learning platform",
  ar: "Claude Academy · منصة التعلّم من Anthropic",
};

const academy = (title: string, code: string, issued = true): Credential => ({
  title,
  issuer: "Anthropic",
  programme: CLAUDE_ACADEMY,
  kind: "badge",
  ...(issued ? { date: "2026-09-18" } : { issued: false }),
  verifyUrl: `https://academy.claude.com/verify/${code}`,
});

export const CREDENTIALS: Credential[] = [
  {
    title: "Agent Foundations",
    issuer: "Cognizant",
    programme: { en: "Agent Academy · Cognizant AI Lab", ar: "Agent Academy · Cognizant AI Lab" },
    kind: "certificate",
    date: "2026-09-30",
    certificateUrl: "/certificates/agent-foundations-asadullah-shafique.png",
  },
  academy("AI Fluency: Framework and foundations", "20a54be8bbdcfa54f1ffee06f6c45082"),
  academy("Introduction to Claude Cowork", "e14c137e39659a99fb79e7afc1394c09"),
  academy("Claude Code 101", "64b43e3f91ee11516e562d2c35801e3a"),
  academy("AI Fluency for builders", "2cfb8dd802a841177aba39028ef6cf4e"),
  academy("AI capabilities and limitations", "e5f7a0e1a35e7d3e6626241402d556be"),
  academy("Claude 101", "6d808a4f90c00a98b326959280f5c280"),
  academy("Claude Code in action", "f8192381a00c3d85b011b7cd94673286", false),
  academy("Introduction to Model Context Protocol", "881db997d7957558e2d108c9ab9d174e", false),
];

/** schema.org EducationalOccupationalCredential entries for issued credentials. */
export function credentialJsonLd(baseUrl: string) {
  return CREDENTIALS.filter((c) => c.issued !== false && c.date).map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: c.title,
    credentialCategory: c.kind === "certificate" ? "certificate" : "badge",
    dateCreated: c.date,
    recognizedBy: { "@type": "Organization", name: c.issuer },
    url: c.verifyUrl ?? `${baseUrl}${c.certificateUrl}`,
  }));
}
