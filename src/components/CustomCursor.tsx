"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Detect touch devices more reliably
    const isTouchDevice = () => {
      return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (window.matchMedia("(hover: none)").matches));
    };

    if (isTouchDevice()) {
      cursor.style.display = 'none';
      return;
    }

    // Initial position: center of screen
    gsap.set(cursor, {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
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
      
      if (interactive) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver);
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.body.addEventListener('mouseenter', onMouseEnter);

    // Make visible after a short delay to ensure smooth appearance
    setTimeout(() => setIsVisible(true), 100);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeEventListener('mouseenter', onMouseEnter);
      tweenRef.current?.kill();
    };
  }, [mounted, isVisible]);

  // Don't render on server
  if (!mounted) return null;

  return (
    <div 
      ref={cursorRef} 
      className={`custom-cursor ${isHovering ? 'hovering' : ''} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};
