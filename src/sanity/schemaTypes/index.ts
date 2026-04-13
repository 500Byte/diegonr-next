import { type SchemaTypeDefinition } from 'sanity'

import project from './project'
import service from './service'
import blogPost from './blogPost'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, service, blogPost],
}
