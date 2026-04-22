import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";

/**
 * Generate static params for all supported locales.
 * This enables static generation at build time.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface RootPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RootPage({ params }: RootPageProps) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // This page should not be accessed directly
  // The middleware handles redirects to appropriate routes
  return null;
}
