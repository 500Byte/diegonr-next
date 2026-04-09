"use client";

import { useRef, type ReactNode } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { cn } from "../../lib/utils"

interface MarqueeProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
  repeat?: number
}

export function Marquee({
  children,
  className,
  speed = 50,
  direction = "left",
  pauseOnHover = true,
  repeat = 4,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!trackRef.current || !containerRef.current) return

    const track = trackRef.current
    const items = track.children
    if (items.length === 0) return

    // Calculate total width of one set of items
    const itemWidth = (items[0] as HTMLElement).offsetWidth
    
    // Set initial position based on direction
    const startX = direction === "left" ? 0 : -itemWidth
    const endX = direction === "left" ? -itemWidth : 0

    gsap.set(track, { x: startX })

    const tween = gsap.to(track, {
      x: endX,
      duration: speed,
      ease: "none",
      repeat: -1,
    })

    // Pause on hover
    if (pauseOnHover) {
      const onEnter = () => tween.pause()
      const onLeave = () => tween.resume()
      
      containerRef.current.addEventListener("mouseenter", onEnter)
      containerRef.current.addEventListener("mouseleave", onLeave)
      
      return () => {
        containerRef.current?.removeEventListener("mouseenter", onEnter)
        containerRef.current?.removeEventListener("mouseleave", onLeave)
        tween.kill()
      }
    }

    return () => {
      tween.kill()
    }
  }, { scope: containerRef, dependencies: [speed, direction, pauseOnHover, repeat] })

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden whitespace-nowrap", className)}
    >
      <div ref={trackRef} className="inline-flex">
        {Array.from({ length: repeat }).map((_, i) => (
          <div key={i} className="flex-shrink-0">
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}
