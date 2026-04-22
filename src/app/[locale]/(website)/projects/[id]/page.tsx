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


export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map(project => ({
    id: project.slug?.current,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const projectDoc = await getProject(id);

  if (!projectDoc) {
    return {
      title: 'Proyecto no encontrado | Diego NR',
      description: 'El proyecto que buscas no existe.',
    };
  }

  const project = projectDoc;
  const title = `${project.title} | Diego NR`;
  const descText = toPlainText(project.description_es || []);
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
      'proyecto',
      'portfolio',
      'desarrollo',
    ],
    authors: [{ name: 'Diego NR' }],
    creator: 'Diego NR',
    publisher: 'Diego NR',
    metadataBase: new URL('https://diegonr.com'),
    alternates: {
      canonical: `/projects/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `/projects/${id}`,
      siteName: 'Diego NR Portfolio',
      locale: 'es_ES',
      type: 'article',
      images: [
        {
          url: `/og?title=${encodeURIComponent(project.title as string || '')}&type=Proyecto&subtitle=${encodeURIComponent(cats.join(' • '))}`,
          width: 1200,
          height: 630,
          alt: `${project.title} - Proyecto de Diego NR`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@diegonr',
      images: [
        `/og?title=${encodeURIComponent(project.title as string || '')}&type=Proyecto&subtitle=${encodeURIComponent(cats.join(' • '))}`,
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
  const { id } = await params;
  const projectDoc = await getProject(id);

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
            href="/projects"
            className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors w-fit mb-12"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-[10px] uppercase tracking-widest">
              Volver a proyectos
            </span>
          </Link>
        </SwissContainer>
      </div>

      <PageHeader
        title={project.title as string}
        subtitle={cats.join(' / ')}
        description={toPlainText(project.description_es || [])}
      />

      <section className="py-24">
        <SwissContainer>
          <FadeIn>
            <div className="aspect-video bg-white/5 overflow-hidden mb-24 relative">
              { project.image && <Image src={urlFor(project.image).url()} alt="" fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
               /> }
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
            <div className="md:col-span-4 space-y-12">
              <div>
                <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">
                  Año
                </p>
                <p className="text-xl font-light">{project.year as string}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">
                  Tecnologías
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
            </div>
            <div className="md:col-span-8">
              <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-8">
                Sobre el proyecto
              </p>
              <div className="text-2xl md:text-3xl font-light leading-relaxed text-white/80 portable-text-content">
                <DocumentRenderer field={project.content} />
              </div>

              {project.url && (
                <div className="mt-24 pt-12 border-t border-white/10">
                  <Magnetic strength={0.2}>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 text-2xl font-medium tracking-tighter hover:text-white/60 transition-colors"
                    >
                      Ver sitio en vivo{' '}
                      <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  </Magnetic>
                </div>
              )}
            </div>
          </div>
        </SwissContainer>
      </section>
      <StructuredData
        data={generateProjectStructuredData(
          project.title as string,
          toPlainText(project.description_es || []),
          `https://diegonr.com/projects/${id}`,
          project?.image ? urlFor(project.image).url() : "",
          (project.year as string) || '',
          techs,
          cats.join(' • ')
        )}
      />
      <StructuredData
        data={generateBreadcrumbStructuredData([
          { name: 'Inicio', url: '/' },
          { name: 'Proyectos', url: '/projects' },
          { name: project.title as string, url: `/projects/${id}` },
        ])}
      />
    </div>
  );
}
