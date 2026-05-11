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
  url?: string;
  github_url?: string;
  gallery?: SanityImage[];
  challenge_es?: PortableTextBlock[];
  challenge_en?: PortableTextBlock[];
  solution_es?: PortableTextBlock[];
  solution_en?: PortableTextBlock[];
  results_es?: PortableTextBlock[];
  results_en?: PortableTextBlock[];
  technical_specs?: { label?: string; value?: string }[];
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
  published?: boolean;
  date?: string;
  category?: string;
  read_time?: string;
  excerpt?: PortableTextBlock[];
  image?: SanityImage;
  author?: string;
  tags?: { tag?: string }[];
  content?: PortableTextBlock[];
}

export interface SiteSettings {
  _id: string;
  _type: 'siteSettings';
  brand: {
    name: string;
    fullName: string;
    tagline_es: PortableTextBlock[];
    tagline_en: PortableTextBlock[];
  };
  contact: {
    email: string;
    location_es: string;
    location_en: string;
  };
  socialLinks: { platform: string; url: string }[];
  seo: {
    siteUrl: string;
    twitterHandle: string;
  };
  copyright: string;
}

export interface PageMetadata {
  _id: string;
  _type: 'pageMetadata';
  page: 'home' | 'about' | 'services' | 'projects' | 'blog' | 'contact';
  metaTitle?: { es?: string; en?: string };
  metaDescription?: { es?: string; en?: string };
  keywords?: { es?: string[]; en?: string[] };
  ogImage?: SanityImage;
  robotsIndex?: boolean;
}
