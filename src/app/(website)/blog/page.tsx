import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { PrismicNextImage } from '@prismicio/next';
import * as prismic from '@prismicio/client';
import { getAllPosts } from '@/lib/prismic';
import { PageHeader } from '@/components/PageHeader';
import { SwissContainer } from '@/components/Layout';
import { FadeIn } from '@/components/animations/text-reveal';
import { ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog | Diego NR',
  description: 'Compartiendo conocimientos sobre tecnología, diseño y el futuro del desarrollo web. Artículos sobre desarrollo full-stack, IA, arquitectura de software y mejores prácticas.',
  keywords: ['blog', 'tecnología', 'desarrollo web', 'IA', 'arquitectura', 'programación', 'full-stack'],
  authors: [{ name: 'Diego NR' }],
  creator: 'Diego NR',
  publisher: 'Diego NR',
  metadataBase: new URL('https://diegonr.com'),
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog | Diego NR',
    description: 'Compartiendo conocimientos sobre tecnología, diseño y el futuro del desarrollo web.',
    url: '/blog',
    siteName: 'Diego NR Blog',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og?title=Blog&type=Articles&subtitle=Pensamientos y Artículos',
        width: 1200,
        height: 630,
        alt: 'Blog - Diego NR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Diego NR',
    description: 'Compartiendo conocimientos sobre tecnología, diseño y el futuro del desarrollo web.',
    creator: '@diegonr',
    images: ['/og?title=Blog&type=Articles&subtitle=Pensamientos y Artículos'],
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

export default async function BlogPage() {
  const blogPosts = await getAllPosts();
  return (
    <div className="page-content">
      <PageHeader 
        title="BLOG" 
        subtitle="Pensamientos & Artículos"
        description="Compartiendo conocimientos sobre tecnología, diseño y el futuro del desarrollo web."
      />
      
      <section className="py-24">
        <SwissContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            {blogPosts.map((post, index) => (
              <FadeIn key={post.uid} delay={index * 0.1}>
                <Link href={`/blog/${post.uid}`} className="group cursor-pointer space-y-6 block">
                  <div className="aspect-video bg-white/5 border border-white/10 relative overflow-hidden">
                    <PrismicNextImage 
                      field={post.data.image} 
                      fallbackAlt="" 
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{post.data.date?.toString()}</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span className="font-mono text-[10px] text-white/60 uppercase tracking-widest">{post.data.category as string}</span>
                    </div>
                    <h2 className="text-3xl font-medium tracking-tighter group-hover:text-white/80 transition-colors">
                      {post.data.title as string}
                    </h2>
                    <p className="text-white/60 leading-relaxed font-light line-clamp-2">
                      {prismic.asText(post.data.excerpt)}
                    </p>
                    <div className="pt-4 flex items-center gap-2 text-white font-medium uppercase tracking-widest text-[10px]">
                      Leer más <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </SwissContainer>
      </section>
    </div>
  );
}
