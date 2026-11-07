"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/lib/portfolio-data";
import { ScrambleHeading } from "@/components/ScrambleHeading";
import { ArrowUpRight } from "lucide-react";

export function About() {
  const { hero } = portfolioData;

  const specs = [
    { label: "Role", value: hero.headline },
    { label: "Location", value: hero.location },
    { label: "Degree", value: "B.Tech CSE '27" },
    { label: "Core Stack", value: "C++, Java, Go, Node.js, Python" },
  ];

  return (
    <div className="py-24 sm:py-36 px-6 sm:px-12 lg:px-20 border-b border-white/10 bg-black text-white">
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="font-mono text-xs uppercase tracking-widest text-white/70">
            <ScrambleHeading text="[ 01 // ABOUT ]" as="span" />
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-white/70">
            Engineering Philosophy • Kolhapur, India
          </div>
        </div>

        <div className="space-y-10 max-w-6xl">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.08] text-white font-normal tracking-tight"
          >
            &ldquo;Bridging software with embedded hardware to solve practical challenges.&rdquo;
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif italic text-2xl sm:text-4xl text-white/80 font-normal leading-snug"
          >
            Tested under pressure across national hackathons, building low-latency backend systems and connected hardware.
          </motion.div>
        </div>

        <div className="pt-8 border-t border-white/10 space-y-8">
          <div className="font-mono text-xs uppercase tracking-widest text-white/40">
            [ Specifications // Background ]
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-white/10 rounded-2xl overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-white/10 bg-white/[0.02]">
            {specs.map((spec) => (
              <div key={spec.label} className="p-6 sm:p-8 space-y-2">
                <div className="font-mono text-xs uppercase tracking-widest text-white/60">
                  {spec.label}
                </div>
                <div className="font-mono text-sm sm:text-base text-white font-semibold">
                  {spec.value}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-white text-black font-mono text-xs uppercase tracking-widest font-semibold hover:bg-white/90 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <span>Explore Projects</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
