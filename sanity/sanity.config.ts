import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Diego NR Studio',

  projectId: 'qda0c21o',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: schema,
})
