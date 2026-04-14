# Diego NR Portfolio

Modern portfolio website for Diego NR - Solutions Architect & Full-Stack Developer.

## Description
A highly optimized, modern personal portfolio and professional services website built to showcase expertise in web development, AI integration, and advanced frontend architectures. It features high-end GSAP animations, a custom Sanity Cloud CMS integration, and a sophisticated monochromatic/Swiss design system.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: GSAP & Lenis (Smooth Scrolling)
- **CMS**: Sanity Cloud (Headless CMS)
- **Hosting**: Cloudflare Pages (via OpenNext)
- **Forms**: EmailJS
- **Analytics**: Google Analytics 4

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev &

# Build for production
npm run build

# Start production server
npm run start &
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```env
# SANITY CMS (Required)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Analytics & Tracking (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# GitHub Stats (Optional)
NEXT_PUBLIC_GITHUB_TOKEN=

# EmailJS (Required for forms)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

## Folder Structure

```
├── docs/                # Architecture and coding standards documentation
├── public/              # Static assets (images, icons)
├── sanity/              # Standalone Sanity Studio admin panel
├── src/
│   ├── app/             # Next.js App Router (pages, layouts, actions)
│   │   ├── (website)/   # Main website routes and colocated _sections
│   ├── components/      # Shared components (UI, animations, providers)
│   ├── lib/             # Utilities and configurations (sanity, lenis, utils)
│   └── types/           # Shared TypeScript types for Sanity CMS
```

## Development Guidelines

Refer to the `/docs` directory for detailed architectural and coding standards:
- `ARCHITECTURE.md`
- `CODING_STANDARDS.md`
- `DEPENDENCIES.md`
- `DEPLOYMENT.md`

## Deployment

### Cloudflare Pages
This project is configured to deploy seamlessly to Cloudflare Pages using OpenNext.
1. Configure secrets in the Cloudflare Dashboard.
2. Build and deploy: `npm run deploy`

### Sanity Studio
The admin interface lives in `/sanity`:
```bash
cd sanity
npx sanity deploy
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
