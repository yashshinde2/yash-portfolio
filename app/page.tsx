"use client";

import { useState } from "react";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { GiantSkillsMarquee } from "@/components/sections/GiantSkillsMarquee";
import { Projects } from "@/components/sections/Projects";
import { Hackathons } from "@/components/sections/Hackathons";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

            <ul className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-white/60">
              <li>
                <a
                  href="#about"
                  className="hover:text-white transition-colors duration-200 py-1"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="hover:text-white transition-colors duration-200 py-1"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#hackathons"
                  className="hover:text-white transition-colors duration-200 py-1"
                >
                  Hackathons
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors duration-200 py-1"
                >
                  Contact
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
                  Resume
                </a>
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
              About
            </a>
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-mono text-sm uppercase tracking-widest text-white/70 hover:text-white py-2"
            >
              Projects
            </a>
            <a
              href="#hackathons"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-mono text-sm uppercase tracking-widest text-white/70 hover:text-white py-2"
            >
              Hackathons
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-mono text-sm uppercase tracking-widest text-white/70 hover:text-white py-2"
            >
              Contact
            </a>
            <a
              href="/Yash_Shinde.pdf"
              download="Yash_Shinde_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-mono text-sm uppercase tracking-widest text-white hover:text-white py-2"
            >
              Download Resume ↗
            </a>
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

      <section id="hackathons">
        <Hackathons />
      </section>

      <section id="contact">
        <Contact />
      </section>

      <Footer />
    </main>
  );
}
