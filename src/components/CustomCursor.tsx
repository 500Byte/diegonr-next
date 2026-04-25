'use client';

import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

const BASE_SIZE = 10;
const HOVER_SIZE = 40;

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
      cursor.style.display = 'none';
      return;
    }

    gsap.set(cursor, {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: 'expo.out',
      });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest(
        'a, button, [role="button"], .cursor-pointer, .magnetic-wrap'
      );
      setIsHovering(!!isInteractive);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const size = isHovering ? HOVER_SIZE : BASE_SIZE;

    gsap.to(cursor, {
      width: size,
      height: size,
      xPercent: -50,
      yPercent: -50,
      duration: 0.35,
      ease: 'power2.out',
    });
  }, [isHovering]);

  return (
    <>
      <style>{`
        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: ${BASE_SIZE}px;
          height: ${BASE_SIZE}px;
          border-radius: 50%;
          background-color: white;
          pointer-events: none;
          z-index: 99999;
          mix-blend-mode: difference;
          transition: opacity 0.2s ease;
        }
      `}</style>
      <div
        ref={cursorRef}
        className="custom-cursor"
        style={{ opacity: isVisible ? 1 : 0 }}
        aria-hidden="true"
      />
    </>
  );
};
