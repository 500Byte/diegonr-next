import { defineType, defineField } from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'category', title: 'Category', type: 'array', of: [{ type: 'object', fields: [{ name: 'item', type: 'string' }] }] }),
    defineField({ name: 'year', title: 'Year', type: 'string' }),
    defineField({ name: 'description_es', title: 'Description (ES)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'description_en', title: 'Description (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'tech', title: 'Technologies', type: 'array', of: [{ type: 'object', fields: [{ name: 'item', type: 'string' }] }] }),
    defineField({ name: 'url', title: 'URL', type: 'object', fields: [
      { name: 'link_type', type: 'string' },
      { name: 'url', type: 'url' },
      { name: 'target', type: 'string' }
    ]}),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] }),
  ],
})
