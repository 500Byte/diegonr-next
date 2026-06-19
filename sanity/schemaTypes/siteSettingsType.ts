import { defineType, defineField } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'object',
      fields: [
        { name: 'name', title: 'Name', type: 'string' },
        { name: 'fullName', title: 'Full Name', type: 'string' },
        { name: 'tagline_es', title: 'Tagline (ES)', type: 'array', of: [{ type: 'block' }] },
        { name: 'tagline_en', title: 'Tagline (EN)', type: 'array', of: [{ type: 'block' }] },
      ]
    }),
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'object',
      fields: [
        { name: 'email', title: 'Email', type: 'string' },
        { name: 'location_es', title: 'Location (ES)', type: 'string' },
        { name: 'location_en', title: 'Location (EN)', type: 'string' },
      ]
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'platform', title: 'Platform', type: 'string' },
          { name: 'url', title: 'URL', type: 'url' },
        ]
      }]
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'siteUrl', title: 'Site URL', type: 'url' },
      ]
    }),
    defineField({ name: 'copyright', title: 'Copyright', type: 'string' }),
  ],
  preview: {
    prepare() { return { title: 'Site Settings' } }
  }
})
