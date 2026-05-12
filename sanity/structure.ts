import { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.divider(),
      S.listItem()
        .title('Page Metadata')
        .id('pageMetadata')
        .child(
          S.documentTypeList('pageMetadata')
            .title('Page Metadata')
        ),
      S.divider(),
      // Filter out singleton types from the default list
      ...S.documentTypeListItems().filter(
        (listItem) => !['siteSettings'].includes(listItem.getId()!)
      ),
    ])
