import { LenisProvider } from "@/components/providers/LenisProvider";
import { CustomCursor } from "@/components/CustomCursor";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { StructuredData, generatePersonStructuredData, generateWebSiteStructuredData, generateOrganizationStructuredData } from "@/components/StructuredData";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <div className="page-wrapper min-h-screen bg-swiss-black text-swiss-white">
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
