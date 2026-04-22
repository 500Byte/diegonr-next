"use client";

import React from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { NavigationError } from '@/components/NavigationError';
import { FooterError } from '@/components/FooterError';
import { Magnetic } from '@/components/Magnetic';
import { SwissContainer } from '@/components/Layout';
import { MarqueeBanner } from '@/components/ui/marquee-banner';
import { Barcode } from '@/components/ui/barcode';

export default function NotFound() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tl = gsap.timeline();

    tl.from(".not-found-grid", {
      opacity: 0,
      duration: 1.5,
      ease: "expo.out",
    });

    tl.from(".not-found-chars span", {
      y: "100%",
      rotateX: 90,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power4.out",
    }, "-=1");

    tl.from(".not-found-content > *", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    }, "-=0.5");

  }, { scope: containerRef });

  const errorCodes = "404".split("").map((char, i) => (
    <span key={i} className="inline-block overflow-hidden">
      <span className="inline-block">{char}</span>
    </span>
  ));

  return (
    <>
      <NavigationError />
      <div ref={containerRef} className="relative min-h-[90vh] flex flex-col justify-center bg-swiss-black overflow-hidden pt-20">
        {/* Background Grid */}
        <div 
          className="not-found-grid absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        <SwissContainer className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-8">
            <p className="font-mono text-white/40 text-xs uppercase tracking-[0.3em] mb-4">
              [ ERROR_CODE: NULL_POINTER_EXCEPTION ]
            </p>
            <h1 
              className="not-found-chars text-[30vw] md:text-[25vw] font-medium leading-none tracking-tighter"
            >
              {errorCodes}
            </h1>
          </div>

          <div className="not-found-content max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-light mb-6 tracking-tight">
              Página no encontrada
            </h2>
            <p className="text-white/60 text-base md:text-lg mb-12 leading-relaxed">
              El recurso solicitado no ha sido localizado en el servidor. 
              Es posible que el enlace esté roto o que el archivo haya sido reubicado permanentemente.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Magnetic strength={0.3}>
                <Link 
                  href="/"
                  className="group flex items-center gap-3 px-8 py-4 border border-white/20 hover:border-white/60 transition-colors duration-300"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-white">REINTENTAR ACCESO</span>
                  <span className="w-6 h-px bg-white/40 group-hover:w-10 transition-all duration-300" />
                </Link>
              </Magnetic>
            </div>
          </div>
        </SwissContainer>

        <div className="mt-auto pt-20">
          <MarqueeBanner text="ERROR 404 • SYSTEM OVERLOAD • LOST IN SPACE • PAGE NOT FOUND •" speed={50} />
        </div>

        <div className="absolute bottom-8 right-8 opacity-20 hidden md:block">
          <Barcode />
        </div>
      </div>
      <FooterError />
    </>
  );
}
