import { LenisProvider } from "@/components/providers/LenisProvider";
import { BarbaProvider } from "@/components/providers/BarbaProvider";
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
      <BarbaProvider>
        <Preloader />
        {/* Barba wrapper - everything inside wrapper but outside container persists */}
        <div data-barba="wrapper" className="page-wrapper min-h-screen bg-swiss-black text-swiss-white">
          {/* Static elements outside container */}
          <CustomCursor />
          <Navigation />
          
          {/* Barba container - this content changes on navigation */}
          <main data-barba="container" data-barba-namespace="default" className="relative min-h-screen">
            {children}
          </main>
          
          <Footer />
        </div>
        <StructuredData data={generatePersonStructuredData()} />
        <StructuredData data={generateWebSiteStructuredData()} />
        <StructuredData data={generateOrganizationStructuredData()} />
      </BarbaProvider>
    </LenisProvider>
  );
}
