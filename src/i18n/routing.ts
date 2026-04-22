import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale, localePrefix, pathnames } from "./config";

/**
 * Next-intl Routing Configuration
 * 
 * Creates type-safe navigation utilities for the application.
 * Exported Link, redirect, usePathname, useRouter work with locales.
 * 
 * @example
 * import { Link } from "@/i18n/routing";
 * 
 * <Link href="/about">About</Link> // Automatically adds /en prefix if needed
 * <Link href="/about" locale="en">About in English</Link> // Force locale
 * 
 * @see https://next-intl-docs.vercel.app/docs/routing/navigation
 */

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix,
  pathnames,
});

/**
 * Navigation utilities that are aware of locales.
 * Use these instead of next/navigation imports.
 */
export const {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing);
