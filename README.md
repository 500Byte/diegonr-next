# Diego NR

Solutions Architect & Full-Stack Developer

## About

A modern portfolio built with Next.js, showcasing expertise in web development, AI integration, and performance optimization. This project demonstrates advanced techniques in React development, TypeScript, and modern web standards.

## Technology

- Next.js 16 with App Router
- TypeScript for type safety
- Tailwind CSS v4 for styling
- GSAP for animations
- Sanity Cloud for content management
- Cloudflare Pages for hosting

## Features

- Responsive design with fluid typography
- Advanced animations and micro-interactions
- SEO optimization with structured data
- Performance monitoring and analytics
- Contact forms with email integration
- Content management system
- Dark/light theme support

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Configuration

Copy `.env.example` to `.env.local` and configure:

- Google Analytics tracking ID
- EmailJS service credentials
- GitHub API token (optional)

## License

This project is private and proprietary.

- **Colors**: Modify `tailwind.config.js`
- **Fonts**: Update `src/app/layout.tsx`
- **Animations**: Adjust GSAP configurations

### Analytics

Configure tracking IDs in environment variables for:

- Google Analytics 4
- GitHub API integration
- EmailJS for forms

## Deployment

### Cloudflare Pages (Recommended)

1. Connect your GitHub repository to Cloudflare Pages.
2. The project uses OpenNext to bridge Next.js to Cloudflare.
3. Configure environment variables in the Cloudflare Dashboard.
4. Deployments are automatic on every push to `master`.

### Sanity Studio (Standalone)

The CMS admin panel is located in the `/sanity` directory and is deployed to Sanity's global CDN:

```bash
cd sanity
npx sanity deploy
```

### Manual Deployment

```bash
npm run build
npm run start
```

## Performance

- **Lighthouse Score**: 95+ (Performance, SEO, Accessibility)
- **Core Web Vitals**: All metrics in green
- **Bundle Size**: Optimized with code splitting
- **Image Optimization**: Next.js automatic optimization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Next.js** - The React framework for production
- **Cloudflare** - Hosting and Edge computing platform
- **Sanity** - Headless CMS & Content Platform
- **GSAP** - Animation library
- **Tailwind CSS** - Utility-first CSS framework

## Contact

**Diego NR**

- Website: [diegonr.com](https://diegonr.com)
- LinkedIn: [linkedin.com/in/diegonr](https://linkedin.com/in/diegonr)
- GitHub: [github.com/diegonr](https://github.com/diegonr)
- Email: hola@diegonr.com

---

<a href="#diego-nr---portfolio">Back to top</a>
