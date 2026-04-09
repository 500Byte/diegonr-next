"use client";

import { useRef, useState, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Barcode } from "../components/ui/barcode"
import { TextScramble } from "../components/animations/text-scramble"
import { Magnetic } from "../components/Magnetic"
import { coreStack } from "@/data"
import { ArrowDown } from "lucide-react"
import { SwissContainer } from "../components/Layout"
import { scrollTo } from "@/lib/lenis";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const tagRef = useRef<HTMLParagraphElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const rawMousePositionRef = useRef({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  // Track mouse for parallax effect and coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      
      // Update refs
      mousePositionRef.current = { x, y }
      rawMousePositionRef.current = { x: e.clientX, y: e.clientY }
      
      // Animate parallax elements with GSAP
      if (gridRef.current) {
        gsap.to(gridRef.current, {
          x: x * 10,
          y: y * 10,
          duration: 0.5,
          ease: "power2.out",
        })
      }
      
      if (bottomBarRef.current) {
        gsap.to(bottomBarRef.current, {
          scaleX: 0.3 + x * 0.1,
          duration: 0.3,
          ease: "power2.out",
        })
      }
      
      // Animate name characters
      if (nameRef.current) {
        const chars = nameRef.current.querySelectorAll(".name-char")
        chars.forEach((char, i) => {
          gsap.to(char, {
            x: x * (i - 6) * 0.5,
            y: y * 2,
            duration: 0.3,
            ease: "power2.out",
          })
        })
      }
    }
    
    window.addEventListener("mousemove", handleMouseMove)
    
    // Delay to sync with preloader
    const timeout = setTimeout(() => setIsLoaded(true), 2000)
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timeout)
    }
  }, [])

  useGSAP(() => {
    if (!sectionRef.current || !isLoaded) return

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tl = gsap.timeline({ delay: 0.2 })

    // Animate tag with glitch effect
    if (tagRef.current) {
      tl.from(tagRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      })
    }

    // Animate name - dramatic entrance
    if (nameRef.current) {
      const chars = nameRef.current.querySelectorAll(".name-char")
      tl.from(
        chars,
        {
          y: "120%",
          rotateX: 90,
          opacity: 0,
          duration: 1,
          stagger: 0.04,
          ease: "power4.out",
          transformOrigin: "bottom",
        },
        "-=0.2"
      )
    }

    // Animate description paragraphs with stagger
    if (descriptionRef.current) {
      const paragraphs = descriptionRef.current.querySelectorAll("p")
      tl.from(
        paragraphs,
        {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.2,
          ease: "power3.out",
        },
        "-=0.6"
      )
    }

    // Animate sidebar
    if (sidebarRef.current) {
      const items = sidebarRef.current.querySelectorAll(".sidebar-item")
      tl.from(
        items,
        {
          x: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
        },
        "-=0.8"
      )
    }

    // Scroll indicator
    if (scrollIndicatorRef.current) {
      tl.from(
        scrollIndicatorRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.3"
      )

      // Continuous bounce animation
      gsap.to(scrollIndicatorRef.current.querySelector(".scroll-arrow"), {
        y: 8,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })
    }
  }, { scope: sectionRef, dependencies: [isLoaded] })

  // Split name into characters for animation with perspective
  const name = "DIEGO NAVARRO"
  const nameChars = name.split("").map((char, i) => (
    <span key={i} className="inline-block overflow-hidden perspective-1000">
      <span className="name-char inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    </span>
  ))

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex flex-col justify-between px-6 pt-24 pb-8 md:px-12 lg:px-20 overflow-hidden"
    >
      <div 
        ref={gridRef}
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <SwissContainer className="relative flex-1 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 mt-8">
        <div className="flex-1 max-w-3xl">
          <p ref={tagRef} className="font-mono text-white/60 mb-4 text-xs">
            <TextScramble text="[ID: SOLUTIONS ARCHITECT]" delay={1500} />
          </p>

          <h1
            ref={nameRef}
            className="text-[12vw] md:text-[10vw] lg:text-[8vw] mb-8 tracking-tighter leading-[0.85] font-medium"
            style={{ perspective: "1000px" }}
          >
            {nameChars}
          </h1>

          <div ref={descriptionRef} className="space-y-4 max-w-xl">
            <p className="text-base md:text-lg text-swiss-white/80 leading-relaxed">
              Soy un Solutions Architect híbrido que fusiona una base nativa en UI/UX con ingeniería de software orientada a la eficiencia. Opero más allá del desarrollo web tradicional, especializándome en{" "}
              <span className="text-swiss-white font-medium">AI-Augmented Development</span>{" "}
              y orquestación de sistemas.
            </p>
            <p className="text-base md:text-lg text-swiss-white/60 leading-relaxed">
              Mi enfoque es agnóstico a la sintaxis pero estricto en la estructura de datos: domino la automatización de flujos de trabajo, pipelines ETL y la industrialización del SDLC.
            </p>
          </div>

          <div className="mt-10">
            <Magnetic
              as="button"
              strength={0.4}
              cursorText="VIEW"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                scrollTo('#works');
              }}
              className="group inline-flex items-center gap-3 px-6 py-3 border border-white/20 hover:border-white/60 transition-colors duration-300"
            >
              <span className="font-mono text-xs uppercase tracking-widest">VER PROYECTOS</span>
              <span className="w-8 h-px bg-white/40 group-hover:w-12 transition-all duration-300" />
            </Magnetic>
          </div>
        </div>

        <div
          ref={sidebarRef}
          className="lg:text-right space-y-8 lg:min-w-[220px]"
        >
          <div className="sidebar-item">
            <div className="flex items-center lg:justify-end gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span className="font-mono text-xs uppercase tracking-widest">
                [STATUS: ACTIVE]
              </span>
            </div>
          </div>

          <div className="sidebar-item">
            <p className="font-mono text-xs text-white/50 mb-3 uppercase tracking-widest">
              CORE STACK:
            </p>
            <ul className="space-y-1.5">
              {coreStack.map((item, i) => (
                <li
                  key={item}
                  className="font-mono text-white/60 text-[10px] hover:text-white transition-colors duration-200 uppercase tracking-widest"
                  style={{
                    transitionDelay: `${i * 50}ms`,
                  }}
                >
                  {`\u2014 ${item}`}
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-item">
            <p className="font-mono text-xs text-white/50 mb-1 uppercase tracking-widest">
              LOCATION:
            </p>
            <p className="font-mono text-[10px] text-white/60 uppercase tracking-widest">
              REMOTE / WORLDWIDE
            </p>
          </div>
        </div>
      </SwissContainer>

      <SwissContainer className="relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mt-auto pt-16">
        <p className="font-mono text-xs text-white/60 uppercase tracking-widest">
          {`DIEGO NAVARRO \u2014 ${new Date().getFullYear()}`}
        </p>

        <div
          ref={scrollIndicatorRef}
          className="absolute left-1/2 -translate-x-1/2 bottom-0 hidden md:flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] text-white/60 uppercase tracking-widest">
            SCROLL
          </span>
          <div className="scroll-arrow">
            <ArrowDown className="w-4 h-4 text-white/60" />
          </div>
        </div>

        <div className="flex items-end gap-4">
          <Barcode />
          <div className="text-right">
            <p className="font-mono text-[10px] text-white/60 uppercase tracking-widest">
              VER: 2.0.5
            </p>
          </div>
        </div>
      </SwissContainer>

      <div className="absolute bottom-8 right-6 md:right-12 lg:right-20 hidden sm:block">
        <p className="font-mono text-[10px] text-white/40 hover:opacity-100 transition-opacity uppercase tracking-widest">
          [X: {Math.round(rawMousePositionRef.current.x)} Y: {Math.round(rawMousePositionRef.current.y)}]
        </p>
      </div>

      <div
        ref={bottomBarRef}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </section>
  )
}
