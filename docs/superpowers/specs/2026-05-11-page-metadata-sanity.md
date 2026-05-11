# Page Metadata Management via Sanity

**Date:** 2026-05-11
**Status:** Draft

## Problem

Static page metadata (title, description, keywords, OG) is currently hardcoded in `next-intl` translation files (`messages/es.json`, `messages/en.json`) and individual `generateMetadata()` functions across 7+ page files. There is no way for the site owner to edit SEO metadata without modifying code.

## Scope

Manage SEO metadata for **static pages only** in Sanity. Dynamic pages (blog/[id], projects/[id], services/[id]) already derive their metadata from their own Sanity document content and are excluded.

### Pages Covered

| Page | Route | Current Source |
|------|-------|---------------|
| Home | `/` | `messages/*.json` → `Metadata.home_title`, `Metadata.home_description` |
| About | `/about` | `messages/*.json` → full metadata |
| Services | `/services` | `messages/*.json` → full metadata |
| Projects | `/projects` | `messages/*.json` → full metadata |
| Blog | `/blog` | `messages/*.json` → full metadata |
| Contact | `/contact` | No metadata (inherits root) |

### Excluded

- `blog/[id]` — metadata from Sanity `blog_post` content
- `projects/[id]` — metadata from Sanity `project` content
- `services/[id]` — metadata from Sanity `service` content
- `offline` — not indexable, no metadata needed

## Schema: `pageMetadata`

New document type in `sanity/schemaTypes/pageMetadataType.ts`.

### i18n Pattern: New Standard

This schema uses the `{ es, en }` object pattern (instead of the `_es`/`_en` flat pattern found in existing schemas like `projectType`, `serviceType`). This is declared as the **new project standard** for all new schemas going forward. Existing schemas should be migrated eventually but are out of scope for this plan.

```
pageMetadata
├── page: string (required, select: home|about|services|projects|blog|contact)
├── metaTitle: object
│   ├── es: string
│   └── en: string
├── metaDescription: object
│   ├── es: text (rows: 3)
│   └── en: text (rows: 3)
├── keywords: object
│   ├── es: array of strings
│   └── en: array of strings
├── ogImage: image (optional)
└── robotsIndex: boolean (default: true)
```

### Validation

- `page`: required, with **custom async uniqueness check** via GROQ (`count(*[_type == "pageMetadata" && page == $page && _id != $id])`)
- At least one locale should have a title filled per document

## TypeScript Interface

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

## Sanity Query

```typescript
export async function getPageMetadata(page: string): Promise<PageMetadata | null> {
  return await client.fetch<PageMetadata | null>(
    `*[_type == "pageMetadata" && page == $page && !(_id in path("drafts.**"))][0]`,
    { page }
  )
}
```

Optionally, fetch all at once for layouts that need multiple pages:

```typescript
export async function getAllPageMetadata(): Promise<PageMetadata[]> {
  return await client.fetch<PageMetadata[]>(
    `*[_type == "pageMetadata" && !(_id in path("drafts.**"))]`
  )
}
```

## Frontend Helper

A helper function `buildPageMetadata` in a new file `src/lib/metadata.ts`:

```typescript
export async function buildPageMetadata(
  pageId: string,
  locale: string,
  fallback?: { title: string; description: string }
): Promise<Metadata>
```

This function:
1. Calls `getPageMetadata(pageId)` from Sanity
2. Calls `getSiteSettings()` for `siteUrl`, `twitterHandle`
3. Merges Sanity data with fallbacks
4. Returns a full `Metadata` object (title, description, keywords, OG, Twitter, robots, alternates)

### Merge Logic

| Field | Priority | Fallback |
|-------|----------|----------|
| `title` | `metaTitle[locale]` from Sanity | `fallback.title` |
| `description` | `metaDescription[locale]` from Sanity | `fallback.description` |
| `keywords` | `keywords[locale]` from Sanity | `[]` |
| `ogImage` | `ogImage` from Sanity | OG route URL (current pattern) |
| `robots` | `robotsIndex` from Sanity | `true` |
| `siteUrl` | from `siteSettings.seo.siteUrl` | `'https://diegonr.com'` |
| `twitterHandle` | from `siteSettings.seo.twitterHandle` | `'@diegonr'` |

### Static Fields (same for all pages)

- `authors: [{ name: settings.brand.name }]`
- `creator`, `publisher`: from settings
- `metadataBase`: from settings
- `alternates`: generated from page route + locale
- `robots.index`, `robots.follow`: from `robotsIndex` field

## Implementation Steps

1. Create `sanity/schemaTypes/pageMetadataType.ts`
2. Register in `sanity/schemaTypes/index.ts`
3. Add `PageMetadata` interface to `src/types/index.ts`
4. Add `getPageMetadata` / `getAllPageMetadata` to `src/lib/sanity.ts`
5. Create `src/lib/metadata.ts` with `buildPageMetadata` helper
6. Update each static page's `generateMetadata` to use the helper:
   - `src/app/[locale]/(website)/page.tsx` (Home)
   - `src/app/[locale]/(website)/about/page.tsx`
   - `src/app/[locale]/(website)/services/page.tsx`
   - `src/app/[locale]/(website)/projects/page.tsx`
   - `src/app/[locale]/(website)/blog/page.tsx`
   - `src/app/[locale]/(website)/contact/page.tsx`
7. Verify `src/app/layout.tsx` default metadata values match Sanity `siteSettings` — keep hardcoded (already correct)  
8. Create seed script `sanity/seeds/pageMetadata.ts` that reads current values from `messages/es.json` and `messages/en.json` and creates/updates each `pageMetadata` document via the Sanity client

## Not Changing

- Dynamic page metadata generators (blog/[id], projects/[id], services/[id]) — keep deriving from their own Sanity content
- StructuredData generators — already accept siteSettings
- OG image route `/og` — stays as fallback
- next-intl translation strings for page content (only metadata strings are replaced)
