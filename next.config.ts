/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
  async rewrites() {
    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    if (!shopifyDomain) return [];

    return [
      {
        source: '/cart/c/:path*',
        destination: `https://${shopifyDomain}/cart/c/:path*`,
      },
      {
        source: '/checkouts/:path*',
        destination: `https://${shopifyDomain}/checkouts/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;