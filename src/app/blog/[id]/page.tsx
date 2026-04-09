import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getPost } from '@/lib/keystatic';
import { SwissContainer } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { FadeIn } from '@/components/animations/text-reveal';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';
import { DocumentRenderer } from '@/components/DocumentRenderer';
import { StructuredData, generateArticleStructuredData, generateBreadcrumbStructuredData } from '@/components/StructuredData';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    id: post.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const postDoc = await getPost(id);

  if (!postDoc) {
    return {
      title: 'Artículo no encontrado | Diego NR',
      description: 'El artículo que buscas no existe.',
    };
  }

  const post = {
    ...postDoc,
    id
  };

  const title = `${post.title} | Blog - Diego NR`;
  const description = post.excerpt || 'Artículo del blog de Diego NR';

  return {
    title,
    description,
    keywords: [post.category, 'blog', 'desarrollo', 'tecnología', 'IA', 'programación'],
    authors: [{ name: 'Diego NR' }],
    creator: 'Diego NR',
    publisher: 'Diego NR',
    metadataBase: new URL('https://diegonr.com'),
    alternates: {
      canonical: `/blog/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `/blog/${id}`,
      siteName: 'Diego NR Blog',
      locale: 'es_ES',
      type: 'article',
      publishedTime: post.date || undefined,
      authors: ['Diego NR'],
      images: [
        {
          url: `/og?title=${encodeURIComponent(post.title)}&type=Blog&subtitle=${encodeURIComponent(post.category)}`,
          width: 1200,
          height: 630,
          alt: `${post.title} - Blog de Diego NR`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@diegonr',
      images: [`/og?title=${encodeURIComponent(post.title)}&type=Blog&subtitle=${encodeURIComponent(post.category)}`],
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
  
  const post = postDoc;

  return (
    <div className="page-content">
      <div className="pt-32 pb-12">
        <SwissContainer>
          <Link href="/blog" className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors w-fit mb-12">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-[10px] uppercase tracking-widest">Volver al blog</span>
          </Link>
        </SwissContainer>
      </div>

      <PageHeader 
        title={post.title} 
        subtitle={post.date || ''}
        description={post.excerpt}
      />

      <section className="py-24">
        <SwissContainer>
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="aspect-video bg-white/5 overflow-hidden mb-16">
                <Image 
                  src={post.image || ''} 
                  alt={post.title} 
                  fill
                  className="object-cover grayscale"
                />
              </div>

              <div className="flex items-center gap-8 mb-16 py-8 border-y border-white/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white/40" />
                  <span className="font-mono text-[10px] text-white/60 uppercase tracking-widest">{post.readTime} de lectura</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-white/40" />
                  <span className="font-mono text-[10px] text-white/60 uppercase tracking-widest">{post.category}</span>
                </div>
              </div>

              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-2xl font-light leading-relaxed text-white/80 mb-12 italic">
                  {post.excerpt}
                </p>
                <div className="text-xl font-light leading-relaxed text-white/60 space-y-8">
                  <DocumentRenderer document={await post.content()} />
                </div>
              </div>
            </FadeIn>
          </div>
        </SwissContainer>
      </section>
      <StructuredData 
        data={generateArticleStructuredData(
          post.title,
          post.excerpt || post.title,
          `https://diegonr.com/blog/${id}`,
          post.image || '',
          post.date || new Date().toISOString(),
          post.date || new Date().toISOString(),
          [post.category, 'blog', 'tecnología', 'desarrollo']
        )} 
      />
      <StructuredData 
        data={generateBreadcrumbStructuredData([
          { name: 'Inicio', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${id}` }
        ])} 
      />
    </div>
  );
}
