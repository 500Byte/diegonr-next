import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { Project, Service, Blog_post } from '@/sanity.types'
import { defineQuery } from 'next-sanity'
import { PortableTextBlock } from '@portabletext/types'


const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dummy-project-id'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2024-03-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Ensure fresh data for portfolio
})

const builder = imageUrlBuilder(client)

// @ts-ignore
export function urlFor(source: any) {
  return builder.image(source)
}

// GROQ Queries
export const projectsQuery = defineQuery(`*[_type == "project"] | order(featured desc, year desc) {
  _id,
  title,
  "uid": uid.current,
  category,
  year,
  description_es,
  description_en,
  tech,
  url,
  featured,
  image,
  content
}`)

export const projectByUidQuery = defineQuery(`*[_type == "project" && uid.current == $uid][0] {
  _id,
  title,
  "uid": uid.current,
  category,
  year,
  description_es,
  description_en,
  tech,
  url,
  featured,
  image,
  content
}`)

export const servicesQuery = defineQuery(`*[_type == "service"] | order(order asc) {
  _id,
  title,
  "uid": uid.current,
  title_es,
  title_en,
  description_es,
  description_en,
  items,
  order,
  content
}`)

export const serviceByUidQuery = defineQuery(`*[_type == "service" && uid.current == $uid][0] {
  _id,
  title,
  "uid": uid.current,
  title_es,
  title_en,
  description_es,
  description_en,
  items,
  order,
  content
}`)

export const blogPostsQuery = defineQuery(`*[_type == "blog_post"] | order(date desc) {
  _id,
  title,
  "uid": uid.current,
  date,
  category,
  read_time,
  excerpt,
  image,
  author,
  tags,
  content
}`)

export const blogPostByUidQuery = defineQuery(`*[_type == "blog_post" && uid.current == $uid][0] {
  _id,
  title,
  "uid": uid.current,
  date,
  category,
  read_time,
  excerpt,
  image,
  author,
  tags,
  content
}`)

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

export type ExtendedProject = Omit<Project, 'uid'> & { uid: string; category?: string[]; tech?: string[]; description_es?: PortableTextBlock[]; image?: SanityImage; content?: PortableTextBlock[]; url?: string }
export type ExtendedService = Omit<Service, 'uid'> & { uid: string; description_es?: PortableTextBlock[]; items?: {es?: string; en?: string}[]; content?: PortableTextBlock[] }
export type ExtendedBlogPost = Omit<Blog_post, 'uid'> & { uid: string; excerpt?: PortableTextBlock[]; image?: SanityImage; content?: PortableTextBlock[]; date?: string; read_time?: string; category?: string }

export async function getAllProjects(): Promise<ExtendedProject[]> {
  try {
    const result = await client.fetch(projectsQuery)
    return result as unknown as ExtendedProject[]
  } catch (e) {
    console.error("Failed to fetch projects", e)
    return []
  }
}

export async function getProject(uid: string): Promise<ExtendedProject | null> {
  try {
    const result = await client.fetch(projectByUidQuery, { uid })
    return result as unknown as ExtendedProject | null
  } catch (e) {
    console.error(`Failed to fetch project ${uid}`, e)
    return null
  }
}

export async function getAllServices(): Promise<ExtendedService[]> {
  try {
    const result = await client.fetch(servicesQuery)
    return result as unknown as ExtendedService[]
  } catch (e) {
    console.error("Failed to fetch services", e)
    return []
  }
}

export async function getService(uid: string): Promise<ExtendedService | null> {
  try {
    const result = await client.fetch(serviceByUidQuery, { uid })
    return result as unknown as ExtendedService | null
  } catch (e) {
    console.error(`Failed to fetch service ${uid}`, e)
    return null
  }
}

export async function getAllPosts(): Promise<ExtendedBlogPost[]> {
  try {
    const result = await client.fetch(blogPostsQuery)
    return result as unknown as ExtendedBlogPost[]
  } catch (e) {
    console.error("Failed to fetch posts", e)
    return []
  }
}

export async function getPost(uid: string): Promise<ExtendedBlogPost | null> {
  try {
    const result = await client.fetch(blogPostByUidQuery, { uid })
    return result as unknown as ExtendedBlogPost | null
  } catch (e) {
    console.error(`Failed to fetch post ${uid}`, e)
    return null
  }
}

// Helper to convert Portable Text to plain string
export function toPlainText(blocks: PortableTextBlock[] = []) {
  if (!blocks) return ''
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return ''
      }
      return (block.children as any[]).map((child) => child.text).join('')
    })
    .join('\n\n')
}
