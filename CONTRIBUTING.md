# Contributing to Diego NR Portfolio

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/diegonr-next.git`
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Install** dependencies: `npm install`
5. **Start** development: `npm run dev`

## 📝 Development Workflow

### Branch Naming Convention
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Testing related changes

### Commit Messages
We use conventional commits:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Testing
- `chore` - Maintenance

Examples:
```
feat: add dark mode toggle
fix: resolve mobile navigation bug
docs: update installation guide
```

### Pull Request Process

1. **Update** your branch with main: `git pull origin main`
2. **Test** your changes thoroughly
3. **Run** linting: `npm run lint`
4. **Create** a Pull Request with:
   - Clear title and description
   - Screenshots for UI changes
   - Link to related issues

## 🛠️ Development Guidelines

### Code Style
- **TypeScript** - Strict type checking enabled
- **ESLint** - Code linting with Next.js rules
- **Prettier** - Automatic code formatting
- **PascalCase** - Components and files
- **camelCase** - Functions and variables

### Component Structure
```tsx
// Use functional components with TypeScript
interface ComponentProps {
  title: string
  onClick?: () => void
}

export function MyComponent({ title, onClick }: ComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      {onClick && <button onClick={onClick}>Click me</button>}
    </div>
  )
}
```

### File Organization
```
src/
├── app/               # Routes and layouts
│   └── (website)/
│       └── _sections/ # Page-specific private sections
├── components/        # Shared, truly reusable UI components
│   └── ui/           # Atomic UIPrimitives
├── lib/              # Service connectors & utilities (sanity.ts, analytics.tsx)
├── types/            # Shared TypeScript interfaces for Sanity content
└── sanity/            # Standalone Sanity Studio project (outside src actually, but described in context)
```

## 🎨 Design Guidelines

### Color Palette
- **Primary**: Swiss Black (#000000)
- **Secondary**: Swiss White (#FFFFFF)
- **Accent**: Subtle grays and brand colors

### Typography
- **Headings**: Font family with proper hierarchy
- **Body**: Clean, readable font
- **Mono**: For code and technical content

### Animations
- **GSAP**: For complex animations
- **CSS**: For simple transitions
- **Performance**: 60fps animations preferred

## 🧪 Testing

### Manual Testing Checklist
- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Mobile (iOS Safari, Chrome Mobile)
- [ ] Tablet (iPad, Android tablets)
- [ ] Accessibility (screen readers, keyboard navigation)
- [ ] Performance (Lighthouse score >90)

### Automated Testing
```bash
# Run tests (currently not specified)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📱 Progressive Web App (PWA)

### Testing PWA Features
1. **Installability**: Check "Add to Home Screen" prompt
2. **Offline**: Test with network disabled
3. **Updates**: Verify service worker updates

### PWA Checklist
- [ ] Web App Manifest present
- [ ] Service Worker registered
- [ ] HTTPS enabled
- [ ] Offline page available
- [ ] Install prompt triggered

## 🔍 SEO & Performance

### SEO Checklist
- [ ] Meta tags configured
- [ ] Open Graph images
- [ ] Structured data (JSON-LD)
- [ ] Sitemap generated
- [ ] Robots.txt configured

### Performance Checklist
- [ ] Images optimized
- [ ] Bundle size < 200KB
- [ ] Core Web Vitals green
- [ ] Lighthouse score >90

## 📞 Communication

### Issues and Discussions
- **Bug Reports**: Use issue templates
- **Feature Requests**: Describe use case and benefits
- **Questions**: Check documentation first

### Code Reviews
- ** constructive feedback
- **Focus** on code quality and best practices
- **Suggest** improvements, don't demand changes

## 🎉 Recognition

Contributors will be:
- Listed in repository contributors
- Mentioned in release notes
- Featured in portfolio updates (with permission)

## 📋 Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors.

### Our Standards
- Be respectful and inclusive
- Focus on constructive feedback
- Accept responsibility for mistakes
- Show empathy towards other contributors

## 📞 Contact

Questions about contributing? Reach out:
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: hola@diegonr.com

Thank you for contributing! 🎉