import { toPlainText } from '@portabletext/react';
import { DocumentRenderer } from '@/components/DocumentRenderer';
import { SwissContainer } from '@/components/Layout';
import { Magnetic } from '@/components/Magnetic';
import { PageHeader } from '@/components/PageHeader';
import { FadeIn } from '@/components/animations/text-reveal';
import { getAllServices, getService } from '@/lib/sanity';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';


export async function generateStaticParams() {
  const services = await getAllServices();
  return services.map(service => ({
    id: service.slug?.current,
  }));
}

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const serviceDoc = await getService(id);

  if (!serviceDoc) {
    return {
      title: `${locale === 'es' ? 'Servicio no encontrado' : 'Service not found'} | Diego NR`,
      description: locale === 'es' ? 'El servicio que buscas no existe.' : 'The service you are looking for does not exist.',
    };
  }

  const service = serviceDoc;
  const titleField = locale === 'en' ? service.title_en : service.title_es;
  const title = `${titleField} | ${locale === 'es' ? 'Servicios' : 'Services'} - Diego NR`;
  const descField = locale === 'en' ? service.description_en : service.description_es;
  const descText = toPlainText(descField || []);
  const description =
    descText.length > 160
      ? descText.substring(0, 157) + '...'
      : descText;

  return {
    title,
    description,
    keywords: [
      (titleField as string) || (locale === 'es' ? 'Servicio' : 'Service'),
      locale === 'es' ? 'servicio' : 'service',
      locale === 'es' ? 'desarrollo' : 'development',
      locale === 'es' ? 'consultoría' : 'consulting',
      locale === 'es' ? 'tecnología' : 'technology',
    ],
    authors: [{ name: 'Diego NR' }],
    creator: 'Diego NR',
    publisher: 'Diego NR',
    metadataBase: new URL('https://diegonr.com'),
    alternates: {
      canonical: `/${locale}/services/${id}`,
      languages: {
        'es': `/es/services/${id}`,
        'en': `/en/services/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/services/${id}`,
      siteName: locale === 'es' ? 'Diego NR Servicios' : 'Diego NR Services',
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
      images: [
        {
          url: `/og?title=${encodeURIComponent((titleField as string) || '')}&type=Servicio&subtitle=${locale === 'es' ? 'Desarrollo Profesional' : 'Professional Development'}&lang=${locale}`,
          width: 1200,
          height: 630,
          alt: `${titleField} - ${locale === 'es' ? 'Servicios de' : 'Services by'} Diego NR`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@diegonr',
      images: [
        `/og?title=${encodeURIComponent((titleField as string) || '')}&type=Servicio&subtitle=${locale === 'es' ? 'Desarrollo Profesional' : 'Professional Development'}&lang=${locale}`,
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
  const { id, locale } = await params;
  const serviceDoc = await getService(id);
  const t = await getTranslations({ locale, namespace: 'ServiceDetail' });

  if (!serviceDoc) {
    notFound();
  }

  const service = serviceDoc;
  const titleField = locale === 'en' ? service.title_en : service.title_es;
  const descField = locale === 'en' ? service.description_en : service.description_es;

  return (
    <div className="page-content">
      <div className="pt-32 pb-12">
        <SwissContainer>
          <Link
            href={`/${locale}/services`}
            className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors w-fit mb-12"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-[10px] uppercase tracking-widest">
              {t('back_link')}
            </span>
          </Link>
        </SwissContainer>
      </div>

      <PageHeader
        title={(titleField as string) || ''}
        subtitle={locale === 'es' ? 'Servicio Especializado' : 'Specialized Service'}
        description={toPlainText(descField || [])}
      />

      <section className="py-24">
        <SwissContainer>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
            <div className="md:col-span-8">
              <FadeIn>
                <div className="space-y-12">
                  <div className="text-3xl md:text-4xl font-light leading-relaxed text-white/80 portable-text-content">
                    <DocumentRenderer field={service.content} />
                  </div>

                  <div className="pt-12 space-y-8">
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                      {t('offerings_label')}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {service.items?.map((itemField: { es?: string; en?: string }, index: number) => (
                        <div
                          key={index}
                          className="p-8 border border-white/10 hover:border-white/30 transition-colors"
                        >
                          <span className="font-mono text-[10px] text-white/20 mb-4 block">
                            0{index + 1}
                          </span>
                          <h3 className="text-xl font-medium tracking-tight mb-2">
                            {locale === 'en' ? itemField.en : itemField.es}
                          </h3>
                          <p className="text-white/60 font-light text-sm">
                            {t('cta_description')}
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
                    {t('cta_title')}
                  </h4>
                  <p className="text-white/60 text-sm font-light mb-8 leading-relaxed">
                    {t('cta_description')}
                  </p>
                  <Magnetic strength={0.2}>
                    <Link
                      href={`/${locale}/contact`}
                      className="block w-content py-4 bg-white text-black text-center font-medium uppercase tracking-widest text-[10px] hover:bg-white/90 transition-colors"
                    >
                      {t('cta_button')}
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
