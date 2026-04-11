import * as prismic from '@prismicio/client';
import { ProjectDocument, ServiceDocument, BlogPostDocument } from '../types';

export const repositoryName = process.env.PRISMIC_REPOSITORY_NAME || 'your-repo-name';

export const createClient = (config: prismic.ClientConfig = {}) => {
  const client = prismic.createClient(repositoryName, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    ...config,
  });
  return client;
};

export const client = createClient();

export async function getAllProjects(): Promise<ProjectDocument[]> {
  const projects = await client.getAllByType<ProjectDocument>('project', { lang: '*' });
  return projects.sort((a, b) => {
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    // Assuming year is stored as string 'YYYY'
    return String(b.data.year || '').localeCompare(String(a.data.year || ''));
  });
}

export async function getProject(uid: string): Promise<ProjectDocument> {
  return await client.getByUID<ProjectDocument>('project', uid, { lang: '*' });
}

export async function getAllServices(): Promise<ServiceDocument[]> {
  const services = await client.getAllByType<ServiceDocument>('service', { lang: '*' });
  return services.sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
}

export async function getService(uid: string): Promise<ServiceDocument> {
  return await client.getByUID<ServiceDocument>('service', uid, { lang: '*' });
}

export async function getAllPosts(): Promise<BlogPostDocument[]> {
  return await client.getAllByType<BlogPostDocument>('blog_post', { lang: '*' });
}

export async function getPost(uid: string): Promise<BlogPostDocument> {
  return await client.getByUID<BlogPostDocument>('blog_post', uid, { lang: '*' });
}
