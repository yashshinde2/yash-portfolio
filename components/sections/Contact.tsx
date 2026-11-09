"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
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
import { DecodeText } from "@/components/decode-text";

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
  const [emailText, setEmailText] = useState(contact.email);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const titleChars = "LET'S BUILD".split("");
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const currentWeights = useRef<number[]>(titleChars.map(() => 300));
  const targetWeights = useRef<number[]>(titleChars.map(() => 300));
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sendBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      letterRefs.current.forEach((el) => {
        if (el) el.style.fontWeight = "900";
      });
      return;
    }

    let rafId: number;

    const handlePointerMove = (e: PointerEvent) => {
      letterRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (dist < 220) {
          const factor = 1 - dist / 220;
          targetWeights.current[i] = 300 + factor * 600;
        } else {
          targetWeights.current[i] = 300;
        }
      });
    };

    const updateWeights = () => {
      letterRefs.current.forEach((el, i) => {
        if (!el) return;
        currentWeights.current[i] += (targetWeights.current[i] - currentWeights.current[i]) * 0.15;
        el.style.fontWeight = Math.round(currentWeights.current[i]).toString();
      });
      rafId = requestAnimationFrame(updateWeights);
    };

    window.addEventListener("pointermove", handlePointerMove);
    rafId = requestAnimationFrame(updateWeights);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleSendMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const btn = sendBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 14;
    const y = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * 14;
    gsap.to(btn, { x, y, duration: 0.25, ease: "power2.out" });
  };

  const handleSendMagneticLeave = () => {
    const btn = sendBtnRef.current;
    if (!btn) return;
    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
    } catch {}
    setEmailText("COPIED");
    setShowToast(true);
    setTimeout(() => {
      setEmailText(contact.email);
      setShowToast(false);
    }, 2200);
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
            <DecodeText text="[ 05 // CONTACT ]" />
          </div>

          <div className="space-y-4">
            <h2
              ref={headlineRef}
              data-cursor="view"
              data-cursor-label="BUILD"
              className="font-sans text-6xl sm:text-8xl md:text-9xl lg:text-[11vw] tracking-tighter uppercase leading-[0.88] text-white select-none"
            >
              {titleChars.map((char, i) => (
                <span
                  key={`char-${i}`}
                  ref={(el) => {
                    letterRefs.current[i] = el;
                  }}
                  className="inline-block transition-[font-weight] duration-75 will-change-[font-weight]"
                  style={{ fontWeight: 300 }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h2>
            <div className="font-serif italic text-2xl sm:text-4xl text-white/80 font-normal">
              Open to internships and entry-level software engineering roles.
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
              </div>

              <button
                type="button"
                onClick={copyEmail}
                className="w-full text-left group flex items-center justify-between gap-3 p-3 -mx-3 rounded-xl hover:bg-white/5 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                aria-label={`Copy email address ${contact.email}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Mail className="w-5 h-5 text-white/50 group-hover:text-white transition-colors flex-shrink-0" />
                  <span className="font-mono text-sm sm:text-base text-white font-semibold tracking-tight truncate">
                    <DecodeText key={emailText} text={emailText} />
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
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="relative">
                  <label
                    htmlFor="contact-name"
                    className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2"
                  >
                    Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Your name"
                      className={`w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border text-white placeholder:text-white/30 font-sans text-sm focus:outline-none transition-colors ${
                        errors.name ? "border-white/50" : "border-white/15"
                      }`}
                    />
                    <div
                      className={`absolute bottom-0 inset-x-0 h-[2px] bg-white origin-center transition-transform duration-300 pointer-events-none rounded-b-xl ${
                        focusedField === "name" ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <span className="block mt-1.5 font-mono text-xs text-white/70">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border text-white placeholder:text-white/30 font-sans text-sm focus:outline-none transition-colors ${
                        errors.email ? "border-white/50" : "border-white/15"
                      }`}
                    />
                    <div
                      className={`absolute bottom-0 inset-x-0 h-[2px] bg-white origin-center transition-transform duration-300 pointer-events-none rounded-b-xl ${
                        focusedField === "email" ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <span className="block mt-1.5 font-mono text-xs text-white/70">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <label
                    htmlFor="contact-message"
                    className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2"
                  >
                    Message
                  </label>
                  <div className="relative">
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Tell me about your project or architecture requirements..."
                      rows={4}
                      className={`w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border text-white placeholder:text-white/30 font-sans text-sm focus:outline-none transition-colors resize-none ${
                        errors.message ? "border-white/50" : "border-white/15"
                      }`}
                    />
                    <div
                      className={`absolute bottom-0 inset-x-0 h-[2px] bg-white origin-center transition-transform duration-300 pointer-events-none rounded-b-xl ${
                        focusedField === "message" ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </div>
                  {errors.message && (
                    <span className="block mt-1.5 font-mono text-xs text-white/70">
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
                  ref={sendBtnRef}
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  onMouseMove={handleSendMagneticMove}
                  onMouseLeave={handleSendMagneticLeave}
                  className="w-full px-6 py-4 rounded-xl bg-white text-black hover:bg-white/90 disabled:bg-white/50 font-mono text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <DecodeText text="TRANSMITTING..." />
                    </span>
                  ) : isSubmitted ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <DecodeText text="SENT" />
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <DecodeText text="SEND MESSAGE" />
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
