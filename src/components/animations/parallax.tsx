import { useRef, type ReactNode } from "react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import { cn } from "@/lib/utils"

interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
  direction?: "vertical" | "horizontal"
}

export function Parallax({
  children,
  speed = 0.5,
  className,
  direction = "vertical",
}: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  
  useGSAP(() => {
    if (!containerRef.current || !contentRef.current) return
    
    const movement = 100 * speed
    
    gsap.to(contentRef.current, {
      [direction === "vertical" ? "y" : "x"]: -movement,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })
  }, { scope: containerRef, dependencies: [speed, direction] })
  
  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)}>
      <div ref={contentRef} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  )
}
