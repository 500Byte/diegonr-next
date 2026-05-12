import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';
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

const apiVersion = '2025-01-01'; // Use current date for latest features
const token = getEnvVar('SANITY_API_TOKEN');

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token,
});

const builder = createImageUrlBuilder(client);


export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

// ============================================================================
// PROJECTS
// ============================================================================

// For list views - lightweight projection
export async function getAllProjects(): Promise<ProjectDocument[]> {
  const projects = await client.fetch(queries.projectsQuery);

  return (projects as any).sort((a: any, b: any) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return String(b.year || '').localeCompare(String(a.year || ''));
  });
}

// For detail views - full document
export async function getAllProjectsFull(): Promise<ProjectDocument[]> {
  return await client.fetch(queries.projectsFullQuery) as any;
}

export async function getProject(slug: string): Promise<ProjectDocument | null> {
  return await client.fetch(queries.projectBySlugQuery, { slug }) as any;
}

// ============================================================================
// SERVICES
// ============================================================================

// For list views - lightweight projection
export async function getAllServices(): Promise<ServiceDocument[]> {
  return await client.fetch(queries.servicesQuery) as any;
}

// For detail views - full document
export async function getAllServicesFull(): Promise<ServiceDocument[]> {
  return await client.fetch(queries.servicesFullQuery) as any;
}

export async function getService(slug: string): Promise<ServiceDocument | null> {
  return await client.fetch(queries.serviceBySlugQuery, { slug }) as any;
}

// ============================================================================
// BLOG POSTS
// ============================================================================

// For list views - lightweight projection
export async function getAllPosts(): Promise<BlogPostDocument[]> {
  return await client.fetch(queries.postsQuery) as any;
}

// For detail views - full document (includes content)
export async function getAllPostsFull(): Promise<BlogPostDocument[]> {
  return await client.fetch(queries.postsFullQuery) as any;
}

export async function getPost(slug: string): Promise<BlogPostDocument | null> {
  return await client.fetch(queries.postBySlugQuery, { slug }) as any;
}

// ============================================================================
// SITE SETTINGS
// ============================================================================

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return await client.fetch(queries.siteSettingsQuery) as any
}

// ============================================================================
// PAGE METADATA
// ============================================================================

export async function getPageMetadata(page: string): Promise<PageMetadata | null> {
  return await client.fetch(queries.pageMetadataQuery, { page }) as any
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
