"use client";

import React, { useRef, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { cn } from "../../lib/utils"

gsap.registerPlugin(ScrollTrigger)

interface TextRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: number
  duration?: number
  scrub?: boolean
  splitBy?: "chars" | "words" | "lines"
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div"
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  className,
  delay = 0,
  stagger = 0.02,
  duration = 0.8,
  scrub = false,
  splitBy = "chars",
  as: Component = "div",
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!textRef.current || !containerRef.current) return

    const text = textRef.current.textContent || ""
    let elements: string[] = []

    switch (splitBy) {
      case "chars":
        elements = text.split("")
        break
      case "words":
        elements = text.split(" ")
        break
      case "lines":
        elements = [text]
        break
    }

    // Create wrapped spans
    textRef.current.innerHTML = elements
      .map((el, i) => {
        const content = el === " " ? "&nbsp;" : el
        const separator = splitBy === "words" && i < elements.length - 1 ? "&nbsp;" : ""
        return `<span class="inline-block overflow-hidden"><span class="inline-block reveal-char">${content}</span></span>${separator}`
      })
      .join("")

    const chars = textRef.current.querySelectorAll(".reveal-char")

    gsap.set(chars, { y: "110%", opacity: 0 })

    const animationConfig: gsap.TweenVars = {
      y: "0%",
      opacity: 1,
      duration,
      stagger,
      ease: "power4.out",
      delay,
    }

    if (scrub) {
      gsap.to(chars, {
        ...animationConfig,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      })
    } else {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 85%",
        onEnter: () => {
          gsap.to(chars, animationConfig)
        },
        once: true,
      })
    }
  }, { scope: containerRef, dependencies: [children] })

  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)}>
      <Component ref={textRef as any} className="leading-tight">
        {children}
      </Component>
    </div>
  )
}

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.8,
  direction = "up",
  distance = 40,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!ref.current) return

    const directionMap = {
      up: { y: distance },
      down: { y: -distance },
      left: { x: distance },
      right: { x: -distance },
      none: {},
    }

    gsap.from(ref.current, {
      ...directionMap[direction],
      opacity: 0,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    })
  }, { scope: ref })

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
