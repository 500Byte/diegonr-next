import { type SchemaTypeDefinition } from 'sanity'

import { projectType } from './projectType'
import { serviceType } from './serviceType'
import { blogPostType } from './blogPostType'
import { siteSettingsType } from './siteSettingsType'
import { pageMetadataType } from './pageMetadataType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectType, serviceType, blogPostType, siteSettingsType, pageMetadataType],
}
