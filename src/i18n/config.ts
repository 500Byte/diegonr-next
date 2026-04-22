/**
 * i18n Configuration
 * 
 * Defines supported locales and default locale for the application.
 * Uses next-intl with App Router + subpath routing (/en).
 * 
 * @see https://next-intl-docs.vercel.app/docs/routing/middleware
 */

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

/**
 * Locale prefix configuration:
 * - 'always': /es/about, /en/about (explicit for all)
 * - 'as-needed': /about (default), /en/about (non-default)
 * - 'never': no prefix (use domain or cookie)
 * 
 * Using 'as-needed' for cleaner URLs in Spanish (default).
 */
export const localePrefix = "as-needed" as const;

/**
 * Pathnames configuration for localized routes.
 * Allows different slugs per locale (e.g., /es/nosotros vs /en/about).
 */
export const pathnames = {
  "/": "/",
  "/about": {
    es: "/sobre-mi",
    en: "/about",
  },
  "/contact": {
    es: "/contacto",
    en: "/contact",
  },
  "/projects": {
    es: "/proyectos",
    en: "/projects",
  },
  "/services": {
    es: "/servicios",
    en: "/services",
  },
  "/blog": {
    es: "/blog",
    en: "/blog",
  },
} as const;
