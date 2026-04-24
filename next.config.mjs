import createNextIntlPlugin from "next-intl/plugin";

// Initialize Cloudflare dev environment ONLY if explicitly enabled
// Disabled by default to prevent aggressive caching in local development
if (process.env.NODE_ENV === 'development' && process.env.ENABLE_CLOUDFLARE_DEV === 'true') {
  import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev()).catch(() => {
    // Silently fail if Cloudflare is not configured
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Disable static page generation cache in development
  // Note: Next.js 16+ uses dynamic rendering by default
  // Cache-Control headers in headers() function handle dev caching
  
  // Add headers to disable caching in development
  async headers() {
    const headers = [];
    
    if (process.env.NODE_ENV === 'development') {
      headers.push(
        {
          source: '/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            },
            {
              key: 'Pragma',
              value: 'no-cache',
            },
            {
              key: 'Expires',
              value: '0',
            },
            {
              key: 'Surrogate-Control',
              value: 'no-store',
            },
          ],
        },
        {
          // Also disable cache for static assets in development
          source: '/_next/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate, max-age=0',
            },
          ],
        }
      );
    }
    
    return headers;
  },
  
  // Disable powered by header
  poweredByHeader: false,
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
