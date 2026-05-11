import React from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getAllProjects } from '@/lib/sanity';
import { buildPageMetadata } from '@/lib/metadata';
import { PageHeader } from '@/components/PageHeader';
import { SwissContainer } from '@/components/Layout';
import { FadeIn } from '@/components/animations/text-reveal';
import { ArrowUpRight } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return buildPageMetadata({
    page: 'projects',
    locale,
    fallback: {
      title: t('projects_title'),
      description: t('projects_description'),
    },
  });
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ProjectsPage' });
  const projects = await getAllProjects();

  return (
    <div className="page-content">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
      />
      
      <section className="py-24">
        <SwissContainer>
          <div className="space-y-0">
            {projects.map((project, index) => {
              const cats = project.category?.map(c => c.item?.toString()) || [];
              return (
              <FadeIn key={project.slug?.current} delay={index * 0.1}>
                <Link 
                  href={`/projects/${project.slug?.current}`}
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
