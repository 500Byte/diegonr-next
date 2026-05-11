/**
 * Seed script for pageMetadata documents.
 *
 * Run: npx tsx sanity/seeds/pageMetadata.ts
 *
 * Requires SANITY_API_TOKEN and NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 */
import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

interface PageMetaSeed {
  _id: string
  _type: 'pageMetadata'
  page: string
  metaTitle: { es: string; en: string }
  metaDescription: { es: string; en: string }
  keywords: { es: string[]; en: string[] }
  robotsIndex: boolean
}

const pages: PageMetaSeed[] = [
  {
    _id: 'pageMetadata-home',
    _type: 'pageMetadata',
    page: 'home',
    metaTitle: {
      es: 'Diego Navarro — Design Engineer & Solutions Architect',
      en: 'Diego Navarro — Design Engineer & Solutions Architect',
    },
    metaDescription: {
      es: 'Design Engineer & Solutions Architect especializado en la optimización de procesos de desarrollo y arquitecturas escalables de alto rendimiento.',
      en: 'Design Engineer & Solutions Architect specializing in development process optimization and high-performance scalable architectures.',
    },
    keywords: {
      es: ['design engineer', 'solutions architect', 'desarrollo full-stack', 'arquitectura de software', 'optimización'],
      en: ['design engineer', 'solutions architect', 'full-stack development', 'software architecture', 'optimization'],
    },
    robotsIndex: true,
  },
  {
    _id: 'pageMetadata-about',
    _type: 'pageMetadata',
    page: 'about',
    metaTitle: {
      es: 'Sobre mí | Diego Navarro — Design Engineer',
      en: 'About | Diego Navarro — Design Engineer',
    },
    metaDescription: {
      es: 'Design Engineer & Solutions Architect especializado en la optimización de procesos de desarrollo, arquitectura de sistemas y automatización.',
      en: 'Design Engineer & Solutions Architect specializing in development process optimization, systems architecture, and automation.',
    },
    keywords: {
      es: ['sobre mí', 'design engineer', 'arquitecto de soluciones', 'automatización'],
      en: ['about me', 'design engineer', 'solutions architect', 'automation'],
    },
    robotsIndex: true,
  },
  {
    _id: 'pageMetadata-services',
    _type: 'pageMetadata',
    page: 'services',
    metaTitle: {
      es: 'Servicios | Diego Navarro — Design Engineer',
      en: 'Services | Diego Navarro — Design Engineer',
    },
    metaDescription: {
      es: 'Capacidades técnicas: Design Systems, arquitectura Full-Stack, automatización de procesos.',
      en: 'Technical capabilities: Design Systems, Full-Stack architecture, process automation.',
    },
    keywords: {
      es: ['servicios', 'design systems', 'arquitectura full-stack', 'automatización', 'consultoría'],
      en: ['services', 'design systems', 'full-stack architecture', 'automation', 'consulting'],
    },
    robotsIndex: true,
  },
  {
    _id: 'pageMetadata-projects',
    _type: 'pageMetadata',
    page: 'projects',
    metaTitle: {
      es: 'Proyectos | Diego Navarro — Design Engineer',
      en: 'Projects | Diego Navarro — Design Engineer',
    },
    metaDescription: {
      es: 'Proyectos seleccionados que representan arquitectura técnica y ejecución.',
      en: 'Selected projects representing technical architecture and execution.',
    },
    keywords: {
      es: ['proyectos', 'portafolio', 'case studies', 'desarrollo web'],
      en: ['projects', 'portfolio', 'case studies', 'web development'],
    },
    robotsIndex: true,
  },
  {
    _id: 'pageMetadata-blog',
    _type: 'pageMetadata',
    page: 'blog',
    metaTitle: {
      es: 'Blog | Diego Navarro — Design Engineer',
      en: 'Blog | Diego Navarro — Design Engineer',
    },
    metaDescription: {
      es: 'Publicaciones técnicas sobre arquitectura de software, sistemas de diseño y automatización.',
      en: 'Technical publications on software architecture, design systems, and automation.',
    },
    keywords: {
      es: ['blog', 'arquitectura de software', 'sistemas de diseño', 'automatización'],
      en: ['blog', 'software architecture', 'design systems', 'automation'],
    },
    robotsIndex: true,
  },
  {
    _id: 'pageMetadata-contact',
    _type: 'pageMetadata',
    page: 'contact',
    metaTitle: {
      es: 'Contacto | Diego Navarro — Design Engineer',
      en: 'Contact | Diego Navarro — Design Engineer',
    },
    metaDescription: {
      es: 'Formulario de contacto para consultas técnicas y propuestas de proyecto.',
      en: 'Contact form for technical inquiries and project proposals.',
    },
    keywords: {
      es: ['contacto', 'consulta', 'colaboración', 'proyecto'],
      en: ['contact', 'inquiry', 'collaboration', 'project'],
    },
    robotsIndex: true,
  },
]

async function seed() {
  console.log('Seeding pageMetadata documents...\n')

  for (const doc of pages) {
    try {
      await client.createOrReplace(doc)
      console.log(`  ✓ ${doc.page} (${doc._id})`)
    } catch (err) {
      console.error(`  ✗ ${doc.page}:`, err)
    }
  }

  console.log('\nDone.')
}

seed()
