import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../index.css";
import { ThemeProvider } from "next-themes";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { CustomCursor } from "@/components/CustomCursor";
import { Preloader } from "@/components/Preloader";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { StructuredData, generatePersonStructuredData, generateWebSiteStructuredData, generateOrganizationStructuredData } from "@/components/StructuredData";
import { AnalyticsProvider, WebVitals } from "@/lib/analytics";
import { PWAInstallButton, OfflineIndicator } from "@/hooks/usePWA";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Diego NR | Portafolio",
  description: "Desarrollador Full-Stack, IA & Diseño",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Diego NR" />
        <link rel="apple-touch-icon" href="/images/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-swiss-black text-swiss-white selection:bg-swiss-white selection:text-swiss-black overflow-x-hidden transition-colors duration-500`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LenisProvider>
            <Preloader />
            <div className="page-wrapper min-h-screen">
              <CustomCursor />
              <Navigation />
              <main className="relative min-h-screen">
                {children}
              </main>
              <Footer />
            </div>
          </LenisProvider>
        </ThemeProvider>
        <StructuredData data={generatePersonStructuredData()} />
        <StructuredData data={generateWebSiteStructuredData()} />
        <StructuredData data={generateOrganizationStructuredData()} />
        <AnalyticsProvider />
        <WebVitals />
        <PWAInstallButton />
        <OfflineIndicator />
      </body>
    </html>
  );
}
