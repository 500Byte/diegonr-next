"use client";

import { useRef, type ElementType, type ComponentPropsWithoutRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { cn } from "../../lib/utils"

gsap.registerPlugin(ScrollTrigger)

type SplitTextProps<T extends ElementType> = {
  as?: T
  children: string
  className?: string
  splitBy?: "chars" | "words" | "lines"
  animation?: "fade" | "slide" | "rotate" | "scale"
  stagger?: number
  duration?: number
  delay?: number
  trigger?: boolean
} & Omit<ComponentPropsWithoutRef<T>, "children">

export function SplitText<T extends ElementType = "span">({
  as,
  children,
  className,
  splitBy = "chars",
  animation = "slide",
  stagger = 0.02,
  duration = 0.8,
  delay = 0,
  trigger = true,
  ...props
}: SplitTextProps<T>) {
  const Tag = (as || "span") as ElementType
  const containerRef = useRef<HTMLElement>(null)
  
  const getAnimationProps = () => {
    switch (animation) {
      case "fade":
        return { opacity: 0 }
      case "slide":
        return { y: "100%", opacity: 0 }
      case "rotate":
        return { rotateX: 90, opacity: 0, transformOrigin: "bottom" }
      case "scale":
        return { scale: 0, opacity: 0 }
      default:
        return { y: "100%", opacity: 0 }
    }
  }
  
  useGSAP(() => {
    if (!containerRef.current) return
    
    const elements = containerRef.current.querySelectorAll(".split-element")
    
    const animationConfig = {
      ...getAnimationProps(),
      duration,
      stagger,
      ease: "power4.out",
      delay,
    }
    
    if (trigger) {
      gsap.from(elements, {
        ...animationConfig,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
    } else {
      gsap.from(elements, animationConfig)
    }
  }, { scope: containerRef, dependencies: [animation, stagger, duration, delay, trigger] })
  
  const splitContent = () => {
    if (splitBy === "chars") {
      return children.split("").map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span className="split-element inline-block">
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))
    }
    
    if (splitBy === "words") {
      return children.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <span className="split-element inline-block">{word}</span>
        </span>
      ))
    }
    
    // Lines - wrap entire content
    return (
      <span className="inline-block overflow-hidden">
        <span className="split-element inline-block">{children}</span>
      </span>
    )
  }
  
  return (
    <Tag
      {...props}
      ref={containerRef as any}
      className={cn("inline-block", className)}
    >
      {splitContent()}
    </Tag>
  )
}
