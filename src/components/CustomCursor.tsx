"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useTheme } from 'next-themes';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // Mount check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize cursor
  useLayoutEffect(() => {
    if (!mounted) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Detect touch devices
    const isTouchDevice = () => {
      return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (window.matchMedia("(hover: none)").matches));
    };

    if (isTouchDevice()) {
      cursor.style.display = 'none';
      return;
    }

    // Set initial position
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    positionRef.current = { x: centerX, y: centerY };
    
    gsap.set(cursor, {
      x: centerX,
      y: centerY,
      opacity: 0,
      scale: 0.5,
    });

    // Make visible
    gsap.to(cursor, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      delay: 0.5,
      onComplete: () => setIsVisible(true),
    });

    const onMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      
      tweenRef.current?.kill();
      tweenRef.current = gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: 'expo.out',
      });
    };

    const onMouseDown = () => setIsHovering(true);
    const onMouseUp = () => setIsHovering(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], .cursor-pointer, input, textarea, select, .magnetic-wrap, [data-cursor-hover]');
      
      setIsHovering(!!interactive);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
      gsap.to(cursor, { opacity: 0, scale: 0.5, duration: 0.2 });
    };
    
    const onMouseEnter = () => {
      setIsVisible(true);
      gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      tweenRef.current?.kill();
    };
  }, [mounted]);

  // Force cursor update when theme changes
  useEffect(() => {
    if (!mounted || !cursorRef.current) return;
    
    // Small timeout to ensure theme class is applied
    const timer = setTimeout(() => {
      if (cursorRef.current && isVisible) {
        gsap.fromTo(cursorRef.current, 
          { scale: 0.8 },
          { scale: 1, duration: 0.2, ease: 'power2.out' }
        );
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [resolvedTheme, mounted, isVisible]);

  if (!mounted) return null;

  return (
    <div 
      ref={cursorRef} 
      className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
      style={{
        transform: 'translate(-50%, -50%)',
      }}
      data-cursor="true"
    />
  );
};
