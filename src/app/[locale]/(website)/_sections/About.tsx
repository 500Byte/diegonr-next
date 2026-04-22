"use client";

import { useRef } from "react"
import { gsap } from "@/lib/gsap"
import { useGSAP } from "@gsap/react"
import { TextReveal, FadeIn } from "@/components/animations/text-reveal"
import { Magnetic } from "@/components/Magnetic"
import { cn } from "@/lib/utils"
import { SwissContainer } from "@/components/Layout"
import { useTranslations } from "next-intl"

const getStats = (t: (key: string) => string) => [
  { value: "5+", label: t("stats_experience") },
  { value: "50+", label: t("stats_projects") },
  { value: "20+", label: t("stats_clients") },
]

const skills = [
  "React / Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "AWS / GCP",
  "Docker",
  "LLMs / AI",
  "Tailwind CSS",
  "GSAP",
  "Sanity",
  "GraphQL",
]

const experiences = [
  { year: "2024", role: "Solutions Architect", company: "Freelance", type: "current" },
  { year: "2022", role: "Senior Full-Stack Developer", company: "Tech Startup", type: "past" },
  { year: "2020", role: "Full-Stack Developer", company: "Digital Agency", type: "past" },
  { year: "2019", role: "Frontend Developer", company: "Startup", type: "past" },
]

export function About() {
  const t = useTranslations("About");
  const sectionRef = useRef<HTMLElement>(null)
  const experienceRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Stats are animated via FadeIn component

    // Animate skill badges
    const skillBadges = sectionRef.current.querySelectorAll(".skill-badge")
    gsap.from(skillBadges, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    })

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
        <div className="absolute top-1/4 right-1/4 text-[15vw] md:text-[20rem] font-medium text-white leading-none tracking-tighter max-lg:text-[10rem]">
          01
        </div>
      </div>

      <SwissContainer className="relative">
        {/* Section header */}
        <div className="mb-20">
          <FadeIn>
            <p className="font-mono text-xs text-white/60 mb-4 uppercase tracking-widest">
              {t("label")}
            </p>
          </FadeIn>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <TextReveal
              as="h2"
              className="text-4xl md:text-5xl lg:text-7xl max-w-2xl font-medium tracking-tighter"
              splitBy="chars"
              stagger={0.03}
            >
              {t("heading")}
            </TextReveal>
            <FadeIn delay={0.4}>
              <p className="text-swiss-gray-light max-w-sm text-right hidden md:block text-sm uppercase tracking-wider">
                {t("subtitle")}
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
                {t("bio_1")}
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-lg text-white/70 leading-relaxed">
                {t("bio_2")}
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="text-lg text-white/70 leading-relaxed">
                {t("bio_3")}
              </p>
            </FadeIn>

            {/* CTA */}
            <FadeIn delay={0.5}>
              <div className="pt-4">
                <Magnetic
                  as="a"
                  href="mailto:hola@diegonr.com"
                  strength={0.3}
                  cursorText={t("cta_cursor")}
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
                    {t("cta")}
                  </span>
                </Magnetic>
              </div>
            </FadeIn>
          </div>

          {/* Right column - Stats, Skills, Experience */}
          <div className="lg:col-span-7 space-y-16">
            {/* Stats - Static values */}
            <FadeIn>
              <div className="grid grid-cols-3 gap-6 md:gap-12 border-b border-white/10 pb-12 md:pb-16">
                {getStats(t).map((stat) => (
                  <div key={stat.label} className="stat-item">
                    <div className="flex items-baseline gap-1">
                      <span className="stat-value text-4xl md:text-6xl lg:text-8xl font-medium tracking-tighter">
                        {stat.value}
                      </span>
                    </div>
                    <p className="font-mono text-white/60 text-[8px] md:text-[10px] mt-2 md:mt-4 leading-tight uppercase tracking-[0.2em]">
                      {stat.label.toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Skills - Badge Grid */}
            <FadeIn>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={skill}
                    className={cn(
                      "skill-badge px-3 py-2 border border-white/10 font-mono text-[10px] uppercase tracking-widest",
                      "text-white/80 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300",
                      "reveal-on-scroll"
                    )}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </FadeIn>

            {/* Experience Timeline */}
            <div ref={experienceRef}>
              <p className="font-mono text-xs text-white/60 mb-6 uppercase tracking-widest">
                {t("experience_label")}
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
                            {t("current_badge")}
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
