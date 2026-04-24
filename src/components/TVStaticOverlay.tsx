"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

export interface TVStaticConfig {
  /** Opacity in dark mode (0.0 - 1.0) */
  opacityDark?: number;
  /** Opacity in light mode (0.0 - 1.0) */
  opacityLight?: number;
  /** Frames per second (12-30 recommended) */
  fps?: number;
  /** Render scale: 1 = full res, 4 = 1/4 res (better performance) */
  renderScale?: number;
  /** Show CRT scanlines overlay */
  scanlines?: boolean;
}

interface TVStaticOverlayProps {
  config?: TVStaticConfig;
}

const defaultConfig: Required<TVStaticConfig> = {
  opacityDark: 0.05,
  opacityLight: 0.025,
  fps: 15,
  renderScale: 4,
  scanlines: true,
};

/**
 * TV Static Noise Overlay - THEME AWARE
 * 
 * Adapts noise color and opacity based on light/dark mode:
 * - Dark mode: White noise at higher opacity
 * - Light mode: Black noise at lower opacity
 * 
 * Low-resolution rendering for performance:
 * - Renders at 1/4 resolution (or custom scale)
 * - Scales up with CSS pixelated rendering
 * - Reuses buffers to prevent GC pressure
 */
export function TVStaticOverlay({ config = {} }: TVStaticOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imgDataRef = useRef<ImageData | null>(null);
  const bufferRef = useRef<Uint8ClampedArray | null>(null);
  const animationRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const isActiveRef = useRef<boolean>(true);
  
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const mergedConfig = { ...defaultConfig, ...config };
  const { opacityDark, opacityLight, fps, renderScale, scanlines } = mergedConfig;
  
  // Use appropriate opacity based on theme
  const opacity = isDark ? opacityDark : opacityLight;

  const renderNoise = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const imgData = imgDataRef.current;
    const buffer = bufferRef.current;

    if (!canvas || !ctx || !imgData || !buffer) return;

    const width = canvas.width;
    const height = canvas.height;
    const len = width * height;

    // Generate noise - white for dark mode, black for light mode
    for (let i = 0; i < len; i++) {
      const v = Math.random();
      const idx = i * 4;
      
      // Invert noise based on theme
      // Dark mode: white noise (255 * v)
      // Light mode: black noise (255 * (1 - v))
      const noiseVal = isDark 
        ? (v * 255) | 0           // White noise
        : ((1 - v) * 255) | 0;    // Black noise (inverted)

      buffer[idx] = noiseVal;     // R
      buffer[idx + 1] = noiseVal; // G
      buffer[idx + 2] = noiseVal; // B
      buffer[idx + 3] = 255;      // A (full alpha, opacity handled by CSS)
    }

    // Copy buffer to image data
    imgData.data.set(buffer);
    ctx.putImageData(imgData, 0, 0);
  }, [isDark]);

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

  // Scanlines color: darker for light mode, lighter for dark mode
  const scanlineColor = isDark 
    ? "rgba(0, 0, 0, 0.08)" 
    : "rgba(255, 255, 255, 0.04)";

  return (
    <>
      {/* Noise Canvas - Low res scaled up */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: 9999,
          opacity,
          imageRendering: "pixelated",
          transform: "scale(1.01)",
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
              ${scanlineColor} 2px,
              ${scanlineColor} 4px
            )`,
          }}
        />
      )}
    </>
  );
}
