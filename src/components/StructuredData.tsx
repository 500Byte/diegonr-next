import { Metadata } from 'next'

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

export function generatePersonStructuredData(): StructuredDataPerson {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Diego NR',
    url: 'https://diegonr.com',
    sameAs: [
      'https://github.com/diegonr',
      'https://linkedin.com/in/diegonr',
      'https://twitter.com/diegonr'
    ],
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

export function generateWebSiteStructuredData(): StructuredDataWebSite {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Diego NR - Solutions Architect & Full-Stack Developer',
    url: 'https://diegonr.com',
    description: 'Portfolio profesional de Diego NR, desarrollador Full-Stack especializado en IA, arquitectura de soluciones y diseño UX/UI.',
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
  keywords: string[] = []
): StructuredDataArticle {
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
      name: 'Diego NR',
      url: 'https://diegonr.com'
    },
    publisher: {
      '@type': 'Person',
      name: 'Diego NR',
      logo: {
        '@type': 'ImageObject',
        url: 'https://diegonr.com/og?title=Diego NR&type=Portfolio'
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
  category: string = 'Web Application'
): StructuredDataProject {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: name,
    description: description,
    image: image,
    url: url,
    creator: {
      '@type': 'Person',
      name: 'Diego NR',
      url: 'https://diegonr.com'
    },
    dateCreated: dateCreated,
    programmingLanguage: technologies,
    applicationCategory: category,
    operatingSystem: 'Web Browser'
  }
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>): StructuredDataBreadcrumbList {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `https://diegonr.com${crumb.url}`
    }))
  }
}

export function generateOrganizationStructuredData(): StructuredDataOrganization {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Diego NR - Solutions Architect & Full-Stack Developer',
    url: 'https://diegonr.com',
    logo: 'https://diegonr.com/og?title=Diego NR&type=Portfolio',
    description: 'Portfolio profesional especializado en desarrollo Full-Stack, inteligencia artificial, arquitectura de soluciones y diseño UX/UI.',
    foundingDate: '2020',
    sameAs: [
      'https://github.com/diegonr',
      'https://linkedin.com/in/diegonr',
      'https://twitter.com/diegonr'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Professional',
      url: 'https://diegonr.com/contact'
    }
  }
}

interface StructuredDataProps {
  data: Record<string, any>
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  )
}