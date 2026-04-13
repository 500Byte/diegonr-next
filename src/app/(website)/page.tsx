import React from 'react';
import { Metadata } from 'next';
import { Hero } from './_sections/Hero';
import { About } from './_sections/About';
import { Works } from './_sections/Works';
import { Vision } from './_sections/Vision';
import { Services } from './_sections/Services';
import { BlogSection } from './_sections/BlogSection';
import { MarqueeBanner } from '@/components/ui/marquee-banner';
import { getAllProjects, getAllServices, getAllPosts } from '@/lib/sanity';

export const metadata: Metadata = {
  title: 'Diego NR | Solutions Architect & Full-Stack Developer',
  description: 'Desarrollador Full-Stack especializado en IA, arquitectura de soluciones y diseño UX/UI. Creo experiencias digitales innovadoras con tecnologías modernas.',
  keywords: ['desarrollador full-stack', 'arquitecto de soluciones', 'IA', 'React', 'Next.js', 'TypeScript', 'Node.js', 'diseño UX/UI'],
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
    canonical: '/',
  },
  openGraph: {
    title: 'Diego NR | Solutions Architect & Full-Stack Developer',
    description: 'Desarrollador Full-Stack especializado en IA, arquitectura de soluciones y diseño UX/UI. Creo experiencias digitales innovadoras.',
    url: '/',
    siteName: 'Diego NR Portfolio',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og?title=Diego NR&type=Portfolio&subtitle=Solutions Architect • Full-Stack Developer • AI Specialist',
        width: 1200,
        height: 630,
        alt: 'Diego NR - Solutions Architect & Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diego NR | Solutions Architect & Full-Stack Developer',
    description: 'Desarrollador Full-Stack especializado en IA, arquitectura de soluciones y diseño UX/UI.',
    creator: '@diegonr',
    images: ['/og?title=Diego NR&type=Portfolio&subtitle=Solutions Architect • Full-Stack Developer • AI Specialist'],
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
