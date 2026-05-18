'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxImage {
  src: string;
  alt: string;
}

interface ResearchImageGalleryProps {
  images: LightboxImage[];
}

export function ResearchImageGallery({ images }: ResearchImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!modalRef.current || !overlayRef.current || !imageRef.current) return;

    if (isOpen) {
      gsap.set(modalRef.current, { display: 'flex' });
      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
      .fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' },
        0
      );
    } else {
      const tl = gsap.timeline({
        onComplete: () => { gsap.set(modalRef.current, { display: 'none' }); },
      });
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      })
      .to(
        imageRef.current,
        { scale: 0.9, opacity: 0, duration: 0.2, ease: 'power2.in' },
        0
      );
    }
  }, { scope: modalRef, dependencies: [isOpen] });

  const open = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const navigate = useCallback((direction: 'prev' | 'next') => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => {
      if (direction === 'prev') return prev === 0 ? images.length - 1 : prev - 1;
      return prev === images.length - 1 ? 0 : prev + 1;
    });
  }, [images.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') navigate('prev');
      if (e.key === 'ArrowRight') navigate('next');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, close, navigate]);

  const current = images[currentIndex];

  return (
    <>
      <div className="research-images">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative w-full my-8 group cursor-pointer"
            onClick={() => open(index)}
            role="button"
            tabIndex={0}
            aria-label={`View ${img.alt} in full size`}
            onKeyDown={(e) => e.key === 'Enter' && open(index)}
          >
            <div className="relative w-full aspect-video bg-white/5 overflow-hidden border border-white/10">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover grayscale transition-transform duration-500 group-hover:grayscale-0 group-hover:scale-105"
              />
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity">
                <ZoomIn className="w-6 h-6 text-white" />
              </div>
            </div>
            {img.alt && (
              <p className="mt-3 text-white/40 font-mono text-[10px] uppercase tracking-widest">
                {img.alt}
              </p>
            )}
          </div>
        ))}
      </div>

      <div
        ref={modalRef}
        className="fixed inset-0 z-[10001] items-center justify-center"
        style={{ display: 'none' }}
        onClick={close}
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox"
      >
        <div ref={overlayRef} className="absolute inset-0 bg-black" style={{ opacity: 0 }} />

        <div className="relative z-10 max-w-7xl w-full mx-4 flex flex-col items-center">
          <button
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 p-2 text-white/60 hover:text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('next'); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 p-2 text-white/60 hover:text-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div
            ref={imageRef}
            className="relative w-full"
            style={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-video max-h-[80vh]">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                className="object-contain"
                priority
              />
            </div>
            {current.alt && (
              <p className="text-center text-white/40 font-mono text-[10px] uppercase tracking-widest mt-4">
                {current.alt}
              </p>
            )}
            {images.length > 1 && (
              <p className="text-center text-white/30 font-mono text-[10px] uppercase tracking-widest mt-2">
                {currentIndex + 1} / {images.length}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
