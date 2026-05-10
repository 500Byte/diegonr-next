"use client";

import { TextScramble } from "@/components/animations/text-scramble";
import { SwissContainer } from "@/components/Layout";
import { Magnetic } from "@/components/Magnetic";
import { Barcode } from "@/components/ui/barcode";
import { gsap } from "@/lib/gsap";
import { scrollTo } from "@/lib/lenis";
import { useGSAP } from "@gsap/react";
import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const coreStack = [
  "React / Next.js",
  "TypeScript",
  "WordPress / CMS",
  "Node.js",
  "Python",
  "PostgreSQL",
  "AWS / GCP",
  "Docker",
  "LLMs / AI",
];

export function Hero() {
  const t = useTranslations("Hero");
  const sectionRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const tagRef = useRef<HTMLParagraphElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const mousePosRef = useRef({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isReady, setIsReady] = useState(false)
  const rafIdRef = useRef<number | undefined>(undefined)
  const lastUpdateRef = useRef(0)

  // Animate immediately on mount (template.tsx handles page transition)
  useEffect(() => {
    // Small delay to ensure template.tsx fade-in has started
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [])

  // Track mouse for parallax effect and coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      
      // Update refs immediately for GSAP animations
      mousePositionRef.current = { x, y }
      mousePosRef.current = { x: e.clientX, y: e.clientY }
      
      // Throttle React state updates to every 100ms for performance
      const now = Date.now()
      if (now - lastUpdateRef.current > 100) {
        lastUpdateRef.current = now
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = requestAnimationFrame(() => {
          setMousePos(mousePosRef.current)
        })
      }
      
      // Animate parallax elements with GSAP (direct DOM manipulation, no React re-render)
      // Skip if user prefers reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      
      if (gridRef.current) {
        gsap.to(gridRef.current, {
          x: x * 10,
          y: y * 10,
          duration: 0.5,
          ease: "expo.out",
        })
      }

      if (bottomBarRef.current) {
        gsap.to(bottomBarRef.current, {
          scaleX: 0.3 + x * 0.1,
          duration: 0.3,
          ease: "expo.out",
        })
      }

      // Animate name words (parallax effect)
      if (nameRef.current) {
        const words = nameRef.current.querySelectorAll(".name-char")
        words.forEach((word, i) => {
          gsap.to(word, {
            x: x * (i - 0.5) * 3,
            y: y * 2,
            duration: 0.3,
            ease: "expo.out",
          })
        })
      }
    }
    
    window.addEventListener("mousemove", handleMouseMove)
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [])

  useGSAP(() => {
    if (!sectionRef.current || !isReady) return

    // Make section visible immediately (but content still animates)
    sectionRef.current.style.opacity = "1"
    sectionRef.current.style.visibility = "visible"

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Show everything immediately without animation
      if (sectionRef.current) {
        sectionRef.current.style.opacity = "1"
        sectionRef.current.style.visibility = "visible"
      }
      if (tagRef.current) tagRef.current.style.opacity = "1"
      if (nameRef.current) {
        nameRef.current.querySelectorAll(".name-char").forEach(char => {
          ;(char as HTMLElement).style.opacity = "1"
          ;(char as HTMLElement).style.transform = "none"
        })
      }
      if (descriptionRef.current) {
        descriptionRef.current.querySelectorAll("p").forEach(p => {
          ;(p as HTMLElement).style.opacity = "1"
          ;(p as HTMLElement).style.transform = "none"
        })
      }
      if (sidebarRef.current) {
        sidebarRef.current.querySelectorAll(".sidebar-item").forEach(item => {
          ;(item as HTMLElement).style.opacity = "1"
          ;(item as HTMLElement).style.transform = "none"
        })
      }
      if (scrollIndicatorRef.current) scrollIndicatorRef.current.style.opacity = "1"
      return
    }

    const tl = gsap.timeline()

    // Animate tag with glitch effect
    if (tagRef.current) {
      tl.from(tagRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      })
    }

    // Animate name - dramatic entrance (by words, not letters)
    if (nameRef.current) {
      const words = nameRef.current.querySelectorAll(".name-char")
      tl.from(
        words,
        {
          y: "120%",
          rotateX: 90,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
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
  }, { scope: sectionRef, dependencies: [isReady] })

  // Split name into words for animation - prevents breaking by letters
  const nameWords = ["DIEGO", "NAVARRO"]
  const nameElements = nameWords.map((word, i) => (
    <span key={i} className="inline-block overflow-hidden perspective-1000 whitespace-nowrap">
      <span className="name-char inline-block">
        {word}
      </span>
      {i < nameWords.length - 1 && <span className="inline-block">&nbsp;</span>}
    </span>
  ))

  return (
    <section
      ref={sectionRef}
      id="home"
      data-reveal="hero"
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
            <TextScramble text={t("tag")} delay={1500} />
          </p>

          <h1
            ref={nameRef}
            className="text-[12vw] md:text-[10vw] lg:text-[8vw] mb-8 tracking-tighter leading-[0.85] font-medium"
            style={{ perspective: "1000px" }}
          >
            {nameElements}
          </h1>

          <div ref={descriptionRef} className="space-y-4 max-w-xl">
            <p className="text-base md:text-lg text-swiss-white/80 leading-relaxed">
              {t("description_1")}
            </p>
            <p className="text-base md:text-lg text-swiss-white/60 leading-relaxed">
              {t("description_2")}
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
              <span className="font-mono text-xs uppercase tracking-widest">{t("cta")}</span>
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
                [{t("status")}: ACTIVE]
              </span>
            </div>
          </div>

          <div className="sidebar-item">
            <p className="font-mono text-xs text-white/50 mb-3 uppercase tracking-widest">
              {t("core_stack")}:
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
              {t("location")}:
            </p>
            <p className="font-mono text-[10px] text-white/60 uppercase tracking-widest">
              {t("remote_worldwide")}
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
              [X: {Math.round(mousePos.x)} Y: {Math.round(mousePos.y)}]
            </p>
          </div>
        </div>
      </SwissContainer>

      <div
        ref={bottomBarRef}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </section>
  )
}
