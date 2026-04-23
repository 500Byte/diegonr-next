import { LenisProvider } from "@/components/providers/LenisProvider";
import { PageTransitionProvider } from "@/components/providers/PageTransitionProvider";
import { CustomCursor } from "@/components/CustomCursor";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { StructuredData, generatePersonStructuredData, generateWebSiteStructuredData, generateOrganizationStructuredData } from "@/components/StructuredData";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <PageTransitionProvider>
        <Preloader />
        {/* Static elements outside transition container */}
        <div className="page-wrapper min-h-screen bg-swiss-black text-swiss-white">
          <CustomCursor />
          <Navigation />
          
          {/* Transition container - this gets cloned during transitions */}
          <main data-transition-container className="relative min-h-screen">
            {children}
          </main>
          
          <Footer />
        </div>
        <StructuredData data={generatePersonStructuredData()} />
        <StructuredData data={generateWebSiteStructuredData()} />
        <StructuredData data={generateOrganizationStructuredData()} />
      </PageTransitionProvider>
    </LenisProvider>
  );
}
