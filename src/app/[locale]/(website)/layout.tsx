import { LenisProvider } from "@/components/providers/LenisProvider";
import { CustomCursor } from "@/components/CustomCursor";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { TVStaticOverlay } from "@/components/TVStaticOverlay";
import { StructuredData, generatePersonStructuredData, generateWebSiteStructuredData, generateOrganizationStructuredData } from "@/components/StructuredData";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <Preloader />
      <TVStaticOverlay 
        config={{
          opacityDark: 0.05,
          opacityLight: 0.025,
          fps: 15,
          renderScale: 4,
          scanlines: true,
        }}
      />
      <div className="page-wrapper min-h-screen bg-swiss-black text-swiss-white">
        {/* CustomCursor inside page-wrapper to share stacking context */}
        <CustomCursor />
        <Navigation />
        <main className="relative min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
      <StructuredData data={generatePersonStructuredData()} />
      <StructuredData data={generateWebSiteStructuredData()} />
      <StructuredData data={generateOrganizationStructuredData()} />
    </LenisProvider>
  );
}
