import { config, fields, collection } from '@keystatic/core';

const isProd = process.env.NODE_ENV === 'production';

export default config({
  storage: isProd
    ? { kind: 'cloud' }
    : { kind: 'local' },
  cloud: isProd
    ? { project: 'portafolio/diegonr-next' }
    : undefined,
  collections: {
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'content/projects/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        category: fields.array(
          fields.text({ label: 'Category' }),
          { label: 'Categories', itemLabel: props => props.value }
        ),
        year: fields.text({ label: 'Year' }),
        description: fields.object({
          es: fields.text({ label: 'Description ES', multiline: true }),
          en: fields.text({ label: 'Description EN', multiline: true }),
        }),
        tech: fields.array(
          fields.text({ label: 'Technology' }),
          { label: 'Technologies', itemLabel: props => props.value }
        ),
        url: fields.url({ label: 'Project URL' }),
        featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
        image: fields.image({
          label: 'Cover Image',
          directory: 'public/keystatic-assets/projects',
          publicPath: '/keystatic-assets/projects',
        }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/keystatic-assets/projects',
            publicPath: '/keystatic-assets/projects',
          },
        }),
      },
    }),
    services: collection({
      label: 'Services',
      slugField: 'title',
      path: 'content/services/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title (Admin use only)' } }),
        titleObj: fields.object({
          es: fields.text({ label: 'Title ES' }),
          en: fields.text({ label: 'Title EN' }),
        }),
        description: fields.object({
          es: fields.text({ label: 'Description ES', multiline: true }),
          en: fields.text({ label: 'Description EN', multiline: true }),
        }),
        items: fields.array(
          fields.object({
            es: fields.text({ label: 'Item ES' }),
            en: fields.text({ label: 'Item EN' }),
          }),
          { label: 'Service Items', itemLabel: props => props.fields.es.value }
        ),
        content: fields.document({
          label: 'Full Content',
          formatting: true,
          dividers: true,
          links: true,
        }),
        order: fields.integer({ label: 'Display Order', defaultValue: 0 }),
      },
    }),
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Publish Date' }),
        category: fields.text({ label: 'Category' }),
        readTime: fields.text({ label: 'Read Time' }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true }),
        image: fields.image({
          label: 'Cover Image',
          directory: 'public/keystatic-assets/blog',
          publicPath: '/keystatic-assets/blog',
        }),
        author: fields.text({ label: 'Author', defaultValue: 'Diego' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags', itemLabel: props => props.value }
        ),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/keystatic-assets/blog',
            publicPath: '/keystatic-assets/blog',
          },
        }),
      },
    }),
  },
});