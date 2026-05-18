import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schema } from './schemaTypes'
import { structure } from './structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qda0c21o'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'


export default defineConfig({
  name: 'default',
  title: 'Diego NR Studio',

  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2022-03-07' }),
    codeInput(),
  ],

  schema: {
    types: schema.types,
    // Enforce singleton by hiding from "New document" menu
    templates: (prev) =>
      prev.filter((template) => !['siteSettings'].includes(template.id)),
  },
  document: {
    // For singletons, hide the "Duplicate" and "Delete" actions
    actions: (prev, { schemaType }) => {
      if (['siteSettings'].includes(schemaType)) {
        return prev.filter(({ action }) => !['duplicate', 'delete'].includes(action!))
      }
      return prev
    },
  },
})

