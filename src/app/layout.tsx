import type { Metadata } from "next";
import "./globals.css";
import { Cairo, Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocaleProvider } from "@/context/LocaleContext";
import { KeyboardShortcutsProvider } from "@/components/KeyboardShortcutsProvider";
import ShortcutsDialog from "@/components/ShortcutsDialog";
import ScrollProgress from "@/components/ScrollProgress";
import BootSequence from "@/components/BootSequence";
import { BASE_URL, PERSON_ID } from "@/lib/seo";

// Body/UI: Inter stays for small-size readability.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Display: Space Grotesk carries the headlines. Pairing a display face with
// Inter avoids the "Inter everywhere" flatness while adding zero risk.
const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
    variable: "--font-display",
});
const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});
// Arabic. Declared at the ROOT, not on /ar, because <Navbar />, ShortcutsDialog
// and BootSequence render here as siblings of <main> — a font variable scoped
// to the /ar wrapper never reaches them, so Arabic nav labels fell back to
// Inter while the body rendered in Cairo.
//
// `preload: false` is the whole trick: Next still self-hosts the font and emits
// the @font-face rule, but adds no <link rel="preload">, so English visitors
// never fetch it. It replaces a render-blocking @import in globals.css that
// pulled six Arabic font files from two third-party origins for everyone.
//
// Latin is in the subset so mixed strings ("OpenAI Agents SDK", "Kubernetes")
// stay in one family instead of falling back mid-sentence.
const cairo = Cairo({
    subsets: ["arabic", "latin"],
    variable: "--font-arabic",
    display: "swap",
    preload: false,
});

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: "Asadullah Shafique | Agentic AI Developer",
    // Names the substrate, not the aspiration. Every claim here is one the
    // repo can demonstrate on request: the Agents SDK orchestrator lives in
    // backend/orchestration/, the MCP server is mounted at /mcp/server, and
    // the constitution in backend/constitution/ is enforced as SDK guardrails.
    description:
          "Asadullah Shafique — Agentic AI engineer. Production multi-agent systems on the OpenAI Agents SDK, real MCP servers, and Constitutional AI guardrails. Pakistan · UAE.",
    keywords: [
          "Asadullah Shafique",
          "Agentic AI",
          "Next.js Developer",
          "Full Stack",
          "TypeScript",
          "Python",
          "FastAPI",
          "MCP",
          "AI Agents",
        ],
    authors: [{ name: "Asadullah Shafique" }],
    // NOTE: `alternates` is deliberately NOT here. Metadata inherits into every
    // segment, and no other route overrides it, so a canonical/hreflang block
    // at this level is claimed by all ~14 routes. Putting `languages` here made
    // /resume, /videos, /login and the rest each advertise an Arabic twin at
    // /ar that /ar does not reciprocate — Search Console reports that as
    // "no return tag" and discards the annotation. It lives on the page that
    // actually has a translation: see src/app/page.tsx and src/app/ar/page.tsx.
    robots: { index: true, follow: true },
    icons: {
          icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
          shortcut: "/favicon.svg",
    },
    openGraph: {
          title: "Asadullah Shafique | Agentic AI Developer",
          description:
                  "Production multi-agent systems — OpenAI Agents SDK, real MCP servers, Constitutional AI guardrails. Spec-first delivery across six consecutive hackathons.",
          type: "website",
          url: BASE_URL,
          siteName: "Asadullah Shafique Portfolio",
          locale: "en_US",
          alternateLocale: ["ar_AR"],
    },
    twitter: {
          card: "summary_large_image",
          title: "Asadullah Shafique | Agentic AI Developer",
          description:
                  "Production multi-agent systems — OpenAI Agents SDK, real MCP servers, Constitutional AI guardrails. Spec-first delivery across six consecutive hackathons.",
    },
};

/**
 * The entity definition Google and the AI answer engines read to decide what
 * this person is "known for". Two rules govern what may go in here.
 *
 * 1. `sameAs` lists ONLY profiles this site already links somewhere else
 *    (About, Footer, Testimonials, resume). sameAs exists for entity
 *    consolidation; an unreachable or invented profile weakens the graph
 *    rather than strengthening it, and would be a new claim besides.
 * 2. `knowsAbout` is phrased as what people actually search for, not as a
 *    dependency list. Every entry must be demonstrable in this repo per
 *    CLAUDE.md §0 — the constitution is in backend/constitution/, the real
 *    MCP server at /mcp/server, the SDK orchestrator in backend/orchestration/,
 *    and the bilingual/RTL system is the /ar route.
 *
 * Two properties below were added at the owner's explicit direction after the
 * trade-offs were raised. Recorded here so the decision is not silently
 * re-litigated:
 *   - `worksFor` names a business unrelated to the agentic-AI positioning.
 *     It is true, and truth is the higher bar; it does broaden the entity.
 *   - `knowsLanguage` asserts the PERSON reads these, which is a separate
 *     claim from the site shipping an Arabic locale. Owner-confirmed.
 *
 * `aggregateRating` was requested and is deliberately NOT here, on facts
 * rather than taste. src/components/Testimonials.tsx holds THREE testimonials,
 * not two, and its `Testimonial` type is {name, role, text, context} — there
 * is no rating field anywhere in the data, so a "5" is sourced from nothing
 * and a reviewCount of "2" is simply wrong. One of the three is also explicit
 * pre-delivery feedback on a concept, not a review of delivered work. Add
 * this block only once real, rated reviews exist to count — and note that
 * even then, self-hosted reviews about this site's owner are ineligible for
 * Google review rich results and unsupported on Person.
 *
 * `alternateName` here coexists with `alternateName: "أسد الله شافق"` on the
 * same @id in src/app/ar/layout.tsx. Multiple alternateName values are valid
 * schema.org, so these merge rather than conflict.
 *
 * NOTE: `jobTitle` is "Agentic AI & Automation Engineer" while the openGraph
 * and twitter titles above still say "Agentic AI Developer". Entity search
 * rewards ONE identity string everywhere, so these want to be reconciled in
 * a single pass across metadata, LinkedIn, GitHub and Medium — not drifted
 * one file at a time.
 */
const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Asadullah Shafique",
    alternateName: "Asadullah Shafique — Agentic AI & Automation Engineer",
    url: BASE_URL,
    image: `${BASE_URL}/opengraph-image`,
    jobTitle: "Agentic AI & Automation Engineer",
    description:
          "Agentic AI engineer building production multi-agent systems with the OpenAI Agents SDK, real MCP servers, and Constitutional AI guardrails, for clients in Western markets and the Gulf.",
    sameAs: [
          "https://github.com/asadullah48",
          "https://www.linkedin.com/in/asadullah-shafique-a00679325/",
          "https://x.com/texcotembroide1",
          "https://medium.com/@texcotembroiderysourcinghouse",
          "https://facebook.com/asadullahshafique",
          "https://instagram.com/shafiqueasadullah",
        ],
    knowsAbout: [
          "Agentic AI Development",
          "AI Agent Automation",
          "Multi-Agent Orchestration",
          "Model Context Protocol (MCP)",
          "OpenAI Agents SDK",
          "LangGraph",
          "LangChain",
          "Constitutional AI",
          "AI Guardrails",
          "Cloud-Native AI Deployment",
          "Kubernetes",
          "FastAPI",
          "Next.js",
          "TypeScript",
          "Python",
          "Bilingual & RTL AI Systems",
        ],
    areaServed: [
          "United States",
          "United Kingdom",
          "European Union",
          "United Arab Emirates",
          "Saudi Arabia",
          "Pakistan",
        ],
    worksFor: {
          "@type": "Organization",
          name: "Texcot Embroidery Sourcing House",
        },
    knowsLanguage: ["en", "ar", "ur"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
          <html lang="en" suppressHydrationWarning className="scroll-smooth">
                <body
                          className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${cairo.variable} font-sans antialiased`}
                          suppressHydrationWarning
                        >
                        <ThemeProvider
                                    attribute="class"
                                    defaultTheme="dark"
                                    enableSystem
                                    disableTransitionOnChange
                        >
                        <script
                                    type="application/ld+json"
                                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
                        />
                              <LocaleProvider><KeyboardShortcutsProvider>
                                    <a
                                          href="#main-content"
                                          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-toast focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:font-medium"
                                    >
                                          Skip to content
                                    </a>
                                    <ScrollProgress />
                                    <Navbar />
                                    <main id="main-content">{children}</main>
                                    <ShortcutsDialog />
                                    {/* Site-wide film grain. Fixed + pointer-events-none, so it
                                        never intercepts clicks; breaks up gradient banding on
                                        large carbon surfaces. */}
                                    <div className="grain-overlay" aria-hidden="true" />
                                    {/* One-shot "system coming online" overlay. Last in the
                                        tree and z-boot (80) so it paints above the grain
                                        (z-1) and every other layer. Self-gates on
                                        sessionStorage and prefers-reduced-motion, so on
                                        most renders it returns null. */}
                                    <BootSequence />
                              </KeyboardShortcutsProvider></LocaleProvider>
                        </ThemeProvider>
                  </body>
          </html>
    );
}


