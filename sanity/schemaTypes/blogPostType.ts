import { defineType, defineField, defineArrayMember } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const blogPostType = defineType({
  name: 'blog_post',
  title: 'Blog Post',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(200)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
      description: 'Set to true when ready to publish'
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({ name: 'read_time', title: 'Read Time', type: 'string' }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'author', title: 'Author', type: 'string' }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'object', fields: [{ name: 'tag', type: 'string' }] }] }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
        defineArrayMember({
          type: 'code',
          name: 'codeBlock',
          title: 'Code Block',
          options: {
            language: 'plaintext',
            languageAlternatives: [
              { title: 'Plain Text', value: 'plaintext' },
              { title: 'JavaScript', value: 'javascript' },
              { title: 'TypeScript', value: 'typescript' },
              { title: 'JSON', value: 'json' },
              { title: 'Python', value: 'python' },
              { title: 'HTML', value: 'html' },
              { title: 'CSS', value: 'css' },
              { title: 'Markdown', value: 'markdown' },
              { title: 'YAML', value: 'yaml' },
              { title: 'SQL', value: 'sql' },
              { title: 'Bash', value: 'bash' },
              { title: 'GROQ', value: 'groq' },
            ],
            withFilename: true,
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'table',
          title: 'Table',
          icon: () => '⊞',
          fields: [
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
            defineField({
              name: 'headers',
              title: 'Headers',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (Rule) => Rule.min(1).required(),
            }),
            defineField({
              name: 'rows',
              title: 'Rows',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'row',
                  fields: [
                    defineField({
                      name: 'cells',
                      title: 'Cells',
                      type: 'array',
                      of: [{ type: 'string' }],
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  preview: {
                    select: { cells: 'cells' },
                    prepare: ({ cells }: { cells?: string[] }) => ({
                      title: cells?.join(' | ') || 'Empty row',
                    }),
                  },
                }),
              ],
              validation: (Rule) => Rule.min(1).required(),
            }),
          ],
          preview: {
            select: { caption: 'caption', headers: 'headers' },
            prepare: ({ caption, headers }: { caption?: string; headers?: string[] }) => ({
              title: caption || 'Table',
              subtitle: headers?.join(' · ') || '',
            }),
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'callout',
          title: 'Callout',
          fields: [
            defineField({
              name: 'variant',
              title: 'Variant',
              type: 'string',
              options: {
                list: [
                  { title: 'Info', value: 'info' },
                  { title: 'Warning', value: 'warning' },
                  { title: 'Insight', value: 'insight' },
                  { title: 'Quote', value: 'quote' },
                ],
                layout: 'radio',
              },
              initialValue: 'info',
            }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'content', title: 'Content', type: 'text', rows: 3 }),
          ],
          preview: {
            select: { variant: 'variant', title: 'title' },
            prepare: ({ variant, title }: { variant?: string; title?: string }) => ({
              title: title || 'Callout',
              subtitle: variant ? variant.charAt(0).toUpperCase() + variant.slice(1) : '',
            }),
          },
        }),
      ],
    }),
  ],
  initialValue: {
    published: true,
    date: new Date().toISOString().split('T')[0],
  },
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'image',
    },
  },
})
