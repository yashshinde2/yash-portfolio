"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import {
  ArrowUpRight,
  Calendar,
  Check,
  Copy,
  Download,
  Flame,
  FolderGit2,
  Home,
  Mail,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { contact } = portfolioData;
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handleNavigate = (id: string) => {
    setOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      showToast("Email copied to clipboard");
    } catch {
      showToast("Email copied to clipboard");
    }
    setOpen(false);
  };

  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = "/Yash_Shinde.pdf";
    link.download = "Yash_Shinde_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloading resume");
    setOpen(false);
  };

  const handleOpenLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  if (!open && !toastMessage) return null;

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 sm:pt-32 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl border border-white/20 bg-black text-white shadow-2xl overflow-hidden flex flex-col select-none animate-in fade-in zoom-in-95 duration-150"
          >
            <Command label="Command Palette" className="w-full">
              <div className="flex items-center px-4 border-b border-white/10">
                <Command.Input
                  autoFocus
                  placeholder="Type a command or search..."
                  className="w-full bg-transparent py-4 font-mono text-sm text-white placeholder:text-white/40 outline-none"
                />
                <kbd className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-white/20 text-white/50">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-80 overflow-y-auto p-2 space-y-3 scrollbar-none">
                <Command.Empty className="py-8 text-center font-mono text-xs uppercase tracking-widest text-white/40">
                  No commands matched your query.
                </Command.Empty>

                <Command.Group
                  heading="Navigation"
                  className="font-mono text-[10px] uppercase tracking-widest text-white/40 px-2 py-1"
                >
                  <Command.Item
                    onSelect={() => handleNavigate("#hero")}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-white/80 cursor-pointer data-[selected=true]:bg-white data-[selected=true]:text-black transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Home className="w-4 h-4" />
                      <span>Hero Section</span>
                    </div>
                    <span className="text-[10px] opacity-60">01</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleNavigate("#about")}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-white/80 cursor-pointer data-[selected=true]:bg-white data-[selected=true]:text-black transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4" />
                      <span>About Philosophy</span>
                    </div>
                    <span className="text-[10px] opacity-60">02</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleNavigate("#skills")}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-white/80 cursor-pointer data-[selected=true]:bg-white data-[selected=true]:text-black transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4" />
                      <span>Core Skills Marquee</span>
                    </div>
                    <span className="text-[10px] opacity-60">03</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleNavigate("#projects")}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-white/80 cursor-pointer data-[selected=true]:bg-white data-[selected=true]:text-black transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FolderGit2 className="w-4 h-4" />
                      <span>Selected Projects</span>
                    </div>
                    <span className="text-[10px] opacity-60">04</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleNavigate("#commit-matrix")}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-white/80 cursor-pointer data-[selected=true]:bg-white data-[selected=true]:text-black transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4" />
                      <span>Commit Matrix (1s &amp; 0s)</span>
                    </div>
                    <span className="text-[10px] opacity-60">05</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleNavigate("#hackathons")}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-white/80 cursor-pointer data-[selected=true]:bg-white data-[selected=true]:text-black transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Trophy className="w-4 h-4" />
                      <span>Hackathons Grand Prix</span>
                    </div>
                    <span className="text-[10px] opacity-60">06</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleNavigate("#contact")}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-white/80 cursor-pointer data-[selected=true]:bg-white data-[selected=true]:text-black transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4" />
                      <span>Contact / Let&apos;s Build</span>
                    </div>
                    <span className="text-[10px] opacity-60">07</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group
                  heading="Actions & Links"
                  className="font-mono text-[10px] uppercase tracking-widest text-white/40 px-2 py-1"
                >
                  <Command.Item
                    onSelect={handleDownloadResume}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-white/80 cursor-pointer data-[selected=true]:bg-white data-[selected=true]:text-black transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4" />
                      <span>Download Resume (PDF)</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </Command.Item>

                  <Command.Item
                    onSelect={handleCopyEmail}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-white/80 cursor-pointer data-[selected=true]:bg-white data-[selected=true]:text-black transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Copy className="w-4 h-4" />
                      <span>Copy Email Address</span>
                    </div>
                    <span className="text-[10px] opacity-60">
                      {contact.email}
                    </span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() =>
                      handleOpenLink("https://github.com/yashshinde2")
                    }
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-white/80 cursor-pointer data-[selected=true]:bg-white data-[selected=true]:text-black transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Flame className="w-4 h-4" />
                      <span>Open GitHub Profile</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </Command.Item>

                  <Command.Item
                    onSelect={() =>
                      handleOpenLink("https://linkedin.com/in/yashshinde2")
                    }
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-white/80 cursor-pointer data-[selected=true]:bg-white data-[selected=true]:text-black transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4" />
                      <span>Open LinkedIn Profile</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </Command.Item>
                </Command.Group>
              </Command.List>

              <div className="p-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/40">
                <span>Navigate ↑↓ • Select ↵</span>
                <span>Yash Shinde // Systems 2026</span>
              </div>
            </Command>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-[10000] flex items-center gap-3 px-5 py-3 rounded-full bg-black text-white border border-white/30 shadow-2xl font-mono text-xs uppercase tracking-widest">
          <Check className="w-3.5 h-3.5 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
