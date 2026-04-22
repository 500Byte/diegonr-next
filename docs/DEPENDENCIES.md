# Key Dependencies

## Framework & Core
- **Next.js (`next`)**: The core React framework providing SSR, routing (App Router), and API endpoints.
- **React & React DOM (`react`, `react-dom`)**: Core UI libraries. Version 19 is currently utilized.

## Styling & UI
- **Tailwind CSS (`tailwindcss`, `@tailwindcss/postcss`)**: Utility-first CSS framework used for all component styling.
- **next-themes**: Handles light/dark mode switching with system preference detection.
- **lucide-react**: Icon library used throughout the UI.
- **clsx & tailwind-merge**: Utilities for conditionally joining Tailwind CSS classes without style conflicts.

## Animation
- **GSAP (`gsap`)**: Industry-standard robust animation library for complex, sequenced timelines and scroll animations.
- **@gsap/react**: Official GSAP integration for React, providing the `useGSAP` hook for safe lifecycle management.
- **Lenis (`lenis`)**: Lightweight smooth scrolling library to enhance the feel of scroll-triggered animations.

## CMS & Content
- **Sanity (`next-sanity`)**: Headless CMS client for fetching content from Sanity Cloud using GROQ.
- **Portable Text (`@portabletext/react`, `@portabletext/types`)**: Renders Sanity's Portable Text rich text content as React components.
- **Sanity Image Utility (`@sanity/image-url`)**: Helper to generate and transform URLs for images hosted on Sanity.

See [SANITY.md](SANITY.md) for detailed CMS integration documentation.

## Forms & Validation
- **React Hook Form (`react-hook-form`)**: Performant form handling with minimal re-renders.
- **Zod (`zod`)**: TypeScript-first schema validation for forms.
- **Resolvers (`@hookform/resolvers`)**: Bridge between Zod and React Hook Form.
- **EmailJS (`@emailjs/browser`)**: Client-side email sending for contact form.

## Analytics & SEO
- **Google Analytics (`nextjs-google-analytics`)**: Analytics integration for Next.js.

## TypeScript
- **React Types (`@types/react`, `@types/react-dom`)**: TypeScript definitions for React.
