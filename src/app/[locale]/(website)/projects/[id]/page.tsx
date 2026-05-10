import { toPlainText } from '@portabletext/react';
import { DocumentRenderer } from '@/components/DocumentRenderer';
import { SwissContainer } from '@/components/Layout';
import { Magnetic } from '@/components/Magnetic';
import { PageHeader } from '@/components/PageHeader';
import {
  StructuredData,
  generateBreadcrumbStructuredData,
  generateProjectStructuredData,
} from '@/components/StructuredData';
import { FadeIn } from '@/components/animations/text-reveal';
import { getAllProjects, getProject } from '@/lib/sanity';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';


export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map(project => ({
    id: project.slug?.current,
  }));
}

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const projectDoc = await getProject(id);
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  if (!projectDoc) {
    return {
      title: `${locale === 'es' ? 'Proyecto no encontrado' : 'Project not found'} | Diego NR`,
      description: locale === 'es' ? 'El proyecto que buscas no existe.' : 'The project you are looking for does not exist.',
    };
  }

  const project = projectDoc;
  const title = `${project.title} | Diego NR`;
  const descText = toPlainText(locale === 'es' ? (project.description_es || []) : (project.description_en || []));
  const description =
    descText.length > 160
      ? descText.substring(0, 157) + '...'
      : descText;

  const cats = (project.category?.map(c => c.item?.toString() || '').filter(Boolean) as string[]) || [];
  const techs = (project.tech?.map(c => c.item?.toString() || '').filter(Boolean) as string[]) || [];

  return {
    title,
    description,
    keywords: [
      ...cats,
      ...techs,
      locale === 'es' ? 'proyecto' : 'project',
      'portfolio',
      locale === 'es' ? 'desarrollo' : 'development',
    ],
    authors: [{ name: 'Diego NR' }],
    creator: 'Diego NR',
    publisher: 'Diego NR',
    metadataBase: new URL('https://diegonr.com'),
    alternates: {
      canonical: `/${locale}/projects/${id}`,
      languages: {
        'es': `/es/projects/${id}`,
        'en': `/en/projects/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/projects/${id}`,
      siteName: 'Diego NR Portfolio',
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      type: 'article',
      images: [
        {
          url: `/og?title=${encodeURIComponent(project.title as string || '')}&type=Proyecto&subtitle=${encodeURIComponent(cats.join(' • '))}&lang=${locale}`,
          width: 1200,
          height: 630,
          alt: `${project.title} - ${locale === 'es' ? 'Proyecto de' : 'Project by'} Diego NR`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@diegonr',
      images: [
        `/og?title=${encodeURIComponent(project.title as string || '')}&type=Proyecto&subtitle=${encodeURIComponent(cats.join(' • '))}&lang=${locale}`,
      ],
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
}

export default async function ProjectSingle({ params }: PageProps) {
  const { id, locale } = await params;
  const projectDoc = await getProject(id);
  const t = await getTranslations({ locale, namespace: 'ProjectDetail' });
  const tMeta = await getTranslations({ locale, namespace: 'Metadata' });

  if (!projectDoc) {
    notFound();
  }

  const project = projectDoc;
  const cats = (project.category?.map(c => c.item?.toString() || '').filter(Boolean) as string[]) || [];
  const techs = (project.tech?.map(c => c.item?.toString() || '').filter(Boolean) as string[]) || [];

  return (
    <div className="page-content">
      <div className="pt-32 pb-12">
        <SwissContainer>
          <Link
            href={`/${locale}/projects`}
            className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors w-fit mb-12"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-[10px] uppercase tracking-widest">
              {t('back_link')}
            </span>
          </Link>
        </SwissContainer>
      </div>

      <PageHeader
        title={project.title as string}
        subtitle={cats.join(' / ')}
        description={toPlainText(locale === 'es' ? (project.description_es || []) : (project.description_en || []))}
      />

      <section className="py-24">
        <SwissContainer>
          <FadeIn>
            <div className="aspect-video bg-white/5 overflow-hidden mb-24 relative">
              { project.image && <Image src={urlFor(project.image).url()} alt={`Cover image for ${project.title}`} fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
               /> }
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
            <div className="md:col-span-4 space-y-12">
              <div>
                <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">
                  {t('year_label')}
                </p>
                <p className="text-xl font-light">{project.year as string}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">
                  {t('tech_label')}
                </p>
                <div className="flex flex-wrap gap-3">
                  {techs.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 border border-white/10 rounded-full font-mono text-[10px] text-white/60 uppercase tracking-widest"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {project.technical_specs && project.technical_specs.length > 0 && (
                <div className="pt-12 border-t border-white/10">
                  <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-6">
                    {t('specs_label')}
                  </p>
                  <div className="space-y-4">
                    {project.technical_specs.map((spec, i) => (
                      <div key={i} className="flex justify-between items-baseline gap-4 border-b border-white/5 pb-2">
                        <span className="font-mono text-[10px] text-white/40 uppercase">{spec.label}</span>
                        <span className="text-sm font-light text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="md:col-span-8">
              <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-8">
                {t('about_label')}
              </p>
              <div className="text-2xl md:text-3xl font-light leading-relaxed text-white/80 portable-text-content mb-24">
                <DocumentRenderer field={project.content} />
              </div>

              {/* Case Study Narrative */}
              <div className="space-y-24">
                {(locale === 'es' ? project.challenge_es : project.challenge_en) && (
                  <div className="pt-12 border-t border-white/10">
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-8">
                      {t('challenges_label')}
                    </p>
                    <div className="text-xl font-light leading-relaxed text-white/70 portable-text-content">
                      <DocumentRenderer field={locale === 'es' ? project.challenge_es : project.challenge_en} />
                    </div>
                  </div>
                )}

                {(locale === 'es' ? project.solution_es : project.solution_en) && (
                  <div className="pt-12 border-t border-white/10">
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-8">
                      {t('solution_label')}
                    </p>
                    <div className="text-xl font-light leading-relaxed text-white/70 portable-text-content">
                      <DocumentRenderer field={locale === 'es' ? project.solution_es : project.solution_en} />
                    </div>
                  </div>
                )}

                {(locale === 'es' ? project.results_es : project.results_en) && (
                  <div className="pt-12 border-t border-white/10">
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-8">
                      {t('results_label')}
                    </p>
                    <div className="text-xl font-light leading-relaxed text-white/70 portable-text-content">
                      <DocumentRenderer field={locale === 'es' ? project.results_es : project.results_en} />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-24 pt-12 border-t border-white/10 flex flex-wrap gap-12">
                {project.url && (
                  <Magnetic strength={0.2}>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 text-2xl font-medium tracking-tighter hover:text-white/60 transition-colors"
                    >
                      {t('view_site')}{' '}
                      <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  </Magnetic>
                )}
                {project.github_url && (
                  <Magnetic strength={0.2}>
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 text-2xl font-medium tracking-tighter hover:text-white/60 transition-colors"
                    >
                      {t('view_code')}{' '}
                      <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  </Magnetic>
                )}
              </div>
            </div>
          </div>
        </SwissContainer>
      </section>

      {project.gallery && project.gallery.length > 0 && (
        <section className="py-24 border-t border-white/10">
          <SwissContainer>
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-12">
              {t('gallery_label')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.gallery.map((image, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="aspect-video bg-white/5 overflow-hidden relative">
                    <Image
                      src={urlFor(image).url()}
                      alt={`${project.title} gallery image ${i + 1}`}
                      fill
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                  </div>
                </FadeIn>
              ))}
            </div>
          </SwissContainer>
        </section>
      )}

      <StructuredData
        data={generateProjectStructuredData(
          project.title as string,
          toPlainText(locale === 'es' ? (project.description_es || []) : (project.description_en || [])),
          `https://diegonr.com/projects/${id}`,
          project?.image ? urlFor(project.image).url() : "",
          (project.year as string) || '',
          techs,
          cats.join(' • ')
        )}
      />
      <StructuredData
        data={generateBreadcrumbStructuredData([
          { name: locale === 'es' ? 'Inicio' : 'Home', url: `/${locale}` },
          { name: tMeta('projects_title').split(' | ')[0], url: `/${locale}/projects` },
          { name: project.title as string, url: `/${locale}/projects/${id}` },
        ])}
      />
    </div>
  );
}
