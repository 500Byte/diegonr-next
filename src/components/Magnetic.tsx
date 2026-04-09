"use client";

import React, { useRef, type ElementType, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type MagneticProps<T extends ElementType = "div"> = {
  as?: T
  children: ReactNode
  className?: string
  strength?: number
  cursorText?: string
} & Omit<ComponentPropsWithoutRef<T>, "children">

export function Magnetic<T extends ElementType = "div">({
  as,
  children,
  className,
  strength = 0.5,
  cursorText,
  ...props
}: MagneticProps<T>) {
  const Tag = (as || "div") as ElementType
  const magneticRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const element = magneticRef.current
    if (!element) return

    const onMouseMove = (e: MouseEvent) => {
      // Disable on touch devices and respect motion preferences
      if (window.matchMedia("(hover: none)").matches) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const { clientX, clientY } = e
      const { left, top, width, height } = element.getBoundingClientRect()
      const x = clientX - (left + width / 2)
      const y = clientY - (top + height / 2)

      gsap.to(element, {
        x: x * strength,
        y: y * strength,
        duration: 0.6,
        ease: 'power3.out',
      })
    }

    const onMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
      })
    }

    element.addEventListener('mousemove', onMouseMove)
    element.addEventListener('mouseleave', onMouseLeave)

    return () => {
      element.removeEventListener('mousemove', onMouseMove)
      element.removeEventListener('mouseleave', onMouseLeave)
    }
  }, { scope: magneticRef, dependencies: [strength] })

  return (
    <Tag
      {...props}
      ref={magneticRef as any}
      className={className}
      data-cursor-text={cursorText}
    >
      {children}
    </Tag>
  )
}
