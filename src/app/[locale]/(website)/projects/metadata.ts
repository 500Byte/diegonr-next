import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('projects_title'),
    description: t('projects_description'),
    keywords: [
      'proyectos', 'portafolio', 'trabajos', 'case studies', 'desarrollo web',
      'projects', 'portfolio', 'works', 'case studies', 'web development'
    ],
    authors: [{ name: 'Diego NR' }],
    creator: 'Diego NR',
    publisher: 'Diego NR',
    metadataBase: new URL('https://diegonr.com'),
    alternates: {
      canonical: `/${locale}/projects`,
      languages: {
        'es': '/es/projects',
        'en': '/en/projects',
      },
    },
    openGraph: {
      title: t('projects_title'),
      description: t('projects_description'),
      url: `/${locale}/projects`,
      siteName: 'Diego NR Portfolio',
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
      images: [
        {
          url: `/og?title=Projects&type=Projects&subtitle=Selected Work&lang=${locale}`,
          width: 1200,
          height: 630,
          alt: t('projects_title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('projects_title'),
      description: t('projects_description'),
      creator: '@diegonr',
      images: [`/og?title=Projects&type=Projects&subtitle=Selected Work&lang=${locale}`],
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
