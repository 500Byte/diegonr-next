'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { schema } from './src/sanity/schemaTypes'

// Use values directly or from env if available
const projectId = 'qda0c21o';
const dataset = 'production';
const apiVersion = '2024-01-01';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'Diego NR Studio',
  schema,
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
