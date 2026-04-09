<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Diego NR - Portfolio

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/GSAP-0AC775?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<div align="center">
  <h3>🚀 Solutions Architect & Full-Stack Developer</h3>
  <p>Modern web applications with cutting-edge technologies</p>
</div>

## ✨ Overview

A modern, high-performance portfolio showcasing full-stack development expertise with a focus on:

- **AI & Machine Learning** integration
- **Progressive Web Apps** (PWA)
- **Advanced SEO** with structured data
- **Smooth animations** and micro-interactions
- **Content Management** with Keystatic
- **Analytics & Performance** monitoring

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **GSAP** - High-performance animations
- **Lenis** - Smooth scrolling

### Backend & CMS
- **Keystatic** - Git-based headless CMS
- **EmailJS** - Email functionality
- **Next.js API Routes** - Serverless functions

### Performance & Analytics
- **Google Analytics 4** - User tracking
- **Vercel Analytics** - Performance metrics
- **Web Vitals** - Core web vitals monitoring
- **PWA** - Offline capabilities

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Commit message linting

## 🚀 Features

### 🎨 Design & UX
- **Swiss Design System** - Clean, minimal aesthetic
- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - Theme switching
- **Custom Cursor** - Interactive cursor effects
- **Magnetic Buttons** - Hover interactions

### 📱 PWA Features
- **Installable** - Add to home screen
- **Offline Support** - Service worker caching
- **Background Sync** - Offline form submissions
- **Push Notifications** - Future-ready

### 🔍 SEO & Performance
- **Structured Data** - Rich snippets support
- **Open Graph** - Social media optimization
- **Meta Tags** - Dynamic metadata
- **Sitemap** - Automatic XML sitemap
- **Robots.txt** - Search engine directives

### 📧 Communication
- **Contact Form** - Advanced form with validation
- **Newsletter** - Email subscription system
- **Social Integration** - GitHub, LinkedIn, Twitter

### 📊 Analytics
- **Event Tracking** - User interaction monitoring
- **Performance Metrics** - Core Web Vitals
- **Error Monitoring** - JavaScript error tracking
- **Conversion Tracking** - Form submissions

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (pages)/           # Route groups
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── animations/       # Animation components
│   ├── providers/        # Context providers
│   └── sections/         # Page sections
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── keystatic.ts      # CMS configuration
│   ├── analytics.ts      # Analytics setup
│   └── utils.ts          # Helper functions
└── types/                # TypeScript definitions

content/                  # Keystatic content
public/                   # Static assets
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/diegonr/diegonr-next.git
   cd diegonr-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create `.env.local`:
   ```env
   # Analytics (Optional)
   NEXT_PUBLIC_GA_MEASUREMENT_ID=GA_MEASUREMENT_ID
   NEXT_PUBLIC_GITHUB_TOKEN=GITHUB_TOKEN

   # EmailJS (Optional)
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=SERVICE_ID
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=TEMPLATE_ID
   NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID=CONTACT_TEMPLATE_ID
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=PUBLIC_KEY
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Content Management
npm run keystatic    # Start Keystatic CMS

# Deployment
npm run deploy       # Deploy to Vercel
```

## 🎨 Customization

### Content Management
Edit content through the Keystatic CMS:
```bash
npm run keystatic
```
Visit [http://localhost:3000/keystatic](http://localhost:3000/keystatic)

### Styling
- **Colors**: Modify `tailwind.config.js`
- **Fonts**: Update `src/app/layout.tsx`
- **Animations**: Adjust GSAP configurations

### Analytics
Configure tracking IDs in environment variables for:
- Google Analytics 4
- GitHub API integration
- EmailJS for forms

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm run start
```

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, SEO, Accessibility)
- **Core Web Vitals**: All metrics in green
- **Bundle Size**: Optimized with code splitting
- **Image Optimization**: Next.js automatic optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - The React framework for production
- **Vercel** - Deployment platform
- **Keystatic** - Headless CMS
- **GSAP** - Animation library
- **Tailwind CSS** - Utility-first CSS framework

## 📞 Contact

**Diego NR**
- Website: [diegonr.com](https://diegonr.com)
- LinkedIn: [linkedin.com/in/diegonr](https://linkedin.com/in/diegonr)
- GitHub: [github.com/diegonr](https://github.com/diegonr)
- Email: hola@diegonr.com

---

<div align="center">
  <p>Built with ❤️ using Next.js & TypeScript</p>
  <p>
    <a href="#diego-nr---portfolio">Back to top</a>
  </p>
</div>
