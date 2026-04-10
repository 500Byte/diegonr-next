import { createReader } from '@keystatic/core/reader';
import { createGitHubReader } from '@keystatic/core/reader/github';
import keystaticConfig from '../../keystatic.config';
import { Project, Service, BlogPost } from '../types';

// Use the GitHub reader in production (Cloudflare Workers) when a token is
// provided. During `next build` and local dev, the local filesystem reader is
// used so that builds never make network requests to GitHub.
const githubToken = process.env.KEYSTATIC_GITHUB_TOKEN;

export const reader = githubToken
  ? createGitHubReader(keystaticConfig, {
      repo: 'diegonr/diegonr-next',
      token: githubToken,
    })
  : createReader(process.cwd(), keystaticConfig);

export async function getAllProjects(): Promise<Project[]> {
  const projects = await reader.collections.projects.all();
  return projects.map(p => ({
    id: p.slug,
    title: p.entry.title,
    category: [...p.entry.category],
    year: p.entry.year,
    description: p.entry.description,
    tech: [...p.entry.tech],
    url: p.entry.url || undefined,
    featured: p.entry.featured,
    image: p.entry.image || undefined,
  })).sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.year.localeCompare(a.year);
  });
}

export async function getProject(slug: string) {
  return await reader.collections.projects.read(slug);
}

export async function getAllServices(): Promise<Service[]> {
  const services = await reader.collections.services.all();
  return services.sort((a, b) => (a.entry.order || 0) - (b.entry.order || 0)).map(s => ({
    id: s.slug,
    title: s.entry.titleObj,
    description: s.entry.description,
    items: s.entry.items.map(item => ({ es: item.es, en: item.en }))
  }));
}

export async function getService(slug: string) {
  return await reader.collections.services.read(slug);
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await reader.collections.posts.all();
  return posts.map(p => ({
    id: p.slug,
    title: p.entry.title,
    excerpt: p.entry.excerpt,
    content: "Content is handled by DocumentRenderer",
    date: p.entry.date || "",
    category: p.entry.category,
    readTime: p.entry.readTime,
    image: p.entry.image || ""
  }));
}

export async function getPost(slug: string) {
  return await reader.collections.posts.read(slug);
}
