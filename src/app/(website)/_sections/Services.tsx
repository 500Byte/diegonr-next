"use client";

import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { TextReveal, FadeIn } from "@/components/animations/text-reveal"
import { Magnetic } from "@/components/Magnetic"
import { ServiceDocument } from "@/types"
import * as prismic from "@prismicio/client"
import { cn } from "@/lib/utils"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { SwissContainer } from "@/components/Layout"

export function Services({ services }: { services: ServiceDocument[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeTab, setActiveTab] = useState(services?.[0]?.uid || '')
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

  const activeService = services.find((s) => s.uid === activeTab)

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 md:py-48 border-t border-white/5 bg-swiss-black overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-full h-full opacity-[0.05] pointer-events-none">
        <div className="absolute -bottom-20 -right-20 text-[25rem] font-medium text-white leading-none tracking-tighter">
          03
        </div>
      </div>

      <SwissContainer className="relative">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-24">
          <div>
            <FadeIn>
              <p className="font-mono text-xs text-white/60 mb-4 uppercase tracking-widest">
                [03 — SERVICES]
              </p>
            </FadeIn>
            <TextReveal
              as="h2"
              className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tighter"
              splitBy="chars"
              stagger={0.03}
            >
              WHAT I DO
            </TextReveal>
          </div>
          <FadeIn delay={0.3}>
            <p className="text-white/60 max-w-sm md:text-right text-sm uppercase tracking-wider">
              Servicios especializados para transformar ideas en productos digitales excepcionales.
            </p>
          </FadeIn>
        </div>

        {/* Services grid - Desktop accordion style */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12">
          {/* Left - Tab list as vertical accordion */}
          <div className="lg:col-span-5 space-y-6">
            {services.map((service, index) => (
              <button
                key={service.uid}
                onClick={() => setActiveTab(service.uid as string)}
                onMouseEnter={() => setHoveredTab(service.uid)}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "service-card w-full text-left p-8 border relative overflow-hidden transition-all duration-500 group",
                  activeTab === service.uid
                    ? "border-white/20"
                    : "border-white/5 hover:border-white/20",
                )}
                data-cursor-text="SELECT"
              >
                {/* Background fill animation */}
                <div className={cn(
                  "absolute inset-0 bg-white transition-transform duration-500 origin-left",
                  activeTab === service.uid ? "scale-x-100" : "scale-x-0"
                )} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className={cn(
                      "font-mono text-[10px] transition-colors duration-300 uppercase tracking-widest",
                      activeTab === service.uid ? "text-black/60" : "text-white/40"
                    )}>
                      0{index + 1}
                    </span>
                    <ArrowRight className={cn(
                      "w-5 h-5 transition-all duration-300",
                      activeTab === service.uid 
                        ? "text-black rotate-0" 
                        : "text-white/40 -rotate-45 group-hover:rotate-0 group-hover:text-white"
                    )} />
                  </div>
                  <h3 className={cn(
                    "text-3xl font-medium transition-colors duration-300 tracking-tight",
                    activeTab === service.uid ? "text-black" : "text-white"
                  )}>
                    {service.data.title_es}
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
                      [{activeService.uid?.toUpperCase()}]
                    </p>
                  </div>
                  <p className="text-2xl md:text-3xl text-white/90 leading-tight font-light">
                    {prismic.asText(activeService.data.description_es)}
                  </p>
                </div>

                {/* Divider */}
                <div className="content-item h-px bg-white/10" />

                {/* Capabilities grid */}
                <div className="content-item">
                  <p className="font-mono text-[10px] text-white/40 mb-6 uppercase tracking-widest">
                    [CAPABILITIES]
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {activeService.data.items?.map((itemField, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 border border-white/5 hover:border-white/10 transition-colors group"
                      >
                        <span className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                        <span className="text-sm text-white/80 font-light">{itemField.es}</span>
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
                    <span className="font-mono text-xs uppercase tracking-widest">SOLICITAR CONSULTA</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Magnetic>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile - Expandable cards */}
        <div className="lg:hidden space-y-4">
          {services.map((service, index) => (
            <div
              key={service.uid}
              className="service-card border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setActiveTab(activeTab === service.uid ? "" : (service.uid as string))}
                className="w-full p-6 text-left flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] text-swiss-gray-light block mb-1 uppercase tracking-widest">
                    0{index + 1}
                  </span>
                  <h3 className="text-xl font-medium tracking-tight">
                    {service.data.title_es}
                  </h3>
                </div>
                <div className={cn(
                  "w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300",
                  activeTab === service.uid && "bg-white text-black rotate-45"
                )}>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
              
              <div className={cn(
                "overflow-hidden transition-all duration-500",
                activeTab === service.uid ? "max-h-[500px]" : "max-h-0"
              )}>
                <div className="px-6 pb-6 space-y-6 border-t border-white/10 pt-6">
                  <p className="text-white/80 leading-relaxed font-light">
                    {prismic.asText(service.data.description_es)}
                  </p>
                  <div className="space-y-2">
                    {service.data.items?.map((itemField, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-swiss-gray-light font-light">
                        <span className="w-1 h-1 bg-white rounded-full" />
                        {itemField.es}
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
