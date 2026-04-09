export interface ProjectDescription {
  es: string;
  en: string;
}

export interface Project {
  id: string;
  title: string;
  category: string[];
  year: string;
  description: ProjectDescription;
  tech: string[];
  url?: string;
  featured: boolean;
  image?: string; // Optional for now as real projects might not have them yet
}

export interface ServiceItem {
  es: string;
  en: string;
}

export interface Service {
  id: string;
  title: ProjectDescription;
  description: ProjectDescription;
  items: ServiceItem[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
}
