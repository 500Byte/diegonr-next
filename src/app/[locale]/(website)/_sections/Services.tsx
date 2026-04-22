"use client";

import { toPlainText } from '@portabletext/react';
import { useRef, useState } from "react"
import { gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import { TextReveal, FadeIn } from "@/components/animations/text-reveal"
import { Magnetic } from "@/components/Magnetic"
import { ServiceDocument } from "@/types"
import { cn } from "@/lib/utils"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { SwissContainer } from "@/components/Layout"
import { useTranslations, useLocale } from "next-intl"

export function Services({ services }: { services?: ServiceDocument[] }) {
  const t = useTranslations("Services");
  const locale = useLocale();
  const safeServices = services || []

  // Handle empty services gracefully
  if (safeServices.length === 0) {
    return null
  }

  const sectionRef = useRef<HTMLElement>(null)
  const [activeTab, setActiveTab] = useState(safeServices[0]?.slug?.current || '')
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Animate service cards with stagger
    const cards = sectionRef.current.querySelectorAll(".service-card")
    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 100,
        opacity: 0,
        duration: 1,
        delay: i * 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
    })
  }, { scope: sectionRef })

  // Animate content when tab changes
  useGSAP(() => {
    if (!contentRef.current) return

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = contentRef.current.querySelectorAll(".content-item")
    gsap.fromTo(
      items,
      { opacity: 0, y: 30, scale: 0.98 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.6, 
        stagger: 0.1,
        ease: "power3.out" 
      }
    )
  }, { scope: contentRef, dependencies: [activeTab] })

  const activeService = safeServices.find((s) => s.slug?.current === activeTab)

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 md:py-48 border-t border-white/5 bg-swiss-black overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-full h-full opacity-[0.05] pointer-events-none">
        <div className="absolute -bottom-20 -right-20 text-[15vw] md:text-[25rem] font-medium text-white leading-none tracking-tighter max-lg:text-[10rem]">
          03
        </div>
      </div>

      <SwissContainer className="relative">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-24">
          <div>
            <FadeIn>
              <p className="font-mono text-xs text-white/60 mb-4 uppercase tracking-widest">
                {t("label")}
              </p>
            </FadeIn>
            <TextReveal
              as="h2"
              className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tighter"
              splitBy="chars"
              stagger={0.03}
            >
              {t("heading")}
            </TextReveal>
          </div>
          <FadeIn delay={0.3}>
            <p className="text-white/60 max-w-sm md:text-right text-sm uppercase tracking-wider">
              {t("description")}
            </p>
          </FadeIn>
        </div>

        {/* Services grid - Desktop accordion style */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12">
          {/* Left - Tab list as vertical accordion */}
          <div className="lg:col-span-5 space-y-6">
            {safeServices.map((service, index) => (
              <button
                key={service.slug?.current}
                onClick={() => setActiveTab(service.slug?.current as string)}
                onMouseEnter={() => setHoveredTab(service.slug?.current || null)}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "service-card w-full text-left p-8 border relative overflow-hidden transition-all duration-500 group",
                  activeTab === service.slug?.current
                    ? "border-white/20"
                    : "border-white/5 hover:border-white/20",
                )}
                data-cursor-text="SELECT"
              >
                {/* Background fill animation */}
                <div className={cn(
                  "absolute inset-0 bg-white transition-transform duration-500 origin-left",
                  activeTab === service.slug?.current ? "scale-x-100" : "scale-x-0"
                )} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className={cn(
                      "font-mono text-[10px] transition-colors duration-300 uppercase tracking-widest",
                      activeTab === service.slug?.current ? "text-black/60" : "text-white/40"
                    )}>
                      0{index + 1}
                    </span>
                    <ArrowRight className={cn(
                      "w-5 h-5 transition-all duration-300",
                      activeTab === service.slug?.current
                        ? "text-black rotate-0" 
                        : "text-white/40 -rotate-45 group-hover:rotate-0 group-hover:text-white"
                    )} />
                  </div>
                  <h3 className={cn(
                    "text-3xl font-medium transition-colors duration-300 tracking-tight",
                    activeTab === service.slug?.current ? "text-black" : "text-white"
                  )}>
                    {locale === 'en' ? service.title_en : service.title_es}
                  </h3>
                </div>
              </button>
            ))}
          </div>

          {/* Right - Content panel */}
          <div className="lg:col-span-7">
            {activeService && (
              <div ref={contentRef} className="sticky top-32 space-y-12 p-12 border border-white/10 bg-white/5 backdrop-blur-sm">
                {/* Header */}
                <div className="content-item">
                  <div className="flex items-start justify-between mb-6">
                    <p className="font-mono text-xs text-white uppercase tracking-widest">
                      [{activeService.slug?.current?.toUpperCase()}]
                    </p>
                  </div>
                  <p className="text-2xl md:text-3xl text-white/90 leading-tight font-light">
                    {toPlainText(locale === 'en' ? activeService.description_en || [] : activeService.description_es || [])}
                  </p>
                </div>

                {/* Divider */}
                <div className="content-item h-px bg-white/10" />

                {/* Capabilities grid */}
                <div className="content-item">
                  <p className="font-mono text-[10px] text-white/40 mb-6 uppercase tracking-widest">
                    {t("capabilities_label")}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {activeService.items?.map((itemField, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 border border-white/5 hover:border-white/10 transition-colors group"
                      >
                        <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                        <span className="text-sm text-white/80 font-light">{locale === 'en' ? itemField.en : itemField.es}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="content-item pt-4">
                  <Magnetic
                    as="a"
                    href="mailto:hola@diegonr.com"
                    strength={0.3}
                    cursorText="GO"
                    className="group inline-flex items-center gap-3 px-6 py-3 bg-white text-black hover:bg-white/90 transition-colors"
                  >
                    <span className="font-mono text-xs uppercase tracking-widest">{t("cta")}</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Magnetic>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile - Expandable cards */}
        <div className="lg:hidden space-y-4">
          {safeServices.map((service, index) => (
            <div
              key={service.slug?.current}
              className="service-card border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setActiveTab(activeTab === service.slug?.current ? "" : (service.slug?.current as string))}
                className="w-full p-6 text-left flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] text-swiss-gray-light block mb-1 uppercase tracking-widest">
                    0{index + 1}
                  </span>
                  <h3 className="text-xl font-medium tracking-tight">
                    {locale === 'en' ? service.title_en : service.title_es}
                  </h3>
                </div>
                <div className={cn(
                  "w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300",
                  activeTab === service.slug?.current && "bg-white text-black rotate-45"
                )}>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
              
              <div className={cn(
                "overflow-hidden transition-all duration-500",
                activeTab === service.slug?.current ? "max-h-[500px]" : "max-h-0"
              )}>
                <div className="px-6 pb-6 space-y-6 border-t border-white/10 pt-6">
                  <p className="text-white/80 leading-relaxed font-light">
                    {toPlainText(locale === 'en' ? service.description_en || [] : service.description_es || [])}
                  </p>
                  <div className="space-y-2">
                    {service.items?.map((itemField, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-swiss-gray-light font-light">
                        <span className="w-1 h-1 bg-white rounded-full" />
                        {locale === 'en' ? itemField.en : itemField.es}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SwissContainer>
    </section>
  )
}
