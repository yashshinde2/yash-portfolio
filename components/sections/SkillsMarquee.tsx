"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/lib/portfolio-data";

export function SkillsMarquee() {
  const { skills } = portfolioData;
  const duplicatedSkills = [...skills, ...skills];

  return (
    <section className="relative py-20 overflow-hidden bg-zinc-950/50">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-16 font-sans">
          Tech Stack & Skills
        </h2>

        <div className="relative overflow-hidden">
          {/* Gradient fade effect on sides */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-zinc-950 to-transparent z-20"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-zinc-950 to-transparent z-20"></div>

          {/* Marquee container */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: -1920 }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-8 whitespace-nowrap"
          >
            {duplicatedSkills.map((skill, index) => (
              <motion.div
                key={`${skill}-${index}`}
                className="relative px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:bg-white/10"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
                }}
              >
                <span className="text-base sm:text-lg font-medium text-gray-300 font-sans">
                  {skill}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
