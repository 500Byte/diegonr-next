"use client";

import React from 'react';
import { SwissContainer } from '../components/Layout';
import { FadeIn } from './animations/text-reveal';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, description }) => {
  return (
    <section className="pt-40 pb-20 border-b border-white/10">
      <SwissContainer>
        {/* Bloque Superior: Subtítulo y Título masivo a ancho completo */}
        <div className="w-full mb-16 lg:mb-24">
          <p className="font-mono text-xs text-white/50 mb-6 uppercase tracking-widest">
            {subtitle}
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem] font-medium leading-[0.85] tracking-tighter break-keep">
            {title}
          </h1>
        </div>

        {/* Bloque Inferior: Descripción alineada a la derecha mediante CSS Grid */}
        {description && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Dejamos un espacio vacío a la izquierda en pantallas grandes para empujar el texto */}
            <div className="hidden md:block md:col-span-6 lg:col-span-7" />
            
            <div className="md:col-span-6 lg:col-span-5">
              <FadeIn delay={0.3}>
                <p className="text-lg md:text-xl text-white/60 leading-relaxed font-light balanced-text">
                  {description}
                </p>
              </FadeIn>
            </div>
          </div>
        )}
      </SwissContainer>
    </section>
  );
};