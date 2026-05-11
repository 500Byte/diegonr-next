# Page Metadata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Sanity `pageMetadata` singleton-per-page schema and consume it in `generateMetadata()` across all 6 static pages.

**Architecture:** Sanity `pageMetadata` documents (one per page) → `getPageMetadata()` query → `buildPageMetadata()` helper consolidates Sanity data + siteSettings + fallbacks → each static page calls helper in its `generateMetadata()`.

**Tech Stack:** Sanity, Next.js 16, TypeScript, GROQ

---

### Task 1: Create Sanity Schema (pageMetadata)

**Files:**
- Create: `sanity/schemaTypes/pageMetadataType.ts`
- Modify: `sanity/schemaTypes/index.ts`

- [ ] **Step 1: Create schema file**

```typescript
import { defineType, defineField } from 'sanity'

export const pageMetadataType = defineType({
  name: 'pageMetadata',
  title: 'Page Metadata',
  type: 'document',
  fields: [
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
      options: {
        list: [
          { title: 'Home', value: 'home' },
          { title: 'About', value: 'about' },
          { title: 'Services', value: 'services' },
          { title: 'Projects', value: 'projects' },
          { title: 'Blog', value: 'blog' },
          { title: 'Contact', value: 'contact' },
        ],
      },
      validation: (rule) =>
        rule
          .required()
          .custom(async (value, context) => {
            if (!value) return true
            const { getClient } = context
            const client = getClient({ apiVersion: '2025-01-01' })
            const id = context.document?._id?.replace(/^drafts\./, '') || ''
            const count = await client.fetch<number>(
              `count(*[_type == "pageMetadata" && page == $page && _id != $id])`,
              { page: value, id }
            )
            return count > 0 ? 'Ya existe un documento para esta página' : true
          }),
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'text', rows: 3 },
        { name: 'en', title: 'English', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'array', of: [{ type: 'string' }] },
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] },
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      description: 'Optional. Falls back to the dynamic /og route if not set.',
    }),
    defineField({
      name: 'robotsIndex',
      title: 'Allow Indexing',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'page', subtitle: 'metaTitle.es' },
  },
})
```

- [ ] **Step 2: Register in schema index**

Edit `sanity/schemaTypes/index.ts`:

```typescript
import { pageMetadataType } from './pageMetadataType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectType, serviceType, blogPostType, siteSettingsType, pageMetadataType],
}
```

- [ ] **Step 3: Commit**

```bash
git add sanity/schemaTypes/pageMetadataType.ts sanity/schemaTypes/index.ts
git commit -m "feat: add pageMetadata Sanity schema with uniqueness validation and i18n object pattern"
```

---

### Task 2: Add TypeScript Interface

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Add PageMetadata interface**

Add after the `SiteSettings` interface in `src/types/index.ts`:

```typescript
export interface PageMetadata {
  _id: string;
  _type: 'pageMetadata';
  page: 'home' | 'about' | 'services' | 'projects' | 'blog' | 'contact';
  metaTitle?: { es?: string; en?: string };
  metaDescription?: { es?: string; en?: string };
  keywords?: { es?: string[]; en?: string[] };
  ogImage?: SanityImage;
  robotsIndex?: boolean;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add PageMetadata interface"
```

---

### Task 3: Add Sanity Query Functions

**Files:**
- Modify: `src/lib/sanity.ts`

- [ ] **Step 1: Import PageMetadata**

Add `PageMetadata` to the import from `../types`:

```typescript
import { ProjectDocument, ServiceDocument, BlogPostDocument, SiteSettings, PageMetadata } from '../types';
```

- [ ] **Step 2: Add query functions**

Add after the `getSiteSettings()` function:

```typescript
export async function getPageMetadata(page: string): Promise<PageMetadata | null> {
  return await client.fetch<PageMetadata | null>(
    `*[_type == "pageMetadata" && page == $page && !(_id in path("drafts.**"))][0]`,
    { page }
  )
}

export async function getAllPageMetadata(): Promise<PageMetadata[]> {
  return await client.fetch<PageMetadata[]>(
    `*[_type == "pageMetadata" && !(_id in path("drafts.**"))]`
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/sanity.ts
git commit -m "feat: add getPageMetadata and getAllPageMetadata queries"
```

---

### Task 4: Create buildPageMetadata Helper

**Files:**
- Create: `src/lib/metadata.ts`

- [ ] **Step 1: Create helper file**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/metadata.ts
git commit -m "feat: add buildPageMetadata helper that merges Sanity data with fallbacks"
```

---

### Task 5: Update Home Page generateMetadata

**Files:**
- Modify: `src/app/[locale]/(website)/page.tsx`

- [ ] **Step 1: Replace generateMetadata**

```typescript
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return buildPageMetadata({
    page: 'home',
    locale,
    fallback: {
      title: t('home_title'),
      description: t('home_description'),
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\[locale\]/\(website\)/page.tsx
git commit -m "feat: update home page generateMetadata to use Sanity pageMetadata"
```

---

### Task 6: Update About Page generateMetadata

**Files:**
- Modify: `src/app/[locale]/(website)/about/page.tsx`

- [ ] **Step 1: Read the current about page**

Read `src/app/[locale]/(website)/about/page.tsx` to see the exact current `generateMetadata`.

- [ ] **Step 2: Replace generateMetadata**

Replace the current `generateMetadata` with Sanity-powered version:

```typescript
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return buildPageMetadata({
    page: 'about',
    locale,
    fallback: {
      title: t('about_title'),
      description: t('about_description'),
    },
  });
}
```

Remove `keywords`, `authors`, `creator`, `publisher`, `metadataBase`, `alternates`, `openGraph`, `twitter`, `robots` from the old metadata — the helper handles all of them.

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/\(website\)/about/page.tsx
git commit -m "feat: update about page generateMetadata to use Sanity pageMetadata"
```

---

### Task 7: Update Services Index Page generateMetadata

**Files:**
- Modify: `src/app/[locale]/(website)/services/page.tsx`

- [ ] **Step 1: Read the current services page**

- [ ] **Step 2: Replace generateMetadata**

```typescript
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return buildPageMetadata({
    page: 'services',
    locale,
    fallback: {
      title: t('services_title'),
      description: t('services_description'),
    },
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/\(website\)/services/page.tsx
git commit -m "feat: update services page generateMetadata to use Sanity pageMetadata"
```

---

### Task 8: Update Projects Index Page generateMetadata

**Files:**
- Modify: `src/app/[locale]/(website)/projects/page.tsx`

- [ ] **Step 1: Replace generateMetadata**

```typescript
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return buildPageMetadata({
    page: 'projects',
    locale,
    fallback: {
      title: t('projects_title'),
      description: t('projects_description'),
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\[locale\]/\(website\)/projects/page.tsx
git commit -m "feat: update projects page generateMetadata to use Sanity pageMetadata"
```

---

### Task 9: Update Blog Index Page generateMetadata

**Files:**
- Modify: `src/app/[locale]/(website)/blog/page.tsx`

- [ ] **Step 1: Replace generateMetadata**

```typescript
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return buildPageMetadata({
    page: 'blog',
    locale,
    fallback: {
      title: t('blog_title'),
      description: t('blog_description'),
    },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\[locale\]/\(website\)/blog/page.tsx
git commit -m "feat: update blog page generateMetadata to use Sanity pageMetadata"
```

---

### Task 10: Update Contact Page generateMetadata

**Files:**
- Modify: `src/app/[locale]/(website)/contact/page.tsx`

- [ ] **Step 1: Read current contact page**

The contact page currently has **no** `generateMetadata` export. Add one:

```typescript
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/metadata';
// ... existing imports

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return buildPageMetadata({
    page: 'contact',
    locale,
    fallback: {
      title: t('contact_title'),
      description: t('contact_description'),
    },
  });
}
```

Place this function **before** the `ContactPage` component export, after the `Props` type.

- [ ] **Step 2: Commit**

```bash
git add src/app/\[locale\]/\(website\)/contact/page.tsx
git commit -m "feat: add generateMetadata to contact page using Sanity pageMetadata"
```

---

### Task 11: Create Seed Script

**Files:**
- Create: `sanity/seeds/pageMetadata.ts`

- [ ] **Step 1: Create seed directory**

```bash
mkdir -p sanity/seeds
```

- [ ] **Step 2: Create seed script**

```typescript
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
```

- [ ] **Step 3: Install dotenv if not present**

```bash
npm ls dotenv || npm install -D dotenv
```

- [ ] **Step 4: Run the seed script**

```bash
npx tsx sanity/seeds/pageMetadata.ts
```

Expected output:
```
Seeding pageMetadata documents...

  ✓ home (pageMetadata-home)
  ✓ about (pageMetadata-about)
  ✓ services (pageMetadata-services)
  ✓ projects (pageMetadata-projects)
  ✓ blog (pageMetadata-blog)
  ✓ contact (pageMetadata-contact)

Done.
```

- [ ] **Step 5: Commit**

```bash
git add sanity/seeds/pageMetadata.ts
git commit -m "feat: add seed script for pageMetadata documents"
```

---

### Task 12: Verify Build

**Files:**
- No file changes

- [ ] **Step 1: Run type-check**

```bash
npm run type-check
```

Expected: No errors.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No errors.

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: Build succeeds with all pages rendered.

---

## Not Changing (verified against spec)

- Dynamic page metadata (blog/[id], projects/[id], services/[id]) — keep their current Sanity-derived metadata
- StructuredData generators — already accept siteSettings from parent layout
- OG image route `/og` — stays as fallback URL generator
- Root layout `src/app/layout.tsx` — default metadata values already match Sanity (`https://diegonr.com`, etc.)
- `offline/page.tsx` — not indexable, no metadata needed
- next-intl translation strings for page content (`AboutPage`, `ServicesPage`, etc.) — only the `Metadata` namespace needs to remain as fallback

## Schema Migration Note

This schema introduces the `{ es, en }` i18n object pattern as the new project standard. Existing schemas (`projectType`, `serviceType`) still use the `_es`/`_en` flat pattern. Migration of existing schemas is out of scope for this plan.
