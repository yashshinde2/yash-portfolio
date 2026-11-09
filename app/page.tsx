"use client";

import { useState } from "react";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { GiantSkillsMarquee } from "@/components/sections/GiantSkillsMarquee";
import { Projects } from "@/components/sections/Projects";
import { MemoryDump } from "@/components/sections/MemoryDump";
import { Hackathons } from "@/components/sections/Hackathons";
import { Contact } from "@/components/sections/Contact";
import { CommandPalette } from "@/components/CommandPalette";
import { Footer } from "@/components/Footer";
import { DecodeText } from "@/components/decode-text";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4">
          <div className="flex justify-between items-center">
            <a href="#" className="flex items-center gap-3 group">
              <span className="font-mono text-sm font-bold tracking-widest uppercase text-white group-hover:text-white/80 transition-colors">
                YSS
              </span>
              <span className="hidden sm:inline-block font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border border-white/20 text-white/50">
                Portfolio 2026
              </span>
            </a>

            <ul className="hidden md:flex items-center gap-6 lg:gap-8 font-mono text-xs uppercase tracking-widest text-white/60">
              <li>
                <a
                  href="#about"
                  className="hover:text-white transition-colors duration-200 py-1 link-hover"
                >
                  <DecodeText text="About" on="hover" />
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="hover:text-white transition-colors duration-200 py-1 link-hover"
                >
                  <DecodeText text="Projects" on="hover" />
                </a>
              </li>
              <li>
                <a
                  href="#memory-dump"
                  className="hover:text-white transition-colors duration-200 py-1 link-hover"
                >
                  <DecodeText text="Memory" on="hover" />
                </a>
              </li>
              <li>
                <a
                  href="#hackathons"
                  className="hover:text-white transition-colors duration-200 py-1 link-hover"
                >
                  <DecodeText text="Hackathons" on="hover" />
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors duration-200 py-1 link-hover"
                >
                  <DecodeText text="Contact" on="hover" />
                </a>
              </li>
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
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/95 px-6 py-6 space-y-4">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-mono text-sm uppercase tracking-widest text-white/70 hover:text-white py-2"
            >
              <DecodeText text="About" on="hover" />
            </a>
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-mono text-sm uppercase tracking-widest text-white/70 hover:text-white py-2"
            >
              <DecodeText text="Projects" on="hover" />
            </a>
            <a
              href="#memory-dump"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-mono text-sm uppercase tracking-widest text-white/70 hover:text-white py-2"
            >
              <DecodeText text="Memory Dump" on="hover" />
            </a>
            <a
              href="#hackathons"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-mono text-sm uppercase tracking-widest text-white/70 hover:text-white py-2"
            >
              <DecodeText text="Hackathons" on="hover" />
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-mono text-sm uppercase tracking-widest text-white/70 hover:text-white py-2"
            >
              <DecodeText text="Contact" on="hover" />
            </a>
            <a
              href="/Yash_Shinde.pdf"
              download="Yash_Shinde_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-mono text-sm uppercase tracking-widest text-white hover:text-white py-2"
            >
              <DecodeText text="Download Resume ↗" on="hover" />
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setCommandPaletteOpen(true);
              }}
              className="w-full text-left font-mono text-sm uppercase tracking-widest text-white/70 hover:text-white py-2 flex items-center justify-between"
            >
              <span>Command Palette</span>
              <span className="text-xs px-2 py-0.5 rounded border border-white/20 text-white/60">
                Ctrl K
              </span>
            </button>
          </div>
        )}
      </nav>

      <section id="hero">
        <Hero />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="skills">
        <GiantSkillsMarquee />
      </section>

      <section id="projects">
        <Projects />
      </section>

      <section id="memory-dump">
        <MemoryDump />
      </section>

      <section id="hackathons">
        <Hackathons />
      </section>

      <section id="contact">
        <Contact />
      </section>

      <Footer />

      <CommandPalette
        open={commandPaletteOpen}
        setOpen={setCommandPaletteOpen}
      />
    </main>
  );
}
