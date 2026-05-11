"use client";

import { scrollTo } from '@/lib/lenis';
import Link from 'next/link';
import React from 'react';
import { SwissContainer } from './Layout';
import { Magnetic } from './Magnetic';

interface FooterErrorProps {
  socialLinks?: { platform: string; url: string }[];
  copyright?: string;
}

export const FooterError: React.FC<FooterErrorProps> = ({ socialLinks, copyright }) => {
  const displayCopyright = copyright || 'DIEGO NAVARRO';

  return (
    <footer className="py-20 md:py-32 bg-swiss-black text-swiss-white border-t border-white/5">
      <SwissContainer>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-8">Navigation</p>
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-lg font-light hover:text-white/60 transition-colors w-fit">
                Home
              </Link>
            </div>
          </div>
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-8">Social</p>
            <div className="flex flex-col gap-4">
              {socialLinks?.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-light hover:text-white/60 transition-colors w-fit"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
          <div className="md:col-span-4 md:text-right">
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-8">Location</p>
            <p className="text-lg font-light">Santa Marta, Colombia</p>
            <p className="text-lg font-light opacity-60">Remote • Global</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="text-[10px] tracking-[0.4em] uppercase opacity-40">
            © {new Date().getFullYear()} {displayCopyright.toUpperCase()}
          </div>
          <div className="flex gap-12 text-[10px] tracking-[0.3em] uppercase">
            <Magnetic strength={0.2}>
              <button 
                onClick={() => scrollTo(0)}
                className="swiss-underline opacity-60 hover:opacity-100 transition-opacity"
              >
                Back to top
              </button>
            </Magnetic>
          </div>
        </div>
      </SwissContainer>
    </footer>
  );
};
