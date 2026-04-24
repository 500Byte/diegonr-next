import { toPlainText } from '@portabletext/react';
import React from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getAllServices } from '@/lib/sanity';
import { PageHeader } from '@/components/PageHeader';
import { SwissContainer } from '@/components/Layout';
import { FadeIn } from '@/components/animations/text-reveal';
import { useLocale } from 'next-intl';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('services_title'),
    description: t('services_description'),
    keywords: [
      'servicios', 'desarrollo full-stack', 'arquitectura', 'IA', 'consultoría',
      'services', 'full-stack development', 'architecture', 'AI', 'consulting'
    ],
    authors: [{ name: 'Diego NR' }],
    creator: 'Diego NR',
    publisher: 'Diego NR',
    metadataBase: new URL('https://diegonr.com'),
    alternates: {
      canonical: `/${locale}/services`,
      languages: {
        'es': '/es/services',
        'en': '/en/services',
      },
    },
    openGraph: {
      title: t('services_title'),
      description: t('services_description'),
      url: `/${locale}/services`,
      siteName: 'Diego NR Portfolio',
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
      images: [
        {
          url: `/og?title=Services&type=Services&subtitle=Capabilities & Solutions&lang=${locale}`,
          width: 1200,
          height: 630,
          alt: t('services_title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('services_title'),
      description: t('services_description'),
      creator: '@diegonr',
      images: [`/og?title=Services&type=Services&subtitle=Capabilities & Solutions&lang=${locale}`],
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

// Client component wrapper for locale
function ServicesList({ services }: { services: Awaited<ReturnType<typeof getAllServices>> }) {
  const locale = useLocale();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
      {services.map((service, index) => (
        <FadeIn key={service.slug?.current} delay={index * 0.2}>
          <Link href={`/services/${service.slug?.current}`} className="space-y-8 block group">
            <div className="h-px bg-white/20 w-full group-hover:bg-white transition-colors" />
            <h2 className="text-3xl font-medium tracking-tighter">
              {locale === 'en' ? service.title_en : service.title_es}
            </h2>
            <p className="text-white/60 leading-relaxed font-light">
              {toPlainText(locale === 'en' ? service.description_en || [] : service.description_es || [])}
            </p>
            <ul className="space-y-3 pt-4">
              {service.items?.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-white rounded-full opacity-40" />
                  <span className="font-mono text-[10px] text-white/80 uppercase tracking-widest">
                    {locale === 'en' ? item.en : item.es}
                  </span>
                </li>
              ))}
            </ul>
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ServicesPage' });
  const services = await getAllServices();

  return (
    <div className="page-content">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
      />
      
      <section className="py-24 md:py-48">
        <SwissContainer>
          <ServicesList services={services} />
        </SwissContainer>
      </section>
    </div>
  );
}
