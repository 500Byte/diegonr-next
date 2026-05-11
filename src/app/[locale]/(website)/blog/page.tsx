import { toPlainText } from '@portabletext/react';
import React from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

import { getAllPosts } from '@/lib/sanity';
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
    page: 'blog',
    locale,
    fallback: {
      title: t('blog_title'),
      description: t('blog_description'),
    },
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogPage' });
  const blogPosts = await getAllPosts();

  return (
    <div className="page-content">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
      />
      
      <section className="py-24">
        <SwissContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            {blogPosts.map((post, index) => (
              <FadeIn key={post.slug?.current} delay={index * 0.1}>
                <Link href={`/blog/${post.slug?.current}`} className="group cursor-pointer space-y-6 block">
                  <div className="aspect-video bg-white/5 border border-white/10 relative overflow-hidden">
                    { post.image && <Image src={urlFor(post.image).url()} alt={`Cover image for ${post.title}`} fill
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                     /> }
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{post.date?.toString()}</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span className="font-mono text-[10px] text-white/60 uppercase tracking-widest">{post.category as string}</span>
                    </div>
                    <h2 className="text-3xl font-medium tracking-tighter group-hover:text-white/80 transition-colors">
                      {post.title as string}
                    </h2>
                    <p className="text-white/60 leading-relaxed font-light line-clamp-2">
                      {toPlainText(post.excerpt || [])}
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
