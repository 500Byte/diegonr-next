import React from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Hero } from './_sections/Hero';
import { About } from './_sections/About';
import { Works } from './_sections/Works';
import { Vision } from './_sections/Vision';
import { Services } from './_sections/Services';
import { BlogSection } from './_sections/BlogSection';
import { MarqueeBanner } from '@/components/ui/marquee-banner';
import { getAllProjects, getAllServices, getAllPosts } from '@/lib/sanity';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('home_title'),
    description: t('home_description'),
    keywords: [
      'desarrollador full-stack', 'arquitecto de soluciones', 'IA',
      'React', 'Next.js', 'TypeScript', 'Node.js', 'diseño UX/UI',
      'full-stack developer', 'solutions architect', 'AI'
    ],
    authors: [{ name: 'Diego NR' }],
    creator: 'Diego NR',
    publisher: 'Diego NR',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://diegonr.com'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'es': '/es',
        'en': '/en',
      },
    },
    openGraph: {
      title: t('home_title'),
      description: t('home_description'),
      url: `/${locale}`,
      siteName: 'Diego NR Portfolio',
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
      images: [
        {
          url: `/og?title=Diego NR&type=Portfolio&subtitle=Solutions Architect • Full-Stack Developer • AI Specialist&lang=${locale}`,
          width: 1200,
          height: 630,
          alt: t('home_title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('home_title'),
      description: t('home_description'),
      creator: '@diegonr',
      images: [`/og?title=Diego NR&type=Portfolio&subtitle=Solutions Architect • Full-Stack Developer • AI Specialist&lang=${locale}`],
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

export default async function Home() {
  const projects = await getAllProjects();
  const services = await getAllServices();
  const blogPosts = await getAllPosts();

  return (
    <>
      <Hero />
      <MarqueeBanner text="SOLUTIONS ARCHITECT • FULL-STACK DEVELOPER • AI SPECIALIST •" speed={60} />
      <About />
      <Works projects={projects} />
      <MarqueeBanner text="UI/UX DESIGN • BACKEND ARCHITECTURE • CLOUD COMPUTING •" speed={80} direction="right" />
      <Services services={services} />
      <BlogSection blogPosts={blogPosts} />
      <Vision />
    </>
  );
}
