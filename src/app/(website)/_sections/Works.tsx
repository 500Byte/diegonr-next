"use client";

import { toPlainText } from '@portabletext/react';


import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import { TextReveal, FadeIn } from "@/components/animations/text-reveal"
import { Magnetic } from "@/components/Magnetic"
import { ProjectDocument } from "@/types"

import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { SwissContainer } from "@/components/Layout"

export function Works({ projects }: { projects: ProjectDocument[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })

  // Track mouse for image preview
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
      if (previewRef.current) {
        previewRef.current.style.left = `${e.clientX + 20}px`
        previewRef.current.style.top = `${e.clientY - 88}px`
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useGSAP(() => {
    if (!listRef.current) return

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = listRef.current.querySelectorAll(".project-item")
    
    items.forEach((item) => {
      gsap.from(item, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
    })
  }, { scope: sectionRef })

  // Animate preview image on hover
  useGSAP(() => {
    if (!previewRef.current) return

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    
    if (hoveredProject) {
      gsap.to(previewRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
      })
    } else {
      gsap.to(previewRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power3.in",
      })
    }
  }, { scope: previewRef, dependencies: [hoveredProject] })

  const featuredProjects = projects.filter((p) => p.featured)
  const currentProject = hoveredProject ? featuredProjects.find((p) => p.slug?.current === hoveredProject) : null

  return (
    <section
      ref={sectionRef}
      id="works"
      className="relative py-24 md:py-48 border-t border-white/5 bg-swiss-black overflow-hidden"
    >
      {/* Background number */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 text-[15vw] md:text-[25rem] font-medium text-white leading-none tracking-tighter max-lg:text-[10rem]">
          02
        </div>
      </div>

      {/* Abstract Preview - follows cursor */}
      <div
        ref={previewRef}
        className="fixed pointer-events-none z-50 w-72 h-44 opacity-0 scale-90 hidden lg:block"
      >
        {currentProject && (
          <div className="w-full h-full bg-swiss-black border border-white/10 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(135deg, white 1px, transparent 1px),
                  linear-gradient(-135deg, white 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }} />
            </div>
            <div className="relative z-10 p-5 h-full flex flex-col justify-between">
              <div>
                <p className="font-mono text-white text-[10px] mb-2 uppercase tracking-widest">
                  [{currentProject.category?.[0]?.item?.toString().toUpperCase()}]
                </p>
                <p className="text-lg font-medium leading-tight tracking-tight">
                  {currentProject.title}
                </p>
              </div>
              <div className="flex gap-2">
                {currentProject.tech?.slice(0, 3).map((techField) => (
                  <span key={techField.item?.toString()} className="font-mono text-[9px] text-swiss-gray-light uppercase tracking-widest">
                    {techField.item}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-12 h-12 border-b border-l border-white/10" />
          </div>
        )}
      </div>

      <SwissContainer className="relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <div>
            <FadeIn>
              <p className="font-mono text-xs text-white/60 mb-4 uppercase tracking-widest">
                [02 — WORKS]
              </p>
            </FadeIn>
            <TextReveal
              as="h2"
              className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tighter"
              splitBy="chars"
              stagger={0.03}
            >
              SELECTED PROJECTS
            </TextReveal>
          </div>
          
          <FadeIn delay={0.3}>
            <p className="text-white/60 max-w-sm md:text-right text-sm uppercase tracking-wider">
              Una selección de proyectos que representan mi enfoque en arquitectura de software y experiencia de usuario.
            </p>
          </FadeIn>
        </div>

        <div ref={listRef} className="relative">
          {featuredProjects.map((project, index) => (
            <Link
              key={project.slug?.current}
              href={`/projects/${project.slug?.current}`}
              className={cn(
                "project-item group block py-10 md:py-14 border-t border-white/10 first:border-t-0",
                "transition-all duration-500"
              )}
              onMouseEnter={() => setHoveredProject(project.slug?.current || null)}
              onMouseLeave={() => setHoveredProject(null)}
              data-cursor-text="VIEW"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                <span className={cn(
                  "font-mono text-white/40 w-12 flex-shrink-0 transition-all duration-300 uppercase tracking-widest",
                  hoveredProject === project.slug?.current && "text-white"
                )}>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex-1 overflow-hidden">
                  <h3
                    className={cn(
                      "text-3xl md:text-4xl lg:text-5xl font-medium transition-all duration-500 tracking-tighter",
                      "transform",
                      hoveredProject && hoveredProject !== project.slug?.current
                        ? "text-white/10 translate-x-0"
                        : "text-white",
                      hoveredProject === project.slug?.current && "translate-x-4"
                    )}
                  >
                    {project.title}
                  </h3>
                </div>

                <div className={cn(
                  "hidden lg:flex items-center gap-2 flex-shrink-0 transition-all duration-300",
                  hoveredProject && hoveredProject !== project.slug?.current && "opacity-30"
                )}>
                  {project.category?.slice(0, 2).map((catField) => (
                    <span
                      key={catField.item?.toString()}
                      className="font-mono text-[10px] text-white/60 px-2.5 py-1.5 border border-white/10 uppercase tracking-widest"
                    >
                      {catField.item?.toString().toUpperCase()}
                    </span>
                  ))}
                </div>

                <span className={cn(
                  "font-mono text-white/60 w-16 text-right flex-shrink-0 transition-all duration-300 uppercase tracking-widest",
                  hoveredProject && hoveredProject !== project.slug?.current && "opacity-30"
                )}>
                  {project.year}
                </span>

                <Magnetic
                  as="div"
                  strength={0.5}
                  className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full flex-shrink-0"
                >
                  <div className={cn(
                    "w-full h-full rounded-full flex items-center justify-center transition-all duration-300",
                    hoveredProject === project.slug?.current && "bg-white text-black"
                  )}>
                    <ArrowUpRight className={cn(
                      "w-5 h-5 transition-transform duration-300",
                      hoveredProject === project.slug?.current && "rotate-45"
                    )} />
                  </div>
                </Magnetic>
              </div>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-500 ease-out",
                  "max-h-32 opacity-100 mt-4",
                  "md:max-h-0 md:opacity-0 md:mt-0 md:group-hover:max-h-32 md:group-hover:opacity-100 md:group-hover:mt-6"
                )}
              >
                <div className="flex items-start gap-8 md:ml-20">
                  <p className="text-swiss-gray-light max-w-xl leading-relaxed text-sm">
                    {toPlainText(project.description_es || [])}
                  </p>
                  <div className="hidden md:flex flex-wrap gap-2">
                    {project.tech?.slice(0, 4).map((techField) => (
                      <span
                        key={techField.item?.toString()}
                        className="font-mono text-[9px] text-white/80 px-2 py-1 bg-white/5 rounded-sm uppercase tracking-widest"
                      >
                        {techField.item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className="mt-16 pt-10 border-t border-white/10 flex items-center justify-between">
            <Magnetic
              as={Link}
              href="/projects"
              strength={0.3}
              cursorText="ALL"
              className="group inline-flex items-center gap-4"
            >
              <span className="font-mono text-swiss-gray-light group-hover:text-white transition-colors uppercase tracking-widest">
                [VER TODOS LOS PROYECTOS]
              </span>
              <ArrowUpRight className="w-4 h-4 text-swiss-gray-light group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Magnetic>
            
            <span className="font-mono text-swiss-gray-light hidden md:block uppercase tracking-widest text-[10px]">
              {featuredProjects.length} / {projects.length} PROJECTS
            </span>
          </div>
        </FadeIn>
      </SwissContainer>
    </section>
  )
}
