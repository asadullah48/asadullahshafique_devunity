import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
          <footer className="border-t border-zinc-800 bg-zinc-950">
                <div className="container mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {/* Brand */}
                                  <div>
                                              <h3 className="text-xl font-bold text-white mb-3">
                                                            Asadullah <span className="text-[#9CE630]">Shafique</span>
                                              </h3>
                                              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                                            Agentic AI Developer, CMT Industry Founder, and Digital Marketing Strategist.
                                                            Building AI-powered systems and real businesses across Pakistan and UAE.
                                              </p>
                                              <div className="flex flex-wrap gap-4">
                                                            <Link
                                                                              href="https://github.com/asadullah48"
                                                                              target="_blank"
                                                                              rel="noopener noreferrer"
                                                                              aria-label="GitHub"
                                                                              className="text-zinc-400 hover:text-[#9CE630] transition-colors"
                                                                            >
                                                                            <Github className="h-5 w-5" />
                                                            </Link>
                                                            <Link
                                                                              href="https://www.linkedin.com/in/asadullah-shafique-a00679325/"
                                                                              target="_blank"
                                                                              rel="noopener noreferrer"
                                                                              aria-label="LinkedIn"
                                                                              className="text-zinc-400 hover:text-[#9CE630] transition-colors"
                                                                            >
                                                                            <Linkedin className="h-5 w-5" />
                                                            </Link>
                                                            <Link
                                                                              href="https://x.com/texcotembroide1"
                                                                              target="_blank"
                                                                              rel="noopener noreferrer"
                                                                              aria-label="Twitter / X"
                                                                              className="text-zinc-400 hover:text-[#9CE630] transition-colors"
                                                                            >
                                                                            <Twitter className="h-5 w-5" />
                                                            </Link>
                                                            <Link
                                                                              href="mailto:asadullahshafique@hotmail.com"
                                                                              aria-label="Email"
                                                                              className="text-zinc-400 hover:text-[#9CE630] transition-colors"
                                                                            >
                                                                            <Mail className="h-5 w-5" />
                                                            </Link>
                                                            {/* Facebook */}
                                                            <Link
                                                                              href="https://facebook.com/asadullahshafique"
                                                                              target="_blank"
                                                                              rel="noopener noreferrer"
                                                                              aria-label="Facebook"
                                                                              className="text-zinc-400 hover:text-[#9CE630] transition-colors"
                                                                            >
                                                                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                                                              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                                                            </svg>
                                                            </Link>
                                                            {/* Instagram */}
                                                            <Link
                                                                              href="https://instagram.com/shafiqueasadullah"
                                                                              target="_blank"
                                                                              rel="noopener noreferrer"
                                                                              aria-label="Instagram"
                                                                              className="text-zinc-400 hover:text-[#9CE630] transition-colors"
                                                                            >
                                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                                                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                                                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                                                            </svg>
                                                            </Link>
                                                            {/* Medium */}
                                                            <Link
                                                                              href="https://medium.com/@texcotembroiderysourcinghouse"
                                                                              target="_blank"
                                                                              rel="noopener noreferrer"
                                                                              aria-label="Medium"
                                                                              className="text-zinc-400 hover:text-[#9CE630] transition-colors"
                                                                            >
                                                                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                                                              <path d="M13 12a5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5zm9.5 0c0 2.5-.7 4.5-1.5 4.5s-1.5-2-1.5-4.5.7-4.5 1.5-4.5 1.5 2 1.5 4.5zm2.5 0c0 2.5-.4 4.5-1 4.5s-1-2-1-4.5.4-4.5 1-4.5 1 2 1 4.5z" />
                                                                            </svg>
                                                            </Link>
                                                            {/* Discord */}
                                                            <Link
                                                                              href="https://discord.gg/kXfEYVGX"
                                                                              target="_blank"
                                                                              rel="noopener noreferrer"
                                                                              aria-label="Discord"
                                                                              className="text-zinc-400 hover:text-[#9CE630] transition-colors"
                                                                            >
                                                                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                                                              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                                                            </svg>
                                                            </Link>
                                              </div>
                                  </div>

                          {/* Quick Links */}
                                  <div>
                                              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                                              <ul className="space-y-2">
                                                {[
            { name: "About", href: "#about" },
            { name: "Skills", href: "#skills" },
            { name: "Projects", href: "#projects" },
            { name: "Hackathons", href: "#hackathons" },
            { name: "Open Source", href: "#opensource" },
                          ].map((link) => (
                                            <li key={link.name}>
                                                              <Link
                                                                                    href={link.href}
                                                                                    className="text-zinc-400 hover:text-[#9CE630] text-sm transition-colors"
                                                                                  >
                                                                {link.name}
                                                              </Link>
                                            </li>
                                          ))}
                                              </ul>
                                  </div>

                          {/* Contact */}
                                  <div>
                                              <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
                                              <p className="text-zinc-400 text-sm mb-4">
                                                            Open to collaborations, hackathons, and interesting AI projects.
                                              </p>
                                              <Link
                                                              href="mailto:asadullahshafique@hotmail.com"
                                                              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 hover:border-[#9CE630]/30 hover:text-[#9CE630] transition-all"
                                                            >
                                                            <Mail className="w-4 h-4" />
                                                            asadullahshafique@hotmail.com
                                              </Link>
                                  </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-zinc-800 text-center">
                                  <p className="text-sm text-zinc-500">
                                              Built with <Heart className="inline w-3 h-3 text-[#9CE630] mx-1" /> by
                                              Asadullah Shafique &copy; {currentYear}. All rights reserved.
                                  </p>
                        </div>
                </div>
          </footer>
        );
};

export default Footer;
