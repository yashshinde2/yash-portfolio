"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/lib/portfolio-data";

export function SkillsMarquee() {
  const { skills } = portfolioData;
  const marqueeItems = [...skills, ...skills, ...skills];

  return (
    <section className="relative py-14 overflow-hidden border-b border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-8 flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-widest text-white/40">
          [ 02 // Tech Stack & Skills ]
        </h2>
        <span className="font-mono text-xs uppercase tracking-widest text-white/20 hidden sm:inline">
          Continuous Integration • Hardware & Software
        </span>
      </div>

      <div className="relative overflow-hidden w-full">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-black to-transparent z-10" />

        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-33.333%" }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-4 sm:gap-6 whitespace-nowrap w-max"
        >
          {marqueeItems.map((skill, index) => (
            <div
              key={`${skill}-${index}`}
              className="flex items-center gap-4 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.06] transition-all duration-200"
            >
              <span className="font-mono text-xs tracking-wider uppercase text-white/80">
                {skill}
              </span>
              <span className="text-[10px] text-white/20 font-mono">✦</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
