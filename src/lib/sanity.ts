import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';
import { draftMode } from 'next/headers';
import * as queries from './sanity.queries';
import { ProjectDocument, ServiceDocument, BlogPostDocument, SiteSettings, PageMetadata } from '../types';

// Helper to get environment variables across different runtimes (Node.js, Cloudflare Workers)
const getEnvVar = (key: string): string | undefined => {
  const envObj = (globalThis as unknown as { env?: Record<string, string> }).env;
  return process.env[key] || envObj?.[key];
}

const projectId = getEnvVar('NEXT_PUBLIC_SANITY_PROJECT_ID')!;
const dataset = getEnvVar('NEXT_PUBLIC_SANITY_DATASET') || 'production';

if (!projectId) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable');
}

const apiVersion = '2022-03-07'; // Use a stable API version compatible with the Studio socket and Vision
const token = getEnvVar('SANITY_API_TOKEN');

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token,
  stega: {
    enabled: getEnvVar('NEXT_PUBLIC_VERCEL_ENV') === 'preview' || process.env.NODE_ENV === 'development',
    studioUrl: '/studio',
  },
});

/**
 * Helper function to get the client with draft mode support
 * In Next.js 15, draftMode() is asynchronous.
 * We wrap it in a try-catch to avoid build errors during generateStaticParams.
 */
async function getClient() {
  let isDraftMode = false;
  try {
    isDraftMode = (await draftMode()).isEnabled;
  } catch (e) {
    // draftMode() can throw during build time in generateStaticParams
    isDraftMode = false;
  }

  if (isDraftMode && !token) {
    throw new Error('The SANITY_API_TOKEN environment variable is required for Draft Mode.');
  }
  return isDraftMode
    ? client.withConfig({
        token,
        perspective: 'previewDrafts',
        useCdn: false,
        stega: {
          enabled: true,
          studioUrl: '/studio',
        },
      })
    : client;
}

const builder = createImageUrlBuilder(client);


export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

// ============================================================================
// PROJECTS
// ============================================================================

// For list views - lightweight projection
export async function getAllProjects(): Promise<ProjectDocument[]> {
  const currentClient = await getClient();
  const projects = await currentClient.fetch(queries.projectsQuery, {}, {
    next: { tags: ['project'] }
  });

  return (projects as any).sort((a: any, b: any) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return String(b.year || '').localeCompare(String(a.year || ''));
  });
}

// For detail views - full document
export async function getAllProjectsFull(): Promise<ProjectDocument[]> {
  const currentClient = await getClient();
  return await currentClient.fetch(queries.projectsFullQuery, {}, {
    next: { tags: ['project'] }
  }) as any;
}

export async function getProject(slug: string): Promise<ProjectDocument | null> {
  const currentClient = await getClient();
  return await currentClient.fetch(queries.projectBySlugQuery, { slug }, {
    next: { tags: ['project'] }
  }) as any;
}

// ============================================================================
// SERVICES
// ============================================================================

// For list views - lightweight projection
export async function getAllServices(): Promise<ServiceDocument[]> {
  const currentClient = await getClient();
  return await currentClient.fetch(queries.servicesQuery, {}, {
    next: { tags: ['service'] }
  }) as any;
}

// For detail views - full document
export async function getAllServicesFull(): Promise<ServiceDocument[]> {
  const currentClient = await getClient();
  return await currentClient.fetch(queries.servicesFullQuery, {}, {
    next: { tags: ['service'] }
  }) as any;
}

export async function getService(slug: string): Promise<ServiceDocument | null> {
  const currentClient = await getClient();
  return await currentClient.fetch(queries.serviceBySlugQuery, { slug }, {
    next: { tags: ['service'] }
  }) as any;
}

// ============================================================================
// BLOG POSTS
// ============================================================================

// For list views - lightweight projection
export async function getAllPosts(): Promise<BlogPostDocument[]> {
  const currentClient = await getClient();
  return await currentClient.fetch(queries.postsQuery, {}, {
    next: { tags: ['blog_post'] }
  }) as any;
}

// For detail views - full document (includes content)
export async function getAllPostsFull(): Promise<BlogPostDocument[]> {
  const currentClient = await getClient();
  return await currentClient.fetch(queries.postsFullQuery, {}, {
    next: { tags: ['blog_post'] }
  }) as any;
}

export async function getPost(slug: string): Promise<BlogPostDocument | null> {
  const currentClient = await getClient();
  return await currentClient.fetch(queries.postBySlugQuery, { slug }, {
    next: { tags: ['blog_post'] }
  }) as any;
}

// ============================================================================
// SITE SETTINGS
// ============================================================================

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const currentClient = await getClient();
  return await currentClient.fetch(queries.siteSettingsQuery, {}, {
    next: { tags: ['siteSettings'] }
  }) as any
}

// ============================================================================
// PAGE METADATA
// ============================================================================

export async function getPageMetadata(page: string): Promise<PageMetadata | null> {
  const currentClient = await getClient();
  return await currentClient.fetch(queries.pageMetadataQuery, { page }, {
    next: { tags: ['pageMetadata'] }
  }) as any
}



// ============================================================================
// WRITE OPERATIONS (API) - Requires SANITY_API_TOKEN
// ============================================================================

if (!token) {
  console.warn('SANITY_API_TOKEN not configured - write operations will fail');
}

export interface WriteOptions {
  returnDocuments?: boolean;
}

export async function updateDocument<T extends Record<string, unknown>>(
  id: string,
  fields: Partial<T>,
  options: WriteOptions = { returnDocuments: true }
): Promise<unknown> {
  if (!token) {
    throw new Error('SANITY_API_TOKEN is required for write operations. Set it in .env.local or via wrangler secret put SANITY_API_TOKEN');
  }

  const mutation = client.patch(id).set(fields);
  return options.returnDocuments ? mutation.commit() : mutation.commit();
}

export async function createDocument<T extends { _type: string }>(
  doc: T
): Promise<unknown> {
  if (!token) {
    throw new Error('SANITY_API_TOKEN is required for write operations. Set it in .env.local or via wrangler secret put SANITY_API_TOKEN');
  }

  return client.create(doc);
}

export async function deleteDocument(id: string): Promise<unknown> {
  if (!token) {
    throw new Error('SANITY_API_TOKEN is required for write operations. Set it in .env.local or via wrangler secret put SANITY_API_TOKEN');
  }

  return client.delete(id);
}

export async function createOrReplaceDocument<T extends { _type: string; _id: string }>(
  doc: T
): Promise<unknown> {
  if (!token) {
    throw new Error('SANITY_API_TOKEN is required for write operations. Set it in .env.local or via wrangler secret put SANITY_API_TOKEN');
  }

  return client.createOrReplace(doc);
}
