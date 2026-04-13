import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Admin Title',
      type: 'string',
    }),
    defineField({
      name: 'uid',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'title_es',
      title: 'Title (ES)',
      type: 'string',
    }),
    defineField({
      name: 'title_en',
      title: 'Title (EN)',
      type: 'string',
    }),
    defineField({
      name: 'description_es',
      title: 'Short Description (ES)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'description_en',
      title: 'Short Description (EN)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'items',
      title: 'Service Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'es', type: 'string', title: 'Item Name (ES)' },
            { name: 'en', type: 'string', title: 'Item Name (EN)' },
          ],
        },
      ],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
    defineField({
      name: 'content',
      title: 'Service Detail Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
})
