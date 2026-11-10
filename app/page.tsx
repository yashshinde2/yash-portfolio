"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { GiantSkillsMarquee } from "@/components/sections/GiantSkillsMarquee";
import { Projects } from "@/components/sections/Projects";
import { Hackathons } from "@/components/sections/Hackathons";
import { Contact } from "@/components/sections/Contact";
import { CommandPalette } from "@/components/CommandPalette";
import { Footer } from "@/components/Footer";
import { DecodeText } from "@/components/decode-text";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const isMobile = window.matchMedia("(max-width: 1023.98px)").matches;
    if (!isMobile) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    const onHash = () => setMobileMenuOpen(false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
    };
  }, []);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Hackathons", href: "#hackathons" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/10 max-lg:pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 max-lg:px-5 max-lg:py-3.5">
          <div className="flex justify-between items-center">
            <a href="#" className="flex items-center gap-3 group max-lg:min-h-[44px]">
              <span className="font-mono text-sm font-bold tracking-widest uppercase text-white group-hover:text-white/80 transition-colors">
                YSS
              </span>
              <span className="hidden sm:inline-block font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border border-white/20 text-white/50">
                Portfolio 2026
              </span>
            </a>

            <ul className="hidden lg:flex items-center gap-6 lg:gap-8 font-mono text-xs uppercase tracking-widest text-white/60">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors duration-200 py-1 link-hover"
                  >
                    <DecodeText text={link.label} on="hover" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/Yash_Shinde.pdf"
                  download="Yash_Shinde_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white transition-colors duration-200"
                >
                  <DecodeText text="Resume" on="hover" />
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCommandPaletteOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/20 hover:border-white text-white/70 hover:text-white font-mono text-[11px] transition-colors"
                  aria-label="Open command palette"
                >
                  <span className="text-[10px] text-white/40">⌘K</span>
                  <span>Ctrl K</span>
                </button>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-overlay"
              aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
              className="hidden max-lg:flex p-2 min-w-[44px] min-h-[44px] items-center justify-center text-white/80 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-overlay"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-black flex flex-col justify-between px-6 pt-[calc(max(1rem,env(safe-area-inset-top)))] pb-[calc(max(2rem,env(safe-area-inset-bottom)))] lg:hidden"
          >
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 min-h-[44px]"
              >
                <span className="font-mono text-base font-bold tracking-widest uppercase text-white">
                  YSS
                </span>
                <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border border-white/20 text-white/50">
                  Index 2026
                </span>
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/80 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-5 my-auto py-8">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * idx, duration: 0.3 }}
                  className="font-sans text-3xl font-black uppercase tracking-tight text-white/80 hover:text-white transition-colors min-h-[44px] flex items-center justify-between border-b border-white/5 pb-3"
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-xs text-white/40 tracking-widest">
                    0{idx + 1}
                  </span>
                </motion.a>
              ))}

              <motion.a
                href="/Yash_Shinde.pdf"
                download="Yash_Shinde_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.32, duration: 0.3 }}
                className="font-sans text-3xl font-black uppercase tracking-tight text-white hover:text-white/80 transition-colors min-h-[44px] flex items-center justify-between border-b border-white/5 pb-3"
              >
                <span>Resume</span>
                <ArrowUpRight className="w-6 h-6 text-white/60" />
              </motion.a>
            </nav>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 font-mono text-[11px] uppercase tracking-widest text-white/50">
              <span>Kolhapur, India</span>
              <span>Available 2026</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Hero />
      <About />
      <GiantSkillsMarquee />
      <Projects />
      <Hackathons />
      <Contact />
      <Footer />

      <CommandPalette
        open={commandPaletteOpen}
        setOpen={setCommandPaletteOpen}
      />
    </main>
  );
}
