"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { portfolioData } from "@/lib/portfolio-data";
import { Mail, MapPin, Send } from "lucide-react";

export function Contact() {
  const { contact } = portfolioData;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[v0] Form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl opacity-20"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-4 font-sans"
        >
          Let&apos;s Connect
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Got an interesting project or collaboration opportunity? I&apos;d love to hear from you. Feel
          free to reach out anytime.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <GlassCard glow glowColor="blue" interactive>
              <div className="flex gap-4">
                <Mail className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-white mb-1 font-sans">Email</h3>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            </GlassCard>

            <GlassCard glow glowColor="green" interactive>
              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-white mb-1 font-sans">Location</h3>
                  <p className="text-gray-400">{contact.location}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassCard glow glowColor="purple" interactive className="h-full">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 disabled:shadow-none"
                >
                  {isSubmitted ? (
                    <>
                      <span>Message sent! 🎉</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
