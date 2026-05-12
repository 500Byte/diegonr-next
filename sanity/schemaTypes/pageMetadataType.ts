import { defineType, defineField } from 'sanity'
import { SearchIcon } from '@sanity/icons'

export const pageMetadataType = defineType({
  name: 'pageMetadata',
  title: 'Page Metadata',
  type: 'document',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
      options: {
        list: [
          { title: 'Home', value: 'home' },
          { title: 'About', value: 'about' },
          { title: 'Services', value: 'services' },
          { title: 'Projects', value: 'projects' },
          { title: 'Blog', value: 'blog' },
          { title: 'Contact', value: 'contact' },
        ],
      },
      validation: (rule) =>
        rule
          .required()
          .custom(async (value, context) => {
            if (!value) return true
            const { getClient } = context
            const client = getClient({ apiVersion: '2025-01-01' })
            const id = context.document?._id || ''
            const publishedId = id.replace(/^drafts\./, '')
            const draftId = id.startsWith('drafts.') ? id : `drafts.${id}`
            const count = await client.fetch<number>(
              `count(*[_type == "pageMetadata" && page == $page && _id != $publishedId && _id != $draftId])`,
              { page: value, publishedId, draftId }
            )
            return count > 0 ? 'Ya existe un documento para esta página' : true
          }),
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'text', rows: 3 },
        { name: 'en', title: 'English', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'array', of: [{ type: 'string' }] },
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] },
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      description: 'Optional. Falls back to the dynamic /og route if not set.',
    }),
    defineField({
      name: 'robotsIndex',
      title: 'Allow Indexing',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'page', subtitle: 'metaTitle.es' },
  },
})
