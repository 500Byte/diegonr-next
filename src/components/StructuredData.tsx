import { Metadata } from 'next'
import type { SiteSettings } from '@/types'

interface StructuredDataPerson {
  '@context': string
  '@type': string
  name: string
  url: string
  sameAs: string[]
  jobTitle: string
  worksFor: {
    '@type': string
    name: string
  }
  knowsAbout: string[]
  hasOccupation: {
    '@type': string
    name: string
    occupationLocation: {
      '@type': string
      addressCountry: string
    }
  }
  description: string
  image: string
  gender: string
}

interface StructuredDataWebSite {
  '@context': string
  '@type': string
  name: string
  url: string
  description: string
  inLanguage: string
  copyrightHolder: {
    '@type': string
    name: string
  }
  potentialAction: {
    '@type': string
    target: string
    'query-input': string
  }
}

interface StructuredDataArticle {
  '@context': string
  '@type': string
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified: string
  author: {
    '@type': string
    name: string
    url: string
  }
  publisher: {
    '@type': string
    name: string
    logo: {
      '@type': string
      url: string
    }
  }
  mainEntityOfPage: {
    '@type': string
    '@id': string
  }
  articleSection: string
  keywords: string[]
}

interface StructuredDataBreadcrumbList {
  '@context': string
  '@type': string
  itemListElement: Array<{
    '@type': string
    position: number
    name: string
    item: string
  }>
}

interface StructuredDataOrganization {
  '@context': string
  '@type': string
  name: string
  url: string
  logo: string
  description: string
  foundingDate: string
  sameAs: string[]
  contactPoint: {
    '@type': string
    contactType: string
    email?: string
    url?: string
  }
}

interface StructuredDataProject {
  '@context': string
  '@type': string
  name: string
  description: string
  image: string
  url: string
  creator: {
    '@type': string
    name: string
    url: string
  }
  dateCreated: string
  programmingLanguage?: string[]
  applicationCategory: string
  operatingSystem?: string
  offers?: {
    '@type': string
    price: string
    priceCurrency: string
  }
}

export function generatePersonStructuredData(settings?: SiteSettings): StructuredDataPerson {
  const siteUrl = settings?.seo?.siteUrl || 'https://diegonr.com';
  const name = settings?.brand?.name || 'Diego NR';
  const sameAs = settings?.socialLinks?.map(l => l.url) || [
    'https://github.com/diegonr',
    'https://linkedin.com/in/diegonr',
    'https://twitter.com/diegonr'
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: siteUrl,
    sameAs,
    jobTitle: 'Solutions Architect & Full-Stack Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance'
    },
    knowsAbout: [
      'Full-Stack Development',
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Python',
      'Artificial Intelligence',
      'Machine Learning',
      'UI/UX Design',
      'System Architecture',
      'Cloud Computing',
      'DevOps'
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Solutions Architect',
      occupationLocation: {
        '@type': 'Country',
        addressCountry: 'ES'
      }
    },
    description: 'Desarrollador Full-Stack especializado en IA, arquitectura de soluciones y diseño UX/UI. Creo experiencias digitales innovadoras con tecnologías modernas.',
    image: 'https://diegonr.com/og?title=Diego NR&type=Portfolio',
    gender: 'Male'
  }
}

export function generateWebSiteStructuredData(settings?: SiteSettings): StructuredDataWebSite {
  const siteUrl = settings?.seo?.siteUrl || 'https://diegonr.com';
  const name = settings?.brand?.name || 'Diego NR';
  const fullName = settings?.brand?.fullName || 'Diego NR';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${fullName} - Solutions Architect & Full-Stack Developer`,
    url: siteUrl,
    description: `Portfolio profesional de ${name}, desarrollador Full-Stack especializado en IA, arquitectura de soluciones y diseño UX/UI.`,
    inLanguage: 'es-ES',
    copyrightHolder: {
      '@type': 'Person',
      name: 'Diego NR'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://diegonr.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }
}

export function generateArticleStructuredData(
  title: string,
  description: string,
  url: string,
  image: string,
  datePublished: string,
  dateModified: string,
  keywords: string[] = [],
  settings?: SiteSettings
): StructuredDataArticle {
  const siteUrl = settings?.seo?.siteUrl || 'https://diegonr.com';
  const authorName = settings?.brand?.name || 'Diego NR';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
      url: siteUrl
    },
    publisher: {
      '@type': 'Person',
      name: authorName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/og?title=${encodeURIComponent(authorName)}&type=Portfolio`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    articleSection: 'Technology',
    keywords: keywords
  }
}

export function generateProjectStructuredData(
  name: string,
  description: string,
  url: string,
  image: string,
  dateCreated: string,
  technologies: string[] = [],
  category: string = 'Web Application',
  settings?: SiteSettings
): StructuredDataProject {
  const siteUrl = settings?.seo?.siteUrl || 'https://diegonr.com';
  const authorName = settings?.brand?.name || 'Diego NR';

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    image,
    url,
    creator: {
      '@type': 'Person',
      name: authorName,
      url: siteUrl
    },
    dateCreated: dateCreated,
    programmingLanguage: technologies,
    applicationCategory: category,
    operatingSystem: 'Web Browser'
  }
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>, settings?: SiteSettings): StructuredDataBreadcrumbList {
  const siteUrl = settings?.seo?.siteUrl || 'https://diegonr.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.url}`
    }))
  }
}

export function generateOrganizationStructuredData(settings?: SiteSettings): StructuredDataOrganization {
  const siteUrl = settings?.seo?.siteUrl || 'https://diegonr.com';
  const fullName = settings?.brand?.fullName || 'Diego NR';
  const name = settings?.brand?.name || 'Diego NR';
  const email = settings?.contact?.email;
  const sameAs = settings?.socialLinks?.map(l => l.url) || [
    'https://github.com/diegonr',
    'https://linkedin.com/in/diegonr',
    'https://twitter.com/diegonr'
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: `${fullName} - Solutions Architect & Full-Stack Developer`,
    url: siteUrl,
    logo: `${siteUrl}/og?title=${encodeURIComponent(name)}&type=Portfolio`,
    description: 'Portfolio profesional especializado en desarrollo Full-Stack, inteligencia artificial, arquitectura de soluciones y diseño UX/UI.',
    foundingDate: '2020',
    sameAs,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Professional',
      ...(email ? { email } : { url: `${siteUrl}/contact` })
    }
  }
}

interface StructuredDataProps {
  data: Record<string, any>
}

export function StructuredData({ data }: StructuredDataProps) {
  // Sanitize JSON-LD data to prevent XSS attacks via script injection.
  // We escape <, >, &, and line terminators to their Unicode equivalents.
  const json = JSON.stringify(data, null, 2);
  const sanitizedJson = json ? json.replace(
    /[<>& \u2028\u2029]/g,
    (char) => {
      switch (char) {
        case '<': return '\\u003c';
        case '>': return '\\u003e';
        case '&': return '\\u0026';
        case '\u2028': return '\\u2028';
        case '\u2029': return '\\u2029';
        default: return char;
      }
    }
  ) : '';

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: sanitizedJson,
      }}
    />
  )
}