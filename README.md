# Diego NR Portfolio

A production-ready personal portfolio showcasing expertise in frontend architecture, animations, and full-stack development. Built with Next.js 16, Sanity CMS, and deployed to Cloudflare Workers.

---

## Overview

This portfolio features a sophisticated monochromatic design system with smooth scrolling, GSAP animations, and a headless CMS for content management. It supports multiple languages, is fully responsive, and optimized for performance.

### Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Animations | GSAP + Lenis (smooth scroll) |
| CMS | Sanity Cloud |
| Hosting | Cloudflare Workers (OpenNext) |
| i18n | next-intl |
| Forms | EmailJS |

### Features

- **Smooth Scrolling** — Lenis-powered scroll experience
- **GSAP Animations** — Scroll-triggered animations and micro-interactions
- **Multi-language** — English and Spanish support via next-intl
- **Content Management** — Sanity Studio for blog, projects, and services
- **Contact Forms** — Newsletter and contact forms via EmailJS
- **Analytics** — Google Analytics 4 integration
- **PWA Ready** — Offline page and installable manifest
- **Dark Mode** — System preference detection with next-themes

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/500byte/diegonr-next.git
cd diegonr-next

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## Environment Setup

Copy the example environment file and configure your values:

```bash
cp .env.example .env.local
```

### Required Variables

```env
# Sanity CMS (Required)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

### Optional Variables

```env
# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Forms (EmailJS)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxx
NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID=template_xxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxx
```

> [!NOTE]
> Get your Sanity credentials from [sanity.io/manage](https://www.sanity.io/manage). The `SANITY_API_TOKEN` is only needed for draft previews.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix lint errors |
| `npm run type-check` | Run TypeScript check |
| `npm run preview` | Preview Cloudflare build |

---

## Project Structure

```
diegonr-next/
├── src/
│   ├── app/                 # Next.js App Router
│   │   └── [locale]/        # Internationalized routes
│   │       ├── (website)/  # Main pages (_sections colocalized)
│   │       └── api/        # API routes
│   ├── components/         # Shared components
│   │   ├── ui/             # Atomic UI components
│   │   ├── animations/     # GSAP wrappers
│   │   └── providers/      # Context providers
│   ├── lib/                # Utilities (sanity, lenis, utils)
│   └── types/              # TypeScript types
├── sanity/                 # Sanity Studio (standalone)
├── docs/                   # Architecture & coding standards
└── public/                 # Static assets
```

---

## Deployment

### Cloudflare Workers (Recommended)

The project deploys automatically via GitHub Actions on every push to `master`.

**Required GitHub Secrets:**

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

**Manual Deployment:**

```bash
npm run deploy
```

> [!IMPORTANT]
> The `SANITY_API_TOKEN` must be added as a Cloudflare Secret:
> ```bash
> wrangler secret put SANITY_API_TOKEN
> ```

### Sanity Studio

Deploy the admin panel:

```bash
cd sanity
npx sanity deploy
```

---

## Documentation

For detailed architecture and coding standards, see the `/docs` directory:

- [Architecture](/docs/ARCHITECTURE.md) — System design and patterns
- [Coding Standards](/docs/CODING_STANDARDS.md) — Code conventions
- [Deployment](/docs/DEPLOYMENT.md) — Cloudflare setup guide
- [Sanity CMS](/docs/SANITY.md) — Content schema and usage
- [i18n](/docs/I18N_AUDIT.md) — Internationalization details

---

## License

MIT — see the [LICENSE](LICENSE) file for details.