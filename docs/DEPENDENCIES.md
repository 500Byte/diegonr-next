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
- **Keystatic (`@keystatic/core`, `@keystatic/next`)**: A local, Git-based CMS that allows editing content via an admin UI while storing data as Markdown/Markdoc files in the repository.
