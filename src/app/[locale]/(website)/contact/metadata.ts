import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('contact_title'),
    description: t('contact_description'),
    keywords: [
      'contacto', 'email', 'consulta', 'proyecto', 'colaboración',
      'contact', 'email', 'inquiry', 'project', 'collaboration'
    ],
    authors: [{ name: 'Diego NR' }],
    creator: 'Diego NR',
    publisher: 'Diego NR',
    metadataBase: new URL('https://diegonr.com'),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        'es': '/es/contact',
        'en': '/en/contact',
      },
    },
    openGraph: {
      title: t('contact_title'),
      description: t('contact_description'),
      url: `/${locale}/contact`,
      siteName: 'Diego NR Portfolio',
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
      images: [
        {
          url: `/og?title=Contact&type=Contact&subtitle=Let's Talk&lang=${locale}`,
          width: 1200,
          height: 630,
          alt: t('contact_title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('contact_title'),
      description: t('contact_description'),
      creator: '@diegonr',
      images: [`/og?title=Contact&type=Contact&subtitle=Let's Talk&lang=${locale}`],
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
