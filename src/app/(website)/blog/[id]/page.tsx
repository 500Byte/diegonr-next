import { DocumentRenderer } from '@/components/DocumentRenderer';
import { SwissContainer } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import {
  StructuredData,
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
} from '@/components/StructuredData';
import { FadeIn } from '@/components/animations/text-reveal';
import { getAllPosts, getPost } from '@/lib/prismic';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import { Metadata } from 'next';
import { PrismicNextImage } from '@prismicio/next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import * as prismic from '@prismicio/client';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({
    id: post.uid,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const postDoc = await getPost(id);

  if (!postDoc) {
    return {
      title: 'Artículo no encontrado | Diego NR',
      description: 'El artículo que buscas no existe.',
    };
  }

  const post = postDoc.data;
  const title = `${post.title} | Blog - Diego NR`;
  const descText = prismic.asText(post.excerpt) || 'Artículo del blog de Diego NR';

  return {
    title,
    description: descText,
    keywords: [
      (post.category as string) || '',
      'blog',
      'desarrollo',
      'tecnología',
      'IA',
      'programación',
    ],
    authors: [{ name: 'Diego NR' }],
    creator: 'Diego NR',
    publisher: 'Diego NR',
    metadataBase: new URL('https://diegonr.com'),
    alternates: {
      canonical: `/blog/${id}`,
    },
    openGraph: {
      title,
      description: descText,
      url: `/blog/${id}`,
      siteName: 'Diego NR Blog',
      locale: 'es_ES',
      type: 'article',
      publishedTime: post.date as string || undefined,
      authors: ['Diego NR'],
      images: [
        {
          url: `/og?title=${encodeURIComponent((post.title as string) || '')}&type=Blog&subtitle=${encodeURIComponent((post.category as string) || '')}`,
          width: 1200,
          height: 630,
          alt: `${post.title} - Blog de Diego NR`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: descText,
      creator: '@diegonr',
      images: [
        `/og?title=${encodeURIComponent((post.title as string) || '')}&type=Blog&subtitle=${encodeURIComponent((post.category as string) || '')}`,
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

export default async function PostSingle({ params }: PageProps) {
  const { id } = await params;
  const postDoc = await getPost(id);

  if (!postDoc) {
    notFound();
  }

  const post = postDoc.data;

  return (
    <div className="page-content">
      <div className="pt-32 pb-12">
        <SwissContainer>
          <Link
            href="/blog"
            className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors w-fit mb-12"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-[10px] uppercase tracking-widest">
              Volver al blog
            </span>
          </Link>
        </SwissContainer>
      </div>

      <PageHeader
        title={post.title as string}
        subtitle={post.date?.toString() || ''}
        description={prismic.asText(post.excerpt)}
      />

      <section className="py-24">
        <SwissContainer>
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="aspect-video bg-white/5 overflow-hidden mb-16 relative">
                <PrismicNextImage
                  field={post.image}
                  fallbackAlt=""
                  fill
                  className="object-cover grayscale"
                />
              </div>

              <div className="flex items-center gap-8 mb-16 py-8 border-y border-white/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white/40" />
                  <span className="font-mono text-[10px] text-white/60 uppercase tracking-widest">
                    {post.read_time as string} de lectura
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-white/40" />
                  <span className="font-mono text-[10px] text-white/60 uppercase tracking-widest">
                    {post.category as string}
                  </span>
                </div>
              </div>

              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-2xl font-light leading-relaxed text-white/80 mb-12 italic">
                  {prismic.asText(post.excerpt)}
                </p>
                <div className="text-xl font-light leading-relaxed text-white/60 space-y-8 prismic-content">
                  <DocumentRenderer field={post.content} />
                </div>
              </div>
            </FadeIn>
          </div>
        </SwissContainer>
      </section>
      <StructuredData
        data={generateArticleStructuredData(
          post.title as string,
          prismic.asText(post.excerpt) || (post.title as string),
          `https://diegonr.com/blog/${id}`,
          prismic.asImageSrc(post.image) || '',
          (post.date as string) || new Date().toISOString(),
          (post.date as string) || new Date().toISOString(),
          [(post.category as string) || 'blog', 'tecnología', 'desarrollo']
        )}
      />
      <StructuredData
        data={generateBreadcrumbStructuredData([
          { name: 'Inicio', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.title as string, url: `/blog/${id}` },
        ])}
      />
    </div>
  );
}
