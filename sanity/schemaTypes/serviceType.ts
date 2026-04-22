import { defineType, defineField } from 'sanity'

export const serviceType = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(100)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'title_es',
      title: 'Title (ES)',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'title_en',
      title: 'Title (EN)',
      type: 'string'
    }),
    defineField({ name: 'description_es', title: 'Description (ES)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'description_en', title: 'Description (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'items', title: 'Items', type: 'array', of: [{ type: 'object', fields: [
      { name: 'es', title: 'Item (ES)', type: 'string' },
      { name: 'en', title: 'Item (EN)', type: 'string' }
    ] }] }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
    defineField({ name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] }),
  ],
})
