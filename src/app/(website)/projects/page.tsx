import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProjects, ExtendedProject } from '@/lib/sanity';
import { PageHeader } from '@/components/PageHeader';
import { SwissContainer } from '@/components/Layout';
import { FadeIn } from '@/components/animations/text-reveal';
import { ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Proyectos | Diego NR',
  description: 'Una colección de experimentos, productos y soluciones digitales construidas con precisión y propósito. Explora mi portafolio de desarrollo full-stack.',
  keywords: ['proyectos', 'portafolio', 'desarrollo', 'full-stack', 'soluciones digitales', 'productos'],
  authors: [{ name: 'Diego NR' }],
  creator: 'Diego NR',
  publisher: 'Diego NR',
  metadataBase: new URL('https://diegonr.com'),
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Proyectos | Diego NR',
    description: 'Una colección de experimentos, productos y soluciones digitales construidas con precisión y propósito.',
    url: '/projects',
    siteName: 'Diego NR Portfolio',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og?title=Proyectos&type=Portfolio&subtitle=Trabajos Seleccionados',
        width: 1200,
        height: 630,
        alt: 'Proyectos - Diego NR Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proyectos | Diego NR',
    description: 'Una colección de experimentos, productos y soluciones digitales construidas con precisión y propósito.',
    creator: '@diegonr',
    images: ['/og?title=Proyectos&type=Portfolio&subtitle=Trabajos Seleccionados'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


export default async function ProjectsPage() {
  const projects = await getAllProjects();
  return (
    <div className="page-content">
      <PageHeader 
        title="PROYECTOS" 
        subtitle="Trabajos Seleccionados"
        description="Una colección de experimentos, productos y soluciones digitales construidas con precisión y propósito."
      />
      
      <section className="py-24">
        <SwissContainer>
          <div className="space-y-0">
            {projects.map((project: ExtendedProject, index: number) => {
              const cats = project.category || [];
              return (
              <FadeIn key={project.uid} delay={index * 0.1}>
                <Link 
                  href={`/projects/${project.uid}`}
                  className="group border-b border-white/10 py-12 md:py-20 flex flex-col md:flex-row md:items-center justify-between cursor-pointer block"
                >
                  <div className="flex items-baseline gap-8">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">0{index + 1}</span>
                    <h2 className="text-5xl md:text-8xl font-medium tracking-tighter group-hover:italic transition-all duration-500">
                      {project.title as string}
                    </h2>
                  </div>
                  <div className="flex items-center gap-12 mt-8 md:mt-0">
                    <div className="text-right">
                      <p className="font-mono text-[10px] text-white/60 uppercase tracking-widest mb-1">{cats.join(" / ")}</p>
                      <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{project.year as string}</p>
                    </div>
                    <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
              );
            })}
          </div>
        </SwissContainer>
      </section>
    </div>
  );
}
