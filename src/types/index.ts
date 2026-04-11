import { PrismicDocument, RichTextField, KeyTextField, GroupField, ImageField, DateField, NumberField, LinkField, BooleanField } from '@prismicio/client';

export type ProjectDocument = PrismicDocument<{
  title: KeyTextField;
  category: GroupField<{ item: KeyTextField }>;
  year: KeyTextField;
  description_es: RichTextField;
  description_en: RichTextField;
  tech: GroupField<{ item: KeyTextField }>;
  url: LinkField;
  featured: BooleanField;
  image: ImageField;
  content: RichTextField;
}, "project">;

export type ServiceDocument = PrismicDocument<{
  title: KeyTextField;
  title_es: KeyTextField;
  title_en: KeyTextField;
  description_es: RichTextField;
  description_en: RichTextField;
  items: GroupField<{ es: KeyTextField; en: KeyTextField }>;
  order: NumberField;
  content: RichTextField;
}, "service">;

export type BlogPostDocument = PrismicDocument<{
  title: KeyTextField;
  date: DateField;
  category: KeyTextField;
  read_time: KeyTextField;
  excerpt: RichTextField;
  image: ImageField;
  author: KeyTextField;
  tags: GroupField<{ tag: KeyTextField }>;
  content: RichTextField;
}, "blog_post">;
