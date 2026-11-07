"use client";

import { useEffect, useRef } from "react";

const ASCII_MAP = [" ", ";", "/", "<", ">", "{", "}", "0", "1"];

export function AsciiFlashlight({
  imageSrc,
  className,
}: {
  imageSrc: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animId: number;
    let isVisible = true;
    let isTouch = false;

    let targetX = -500;
    let targetY = -500;
    let currentX = -500;
    let currentY = -500;

    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true });

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    let imgData: ImageData | null = null;
    let imgReady = false;

    const setupOffscreen = () => {
      if (!img.naturalWidth || !img.naturalHeight || !offCtx) return;
      offscreen.width = img.naturalWidth;
      offscreen.height = img.naturalHeight;
      offCtx.drawImage(img, 0, 0);
      imgData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      imgReady = true;
    };

    if (img.complete && img.naturalWidth > 0) {
      setupOffscreen();
    } else {
      img.onload = setupOffscreen;
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (targetX === -500 && rect.width > 0) {
        targetX = rect.width * 0.5;
        targetY = rect.height * 0.45;
        currentX = targetX;
        currentY = targetY;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    window.addEventListener("pointermove", handlePointerMove);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          animId = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(animId);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const radius = 70;
    const cellSize = 8;

    const render = () => {
      if (!isVisible) return;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      if (isTouch) {
        const time = performance.now() * 0.001;
        targetX = rect.width * 0.5 + Math.sin(time * 0.9) * (rect.width * 0.28);
        targetY = rect.height * 0.45 + Math.cos(time * 1.3) * (rect.height * 0.25);
      }

      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      ctx.clearRect(0, 0, rect.width, rect.height);

      if (
        imgReady &&
        imgData &&
        currentX >= -radius &&
        currentX <= rect.width + radius &&
        currentY >= -radius &&
        currentY <= rect.height + radius
      ) {
        const imgW = offscreen.width;
        const imgH = offscreen.height;
        const imageRatio = imgW / imgH;
        const containerRatio = rect.width / rect.height;

        let drawW = rect.width;
        let drawH = rect.height;
        let drawX = 0;
        let drawY = 0;

        if (containerRatio > imageRatio) {
          drawH = rect.height;
          drawW = rect.height * imageRatio;
          drawX = (rect.width - drawW) / 2;
          drawY = rect.height - drawH;
        } else {
          drawW = rect.width;
          drawH = rect.width / imageRatio;
          drawX = 0;
          drawY = rect.height - drawH;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(currentX, currentY, radius, 0, Math.PI * 2);
        ctx.clip();

        ctx.fillStyle = "#000000";
        ctx.fillRect(currentX - radius, currentY - radius, radius * 2, radius * 2);

        ctx.fillStyle = "#ffffff";
        ctx.font = `600 ${cellSize}px var(--font-mono), monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const startCol = Math.max(0, Math.floor((currentX - radius) / cellSize));
        const endCol = Math.min(
          Math.ceil(rect.width / cellSize),
          Math.ceil((currentX + radius) / cellSize)
        );
        const startRow = Math.max(0, Math.floor((currentY - radius) / cellSize));
        const endRow = Math.min(
          Math.ceil(rect.height / cellSize),
          Math.ceil((currentY + radius) / cellSize)
        );

        const pixels = imgData.data;

        for (let row = startRow; row < endRow; row++) {
          const cy = (row + 0.5) * cellSize;
          for (let col = startCol; col < endCol; col++) {
            const cx = (col + 0.5) * cellSize;
            const distSq = (cx - currentX) * (cx - currentX) + (cy - currentY) * (cy - currentY);
            if (distSq > radius * radius) continue;

            if (cx < drawX || cx >= drawX + drawW || cy < drawY || cy >= drawY + drawH) {
              continue;
            }

            const imgX = Math.min(
              imgW - 1,
              Math.max(0, Math.floor(((cx - drawX) / drawW) * imgW))
            );
            const imgY = Math.min(
              imgH - 1,
              Math.max(0, Math.floor(((cy - drawY) / drawH) * imgH))
            );
            const idx = (imgY * imgW + imgX) * 4;

            const a = pixels[idx + 3];
            if (a < 30) continue;

            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

            const charIndex = Math.min(
              ASCII_MAP.length - 1,
              Math.max(0, Math.floor((lum / 256) * ASCII_MAP.length))
            );
            const char = ASCII_MAP[charIndex];

            if (char !== " ") {
              ctx.fillText(char, cx, cy);
            }
          }
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      observer.disconnect();
    };
  }, [imageSrc]);

  return <canvas ref={canvasRef} className={className} />;
}
