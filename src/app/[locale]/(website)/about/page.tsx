import React from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { SwissContainer } from '@/components/Layout';
import { FadeIn } from '@/components/animations/text-reveal';
import { GitHubStats } from '@/components/GitHubStats';
import { SocialActivityFeed } from '@/components/SocialActivityFeed';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('about_title'),
    description: t('about_description'),
    keywords: [
      'sobre mí', 'historia', 'filosofía', 'desarrollador', 'arquitecto',
      'about me', 'story', 'philosophy', 'developer', 'architect'
    ],
    authors: [{ name: 'Diego NR' }],
    creator: 'Diego NR',
    publisher: 'Diego NR',
    metadataBase: new URL('https://diegonr.com'),
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        'es': '/es/about',
        'en': '/en/about',
      },
    },
    openGraph: {
      title: t('about_title'),
      description: t('about_description'),
      url: `/${locale}/about`,
      siteName: 'Diego NR Portfolio',
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
      images: [
        {
          url: `/og?title=About&type=About&subtitle=Story & Philosophy&lang=${locale}`,
          width: 1200,
          height: 630,
          alt: t('about_title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('about_title'),
      description: t('about_description'),
      creator: '@diegonr',
      images: [`/og?title=About&type=About&subtitle=Story & Philosophy&lang=${locale}`],
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

export default function AboutPage() {
  return (
    <div className="page-content">
      <PageHeader 
        title="SOBRE MÍ" 
        subtitle="Mi Historia & Filosofía"
        description="Arquitecto de soluciones digitales con una pasión por la intersección entre el diseño minimalista y la ingeniería de vanguardia."
      />
      
      <section className="py-24 md:py-48">
        <SwissContainer>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-24">
            <div className="md:col-span-6">
              <FadeIn>
                <h2 className="text-4xl md:text-5xl font-medium mb-12 tracking-tighter">EL ENFOQUE</h2>
                <div className="space-y-8 text-lg text-white/70 leading-relaxed font-light">
                  <p>
                    Creo en la simplicidad como la máxima sofisticación. Mi trabajo se centra en eliminar lo innecesario para dejar que la esencia del producto brille.
                  </p>
                  <p>
                    Con más de 5 años de experiencia en el ecosistema digital, he ayudado a startups y empresas consolidadas a escalar sus productos mediante arquitecturas robustas y experiencias de usuario memorables.
                  </p>
                </div>
              </FadeIn>
            </div>
            <div className="md:col-span-6">
              <FadeIn delay={0.2}>
                <div className="aspect-[4/5] bg-white/5 border border-white/10 relative overflow-hidden group">
                  <Image 
                    src="https://picsum.photos/seed/about/800/1000" 
                    alt="Profile" 
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </SwissContainer>
      </section>

      {/* Social Integration Section */}
      <section className="py-24 md:py-48 bg-white/5">
        <SwissContainer>
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-medium mb-6 tracking-tighter">
                PRESENCIA DIGITAL
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Mi actividad en el ecosistema tech y colaboraciones abiertas
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <FadeIn delay={0.2}>
              <GitHubStats />
            </FadeIn>
            <FadeIn delay={0.4}>
              <SocialActivityFeed />
            </FadeIn>
          </div>
        </SwissContainer>
      </section>
    </div>
  );
}
