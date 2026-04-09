"use client";

import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { TextReveal, FadeIn } from "../components/animations/text-reveal"
import { Magnetic } from "../components/Magnetic"
import { cn } from "../lib/utils"
import { SwissContainer } from "../components/Layout"

const stats = [
  { value: "5+", label: "Años de experiencia", suffix: "" },
  { value: "50", label: "Proyectos completados", suffix: "+" },
  { value: "20", label: "Clientes satisfechos", suffix: "+" },
]

const skills = [
  { name: "React / Next.js", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "Node.js", level: 88 },
  { name: "Python", level: 82 },
  { name: "PostgreSQL", level: 85 },
  { name: "AWS / GCP", level: 78 },
  { name: "Docker", level: 80 },
  { name: "LLMs / AI", level: 92 },
]

const experiences = [
  { year: "2024", role: "Solutions Architect", company: "Freelance", type: "current" },
  { year: "2022", role: "Senior Full-Stack Developer", company: "Tech Startup", type: "past" },
  { year: "2020", role: "Full-Stack Developer", company: "Digital Agency", type: "past" },
  { year: "2019", role: "Frontend Developer", company: "Startup", type: "past" },
]

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const experienceRef = useRef<HTMLDivElement>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Animate stats with counter effect
    if (statsRef.current) {
      const statItems = statsRef.current.querySelectorAll(".stat-item")
      const statValues = statsRef.current.querySelectorAll(".stat-value")
      
      gsap.from(statItems, {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })
      
      // Counter animation
      statValues.forEach((el) => {
        const target = parseInt(el.getAttribute("data-value") || "0")
        gsap.to(el, {
          textContent: target,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        })
      })
    }

    // Animate skills with reveal bars
    if (skillsRef.current) {
      const skillItems = skillsRef.current.querySelectorAll(".skill-item")
      const skillBars = skillsRef.current.querySelectorAll(".skill-bar-fill")
      
      gsap.from(skillItems, {
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: skillsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })
      
      skillBars.forEach((bar) => {
        const width = bar.getAttribute("data-width")
        gsap.to(bar, {
          width: `${width}%`,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bar,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        })
      })
    }

    // Animate experience timeline
    if (experienceRef.current) {
      const expItems = experienceRef.current.querySelectorAll(".exp-item")
      gsap.from(expItems, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: experienceRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 md:py-48 border-t border-white/5 bg-swiss-black"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.05] pointer-events-none">
        <div className="absolute top-1/4 right-1/4 text-[20rem] font-medium text-white leading-none tracking-tighter">
          01
        </div>
      </div>

      <SwissContainer className="relative">
        {/* Section header */}
        <div className="mb-20">
          <FadeIn>
            <p className="font-mono text-xs text-white/60 mb-4 uppercase tracking-widest">
              [01 — ABOUT]
            </p>
          </FadeIn>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <TextReveal
              as="h2"
              className="text-4xl md:text-5xl lg:text-7xl max-w-2xl font-medium tracking-tighter"
              splitBy="chars"
              stagger={0.03}
            >
              WHO AM I?
            </TextReveal>
            <FadeIn delay={0.4}>
              <p className="text-swiss-gray-light max-w-sm text-right hidden md:block text-sm uppercase tracking-wider">
                Arquitecto de soluciones con pasión por crear experiencias digitales excepcionales.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Left column - Description */}
          <div className="lg:col-span-5 space-y-8">
            <FadeIn delay={0.2}>
              <p className="text-xl md:text-2xl text-white leading-relaxed font-light">
                Soy un desarrollador full-stack con más de{" "}
                <span className="text-white font-medium">5 años de experiencia</span>{" "}
                construyendo productos digitales que combinan diseño excepcional con arquitectura robusta.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <p className="text-lg text-white/70 leading-relaxed">
                Actualmente me especializo en AI-Augmented Development, donde utilizo modelos de lenguaje para automatizar flujos de trabajo y acelerar el ciclo de desarrollo de software.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="text-lg text-white/70 leading-relaxed">
                Creo en escribir código limpio, documentado y mantenible. Cada proyecto es una oportunidad para crear algo elegante en su simplicidad.
              </p>
            </FadeIn>

            {/* CTA */}
            <FadeIn delay={0.5}>
              <div className="pt-4">
                <Magnetic
                  as="a"
                  href="mailto:hola@diegonr.com"
                  strength={0.3}
                  cursorText="HOLA"
                  className="group inline-flex items-center gap-4"
                >
                  <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/60 group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <svg
                      className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </span>
                  <span className="font-mono text-xs text-swiss-gray-light group-hover:text-white transition-colors uppercase tracking-widest">
                    CONTACTAR
                  </span>
                </Magnetic>
              </div>
            </FadeIn>
          </div>

          {/* Right column - Stats, Skills, Experience */}
          <div className="lg:col-span-7 space-y-16">
            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-6 md:gap-12 border-b border-white/10 pb-12 md:pb-16">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-item">
                  <div className="flex items-baseline gap-1">
                    <span
                      className="stat-value text-4xl md:text-6xl lg:text-8xl font-medium tracking-tighter"
                      data-value={stat.value.replace("+", "")}
                    >
                      0
                    </span>
                    {stat.suffix && (
                      <span className="text-xl md:text-3xl lg:text-4xl text-swiss-gray-light">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-white/60 text-[8px] md:text-[10px] mt-2 md:mt-4 leading-tight uppercase tracking-[0.2em]">
                    {stat.label.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div ref={skillsRef}>
              <p className="font-mono text-xs text-white/60 mb-6 uppercase tracking-widest">
                [TECH STACK]
              </p>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className={cn(
                      "skill-item group relative",
                      hoveredSkill && hoveredSkill !== skill.name && "opacity-30"
                    )}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest">{skill.name}</span>
                      <span className="font-mono text-[10px] text-white/60 uppercase tracking-widest">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-px bg-white/10 relative overflow-hidden">
                      <div
                        className="skill-bar-fill absolute inset-y-0 left-0 bg-white"
                        data-width={skill.level}
                        style={{ width: 0 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Timeline */}
            <div ref={experienceRef}>
              <p className="font-mono text-xs text-white/60 mb-6 uppercase tracking-widest">
                [EXPERIENCE]
              </p>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div
                    key={exp.year}
                    className="exp-item flex items-start gap-6 group"
                  >
                    <span className="font-mono text-[10px] text-white/60 w-12 pt-1 uppercase tracking-widest">
                      {exp.year}
                    </span>
                    <div className="flex-1 border-l border-white/10 pl-6 pb-6 group-last:border-transparent">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-medium group-hover:text-white transition-colors">
                          {exp.role}
                        </span>
                        {exp.type === "current" && (
                          <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-mono rounded-sm uppercase tracking-widest">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-white/60 uppercase tracking-widest">
                        {exp.company}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SwissContainer>
    </section>
  )
}
