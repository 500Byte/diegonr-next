import { CustomCursor } from '@/components/CustomCursor';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { Preloader } from '@/components/Preloader';
import { LenisProvider } from '@/components/providers/LenisProvider';
import {
  StructuredData,
  generateOrganizationStructuredData,
  generatePersonStructuredData,
  generateWebSiteStructuredData,
} from '@/components/StructuredData';
import { TVStaticOverlay } from '@/components/TVStaticOverlay';
import { getSiteSettings } from '@/lib/sanity';
import { getTranslations } from 'next-intl/server';

export default async function WebsiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Common' });
  const siteSettings = await getSiteSettings();

  const socialLinks = siteSettings?.socialLinks;
  const email = siteSettings?.contact?.email;
  const copyright = siteSettings?.copyright;

  return (
    <LenisProvider>
      <Preloader />
      <TVStaticOverlay
        config={{
          opacityDark: 0.025,
          opacityLight: 0.025,
          fps: 15,
          renderScale: 4,
          scanlines: true,
        }}
      />
      <div className="page-wrapper min-h-screen bg-swiss-black text-swiss-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:outline-none focus:ring-2 focus:ring-white font-mono text-xs uppercase tracking-widest rounded-none border border-black"
        >
          {t('skip_link')}
        </a>
        {/* CustomCursor inside page-wrapper to share stacking context */}
        <CustomCursor />
        <Navigation socialLinks={socialLinks} email={email} />
        <main id="main-content" className="relative min-h-screen">
          {children}
        </main>
        <Footer siteSettings={siteSettings} />
      </div>
      <StructuredData data={generatePersonStructuredData(siteSettings ?? undefined)} />
      <StructuredData data={generateWebSiteStructuredData(siteSettings ?? undefined)} />
      <StructuredData data={generateOrganizationStructuredData(siteSettings ?? undefined)} />
    </LenisProvider>
  );
}
