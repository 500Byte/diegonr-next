import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Next-intl Middleware
 * 
 * Handles:
 * - Locale detection from Accept-Language header
 * - Cookie-based locale persistence
 * - URL prefixing (/en) for non-default locales
 * - Redirects for missing or invalid locales
 * 
 * IMPORTANT: This middleware runs on Edge Runtime.
 * Must be compatible with Cloudflare Workers/OpenNext.
 * 
 * @see https://next-intl-docs.vercel.app/docs/routing/middleware
 * @see https://developers.cloudflare.com/workers/runtime-apis/
 */

export default createMiddleware(routing);

/**
 * Middleware matcher configuration.
 * 
 * Excludes:
 * - API routes (/api/*)
 * - Static files (/images/*, /fonts/*, etc.)
 * - Next.js internals (_next/*, favicon.ico, etc.)
 * 
 * Includes:
 * - All page routes (/, /about, /en/about, etc.)
 */
export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",
    // Enable redirects that add missing locales
    // (e.g., /about → /en/about or /es/nosotros)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
