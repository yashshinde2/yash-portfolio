"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { portfolioData } from "@/lib/portfolio-data";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import { ScrambleHeading } from "@/components/ScrambleHeading";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function Contact() {
  const { contact } = portfolioData;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [displayEmail, setDisplayEmail] = useState(contact.email);
  const isScramblingRef = useRef(false);

  const handleEmailHover = () => {
    if (
      isScramblingRef.current ||
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      return;
    }

    isScramblingRef.current = true;
    const original = contact.email;
    const chars = "!<>-_\\/[]{}—=+*^?#01";
    let frame = 0;
    let animId: number;

    const animate = () => {
      let complete = 0;
      let next = "";
      for (let i = 0; i < original.length; i++) {
        if (original[i] === "@" || original[i] === ".") {
          next += original[i];
          complete++;
          continue;
        }
        const progress = frame - i * 1.5;
        if (progress >= 8) {
          next += original[i];
          complete++;
        } else if (progress >= 0) {
          next += chars[Math.floor(Math.random() * chars.length)];
        } else {
          next += original[i];
        }
      }
      setDisplayEmail(next);
      frame++;
      if (complete < original.length) {
        animId = requestAnimationFrame(animate);
      } else {
        isScramblingRef.current = false;
      }
    };

    animId = requestAnimationFrame(animate);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2400);
    } catch {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2400);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    if (serverError) setServerError(null);
  };

  const validate = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "[ ERR // Name is required ]";
    }

    if (!formData.email.trim()) {
      newErrors.email = "[ ERR // Email is required ]";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "[ ERR // Valid email required ]";
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = "[ ERR // Message cannot be empty ]";
    } else if (formData.message.trim().length < 5) {
      newErrors.message = "[ ERR // Message too short ]";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Failed to deliver message.");
      } else {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setIsSubmitted(false), 6000);
      }
    } catch {
      setServerError("Network error. Please try again or email directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-24 sm:py-36 px-6 sm:px-12 lg:px-20 border-b border-white/10 bg-black text-white relative">
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-white/70 mb-4">
            <ScrambleHeading text="[ 05 // CONTACT ]" as="span" />
          </div>

          <div className="space-y-4">
            <h2 className="font-sans font-black text-6xl sm:text-8xl md:text-9xl lg:text-[11vw] tracking-tighter uppercase leading-[0.88] text-white">
              LET&apos;S BUILD
            </h2>
            <div className="font-serif italic text-2xl sm:text-4xl text-white/80 font-normal">
              High-performance systems, low-latency protocols, and hardware integrations.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-8 border-t border-white/10">
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-white/70">
                  Email // Click to Copy
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-white/20 text-white/70">
                  Interactive
                </span>
              </div>

              <button
                type="button"
                onClick={copyEmail}
                onMouseEnter={handleEmailHover}
                className="w-full text-left group flex items-center justify-between gap-3 p-3 -mx-3 rounded-xl hover:bg-white/5 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                aria-label={`Copy email address ${contact.email}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Mail className="w-5 h-5 text-white/50 group-hover:text-white transition-colors flex-shrink-0" />
                  <span className="font-mono text-sm sm:text-base text-white font-semibold tracking-tight truncate">
                    {displayEmail}
                  </span>
                </div>
                <Copy className="w-4 h-4 text-white/50 group-hover:text-white transition-colors flex-shrink-0" />
              </button>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-white/70 mb-1">
                    Location
                  </div>
                  <p className="text-white font-mono text-sm font-semibold">
                    {contact.location}
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://linkedin.com/in/yashshinde2"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04] transition-all group focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white group-hover:border-white/40 transition-colors flex-shrink-0">
                    <LinkedinIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono text-xs uppercase tracking-widest text-white/70 mb-0.5">
                      LinkedIn Profile
                    </div>
                    <p className="text-white font-mono text-sm font-semibold">
                      in/yashshinde2
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
              </div>
            </a>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-2xl border border-white/10 bg-white/[0.02]">
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-mono text-xs uppercase tracking-wider text-white/80 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={`w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border text-white placeholder:text-white/40 font-sans text-sm focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none transition-colors ${
                      errors.name ? "border-white/50" : "border-white/15"
                    }`}
                  />
                  {errors.name && (
                    <span className="block mt-1 font-mono text-xs text-white/60">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-xs uppercase tracking-wider text-white/80 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border text-white placeholder:text-white/40 font-sans text-sm focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none transition-colors ${
                      errors.email ? "border-white/50" : "border-white/15"
                    }`}
                  />
                  {errors.email && (
                    <span className="block mt-1 font-mono text-xs text-white/60">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block font-mono text-xs uppercase tracking-wider text-white/80 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project or architecture requirements..."
                    rows={4}
                    className={`w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border text-white placeholder:text-white/40 font-sans text-sm focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none transition-colors resize-none ${
                      errors.message ? "border-white/50" : "border-white/15"
                    }`}
                  />
                  {errors.message && (
                    <span className="block mt-1 font-mono text-xs text-white/60">
                      {errors.message}
                    </span>
                  )}
                </div>

                {serverError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-white/20 bg-white/5 font-mono text-xs text-white/80">
                    <AlertCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="w-full px-6 py-4 rounded-xl bg-white text-black hover:bg-white/90 disabled:bg-white/50 font-mono text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting...</span>
                    </span>
                  ) : isSubmitted ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Message Dispatched Successfully</span>
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-black text-white border border-white/30 shadow-2xl font-mono text-xs uppercase tracking-widest"
          >
            <Check className="w-3.5 h-3.5 text-white" />
            <span>Email copied to clipboard</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
