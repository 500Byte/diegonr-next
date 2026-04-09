import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllServices, getService } from '@/lib/keystatic';
import { SwissContainer } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { FadeIn } from '@/components/animations/text-reveal';
import { ArrowLeft } from 'lucide-react';
import { Magnetic } from '@/components/Magnetic';
import { notFound } from 'next/navigation';
import { DocumentRenderer } from '@/components/DocumentRenderer';

export async function generateStaticParams() {
  const services = await getAllServices();
  return services.map((service) => ({
    id: service.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const serviceDoc = await getService(id);

  if (!serviceDoc) {
    return {
      title: 'Servicio no encontrado | Diego NR',
      description: 'El servicio que buscas no existe.',
    };
  }

  const service = {
    ...serviceDoc,
    id
  };

  const title = `${service.title} | Servicios - Diego NR`;
  const description = service.description.es.length > 160
    ? service.description.es.substring(0, 157) + '...'
    : service.description.es;

  return {
    title,
    description,
    keywords: [service.title, 'servicio', 'desarrollo', 'consultoría', 'tecnología'],
    authors: [{ name: 'Diego NR' }],
    creator: 'Diego NR',
    publisher: 'Diego NR',
    metadataBase: new URL('https://diegonr.com'),
    alternates: {
      canonical: `/services/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `/services/${id}`,
      siteName: 'Diego NR Servicios',
      locale: 'es_ES',
      type: 'website',
      images: [
        {
          url: `/og?title=${encodeURIComponent(service.title)}&type=Servicio&subtitle=Desarrollo Profesional`,
          width: 1200,
          height: 630,
          alt: `${service.title} - Servicios de Diego NR`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@diegonr',
      images: [`/og?title=${encodeURIComponent(service.title)}&type=Servicio&subtitle=Desarrollo Profesional`],
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

export default async function ServiceSingle({ params }: PageProps) {
  const { id } = await params;
  const serviceDoc = await getService(id);

  if (!serviceDoc) {
    notFound();
  }

  const service = serviceDoc;

  return (
    <div className="page-content">
      <div className="pt-32 pb-12">
        <SwissContainer>
          <Link href="/services" className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors w-fit mb-12">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-[10px] uppercase tracking-widest">Volver a servicios</span>
          </Link>
        </SwissContainer>
      </div>

      <PageHeader 
        title={service.titleObj.es} 
        subtitle="Servicio Especializado"
        description={service.description.es}
      />

      <section className="py-24">
        <SwissContainer>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
            <div className="md:col-span-8">
              <FadeIn>
                <div className="space-y-12">
                  <div className="text-3xl md:text-4xl font-light leading-relaxed text-white/80">
                    <DocumentRenderer document={await service.content()} />
                  </div>
                  
                  <div className="pt-12 space-y-8">
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Lo que ofrezco</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {service.items.map((item, index) => (
                        <div key={index} className="p-8 border border-white/10 hover:border-white/30 transition-colors">
                          <span className="font-mono text-[10px] text-white/20 mb-4 block">0{index + 1}</span>
                          <h3 className="text-xl font-medium tracking-tight mb-2">{item.es}</h3>
                          <p className="text-white/60 font-light text-sm">Excelencia técnica y atención al detalle en cada aspecto de la implementación.</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
            
            <div className="md:col-span-4">
              <div className="sticky top-32 space-y-12">
                <div className="p-8 bg-white/5 border border-white/10">
                  <h4 className="text-lg font-medium mb-6">¿Interesado en este servicio?</h4>
                  <p className="text-white/60 text-sm font-light mb-8 leading-relaxed">
                    Si buscas elevar tu presencia digital con soluciones de alta calidad, hablemos sobre cómo puedo ayudarte.
                  </p>
                  <Magnetic strength={0.2}>
                    <Link href="/contact" className="block w-content py-4 bg-white text-black text-center font-medium uppercase tracking-widest text-[10px] hover:bg-white/90 transition-colors">
                      Empezar Proyecto
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </div>
          </div>
        </SwissContainer>
      </section>
    </div>
  );
}
