import { DocumentRenderer } from '@/components/DocumentRenderer';
import { SwissContainer } from '@/components/Layout';
import { Magnetic } from '@/components/Magnetic';
import { PageHeader } from '@/components/PageHeader';
import { FadeIn } from '@/components/animations/text-reveal';
import { getAllServices, getService, toPlainText } from '@/lib/sanity';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const services = await getAllServices();
  return services.map((service: any) => ({
    id: service.uid,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    return {
      title: 'Servicio no encontrado | Diego NR',
      description: 'El servicio que buscas no existe.',
    };
  }

  const title = `${service.title_es} | Servicios - Diego NR`;
  const descText = toPlainText(service.description_es);
  const description =
    descText.length > 160
      ? descText.substring(0, 157) + '...'
      : descText;

  return {
    title,
    description,
    keywords: [
      (service.title_es as string) || 'Servicio',
      'servicio',
      'desarrollo',
      'consultoría',
      'tecnología',
    ],
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
          url: `/og?title=${encodeURIComponent((service.title_es as string) || '')}&type=Servicio&subtitle=Desarrollo Profesional`,
          width: 1200,
          height: 630,
          alt: `${service.title_es} - Servicios de Diego NR`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@diegonr',
      images: [
        `/og?title=${encodeURIComponent((service.title_es as string) || '')}&type=Servicio&subtitle=Desarrollo Profesional`,
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

export default async function ServiceSingle({ params }: PageProps) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    notFound();
  }

  return (
    <div className="page-content">
      <div className="pt-32 pb-12">
        <SwissContainer>
          <Link
            href="/services"
            className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors w-fit mb-12"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-[10px] uppercase tracking-widest">
              Volver a servicios
            </span>
          </Link>
        </SwissContainer>
      </div>

      <PageHeader
        title={(service.title_es as string) || (service.title as string) || ''}
        subtitle="Servicio Especializado"
        description={toPlainText(service.description_es)}
      />

      <section className="py-24">
        <SwissContainer>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
            <div className="md:col-span-8">
              <FadeIn>
                <div className="space-y-12">
                  <div className="text-3xl md:text-4xl font-light leading-relaxed text-white/80 sanity-content">
                    <DocumentRenderer value={service.content} />
                  </div>

                  <div className="pt-12 space-y-8">
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                      Lo que ofrezco
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {service.items?.map((itemField: any, index: number) => (
                        <div
                          key={index}
                          className="p-8 border border-white/10 hover:border-white/30 transition-colors"
                        >
                          <span className="font-mono text-[10px] text-white/20 mb-4 block">
                            0{index + 1}
                          </span>
                          <h3 className="text-xl font-medium tracking-tight mb-2">
                            {itemField.es as string}
                          </h3>
                          <p className="text-white/60 font-light text-sm">
                            Excelencia técnica y atención al detalle en cada
                            aspecto de la implementación.
                          </p>
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
                  <h4 className="text-lg font-medium mb-6">
                    ¿Interesado en este servicio?
                  </h4>
                  <p className="text-white/60 text-sm font-light mb-8 leading-relaxed">
                    Si buscas elevar tu presencia digital con soluciones de alta
                    calidad, hablemos sobre cómo puedo ayudarte.
                  </p>
                  <Magnetic strength={0.2}>
                    <Link
                      href="/contact"
                      className="block w-content py-4 bg-white text-black text-center font-medium uppercase tracking-widest text-[10px] hover:bg-white/90 transition-colors"
                    >
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
