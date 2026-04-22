import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, defaultLocale, type Locale } from "./config";

/**
 * Next-intl Request Config
 * 
 * This file configures how next-intl loads translations.
 * It's automatically picked up by next-intl's server-side utilities.
 * 
 * @see https://next-intl-docs.vercel.app/docs/getting-started/app-router
 */

export default getRequestConfig(async ({ requestLocale }) => {
  // Get locale from request or use default
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  // Load messages for the requested locale
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
