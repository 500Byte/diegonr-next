"use client";

import { useEffect, useRef, useCallback } from "react";

export interface TVStaticConfig {
  /** Opacity of the noise overlay (0.0 - 1.0) */
  opacity?: number;
  /** Frames per second (12-30 recommended) */
  fps?: number;
  /** Render scale: 1 = full res, 4 = 1/4 res (better performance) */
  renderScale?: number;
  /** Noise mode: 'bw' | 'phosphor' | 'color' | 'blizzard' */
  mode?: "bw" | "phosphor" | "color" | "blizzard";
  /** Show CRT scanlines overlay */
  scanlines?: boolean;
}

interface TVStaticOverlayProps {
  config?: TVStaticConfig;
}

const defaultConfig: Required<TVStaticConfig> = {
  opacity: 0.05,
  fps: 15,
  renderScale: 4,
  mode: "bw",
  scanlines: true,
};

/**
 * TV Static Noise Overlay - OPTIMIZED VERSION
 * 
 * Low-resolution rendering for performance:
 * - Renders at 1/4 resolution (or custom scale)
 * - Scales up with CSS pixelated rendering
 * - Reuses buffers to prevent GC pressure
 * - ~16x fewer pixels to process vs full resolution
 * 
 * Modes:
 * - bw: Black and white static
 * - phosphor: Green phosphor glow (CRT monitor style)
 * - color: Full color noise
 * - blizzard: High contrast white/black with random horizontal lines
 */
export function TVStaticOverlay({ config = {} }: TVStaticOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imgDataRef = useRef<ImageData | null>(null);
  const animationRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const isActiveRef = useRef<boolean>(true);
  const bufferRef = useRef<Uint8ClampedArray | null>(null);

  const mergedConfig = { ...defaultConfig, ...config };
  const { opacity, fps, renderScale, mode, scanlines } = mergedConfig;

  const renderNoise = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const imgData = imgDataRef.current;
    const buffer = bufferRef.current;

    if (!canvas || !ctx || !imgData || !buffer) return;

    const width = canvas.width;
    const height = canvas.height;
    const len = width * height;

    // Generate noise directly into buffer
    for (let i = 0; i < len; i++) {
      const v = Math.random();
      const idx = i * 4;

      switch (mode) {
        case "phosphor": {
          const phosphorGreen = Math.floor(v * 255);
          buffer[idx] = 0;      // R
          buffer[idx + 1] = phosphorGreen;  // G
          buffer[idx + 2] = Math.floor(phosphorGreen * 0.2); // B
          buffer[idx + 3] = 255; // A
          break;
        }
        case "color": {
          buffer[idx] = Math.random() * 255;
          buffer[idx + 1] = Math.random() * 255;
          buffer[idx + 2] = Math.random() * 255;
          buffer[idx + 3] = 255;
          break;
        }
        case "blizzard": {
          const val = v > 0.5 ? 255 : 0;
          buffer[idx] = val;
          buffer[idx + 1] = val;
          buffer[idx + 2] = val;
          buffer[idx + 3] = 255;
          break;
        }
        default: { // bw
          const bw = (v * 255) | 0;
          buffer[idx] = bw;
          buffer[idx + 1] = bw;
          buffer[idx + 2] = bw;
          buffer[idx + 3] = 255;
          break;
        }
      }
    }

    // Copy buffer to image data
    imgData.data.set(buffer);
    ctx.putImageData(imgData, 0, 0);

    // Blizzard mode: add random horizontal line
    if (mode === "blizzard") {
      const ly = (Math.random() * height) | 0;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.5})`;
      ctx.fillRect(0, ly, width, (Math.random() * 4 + 1) | 0);
    }
  }, [mode]);

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    ctxRef.current = ctx;

    // Handle resize - set low-res canvas size
    const handleResize = () => {
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      
      // Render at reduced resolution
      canvas.width = Math.ceil(displayWidth / renderScale);
      canvas.height = Math.ceil(displayHeight / renderScale);

      // Create reusable buffers
      imgDataRef.current = ctx.createImageData(canvas.width, canvas.height);
      bufferRef.current = new Uint8ClampedArray(canvas.width * canvas.height * 4);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Animation loop
    const interval = 1000 / fps;

    const animate = (timestamp: number) => {
      if (!isActiveRef.current) return;

      if (timestamp - lastFrameRef.current >= interval) {
        lastFrameRef.current = timestamp;
        renderNoise();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      isActiveRef.current = false;
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [fps, renderScale, renderNoise]);

  // Don't render if reduced motion is preferred
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  return (
    <>
      {/* Noise Canvas - Low res scaled up */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: 9999,
          opacity,
          imageRendering: "pixelated", // Key for retro look when scaling
          transform: "scale(1.01)", // Slight overscale to prevent edge artifacts
        }}
      />

      {/* Scanlines Overlay */}
      {scanlines && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 10000,
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.08) 2px,
              rgba(0, 0, 0, 0.08) 4px
            )`,
          }}
        />
      )}
    </>
  );
}
