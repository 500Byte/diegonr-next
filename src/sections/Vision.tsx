"use client";

import React, { useState } from 'react';
import { SwissContainer } from '../components/Layout';
import { Magnetic } from '../components/Magnetic';
import { TextReveal, FadeIn } from '../components/animations/text-reveal';
import { cn } from '../lib/utils';

const tabs = [
  {
    title: "Visión",
    content: "Mi visión es redefinir la interacción digital a través de un diseño suizo minimalista y funcional. Creo que la simplicidad es la máxima sofisticación, y mi objetivo es crear interfaces que no solo sean visualmente impactantes, sino también intuitivas y accesibles para todos los usuarios."
  },
  {
    title: "Componente",
    content: "Cada componente que desarrollo es una pieza de ingeniería artesanal. Utilizo las últimas tecnologías como React, GSAP y Tailwind CSS para construir sistemas de diseño robustos y escalables. Mi enfoque se centra en la modularidad y el rendimiento, garantizando una experiencia fluida en cualquier dispositivo."
  },
  {
    title: "Misión",
    content: "Mi misión es ayudar a marcas y empresas a destacar en el saturado mundo digital. A través de una combinación estratégica de diseño y desarrollo, transformo ideas complejas en soluciones digitales elegantes que generan resultados tangibles y dejan una impresión duradera en la audiencia."
  }
];

export const Vision: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="vision" className="py-24 md:py-48 bg-swiss-black text-swiss-white overflow-hidden border-t border-white/5">
      <SwissContainer>
        <div className="grid grid-cols-12 gap-8 mb-24">
          <div className="col-span-12 lg:col-span-4">
            <FadeIn>
              <p className="font-mono text-xs text-white/60 mb-4 uppercase tracking-widest">
                [04 — PHILOSOPHY]
              </p>
            </FadeIn>
            <TextReveal
              as="h2"
              className="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9]"
              splitBy="chars"
              stagger={0.03}
            >
              CORE<br />VALUES
            </TextReveal>
          </div>
          
          <div className="col-span-12 lg:col-span-8 lg:pt-12">
            <div className="flex flex-wrap gap-x-8 md:gap-x-12 gap-y-6 border-b border-white/10 pb-8">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "relative text-2xl md:text-4xl font-medium tracking-tighter transition-all duration-500 uppercase",
                    activeTab === i ? "text-white" : "text-white/20 hover:text-white/40"
                  )}
                >
                  <span className="font-mono text-[10px] absolute -top-4 -left-2 opacity-60">
                    0{i + 1}
                  </span>
                  {tab.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-start-5 lg:col-span-7">
            <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
              <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                <div className="text-[12vw] md:text-[8vw] font-medium leading-none opacity-10 select-none font-mono">
                  0{activeTab + 1}
                </div>
                <div className="flex-1">
                  <p className="text-2xl md:text-3xl lg:text-4xl font-light leading-tight text-white/90 mb-8">
                    {tabs[activeTab].content}
                  </p>
                  <div className="h-px bg-white/20 w-24 mb-8" />
                  <p className="font-mono text-[10px] text-white/60 uppercase tracking-[0.3em]">
                    ESTABLISHED PRINCIPLE // {tabs[activeTab].title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SwissContainer>
    </section>
  );
};
