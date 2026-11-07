"use client";

import { useState } from "react";
import { portfolioData } from "@/lib/portfolio-data";
import { Mail, MapPin, Send } from "lucide-react";
import { ScrambleHeading } from "@/components/ScrambleHeading";

export function Contact() {
  const { contact } = portfolioData;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="py-24 sm:py-36 px-6 sm:px-12 lg:px-20 border-b border-black/10 bg-white text-black">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 sm:mb-20 space-y-4">
          <div className="font-mono text-xs uppercase tracking-widest text-black/50">
            <ScrambleHeading text="[ 05 // CONTACT ]" as="span" />
          </div>
          <ScrambleHeading
            text="LET'S CONNECT"
            className="text-4xl sm:text-6xl font-bold tracking-tighter uppercase font-sans text-black"
          />
          <p className="text-black/60 font-sans text-base max-w-xl mx-auto font-light leading-relaxed">
            Got an interesting project or collaboration opportunity? I&apos;d love to hear from you. Feel
            free to reach out anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12">
          <div className="md:col-span-5 space-y-4">
            <div className="p-6 sm:p-8 rounded-2xl border border-black/10 bg-black/[0.02]">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black/60 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-black/40 mb-1">
                    Email
                  </div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-black/80 hover:text-black font-mono text-xs sm:text-sm break-all transition-colors font-medium"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl border border-black/10 bg-black/[0.02]">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black/60 flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-black/40 mb-1">
                    Location
                  </div>
                  <p className="text-black/80 font-mono text-xs sm:text-sm font-medium">
                    {contact.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-black/10 bg-black/[0.02]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-black/15 text-black placeholder:text-black/30 font-sans text-sm focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-black/15 text-black placeholder:text-black/30 font-sans text-sm focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-black/15 text-black placeholder:text-black/30 font-sans text-sm focus:outline-none focus:border-black transition-colors resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="w-full px-6 py-4 rounded-xl bg-black text-white hover:bg-black/85 disabled:bg-black/50 font-mono text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitted ? (
                    <span>Message sent</span>
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
    </div>
  );
}
