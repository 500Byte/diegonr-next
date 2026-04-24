import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import type { NextRequest } from "next/server";

/**
 * Next-intl Proxy (formerly Middleware)
 * 
 * Handles:
 * - Locale detection from Accept-Language header
 * - Cookie-based locale persistence
 * - URL prefixing (/en) for non-default locales
 * - Redirects for missing or invalid locales
 * 
 * IMPORTANT: This proxy runs on Node.js Runtime via OpenNext/Cloudflare Workers.
 * 
 * @see https://next-intl-docs.vercel.app/docs/routing/middleware
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
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
 * Proxy matcher configuration.
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