import { defineType, defineField } from 'sanity'
import { CaseIcon } from '@sanity/icons'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'category',
      title: 'Category',
      type: 'array',
      of: [{ type: 'object', fields: [{ name: 'item', type: 'string' }] }]
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (Rule) => Rule.required().regex(/^\d{4}$/, {
        name: '4-digit year',
        invert: false
      })
    }),
    defineField({ name: 'description_es', title: 'Description (ES)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'description_en', title: 'Description (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'tech', title: 'Technologies', type: 'array', of: [{ type: 'object', fields: [{ name: 'item', type: 'string' }] }] }),
    defineField({ name: 'url', title: 'Project URL', type: 'url', description: 'External link to the live project' }),
    defineField({ name: 'github_url', title: 'GitHub URL', type: 'url' }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }]
        }
      ]
    }),
    defineField({ name: 'challenge_es', title: 'Challenge (ES)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'challenge_en', title: 'Challenge (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'solution_es', title: 'Solution (ES)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'solution_en', title: 'Solution (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'results_es', title: 'Results (ES)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'results_en', title: 'Results (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'technical_specs',
      title: 'Technical Specs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'value', type: 'string', title: 'Value' }
          ]
        }
      ]
    }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] }),
  ],
  initialValue: {
    featured: false,
  },
  preview: {
    select: {
      title: 'title',
      subtitle: 'year',
      media: 'image',
    },
  },
})
