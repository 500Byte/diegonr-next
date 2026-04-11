import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllServices } from '@/lib/prismic';
import * as prismic from '@prismicio/client';
import { PageHeader } from '@/components/PageHeader';
import { SwissContainer } from '@/components/Layout';
import { FadeIn } from '@/components/animations/text-reveal';

export const metadata: Metadata = {
  title: 'Servicios | Diego NR',
  description: 'Ofrezco un enfoque integral para el desarrollo de productos digitales, desde la concepción hasta el despliegue. Desarrollo full-stack, arquitectura de soluciones e IA.',
  keywords: ['servicios', 'desarrollo full-stack', 'arquitectura', 'IA', 'consultoría', 'productos digitales'],
  authors: [{ name: 'Diego NR' }],
  creator: 'Diego NR',
  publisher: 'Diego NR',
  metadataBase: new URL('https://diegonr.com'),
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Servicios | Diego NR',
    description: 'Ofrezco un enfoque integral para el desarrollo de productos digitales, desde la concepción hasta el despliegue.',
    url: '/services',
    siteName: 'Diego NR Servicios',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og?title=Servicios&type=Services&subtitle=Capacidades y Soluciones',
        width: 1200,
        height: 630,
        alt: 'Servicios - Diego NR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Servicios | Diego NR',
    description: 'Ofrezco un enfoque integral para el desarrollo de productos digitales, desde la concepción hasta el despliegue.',
    creator: '@diegonr',
    images: ['/og?title=Servicios&type=Services&subtitle=Capacidades y Soluciones'],
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

export default async function ServicesPage() {
  const services = await getAllServices();
  return (
    <div className="page-content">
      <PageHeader 
        title="SERVICIOS" 
        subtitle="Capacidades & Soluciones"
        description="Ofrezco un enfoque integral para el desarrollo de productos digitales, desde la concepción hasta el despliegue."
      />
      
      <section className="py-24 md:py-48">
        <SwissContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
            {services.map((service, index) => (
              <FadeIn key={service.uid} delay={index * 0.2}>
                <Link href={`/services/${service.uid}`} className="space-y-8 block group">
                  <div className="h-px bg-white/20 w-full group-hover:bg-white transition-colors" />
                  <h2 className="text-3xl font-medium tracking-tighter">{service.data.title_es as string}</h2>
                  <p className="text-white/60 leading-relaxed font-light">
                    {prismic.asText(service.data.description_es)}
                  </p>
                  <ul className="space-y-3 pt-4">
                    {service.data.items?.map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-white rounded-full opacity-40" />
                        <span className="font-mono text-[10px] text-white/80 uppercase tracking-widest">{item.es as string}</span>
                      </li>
                    ))}
                  </ul>
                </Link>
              </FadeIn>
            ))}
          </div>
        </SwissContainer>
      </section>
    </div>
  );
}
