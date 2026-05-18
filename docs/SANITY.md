# Sanity CMS Integration

## Overview

Content is managed in **Sanity Cloud** and served to the Next.js frontend via GROQ queries. The Studio is a **standalone project** in `/sanity/`, separate from the main app to keep the Cloudflare Worker bundle under the 3MB limit.

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Sanity Studio  │────▶│   Sanity Cloud  │◀────│  Next.js SSR    │
│  (Editor)      │     │  (API + CDN)    │     │  (Fetch)       │
└─────────────────┘     └─────────────────┘     └────────────────┘
       Project ID: ${NEXT_PUBLIC_SANITY_PROJECT_ID}  Dataset: ${NEXT_PUBLIC_SANITY_DATASET}  Studio: diegonr.sanity.studio
```

## Studio Configuration (`/sanity/`)

### Structure

```
sanity/
├── sanity.config.ts      # Studio config (plugins, schema)
├── schemaTypes/       # Document schemas
│   ├── projectType.ts
│   ├── serviceType.ts
│   ├── blogPostType.ts
│   └── index.ts
└── sanity.cli.ts
```

### Plugins

```typescript
// sanity.config.ts
plugins: [
  structureTool({ structure }),
  visionTool({ defaultApiVersion: '2022-03-07' }),
  codeInput(), // @sanity/code-input for code blocks in Portable Text
]
```

- `structureTool`: Sidebar navigation in Studio
- `visionTool`: GROQ query playground (accessible at `/sanity/studio/vision`)
- `codeInput`: Code block editor with syntax highlighting support for Portable Text

### Schemas

| Document | Purpose | Used in |
|----------|---------|---------|
| `project` | Portfolio projects | Home page, `/projects` list + detail |
| `service` | Professional services | Home page, `/services` list + detail |
| `blog_post` | Blog articles | Home page, `/blog` list + detail |

## Data Fetching (`src/lib/sanity.ts`)

### Client Setup

```typescript
import { createClient } from 'next-sanity';

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false, // Always fetch fresh data
  token, // Optional for draft content
});
```

### Query Functions

```typescript
// Get all documents (for lists)
export async function getAllProjects(): Promise<ProjectDocument[]>
export async function getAllServices(): Promise<ServiceDocument[]>
export async function getAllPosts(): Promise<BlogPostDocument[]>

// Get single document (for detail pages)
export async function getProject(slug: string): Promise<ProjectDocument | null>
export async function getService(slug: string): Promise<ServiceDocument | null>
export async function getPost(slug: string): Promise<BlogPostDocument | null>
```

### Draft Filtering

All queries filter out drafts:

```groq
*[_type == "project" && !(_id in path("drafts.**"))]
```

## Content Types (`src/types/index.ts`)

### Schema-to-Type Sync

Types are manually kept in sync with Sanity schemas:

| Sanity Schema | TypeScript Interface |
|---------------|---------------------|
| `project` | `ProjectDocument` |
| `service` | `ServiceDocument` |
| `blog_post` | `BlogPostDocument` |

### Common Interfaces

```typescript
interface BaseSanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

interface Slug {
  _type: 'slug';
  current: string;
}

interface SanityImage {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  alt?: string;
}
```

## Usage Patterns

### Server Components (Fetching)

Pages fetch data in Server Components and pass to Client Components:

```typescript
// src/app/(website)/projects/page.tsx
import { getAllProjects } from '@/lib/sanity';

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  return <ProjectList projects={projects} />;
}
```

### Dynamic Routing (Static Generation)

Detail pages use `generateStaticParams` for SSG:

```typescript
// src/app/(website)/projects/[id]/page.tsx
export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map(project => ({
    id: project.slug?.current,
  }));
}
```

### Metadata Generation

Detail pages generate metadata from Sanity content:

```typescript
export async function generateMetadata({ params }: PageProps) {
  const project = await getProject((await params).id);
  const description = toPlainText(project.description_es || []);

  return {
    title: `${project.title} | Diego NR`,
    description: description.substring(0, 157) + '...',
  };
}
```

### Image URLs

```typescript
import { urlFor } from '@/lib/sanity';

// In component
<Image src={urlFor(post.image).url()} alt="" fill />
```

## Rendering Components

### DocumentRenderer

Renders Portable Text with custom components (`src/components/DocumentRenderer.tsx`):

```typescript
import { DocumentRenderer } from '@/components/DocumentRenderer';

// Custom components:
// - block (h1-h6, p, blockquote)
// - marks (link, code)
// - types (codeBlock, table, callout)
// - list (bullet, number)
// Note: images are handled by ResearchContent for lightbox support

<DocumentRenderer field={project.content} />
```

### ResearchContent

Client component wrapper (`src/components/ResearchContent.tsx`) that renders Portable Text content with:
- Text blocks via `DocumentRenderer`
- Images with lightbox (click to fullscreen, keyboard navigation with ← → Esc)
- Code blocks with copy button
- Tables with Swiss-Brutalist styling
- Callouts (info, warning, insight, quote variants)

Used in blog post detail pages to render research-style content.

### ResearchTable

Table component (`src/components/ResearchTable.tsx`) with:
- Headers in monospace, uppercase, tracking-widest
- Horizontal scroll on mobile
- Caption as metadata below the table

### CodeBlock

Code block component (`src/components/CodeBlock.tsx`) with:
- Language label and optional filename
- Copy-to-clipboard button
- Horizontal scroll for long lines

### ResearchCallout

Callout component (`src/components/ResearchCallout.tsx`) with 4 variants:
- `info`: Info icon, subtle border
- `warning`: AlertTriangle icon, higher contrast border
- `insight`: Lightbulb icon, medium border
- `quote`: Blockquote style, Quote icon

### toPlainText

Extract plain text from Portable Text for metadata/excerpts:

```typescript
import { toPlainText } from '@portabletext/react';

const description = toPlainText(post.excerpt || []);
const shortDesc = description.substring(0, 157) + '...';
```

## Internationalization (i18n)

Content has dual-language fields (`*_es`, `*_en`):

```typescript
// In schema
defineField({ name: 'description_es', ... }),
defineField({ name: 'description_en', ... }),

// In page - current selection
const description = toPlainText(service.description_es || []);
```

**Status**: Only Spanish (`*_es`) fields are populated. English fields are defined but unused.

## What's NOT Implemented

| Feature | Reason |
|---------|--------|
| Live Content API (`defineLive`) | SSR in Cloudflare Workers; real-time updates would require WebSockets |
| Visual Editing (`VisualEditing`) | Same reason; requires active Studio session |
| `SanityLive` in layout | Would add unnecessary overhead |
| `useCdn: true` | Currently `false` to ensure fresh content on rebuilds |

These could be added if migrating to Vercel/Netlify where edge functions support long-lived connections.

## Environment Variables

| Variable | Used In | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `src/lib/sanity.ts`, `wrangler.jsonc` | Public project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `src/lib/sanity.ts`, `wrangler.jsonc` | Dataset name |
| `SANITY_API_TOKEN` | `src/lib/sanity.ts` | Read token (optional, for drafts) |

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - System overview
- [CODING_STANDARDS.md](CODING_STANDARDS.md) - TypeScript rules
- [DEPENDENCIES.md](DEPENDENCIES.md) - Package overview
- [Sanity Docs](https://www.sanity.io/docs)
- [GROQ Reference](https://www.sanity.io/docs/groq-reference)
- [Portable Text Spec](https://portabletext.org/)