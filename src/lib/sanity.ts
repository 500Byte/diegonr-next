import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';
import { ProjectDocument, ServiceDocument, BlogPostDocument } from '../types';

// Helper to get environment variables across different runtimes (Node.js, Cloudflare Workers)
const getEnvVar = (key: string): string | undefined => {
  const envObj = (globalThis as unknown as { env?: Record<string, string> }).env;
  return process.env[key] || envObj?.[key];
}

const projectId = getEnvVar('NEXT_PUBLIC_SANITY_PROJECT_ID') || 'qda0c21o';
const dataset = getEnvVar('NEXT_PUBLIC_SANITY_DATASET') || 'production';
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

// For list views - lightweight projection
export async function getAllProjects(): Promise<ProjectDocument[]> {
  const projects = await client.fetch<ProjectDocument[]>(
    `*[_type == "project" && !(_id in path("drafts.**"))] | order(year desc) {
      _id, _type, title, slug, category, year, featured, image, description_es
    }`
  );

  return projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return String(b.year || '').localeCompare(String(a.year || ''));
  });
}

// For detail views - full document
export async function getAllProjectsFull(): Promise<ProjectDocument[]> {
  return await client.fetch<ProjectDocument[]>(
    `*[_type == "project" && !(_id in path("drafts.**"))] | order(year desc)`
  );
}

export async function getProject(slug: string): Promise<ProjectDocument | null> {
  return await client.fetch<ProjectDocument | null>(
    `*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0]`,
    { slug }
  );
}

// For list views - lightweight projection
export async function getAllPosts(): Promise<BlogPostDocument[]> {
  return await client.fetch<BlogPostDocument[]>(
    `*[_type == "blog_post" && !(_id in path("drafts.**")) && published == true] | order(date desc) {
      _id, _type, title, slug, date, category, read_time, excerpt, image
    }`
  );
}

// For detail views - full document (includes content)
export async function getAllPostsFull(): Promise<BlogPostDocument[]> {
  return await client.fetch<BlogPostDocument[]>(
    `*[_type == "blog_post" && !(_id in path("drafts.**")) && published == true] | order(date desc)`
  );
}

// For detail views - full document
export async function getAllServicesFull(): Promise<ServiceDocument[]> {
  return await client.fetch<ServiceDocument[]>(
    `*[_type == "service" && !(_id in path("drafts.**"))] | order(order asc)`
  );
}

export async function getService(slug: string): Promise<ServiceDocument | null> {
  return await client.fetch<ServiceDocument | null>(
    `*[_type == "service" && slug.current == $slug && !(_id in path("drafts.**"))][0]`,
    { slug }
  );
}

export async function getAllPosts(): Promise<BlogPostDocument[]> {
  return await client.fetch<BlogPostDocument[]>(
    `*[_type == "blog_post" && !(_id in path("drafts.**")) && published == true] | order(date desc)`
  );
}

export async function getPost(slug: string): Promise<BlogPostDocument | null> {
  return await client.fetch<BlogPostDocument | null>(
    `*[_type == "blog_post" && slug.current == $slug && !(_id in path("drafts.**")) && published == true][0]`,
    { slug }
  );
}
