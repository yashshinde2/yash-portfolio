"use client";

import { Hero } from "@/components/sections/Hero";
import { SkillsMarquee } from "@/components/sections/SkillsMarquee";
import { Projects } from "@/components/sections/Projects";
import { Hackathons } from "@/components/sections/Hackathons";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Navigation bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-zinc-950/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white font-sans">YSS</h1>
            <ul className="hidden md:flex gap-8 text-gray-300">
              <li>
                <a
                  href="#projects"
                  className="hover:text-blue-400 transition-colors font-sans"
                >
                  Projects
                </a>
              </li>
              <li>
                <a href="#hackathons" className="hover:text-blue-400 transition-colors font-sans">
                  Hackathons
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-400 transition-colors font-sans">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <Hero />

      {/* Skills marquee */}
      <SkillsMarquee />

      {/* Projects gallery */}
      <section id="projects">
        <Projects />
      </section>

      {/* Hackathons timeline */}
      <section id="hackathons">
        <Hackathons />
      </section>

      {/* Contact section */}
      <section id="contact">
        <Contact />
      </section>


    </main>
  );
}
