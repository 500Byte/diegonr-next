import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import type { NextRequest } from "next/server";

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

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Apply intl middleware first
  const response = intlMiddleware(request);
  
  // Add no-cache headers in development to prevent aggressive caching
  if (process.env.NODE_ENV === 'development') {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  
  return response;
}

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
    "/((?!api|_next|_vercel|.*[.].*).*)",
  ],
};
