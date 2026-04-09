"use client";

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { cn } from "../../lib/utils"

gsap.registerPlugin(ScrollTrigger)

interface MarqueeBannerProps {
  text: string
  speed?: number
  direction?: "left" | "right"
  className?: string
}

export function MarqueeBanner({
  text,
  speed = 100,
  direction = "left",
  className,
}: MarqueeBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!trackRef.current) return

    const track = trackRef.current
    const items = track.children
    if (items.length === 0) return

    // Calculate width of one set of items
    const itemWidth = (items[0] as HTMLElement).offsetWidth
    
    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "none" }
    })

    const startX = direction === "left" ? 0 : -itemWidth
    const endX = direction === "left" ? -itemWidth : 0

    gsap.set(track, { x: startX })

    tl.to(track, {
      x: endX,
      duration: speed,
    })

    // Parallax effect based on scroll using xPercent to avoid conflicts
    gsap.to(track, {
      xPercent: direction === "left" ? -20 : 20,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    })
  }, { scope: containerRef, dependencies: [direction, speed] })

  // Create multiple copies for seamless loop
  const copies = Array(6).fill(text)

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden py-8 border-y border-white/10",
        className
      )}
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap"
        style={{ willChange: "transform" }}
      >
        {copies.map((t, i) => (
          <span
            key={i}
            className="flex-shrink-0 text-7xl md:text-8xl lg:text-9xl font-medium px-8 text-white/10 hover:text-white/20 transition-colors duration-500 tracking-tighter"
            style={{ WebkitTextStroke: "1px currentColor" }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
