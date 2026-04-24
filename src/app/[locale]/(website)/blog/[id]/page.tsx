import { toPlainText } from '@portabletext/react';
import { DocumentRenderer } from '@/components/DocumentRenderer';
import { SwissContainer } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import {
  StructuredData,
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
} from '@/components/StructuredData';
import { FadeIn } from '@/components/animations/text-reveal';
import { getAllPosts, getPost } from '@/lib/sanity';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';


export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({
    id: post.slug?.current,
  }));
}

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const postDoc = await getPost(id);
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  if (!postDoc) {
    return {
      title: `${locale === 'es' ? 'Artículo no encontrado' : 'Article not found'} | Diego NR`,
      description: locale === 'es' ? 'El artículo que buscas no existe.' : 'The article you are looking for does not exist.',
    };
  }

  const post = postDoc;
  const title = `${post.title} | Blog - Diego NR`;
  const descText = toPlainText(post.excerpt || []) || (locale === 'es' ? 'Artículo del blog de Diego NR' : 'Article from Diego NR blog');

  return {
    title,
    description: descText,
    keywords: [
      (post.category as string) || '',
      'blog',
      locale === 'es' ? 'desarrollo' : 'development',
      locale === 'es' ? 'tecnología' : 'technology',
      'AI',
      locale === 'es' ? 'programación' : 'programming',
    ],
    authors: [{ name: 'Diego NR' }],
    creator: 'Diego NR',
    publisher: 'Diego NR',
    metadataBase: new URL('https://diegonr.com'),
    alternates: {
      canonical: `/${locale}/blog/${id}`,
      languages: {
        'es': `/es/blog/${id}`,
        'en': `/en/blog/${id}`,
      },
    },
    openGraph: {
      title,
      description: descText,
      url: `/${locale}/blog/${id}`,
      siteName: 'Diego NR Blog',
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      type: 'article',
      publishedTime: post.date as string || undefined,
      authors: ['Diego NR'],
      images: [
        {
          url: `/og?title=${encodeURIComponent((post.title as string) || '')}&type=Blog&subtitle=${encodeURIComponent((post.category as string) || '')}&lang=${locale}`,
          width: 1200,
          height: 630,
          alt: `${post.title} - Blog ${locale === 'es' ? 'de' : 'by'} Diego NR`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: descText,
      creator: '@diegonr',
      images: [
        `/og?title=${encodeURIComponent((post.title as string) || '')}&type=Blog&subtitle=${encodeURIComponent((post.category as string) || '')}&lang=${locale}`,
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
  const { id, locale } = await params;
  const postDoc = await getPost(id);
  const t = await getTranslations({ locale, namespace: 'BlogDetail' });
  const tMeta = await getTranslations({ locale, namespace: 'Metadata' });

  if (!postDoc) {
    notFound();
  }

  const post = postDoc;

  return (
    <div className="page-content">
      <div className="pt-32 pb-12">
        <SwissContainer>
          <Link
            href={`/${locale}/blog`}
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
        title={post.title as string}
        subtitle={post.date?.toString() || ''}
        description={toPlainText(post.excerpt || [])}
      />

      <section className="py-24">
        <SwissContainer>
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="aspect-video bg-white/5 overflow-hidden mb-16 relative">
                { post.image && <Image src={urlFor(post.image).url()} alt="" fill
                  className="object-cover grayscale"
                 /> }
              </div>

              <div className="flex items-center gap-8 mb-16 py-8 border-y border-white/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white/40" />
                  <span className="font-mono text-[10px] text-white/60 uppercase tracking-widest">
                    {post.read_time as string} {t('reading_time_suffix')}
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
                  {toPlainText(post.excerpt || [])}
                </p>
                <div className="text-xl font-light leading-relaxed text-white/60 space-y-8 portable-text-content">
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
          toPlainText(post.excerpt || []) || (post.title as string),
          `https://diegonr.com/blog/${id}`,
          post?.image ? urlFor(post.image).url() : "",
          (post.date as string) || new Date().toISOString(),
          (post.date as string) || new Date().toISOString(),
          [(post.category as string) || 'blog', 'tecnología', 'desarrollo']
        )}
      />
      <StructuredData
        data={generateBreadcrumbStructuredData([
          { name: locale === 'es' ? 'Inicio' : 'Home', url: `/${locale}` },
          { name: tMeta('blog_title').split(' | ')[0], url: `/${locale}/blog` },
          { name: post.title as string, url: `/${locale}/blog/${id}` },
        ])}
      />
    </div>
  );
}
