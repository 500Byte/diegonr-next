import { PortableTextBlock } from '@portabletext/types';

export interface BaseSanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

export interface Slug {
  _type: 'slug';
  current: string;
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  [key: string]: unknown;
}

export interface ProjectDocument extends BaseSanityDocument {
  _type: 'project';
  title?: string;
  slug?: Slug;
  category?: { item?: string }[];
  year?: string;
  description_es?: PortableTextBlock[];
  description_en?: PortableTextBlock[];
  tech?: { item?: string }[];
  url?: {
    link_type?: string;
    url?: string;
    target?: string;
  };
  featured?: boolean;
  image?: SanityImage;
  content?: PortableTextBlock[];
}

export interface ServiceDocument extends BaseSanityDocument {
  _type: 'service';
  title?: string;
  slug?: Slug;
  title_es?: string;
  title_en?: string;
  description_es?: PortableTextBlock[];
  description_en?: PortableTextBlock[];
  items?: { es?: string; en?: string }[];
  order?: number;
  content?: PortableTextBlock[];
}

export interface BlogPostDocument extends BaseSanityDocument {
  _type: 'blog_post';
  title?: string;
  slug?: Slug;
  date?: string;
  category?: string;
  read_time?: string;
  excerpt?: PortableTextBlock[];
  image?: SanityImage;
  author?: string;
  tags?: { tag?: string }[];
  content?: PortableTextBlock[];
}
