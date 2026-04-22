import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto | Diego NR',
  description: '¿Tienes un proyecto en mente? Hablemos sobre cómo podemos trabajar juntos. Estoy disponible para consultas, colaboraciones y nuevas oportunidades.',
  keywords: ['contacto', 'consulta', 'colaboración', 'proyecto', 'desarrollo', 'diseño'],
  authors: [{ name: 'Diego NR' }],
  creator: 'Diego NR',
  publisher: 'Diego NR',
  metadataBase: new URL('https://diegonr.com'),
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contacto | Diego NR',
    description: '¿Tienes un proyecto en mente? Hablemos sobre cómo podemos trabajar juntos.',
    url: '/contact',
    siteName: 'Diego NR Portfolio',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og?title=Contacto&type=Contact&subtitle=Solicitar Consulta',
        width: 1200,
        height: 630,
        alt: 'Contacto - Diego NR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contacto | Diego NR',
    description: '¿Tienes un proyecto en mente? Hablemos sobre cómo podemos trabajar juntos.',
    creator: '@diegonr',
    images: ['/og?title=Contacto&type=Contact&subtitle=Solicitar Consulta'],
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

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}