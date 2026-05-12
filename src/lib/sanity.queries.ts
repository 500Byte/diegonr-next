import { defineQuery } from 'next-sanity'

export const projectsQuery = defineQuery(`*[_type == "project" && !(_id in path("drafts.**"))] | order(year desc) {
  _id, _type, _createdAt, _updatedAt, _rev, title, slug, category, year, featured, image, description_es, description_en
}`)

export const projectsFullQuery = defineQuery(`*[_type == "project" && !(_id in path("drafts.**"))] | order(year desc)`)

export const projectBySlugQuery = defineQuery(`*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0]`)

export const servicesQuery = defineQuery(`*[_type == "service" && !(_id in path("drafts.**"))] | order(order asc) {
  _id, _type, _createdAt, _updatedAt, _rev, title, title_es, title_en, slug, description_es, description_en, items, order
}`)

export const servicesFullQuery = defineQuery(`*[_type == "service" && !(_id in path("drafts.**"))] | order(order asc)`)

export const serviceBySlugQuery = defineQuery(`*[_type == "service" && slug.current == $slug && !(_id in path("drafts.**"))][0]`)

export const postsQuery = defineQuery(`*[_type == "blog_post" && !(_id in path("drafts.**")) && published == true] | order(date desc) {
  _id, _type, _createdAt, _updatedAt, _rev, title, slug, date, category, read_time, excerpt, image
}`)

export const postsFullQuery = defineQuery(`*[_type == "blog_post" && !(_id in path("drafts.**")) && published == true] | order(date desc)`)

export const postBySlugQuery = defineQuery(`*[_type == "blog_post" && slug.current == $slug && !(_id in path("drafts.**")) && published == true][0]`)

export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]`)

export const pageMetadataQuery = defineQuery(`*[_type == "pageMetadata" && page == $page && !(_id in path("drafts.**"))][0]`)
