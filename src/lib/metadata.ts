import { Metadata } from 'next'
import { getPageMetadata } from './sanity'
import { getSiteSettings } from './sanity'

interface BuildMetadataOptions {
  page: string
  locale: string
  fallback?: {
    title: string
    description: string
  }
}

export async function buildPageMetadata({
  page,
  locale,
  fallback,
}: BuildMetadataOptions): Promise<Metadata> {
  const [pageMeta, settings] = await Promise.all([
    getPageMetadata(page),
    getSiteSettings(),
  ])

  const siteUrl = settings?.seo?.siteUrl || 'https://diegonr.com'
  const twitterHandle = settings?.seo?.twitterHandle || '@diegonr'
  const brandName = settings?.brand?.name || 'Diego NR'
  const localeKey = locale as 'es' | 'en'
  const ogLocale = locale === 'en' ? 'en_US' : 'es_ES'

  const title = pageMeta?.metaTitle?.[localeKey] || fallback?.title || `${brandName} | Portfolio`
  const description = pageMeta?.metaDescription?.[localeKey] || fallback?.description || ''
  const keywords = pageMeta?.keywords?.[localeKey] || []
  const robotsIndex = pageMeta?.robotsIndex ?? true

  const pathMap: Record<string, string> = {
    home: '',
    about: '/about',
    services: '/services',
    projects: '/projects',
    blog: '/blog',
    contact: '/contact',
  }
  const path = pathMap[page] || '/'

  const ogImageUrl = `/og?title=${encodeURIComponent(title)}&type=${page}&lang=${locale}`

  return {
    title,
    description,
    ...(keywords.length > 0 && { keywords }),
    authors: [{ name: brandName }],
    creator: brandName,
    publisher: brandName,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        es: `/es${path}`,
        en: `/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}${path}`,
      siteName: `${brandName} Portfolio`,
      locale: ogLocale,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: twitterHandle,
      images: [ogImageUrl],
    },
    robots: {
      index: robotsIndex,
      follow: robotsIndex,
      googleBot: {
        index: robotsIndex,
        follow: robotsIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}
