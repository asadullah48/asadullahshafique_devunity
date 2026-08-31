"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code2, Github, Menu, X, MessageCircle, FileDown, ChevronDown } from "lucide-react";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { useLocale } from "@/context/LocaleContext";

// Only these stay on the top-level bar; everything else folds into the
// "More" dropdown. Keeping the priority list explicit (rather than deriving
// it from page order) keeps the nav's own hierarchy legible on its own.
const PRIMARY_KEYS = ["about", "skills", "projects", "blog", "contact"] as const;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const moreRef = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  // Order mirrors the page's section flow (AI-engineering proof first).
  const navLinks = useMemo(() => [
    { key: "about",        name: t("nav.about"),        href: "#about"        },
    { key: "skills",       name: t("nav.skills"),       href: "#skills"       },
    { key: "agentEng",     name: t("nav.agentEng"),     href: "#agent-engineering" },
    { key: "expertise",    name: t("nav.expertise"),    href: "#expertise"    },
    { key: "leverage",     name: t("nav.leverage"),     href: "#leverage"     },
    { key: "roadmap",      name: t("nav.roadmap"),      href: "#roadmap"      },
    { key: "projects",     name: t("nav.projects"),     href: "#projects"     },
    { key: "hackathons",   name: t("nav.hackathons"),   href: "#hackathons"   },
    { key: "services",     name: t("nav.services"),     href: "#services"     },
    { key: "industries",   name: t("nav.industries"),   href: "#industries"   },
    { key: "blog",         name: t("nav.blog"),         href: "#blog"         },
    { key: "openSource",   name: t("nav.openSource"),   href: "#open-source"  },
    { key: "testimonials", name: t("nav.testimonials"), href: "#testimonials" },
    { key: "contact",      name: t("nav.contact"),      href: "#contact"      },
  ], [t]);

  const primaryLinks = useMemo(
    () => navLinks.filter((l) => (PRIMARY_KEYS as readonly string[]).includes(l.key)),
    [navLinks]
  );
  const moreLinks = useMemo(
    () => navLinks.filter((l) => !(PRIMARY_KEYS as readonly string[]).includes(l.key)),
    [navLinks]
  );
  const isMoreActive = moreLinks.some((l) => l.href === `#${activeId}`);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-spy: highlight whichever section is crossing the middle band of
  // the viewport, including sections folded into "More".
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [navLinks]);

  // Close the "More" dropdown on outside click.
  useEffect(() => {
    if (!isMoreOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMoreOpen]);

  // Rendered server-side (locale is always "en" at SSR, switching after
  // hydration), so the header never pops in late.
  const linkClass = (href: string) =>
    `text-sm transition-colors duration-200 rounded-sm ${
      href === `#${activeId}`
        ? "text-brand font-medium"
        : "text-muted-foreground hover:text-brand"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-nav transition-all duration-300 ease-spring ${
        isScrolled ? "glass-chrome shadow-elevated" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="#home" className="flex items-center space-x-2 group flex-shrink-0">
          <Code2 className="h-7 w-7 text-brand group-hover:rotate-12 transition-transform" />
          <span className="font-display text-base sm:text-lg font-bold text-foreground">
            Asadullah<span className="text-brand">.dev</span>
          </span>
        </Link>

        {/* Desktop Nav — 5 primary links + a "More" dropdown for the rest */}
        <div className="hidden lg:flex items-center space-x-5">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
              aria-current={link.href === `#${activeId}` ? "true" : undefined}
            >
              {link.name}
            </Link>
          ))}

          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setIsMoreOpen((v) => !v)}
              aria-expanded={isMoreOpen}
              className={`flex items-center gap-1 text-sm transition-colors duration-200 ${
                isMoreActive ? "text-brand font-medium" : "text-muted-foreground hover:text-brand"
              }`}
            >
              {t("nav.more")}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreOpen ? "rotate-180" : ""}`}
              />
            </button>
            {/* tailwindcss-animate, already a dependency and already used by
                ui/dialog and ui/tooltip. It animates the OPEN only: a React
                element that unmounts is gone before CSS can run it out, so the
                exit is now instant. Radix primitives get around that with
                data-[state=closed]; this menu is hand-rolled and has no such
                attribute, and adding an exit-state machine to save 150ms on a
                dropdown close is not worth a 33 kB runtime. */}
            {isMoreOpen && (
              <div className="absolute left-0 top-full mt-3 w-48 rounded-panel border border-border bg-popover/95 backdrop-blur-xl shadow-panel py-2 animate-in fade-in-0 slide-in-from-top-1 duration-150">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMoreOpen(false)}
                      aria-current={link.href === `#${activeId}` ? "true" : undefined}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        link.href === `#${activeId}`
                          ? "text-brand"
                          : "text-muted-foreground hover:text-brand hover:bg-white/5"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  {/* External profiles — moved out of the top bar so the
                      right cluster keeps a single primary CTA */}
                  <div className="my-2 border-t border-border" />
                  <Link
                    href="https://discord.gg/kXfEYVGX"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMoreOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-[#5865F2] hover:bg-white/5 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> {t("nav.discord")}
                  </Link>
                  <Link
                    href="https://github.com/asadullah48"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMoreOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-brand hover:bg-white/5 transition-colors"
                  >
                  <Github className="w-4 h-4" /> {t("nav.github")}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right side — one quiet outline (Resume) + one primary CTA */}
        <div className="flex items-center space-x-2">
          <Link href="/resume" className="hidden sm:block">
            <Button
              variant="outline"
              size="sm"
              className="h-9"
            >
              <FileDown className="w-4 h-4 mr-2" />
              {t("nav.resume")}
            </Button>
          </Link>
          {/* The full label is 206px wide. Below `sm` that pushed the locale
              switcher to x=396 and the hamburger to x=463 on a 375px viewport —
              both off-screen, and the bar clips rather than scrolls, so mobile
              navigation was unreachable on every common phone. The CTA keeps
              its slot (it is the conversion path) but wears a short label until
              there is room for the long one. */}
          <Link href="#contact">
            <Button
              variant="neon"
              size="sm"
              className="h-9"
            >
              <span className="sm:hidden">{t("nav.contactMeShort")}</span>
              <span className="hidden sm:inline">{t("nav.contactMe")}</span>
            </Button>
          </Link>
          {/* Moved into the mobile menu below `sm` rather than dropped: the
              site ships a full Arabic translation and targets the UAE, so the
              locale toggle must stay reachable on a phone. */}
          <div className="hidden sm:flex">
            <LocaleSwitcher />
          </div>
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={t("nav.toggleMenu")}
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — full list, all sections reachable regardless of the
          desktop "More" split */}
      {isMobileOpen && (
        <div className="lg:hidden glass-chrome">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                aria-current={link.href === `#${activeId}` ? "true" : undefined}
                className={`block py-2 transition-colors ${
                  link.href === `#${activeId}` ? "text-brand" : "text-muted-foreground hover:text-brand"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="https://discord.gg/kXfEYVGX"
              target="_blank"
              onClick={() => setIsMobileOpen(false)}
              className="block text-muted-foreground hover:text-[#5865F2] py-2 transition-colors"
            >
              {t("nav.discordCommunity")}
            </Link>
            <Link
              href="https://github.com/asadullah48"
              target="_blank"
              onClick={() => setIsMobileOpen(false)}
              className="block text-muted-foreground hover:text-brand py-2 transition-colors"
            >
              {t("nav.github")}
            </Link>
            <Link
              href="/resume"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-2 text-brand py-2 transition-colors font-medium"
            >
              <FileDown className="w-4 h-4" />
              {t("nav.resume")}
            </Link>
            {/* The locale toggle lives here below `sm`, where it is hidden
                from the top bar. Without this, Arabic would be unreachable on
                a phone. */}
            <div className="sm:hidden pt-2 border-t border-border">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
