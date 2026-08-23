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
    description:
          "Portfolio of Asadullah Shafique - Agentic AI Developer, Full-Stack Engineer, and Open Source Contributor. Building the future with AI.",
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
                  "Building the future with Agentic AI, Full-Stack Development, and Open Source.",
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
                  "Building the future with Agentic AI, Full-Stack Development, and Open Source.",
    },
};

const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Asadullah Shafique",
    url: BASE_URL,
    jobTitle: "Agentic AI Developer",
    sameAs: ["https://github.com/asadullah48"],
    knowsAbout: [
          "Agentic AI",
          "Next.js",
          "TypeScript",
          "Python",
          "FastAPI",
          "MCP",
          "LangChain",
          "Docker",
          "Kubernetes",
        ],
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


