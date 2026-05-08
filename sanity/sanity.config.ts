import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'


export default defineConfig({
  name: 'default',
  title: 'Diego NR Studio',

  projectId,
  dataset,

  plugins: [structureTool(), visionTool()],

  schema: schema,
})

