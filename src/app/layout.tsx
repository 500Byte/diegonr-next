import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../index.css";
import { ThemeProvider } from "next-themes";

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
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Diego NR" />
        <link rel="apple-touch-icon" href="/images/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased selection:bg-swiss-white selection:text-swiss-black overflow-x-hidden transition-colors duration-500`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
