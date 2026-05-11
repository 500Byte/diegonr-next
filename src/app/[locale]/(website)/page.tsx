import React from 'react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { Hero } from './_sections/Hero';
import { About } from './_sections/About';
import { Works } from './_sections/Works';
import { Vision } from './_sections/Vision';
import { Services } from './_sections/Services';
import { BlogSection } from './_sections/BlogSection';
import { MarqueeBanner } from '@/components/ui/marquee-banner';
import { getAllProjects, getAllServices, getAllPosts } from '@/lib/sanity';
import { buildPageMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return buildPageMetadata({
    page: 'home',
    locale,
    fallback: {
      title: t('home_title'),
      description: t('home_description'),
    },
  });
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Marquee' });
  const projects = await getAllProjects();
  const services = await getAllServices();
  const blogPosts = await getAllPosts();

  return (
    <>
      <Hero />
      <MarqueeBanner text={t('text_1')} speed={60} />
      <About />
      <Works projects={projects} />
      <MarqueeBanner text={t('text_2')} speed={80} direction="right" />
      <Services services={services} />
      <BlogSection blogPosts={blogPosts} />
      <Vision />
    </>
  );
}
