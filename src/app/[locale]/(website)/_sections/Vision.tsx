"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SwissContainer } from '@/components/Layout';
import { TextReveal, FadeIn } from '@/components/animations/text-reveal';
import { cn } from '@/lib/utils';

export const Vision: React.FC = () => {
  const t = useTranslations('Vision');
  const [activeTab, setActiveTab] = useState(0);

  // Tab data using translations
  const tabs = [
    {
      title: t('tab1_title'),
      content: t('tab1_content')
    },
    {
      title: t('tab2_title'),
      content: t('tab2_content')
    },
    {
      title: t('tab3_title'),
      content: t('tab3_content')
    }
  ];

  return (
    <section id="vision" className="py-24 md:py-48 bg-swiss-black text-swiss-white overflow-hidden border-t border-white/5">
      <SwissContainer>
        <div className="grid grid-cols-12 gap-8 mb-24">
          <div className="col-span-12 lg:col-span-4">
            <FadeIn>
              <p className="font-mono text-xs text-white/60 mb-4 uppercase tracking-widest">
                {t('label')}
              </p>
            </FadeIn>
            <TextReveal
              as="h2"
              className="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9]"
              splitBy="words"
              stagger={0.1}
            >
              {t('heading')}
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
                    {t('footer_label')} // {tabs[activeTab].title}
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
