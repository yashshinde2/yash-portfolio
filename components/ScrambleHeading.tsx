"use client";

import { useEffect, useRef, useState } from "react";

export function ScrambleHeading({
  text,
  className,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "div";
}) {
  const ref = useRef<HTMLElement>(null);
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOutput(text);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let animId: number;
    const chars = "!<>-_\\/[]{}—=+*^?#01";
    let hasAnimated = false;

    const animate = () => {
      let complete = 0;
      let next = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          next += " ";
          complete++;
          continue;
        }
        const progress = frame - i * 2;
        if (progress >= 10) {
          next += text[i];
          complete++;
        } else if (progress >= 0) {
          next += chars[Math.floor(Math.random() * chars.length)];
        } else {
          next += text[i];
        }
      }
      setOutput(next);
      frame++;
      if (complete < text.length) {
        animId = requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          frame = 0;
          animId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [text]);

  const Component = Tag as any;
  return (
    <Component ref={ref} className={className}>
      {output}
    </Component>
  );
}

