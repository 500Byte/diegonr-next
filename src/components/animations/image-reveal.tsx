import { useRef } from "react"
import Image from "next/image"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import { cn } from "@/lib/utils"

interface ImageRevealProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  className?: string
  containerClassName?: string
  direction?: "left" | "right" | "up" | "down"
  delay?: number
  duration?: number
}

export function ImageReveal({
  src,
  alt,
  width,
  height,
  className,
  containerClassName,
  direction = "left",
  delay = 0,
  duration = 1.2,
}: ImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  
  const directionStyles = {
    left: { x: "-100%", originX: "100%" },
    right: { x: "100%", originX: "0%" },
    up: { y: "-100%", originY: "100%" },
    down: { y: "100%", originY: "0%" },
  }
  
  useGSAP(() => {
    if (!containerRef.current || !imageRef.current || !overlayRef.current) return
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    })
    
    // Reveal overlay
    tl.to(overlayRef.current, {
      scaleX: direction === "left" || direction === "right" ? 0 : 1,
      scaleY: direction === "up" || direction === "down" ? 0 : 1,
      duration: duration,
      ease: "power4.inOut",
      delay: delay,
      transformOrigin: direction === "left" ? "right" : direction === "right" ? "left" : direction === "up" ? "bottom" : "top",
    })
    
    // Scale up image for parallax feel
    tl.from(
      imageRef.current,
      {
        scale: 1.3,
        duration: duration * 1.5,
        ease: "power3.out",
      },
      `-=${duration * 0.8}`
    )
  }, { scope: containerRef, dependencies: [direction, delay, duration] })
  
  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", containerClassName)}
    >
      {/* Image wrapper */}
      <div ref={imageRef} className="w-full h-full relative">
        <Image
          src={src}
          alt={alt}
          width={typeof width === 'number' ? width : 800}
          height={typeof height === 'number' ? height : 600}
          className={cn("w-full h-full object-cover", className)}
        />
      </div>
      
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-swiss-black z-10"
        style={{
          transformOrigin: direction === "left" ? "right" : direction === "right" ? "left" : direction === "up" ? "bottom" : "top",
        }}
      />
    </div>
  )
}
