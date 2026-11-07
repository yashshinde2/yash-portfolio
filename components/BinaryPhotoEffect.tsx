"use client";

import { useEffect, useRef } from "react";

interface Ripple {
  x: number;
  y: number;
  startTime: number;
  duration: number;
}

export function BinaryPhotoEffect({
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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animId: number;
    let isVisible = true;
    let isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window;

    let targetX = -500;
    let targetY = -500;
    let currentX = -500;
    let currentY = -500;

    let ripples: Ripple[] = [];
    let decodeStartTime = 0;
    const decodeDuration = 1200;

    const cellW = 8;
    const cellH = 12;
    const radius = 150;

    let cols = 0;
    let rows = 0;
    let totalCells = 0;
    let cellLum = new Float32Array(0);
    let cellInSilhouette = new Uint8Array(0);
    let cellTrail = new Float32Array(0);

    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true });

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    let imgReady = false;

    const computeGrid = () => {
      const rect = canvas.getBoundingClientRect();
      if (
        rect.width === 0 ||
        rect.height === 0 ||
        !imgReady ||
        !img.naturalWidth ||
        !offCtx
      ) {
        return;
      }

      cols = Math.ceil(rect.width / cellW);
      rows = Math.ceil(rect.height / cellH);
      totalCells = cols * rows;

      cellLum = new Float32Array(totalCells);
      cellInSilhouette = new Uint8Array(totalCells);
      cellTrail = new Float32Array(totalCells);

      offscreen.width = img.naturalWidth;
      offscreen.height = img.naturalHeight;
      offCtx.drawImage(img, 0, 0);
      const imgData = offCtx.getImageData(
        0,
        0,
        offscreen.width,
        offscreen.height
      );
      const pixels = imgData.data;

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

      for (let r = 0; r < rows; r++) {
        const cy = (r + 0.5) * cellH;
        for (let c = 0; c < cols; c++) {
          const cx = (c + 0.5) * cellW;
          const idx = r * cols + c;

          if (
            cx < drawX ||
            cx >= drawX + drawW ||
            cy < drawY ||
            cy >= drawY + drawH
          ) {
            cellLum[idx] = 0;
            cellInSilhouette[idx] = 0;
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
          const pIdx = (imgY * imgW + imgX) * 4;

          const alpha = pixels[pIdx + 3];
          if (alpha > 25) {
            cellInSilhouette[idx] = 1;
            const red = pixels[pIdx];
            const green = pixels[pIdx + 1];
            const blue = pixels[pIdx + 2];
            cellLum[idx] = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
          } else {
            cellInSilhouette[idx] = 0;
            cellLum[idx] = 0;
          }
        }
      }
    };

    const setupImage = () => {
      imgReady = true;
      computeGrid();
    };

    if (img.complete && img.naturalWidth > 0) {
      setupImage();
    } else {
      img.onload = setupImage;
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

      computeGrid();
    };

    resize();
    window.addEventListener("resize", resize);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (reducedMotion) {
        currentX = targetX;
        currentY = targetY;
        renderStatic();
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (reducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripples.push({
        x,
        y,
        startTime: performance.now(),
        duration: 700,
      });
    };

    const handleClick = () => {
      if (reducedMotion) return;
      decodeStartTime = performance.now();
    };

    window.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("click", handleClick);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !reducedMotion) {
          animId = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(animId);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const renderStatic = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      if (totalCells === 0) return;

      ctx.font = `600 10px var(--font-mono), monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const startCol = Math.max(0, Math.floor((currentX - radius) / cellW));
      const endCol = Math.min(cols, Math.ceil((currentX + radius) / cellW));
      const startRow = Math.max(0, Math.floor((currentY - radius) / cellH));
      const endRow = Math.min(rows, Math.ceil((currentY + radius) / cellH));

      for (let r = startRow; r < endRow; r++) {
        const cy = (r + 0.5) * cellH;
        for (let c = startCol; c < endCol; c++) {
          const cx = (c + 0.5) * cellW;
          const dist = Math.hypot(cx - currentX, cy - currentY);
          if (dist > radius) continue;

          const edgeFade = Math.max(0, 1 - dist / radius);
          const idx = r * cols + c;
          const isSil = cellInSilhouette[idx] === 1;
          const lum = cellLum[idx];

          ctx.fillStyle = `rgba(0, 0, 0, ${0.65 * edgeFade})`;
          ctx.fillRect(cx - cellW / 2, cy - cellH / 2, cellW, cellH);

          const opacity = isSil
            ? (0.25 + 0.75 * lum) * edgeFade
            : 0.15 * edgeFade;
          const char = (c + r) % 2 === 0 ? "0" : "1";

          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fillText(char, cx, cy);
        }
      }
    };

    const render = (now: number) => {
      if (!isVisible) return;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0 || totalCells === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      if (isTouch) {
        const t = now * 0.001;
        targetX = rect.width * 0.5 + Math.sin(t * 0.8) * (rect.width * 0.25);
        targetY = rect.height * 0.45 + Math.cos(t * 1.1) * (rect.height * 0.22);
      }

      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

      ctx.clearRect(0, 0, rect.width, rect.height);

      ripples = ripples.filter((rip) => now - rip.startTime < rip.duration);

      let decodeProgress = -1;
      if (decodeStartTime > 0) {
        const elapsed = now - decodeStartTime;
        if (elapsed < decodeDuration) {
          decodeProgress = elapsed / decodeDuration;
        } else {
          decodeStartTime = 0;
        }
      }

      const timeBucket = Math.floor(now / 125);

      const startCol = Math.max(0, Math.floor((currentX - radius) / cellW));
      const endCol = Math.min(cols, Math.ceil((currentX + radius) / cellW));
      const startRow = Math.max(0, Math.floor((currentY - radius) / cellH));
      const endRow = Math.min(rows, Math.ceil((currentY + radius) / cellH));

      for (let r = startRow; r < endRow; r++) {
        const cy = (r + 0.5) * cellH;
        for (let c = startCol; c < endCol; c++) {
          const cx = (c + 0.5) * cellW;
          const dist = Math.hypot(cx - currentX, cy - currentY);
          if (dist <= radius) {
            cellTrail[r * cols + c] = now;
          }
        }
      }

      ctx.font = `600 10px var(--font-mono), monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let r = 0; r < rows; r++) {
        const cy = (r + 0.5) * cellH;
        for (let c = 0; c < cols; c++) {
          const cx = (c + 0.5) * cellW;
          const idx = r * cols + c;

          let intensity = 0;

          const dist = Math.hypot(cx - currentX, cy - currentY);
          if (dist <= radius) {
            const rawFade = 1 - dist / radius;
            intensity = rawFade * rawFade * (3 - 2 * rawFade);
          }

          const lastVisit = cellTrail[idx];
          if (lastVisit > 0) {
            const decay = 1 - (now - lastVisit) / 600;
            if (decay > intensity) {
              intensity = decay;
            }
          }

          if (ripples.length > 0) {
            for (let i = 0; i < ripples.length; i++) {
              const rip = ripples[i];
              const p = (now - rip.startTime) / rip.duration;
              const ripR = p * 600;
              const dRip = Math.hypot(cx - rip.x, cy - rip.y);
              const band = Math.abs(dRip - ripR);
              if (band < 55) {
                const w =
                  (1 - p) * Math.cos((band / 55) * (Math.PI / 2));
                if (w > intensity) {
                  intensity = w;
                }
              }
            }
          }

          if (decodeProgress >= 0) {
            const sweep =
              decodeProgress * 1.35 - (r / rows) * 0.35;
            if (sweep < 1) {
              const decInt = Math.max(0, 1 - sweep);
              if (decInt > intensity) {
                intensity = decInt;
              }
            }
          }

          if (intensity <= 0.01) continue;

          ctx.fillStyle = `rgba(0, 0, 0, ${0.65 * intensity})`;
          ctx.fillRect(cx - cellW / 2, cy - cellH / 2, cellW, cellH);

          const isSil = cellInSilhouette[idx] === 1;
          const lum = cellLum[idx];

          const opacity = isSil
            ? (0.25 + 0.75 * lum) * intensity
            : 0.15 * intensity;

          const digit =
            ((c * 374761393 + r * 668265263 + timeBucket * 1013904223) ^
              0x5bf03635) &
            1
              ? "1"
              : "0";

          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fillText(digit, cx, cy);
        }
      }

      animId = requestAnimationFrame(render);
    };

    if (!reducedMotion) {
      animId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("click", handleClick);
      observer.disconnect();
    };
  }, [imageSrc]);

  return <canvas ref={canvasRef} className={className} />;
}
