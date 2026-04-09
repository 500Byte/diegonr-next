"use client";

import React, { useEffect } from 'react';
import { SwissContainer } from '../components/Layout';
import { FadeIn } from './animations/text-reveal';
import { SplitText } from './animations/split-text';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, description }) => {
  return (
    <section className="pt-48 pb-24 border-b border-white/10">
      <SwissContainer>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <p className="font-mono text-xs text-white/60 mb-6 uppercase tracking-widest">{subtitle}</p>
            <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-medium leading-[0.85] tracking-tighter mb-12">
              <SplitText>{title}</SplitText>
            </h1>
          </div>
          {description && (
            <div className="md:col-span-4 flex items-end">
              <FadeIn delay={0.5}>
                <p className="text-xl text-white/60 leading-relaxed font-light">
                  {description}
                </p>
              </FadeIn>
            </div>
          )}
        </div>
      </SwissContainer>
    </section>
  );
};
