"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const moreRef = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  const navLinks = useMemo(() => [
    { key: "about",        name: t("nav.about"),        href: "#about"        },
    { key: "services",     name: t("nav.services"),     href: "#services"     },
    { key: "industries",   name: t("nav.industries"),   href: "#industries"   },
    { key: "skills",       name: t("nav.skills"),       href: "#skills"       },
    { key: "agentEng",     name: t("nav.agentEng"),     href: "#agent-engineering" },
    { key: "roadmap",      name: t("nav.roadmap"),      href: "#roadmap"      },
    { key: "projects",     name: t("nav.projects"),     href: "#projects"     },
    { key: "hackathons",   name: t("nav.hackathons"),   href: "#hackathons"   },
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
    setMounted(true);
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

  if (!mounted) return null;

  const linkClass = (href: string) =>
    `text-sm transition-colors duration-200 ${
      href === `#${activeId}`
        ? "text-[#9CE630] font-medium"
        : "text-zinc-400 hover:text-[#9CE630]"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="#home" className="flex items-center space-x-2 group flex-shrink-0">
          <Code2 className="h-7 w-7 text-[#9CE630] group-hover:rotate-12 transition-transform" />
          <span className="text-lg font-bold text-white">
            Asadullah<span className="text-[#9CE630]">.dev</span>
          </span>
        </Link>

        {/* Desktop Nav — 5 primary links + a "More" dropdown for the rest */}
        <div className="hidden lg:flex items-center space-x-5">
          {primaryLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.name}
            </Link>
          ))}

          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setIsMoreOpen((v) => !v)}
              aria-expanded={isMoreOpen}
              className={`flex items-center gap-1 text-sm transition-colors duration-200 ${
                isMoreActive ? "text-[#9CE630] font-medium" : "text-zinc-400 hover:text-[#9CE630]"
              }`}
            >
              {t("nav.more")}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {isMoreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-3 w-48 rounded-lg border border-zinc-800 bg-zinc-950/95 backdrop-blur-md shadow-xl py-2"
                >
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMoreOpen(false)}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        link.href === `#${activeId}`
                          ? "text-[#9CE630]"
                          : "text-zinc-400 hover:text-[#9CE630] hover:bg-white/5"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          <Link
            href="https://discord.gg/kXfEYVGX"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block"
            title={t("nav.discord")}
          >
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-[#5865F2] h-9 w-9">
              <MessageCircle className="w-4 h-4" />
              <span className="sr-only">{t("nav.discord")}</span>
            </Button>
          </Link>
          <Link
            href="https://github.com/asadullah48"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block"
            title={t("nav.github")}
          >
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-[#9CE630] h-9 w-9">
              <Github className="w-4 h-4" />
              <span className="sr-only">{t("nav.github")}</span>
            </Button>
          </Link>
          <Link href="/resume" className="hidden sm:block">
            <Button
              variant="outline"
              size="sm"
              className="border-[#9CE630]/40 text-[#9CE630] hover:bg-[#9CE630]/10 hover:border-[#9CE630] h-9"
            >
              <FileDown className="w-4 h-4 mr-2" />
              {t("nav.resume")}
            </Button>
          </Link>
          <Link href="#contact">
            <Button
              size="sm"
              className="bg-[#9CE630] text-black hover:bg-[#8BD520] h-9 font-medium"
            >
              {t("nav.contactMe")}
            </Button>
          </Link>
          <LocaleSwitcher />
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-zinc-400 hover:text-white"
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
        <div className="lg:hidden bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`block py-2 transition-colors ${
                  link.href === `#${activeId}` ? "text-[#9CE630]" : "text-zinc-400 hover:text-[#9CE630]"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="https://discord.gg/kXfEYVGX"
              target="_blank"
              onClick={() => setIsMobileOpen(false)}
              className="block text-zinc-400 hover:text-[#5865F2] py-2 transition-colors"
            >
              {t("nav.discordCommunity")}
            </Link>
            <Link
              href="https://github.com/asadullah48"
              target="_blank"
              onClick={() => setIsMobileOpen(false)}
              className="block text-zinc-400 hover:text-[#9CE630] py-2 transition-colors"
            >
              {t("nav.github")}
            </Link>
            <Link
              href="/resume"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-2 text-[#9CE630] py-2 transition-colors font-medium"
            >
              <FileDown className="w-4 h-4" />
              {t("nav.resume")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
