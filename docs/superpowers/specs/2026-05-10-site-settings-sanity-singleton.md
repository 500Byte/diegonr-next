# Design Spec: Site Settings Sanity Singleton

**Date:** 2026-05-10
**Topic:** Centralized site configuration management via Sanity CMS

## Problem
Hardcoded configuration data (social links, email, brand info, SEO metadata) is duplicated across 15+ files with multiple inconsistencies: 3 different GitHub URLs, 2 LinkedIn URLs, 3 email addresses, and wrong country in StructuredData.

## Solution
A single Sanity document type `siteSettings` (singleton pattern) that centralizes all configurable data. Components consume it via a single `getSiteSettings()` query.

## Schema Structure

```
siteSettings (Singleton)
├── brand
│   ├── name: string ("Diego NR")
│   ├── fullName: string ("Diego Navarro")
│   └── tagline_es/en: (Portable Text)
├── contact
│   ├── email: string ("hola@diegonr.com")
│   └── location_es/en: string ("Santa Marta, Colombia")
├── socialLinks (array)
│   ├── { platform: "GitHub", url: "https://github.com/500byte" }
│   ├── { platform: "LinkedIn", url: "https://linkedin.com/in/diegonr" }
│   └── { platform: "Twitter", url: "https://twitter.com/diegonr" }
├── seo
│   ├── siteUrl: string ("https://diegonr.com")
│   └── twitterHandle: string ("@diegonr")
└── copyright: string ("DIEGO NAVARRO")
```

## Components Affected
- Footer.tsx, FooterError.tsx, MobileMenu.tsx
- StructuredData.tsx
- Contact page, Hero.tsx, About.tsx
- Metadata on all 10 page files
