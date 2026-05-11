# Site Settings Sanity Singleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Centralize all site configuration (social links, email, brand, SEO) into a single Sanity singleton document and consume it across all components.

**Architecture:** Sanity singleton `siteSettings` → `getSiteSettings()` query → server component fetches data → passes as props to client components (Footer, MobileMenu).

**Tech Stack:** Sanity, Next.js 16, TypeScript

---

### Task 1: Create Sanity Schema (siteSettings Singleton)

**Files:**
- Create: `sanity/schemaTypes/siteSettingsType.ts`
- Modify: `sanity/schemaTypes/index.ts`

- [ ] **Step 1: Create the siteSettings schema**

```typescript
import { defineType, defineField } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'object',
      fields: [
        { name: 'name', title: 'Name', type: 'string' },
        { name: 'fullName', title: 'Full Name', type: 'string' },
        { name: 'tagline_es', title: 'Tagline (ES)', type: 'array', of: [{ type: 'block' }] },
        { name: 'tagline_en', title: 'Tagline (EN)', type: 'array', of: [{ type: 'block' }] },
      ]
    }),
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'object',
      fields: [
        { name: 'email', title: 'Email', type: 'string' },
        { name: 'location_es', title: 'Location (ES)', type: 'string' },
        { name: 'location_en', title: 'Location (EN)', type: 'string' },
      ]
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'platform', title: 'Platform', type: 'string' },
          { name: 'url', title: 'URL', type: 'url' },
        ]
      }]
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'siteUrl', title: 'Site URL', type: 'url' },
        { name: 'twitterHandle', title: 'Twitter Handle', type: 'string' },
      ]
    }),
    defineField({ name: 'copyright', title: 'Copyright', type: 'string' }),
  ],
  preview: {
    prepare() { return { title: 'Site Settings' } }
  }
})
```

- [ ] **Step 2: Register in schema index**

```typescript
// sanity/schemaTypes/index.ts
import { siteSettingsType } from './siteSettingsType'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectType, serviceType, blogPostType, siteSettingsType],
}
```

### Task 2: Update TypeScript Types

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Add SiteSettings interface**

```typescript
export interface SiteSettings {
  _id: string;
  _type: 'siteSettings';
  brand: {
    name: string;
    fullName: string;
    tagline_es: PortableTextBlock[];
    tagline_en: PortableTextBlock[];
  };
  contact: {
    email: string;
    location_es: string;
    location_en: string;
  };
  socialLinks: { platform: string; url: string }[];
  seo: {
    siteUrl: string;
    twitterHandle: string;
  };
  copyright: string;
}
```

### Task 3: Create Sanity Query Function

**Files:**
- Modify: `src/lib/sanity.ts`

- [ ] **Add getSiteSettings function**

```typescript
export async function getSiteSettings(): Promise<SiteSettings | null> {
  return await client.fetch<SiteSettings | null>(
    `*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]`
  )
}
```

### Task 4: Seed Site Settings Document in Sanity

**Files:**
- Create script or run directly

- [ ] **Publish initial siteSettings document**

Create and run a script that publishes the siteSettings document with:
- brand.name: "Diego NR"
- brand.fullName: "Diego Navarro"
- contact.email: "hola@diegonr.com"
- socialLinks: [{ platform: "GitHub", url: "https://github.com/500byte" }, { platform: "LinkedIn", url: "https://linkedin.com/in/diegonr" }, ...]
- seo.siteUrl: "https://diegonr.com"
- seo.twitterHandle: "@diegonr"
- copyright: "DIEGO NAVARRO"

### Task 5: Update Footer.tsx to Consume Social Links

**Files:**
- Modify: `src/components/Footer.tsx`

Accept `socialLinks` and `email` as props, render dynamically.

### Task 6: Update FooterError.tsx

**Files:**
- Modify: `src/components/FooterError.tsx`

Same approach as Footer.tsx.

### Task 7: Update MobileMenu.tsx

**Files:**
- Modify: `src/components/MobileMenu.tsx`

Consume social links dynamically.

### Task 8: Update StructuredData.tsx

**Files:**
- Modify: `src/components/StructuredData.tsx`

Accept site settings as props for sameAs URLs, author name, etc.

### Task 9: Sanity-ify All Metadata Pages

A helper function to generate common metadata fields from siteSettings, applied to all 10 page metadata files.
