import { type SchemaTypeDefinition } from 'sanity'

import { projectType } from './projectType'
import { serviceType } from './serviceType'
import { blogPostType } from './blogPostType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectType, serviceType, blogPostType],
}
