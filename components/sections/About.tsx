"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/lib/portfolio-data";
import { ScrambleHeading } from "@/components/ScrambleHeading";
import { ArrowUpRight } from "lucide-react";

export function About() {
  const { hero } = portfolioData;

  return (
    <div className="py-24 sm:py-36 px-6 sm:px-12 lg:px-20 border-b border-black/10">
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-6">
          <div className="font-mono text-xs uppercase tracking-widest text-black/70">
            <ScrambleHeading text="[ 01 // ABOUT ]" as="span" />
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-black/70">
            Engineering Philosophy • Kolhapur, India
          </div>
        </div>

        <div className="space-y-10 max-w-6xl">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.08] text-black font-normal tracking-tight"
          >
            &ldquo;Bridging software with embedded hardware to solve practical challenges.&rdquo;
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif italic text-2xl sm:text-4xl text-black/80 font-normal leading-snug"
          >
            Tested under pressure across national hackathons, building low-latency backend systems and connected hardware.
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-black/10">
          <div className="lg:col-span-8">
            <div className="font-mono text-xs uppercase tracking-widest text-black/70 mb-4">
              [ Summary // Verbatim ]
            </div>
            <p className="font-sans text-lg sm:text-xl lg:text-2xl text-black/90 font-light leading-relaxed">
              {hero.summary}
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between gap-6 border-l border-black/10 lg:pl-10">
            <div className="space-y-4 font-mono text-xs uppercase tracking-wider text-black/80">
              <div className="pb-3 border-b border-black/10 flex justify-between">
                <span className="text-black/60">Role</span>
                <span className="font-semibold text-black">{hero.headline}</span>
              </div>
              <div className="pb-3 border-b border-black/10 flex justify-between">
                <span className="text-black/60">Location</span>
                <span className="font-semibold text-black">{hero.location}</span>
              </div>
              <div className="pb-3 border-b border-black/10 flex justify-between">
                <span className="text-black/60">Degree</span>
                <span className="font-semibold text-black">B.Tech CSE &apos;27</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Core Stack</span>
                <span className="font-semibold text-black">C++ / Go / Python / IoT</span>
              </div>
            </div>

            <a
              href="#projects"
              className="inline-flex items-center justify-between px-6 py-4 rounded-full bg-black text-white font-mono text-xs uppercase tracking-widest font-semibold hover:bg-black/80 transition-all focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
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
