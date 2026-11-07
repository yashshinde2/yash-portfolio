"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/lib/portfolio-data";
import { GlassCard } from "@/components/GlassCard";
import { ExternalLink, Mail, ArrowRight } from "lucide-react";

export function Hero() {
  const { hero, social } = portfolioData;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Background gradient elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 font-sans tracking-tight">
            {hero.name}
          </h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 font-semibold mb-8">
              {hero.headline}
            </h2>
          </motion.div>
        </motion.div>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-12"
        >
          <GlassCard glow glowColor="blue" interactive>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed text-center font-sans">
              {hero.summary}
            </p>
          </GlassCard>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/50">
            View Projects
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-300">
            Download Resume
          </button>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex justify-center gap-6"
        >
          {social.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
              title={link.name}
            >
              <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors" />
            </a>
          ))}
        </motion.div>

        {/* Location badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex justify-center mt-12"
        >
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            {hero.location}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
