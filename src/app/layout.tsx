import type { Metadata } from "next";
import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocaleProvider } from "@/context/LocaleContext";
import { KeyboardShortcutsProvider } from "@/components/KeyboardShortcutsProvider";
import ShortcutsDialog from "@/components/ShortcutsDialog";
import ScrollProgress from "@/components/ScrollProgress";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

const BASE_URL = "https://asadullahshafique-devunity.vercel.app";

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
    alternates: { canonical: "/" },
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
                          className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
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
                                          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[#9CE630] focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:font-medium"
                                    >
                                          Skip to content
                                    </a>
                                    <ScrollProgress />
                                    <Navbar />
                                    <main id="main-content">{children}</main>
                                    <ShortcutsDialog />
                              </KeyboardShortcutsProvider></LocaleProvider>
                        </ThemeProvider>
                  </body>
          </html>
    );
}


