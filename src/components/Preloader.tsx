"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const Preloader: React.FC = () => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Counter animation
    const count = { value: 0 };
    tl.to(count, {
      value: 100,
      duration: 2,
      ease: 'power3.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.floor(count.value).toString();
        }
      }
    });

    // Exit animation
    tl.to(preloaderRef.current, {
      yPercent: -100,
      duration: 1.5,
      ease: 'expo.inOut',
      onComplete: () => {
        if (preloaderRef.current) {
          preloaderRef.current.style.display = 'none';
        }
      }
    });

    // Reveal content
    tl.fromTo('.page-wrapper', 
      { y: 100, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1.5, 
        ease: 'expo.out',
        onComplete: () => {
          ScrollTrigger.refresh();
        }
      },
      '-=1'
    );

  }, []);

  return (
    <div 
      ref={preloaderRef}
      className="fixed inset-0 z-[10001] bg-swiss-black flex items-center justify-center"
    >
      <div className="flex items-baseline gap-4">
        <span ref={counterRef} className="text-[15vw] font-medium tracking-tighter leading-none">0</span>
        <span className="text-2xl font-light opacity-40">%</span>
      </div>
    </div>
  );
};
