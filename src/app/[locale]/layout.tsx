import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { locales, type Locale } from "@/i18n/config";

/**
 * Locale Layout
 *
 * This layout handles locale-specific configuration:
 * - Validates the locale parameter
 * - Loads translation messages for the locale
 * - Provides NextIntlClientProvider to children
 * - Sets the request locale for server components
 *
 * @see https://next-intl-docs.vercel.app/docs/getting-started/app-router
 */

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering for the locale
  setRequestLocale(locale);

  // Load messages for the locale directly
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
