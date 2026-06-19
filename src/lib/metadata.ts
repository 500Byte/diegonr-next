import { Metadata } from 'next'
import { getPageMetadata, urlFor, getSiteSettings } from './sanity'
import { resolveI18n } from './sanity.utils'

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

  // Sanity Site Settings as primary source of truth
  const siteUrl = settings?.seo?.siteUrl || 'https://diegonr.com'
  const brandName = settings?.brand?.name || 'Diego NR'
  const ogLocale = locale === 'en' ? 'en_US' : 'es_ES'

  // Resolve localized fields from PageMetadata
  // Handles both field_locale and { es, en } object patterns
  const getLocalized = (field: any, key: string) => {
    const resolved = resolveI18n<any>(pageMeta, key, locale)
    if (typeof resolved === 'string') return resolved
    return field?.[locale]
  }

  const title = getLocalized(pageMeta?.metaTitle, 'metaTitle') || fallback?.title || `${brandName} | Portfolio`
  const description = getLocalized(pageMeta?.metaDescription, 'metaDescription') || fallback?.description || ''
  const keywords = getLocalized(pageMeta?.keywords, 'keywords') || []
  const robotsIndex = pageMeta?.robotsIndex ?? true

  const path = page === 'home' ? '' : `/${page}`

  const ogImageUrl = pageMeta?.ogImage
    ? urlFor(pageMeta.ogImage).width(1200).height(630).url()
    : `/og?title=${encodeURIComponent(title)}&type=${page}&lang=${locale}`

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
      siteName: brandName,
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
