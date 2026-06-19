'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  const isDarkRef = useRef<boolean>(true);

  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const mergedConfig = { ...defaultConfig, ...config };
  const { opacityDark, opacityLight, fps, renderScale, scanlines } =
    mergedConfig;

  // Determine current theme - default to dark if not resolved yet
  const isDark = resolvedTheme === 'dark' || resolvedTheme === undefined;

  // Sync theme to ref for use in animation loop
  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  // Mark as mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const renderNoise = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const imgData = imgDataRef.current;
    const buffer = bufferRef.current;

    if (!canvas || !ctx || !imgData || !buffer) return;

    const width = canvas.width;
    const height = canvas.height;
    const len = width * height;

    // Use ref to get current theme without re-triggering effect
    const currentIsDark = isDarkRef.current;

    // Generate noise - white for dark mode, black for light mode
    for (let i = 0; i < len; i++) {
      const v = Math.random();
      const idx = i * 4;

      // Invert noise based on theme
      const noiseVal = currentIsDark
        ? (v * 255) | 0 // White noise
        : ((1 - v) * 255) | 0; // Black noise (inverted)

      buffer[idx] = noiseVal; // R
      buffer[idx + 1] = noiseVal; // G
      buffer[idx + 2] = noiseVal; // B
      buffer[idx + 3] = 255; // A
    }

    // Copy buffer to image data
    imgData.data.set(buffer);
    ctx.putImageData(imgData, 0, 0);
  }, []);

  // Initialize and run animation
  useEffect(() => {
    // Wait for mount to avoid hydration issues
    if (!mounted) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
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
      bufferRef.current = new Uint8ClampedArray(
        canvas.width * canvas.height * 4
      );
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Reset active flag
    isActiveRef.current = true;

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
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
    // Only re-run when mounted changes, NOT when theme changes
  }, [mounted, fps, renderScale, renderNoise]);

  // Don't render during SSR to avoid hydration mismatch
  if (!mounted) return null;

  // Don't render if reduced motion is preferred
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  // Calculate opacity based on current theme
  const opacity = isDark ? opacityDark : opacityLight;

  // Scanlines color: darker for light mode, lighter for dark mode
  const scanlineColor = isDark
    ? 'rgba(0, 0, 0, 0.08)'
    : 'rgba(255, 255, 255, 0.04)';

  // Disable noise on single blog posts
  if (pathname?.match(/\/blog\/[^/]+/)) {
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
          imageRendering: 'pixelated',
          transform: 'scale(1.01)',
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
