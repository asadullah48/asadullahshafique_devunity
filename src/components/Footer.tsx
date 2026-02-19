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
                                                            Agentic AI Developer building the future with intelligent systems,
                                                            full-stack applications, and open source contributions.
                                              </p>
                                              <div className="flex space-x-4">
                                                            <Link
                                                                              href="https://github.com/asadullah48"
                                                                              target="_blank"
                                                                              className="text-zinc-400 hover:text-[#9CE630] transition-colors"
                                                                            >
                                                                            <Github className="h-5 w-5" />
                                                            </Link>
                                                            <Link
                                                                              href="https://linkedin.com/in/asadullahshafique"
                                                                              target="_blank"
                                                                              className="text-zinc-400 hover:text-[#9CE630] transition-colors"
                                                                            >
                                                                            <Linkedin className="h-5 w-5" />
                                                            </Link>
                                                            <Link
                                                                              href="https://twitter.com/asadullah48"
                                                                              target="_blank"
                                                                              className="text-zinc-400 hover:text-[#9CE630] transition-colors"
                                                                            >
                                                                            <Twitter className="h-5 w-5" />
                                                            </Link>
                                                            <Link
                                                                              href="mailto:asadullahshafique@hotmail.com"
                                                                              className="text-zinc-400 hover:text-[#9CE630] transition-colors"
                                                                            >
                                                                            <Mail className="h-5 w-5" />
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
