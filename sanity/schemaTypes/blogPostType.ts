import { defineType, defineField } from 'sanity'

export const blogPostType = defineType({
  name: 'blog_post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'date', title: 'Date', type: 'date' }),
    defineField({ name: 'category', title: 'Category', type: 'string' }),
    defineField({ name: 'read_time', title: 'Read Time', type: 'string' }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'author', title: 'Author', type: 'string' }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'object', fields: [{ name: 'tag', type: 'string' }] }] }),
    defineField({ name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
  ],
})
