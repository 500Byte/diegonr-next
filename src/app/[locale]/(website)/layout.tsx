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

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        {/* CustomCursor inside page-wrapper to share stacking context */}
        <CustomCursor />
        <Navigation socialLinks={socialLinks} email={email} />
        <main className="relative min-h-screen">{children}</main>
        <Footer socialLinks={socialLinks} email={email} copyright={copyright} />
      </div>
      <StructuredData data={generatePersonStructuredData(siteSettings ?? undefined)} />
      <StructuredData data={generateWebSiteStructuredData(siteSettings ?? undefined)} />
      <StructuredData data={generateOrganizationStructuredData(siteSettings ?? undefined)} />
    </LenisProvider>
  );
}
