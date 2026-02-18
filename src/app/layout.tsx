import type { Metadata } from "next";
import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata: Metadata = {
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
        ],
    authors: [{ name: "Asadullah Shafique" }],
    openGraph: {
          title: "Asadullah Shafique | Agentic AI Developer",
          description:
                  "Building the future with Agentic AI, Full-Stack Development, and Open Source.",
          type: "website",
    },
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
                                  <Navbar />
                                  <main>{children}</main>main>
                        </ThemeProvider>ThemeProvider>
                </body>body>
          </html>html>
        );
}</html>
