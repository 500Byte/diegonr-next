"use client";

import { useEffect, useRef, useCallback } from "react";

export interface TVStaticConfig {
  /** Opacity of the noise overlay (0.0 - 1.0) */
  opacity?: number;
  /** Frames per second (12-60) */
  fps?: number;
  /** Grain size in pixels (1 = fine, 4 = chunky) */
  grainSize?: number;
  /** Noise mode: 'bw' | 'phosphor' | 'color' | 'blizzard' */
  mode?: "bw" | "phosphor" | "color" | "blizzard";
  /** Show CRT scanlines overlay */
  scanlines?: boolean;
}

interface TVStaticOverlayProps {
  config?: TVStaticConfig;
}

const defaultConfig: Required<TVStaticConfig> = {
  opacity: 0.06,
  fps: 24,
  grainSize: 1,
  mode: "bw",
  scanlines: true,
};

/**
 * TV Static Noise Overlay
 * 
 * Animated grain/noise effect with multiple modes:
 * - bw: Black and white static
 * - phosphor: Green phosphor glow (CRT monitor style)
 * - color: Full color noise
 * - blizzard: High contrast white/black with random horizontal lines
 * 
 * Features:
 * - Canvas-based rendering for performance
 * - Respects prefers-reduced-motion
 * - Configurable via props
 * - Swiss-Brutalist aesthetic compatible
 */
export function TVStaticOverlay({ config = {} }: TVStaticOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const isActiveRef = useRef<boolean>(true);

  const mergedConfig = { ...defaultConfig, ...config };
  const { opacity, fps, grainSize, mode, scanlines } = mergedConfig;

  const renderNoise = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const g = grainSize;
      const gridW = Math.ceil(width / g);
      const gridH = Math.ceil(height / g);

      // Create temporary canvas for pixel manipulation
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext("2d")!;
      const imgData = tempCtx.createImageData(width, height);
      const data = imgData.data;

      for (let gy = 0; gy < gridH; gy++) {
        for (let gx = 0; gx < gridW; gx++) {
          const v = Math.random();
          let r: number, gVal: number, b: number;

          switch (mode) {
            case "phosphor":
              r = 0;
              gVal = Math.floor(v * 255);
              b = Math.floor(gVal * 0.2);
              break;
            case "color":
              r = (Math.random() * 255) | 0;
              gVal = (Math.random() * 255) | 0;
              b = (Math.random() * 255) | 0;
              break;
            case "blizzard":
              r = gVal = b = v > 0.5 ? 255 : 0;
              break;
            default: // bw
              r = gVal = b = (v * 255) | 0;
          }

          // Fill grainSize x grainSize block
          for (let dy = 0; dy < g && gy * g + dy < height; dy++) {
            for (let dx = 0; dx < g && gx * g + dx < width; dx++) {
              const px = ((gy * g + dy) * width + (gx * g + dx)) * 4;
              data[px] = r;
              data[px + 1] = gVal;
              data[px + 2] = b;
              data[px + 3] = 255;
            }
          }
        }
      }

      tempCtx.putImageData(imgData, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0);

      // Blizzard mode: add random horizontal line
      if (mode === "blizzard") {
        const ly = (Math.random() * height) | 0;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.5})`;
        ctx.fillRect(0, ly, width, (Math.random() * 8 + 2) | 0);
      }
    },
    [grainSize, mode]
  );

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Animation loop
    const interval = 1000 / fps;

    const animate = (timestamp: number) => {
      if (!isActiveRef.current) return;

      if (timestamp - lastFrameRef.current >= interval) {
        lastFrameRef.current = timestamp;
        renderNoise(ctx, canvas.width, canvas.height);
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
  }, [fps, renderNoise]);

  // Don't render if reduced motion is preferred
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  return (
    <>
      {/* Noise Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: 9999,
          opacity,
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
