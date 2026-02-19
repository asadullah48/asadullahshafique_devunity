"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code2, Github, Menu, X, MessageCircle } from "lucide-react";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Hackathons", href: "#hackathons" },
  { name: "Blog", href: "#blog" },
  { name: "Open Source", href: "#opensource" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

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
        <Link href="#home" className="flex items-center space-x-2 group">
          <Code2 className="h-7 w-7 text-[#9CE630] group-hover:rotate-12 transition-transform" />
          <span className="text-lg font-bold text-white">
            Asadullah<span className="text-[#9CE630]">.dev</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-zinc-400 hover:text-[#9CE630] transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          <Link
            href="https://discord.gg/kXfEYVGX"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block"
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-[#5865F2] h-9"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Discord
            </Button>
          </Link>
          <Link
            href="https://github.com/asadullah48"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block"
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-[#9CE630] h-9"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </Link>
          <Link href="#contact">
            <Button
              size="sm"
              className="bg-[#9CE630] text-black hover:bg-[#8BD520] h-9 font-medium"
            >
              Contact Me
            </Button>
          </Link>
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="lg:hidden bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="block text-zinc-400 hover:text-[#9CE630] py-2 transition-colors"
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
              Discord Community
            </Link>
            <Link
              href="https://github.com/asadullah48"
              target="_blank"
              onClick={() => setIsMobileOpen(false)}
              className="block text-zinc-400 hover:text-[#9CE630] py-2 transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
