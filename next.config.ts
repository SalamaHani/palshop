/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: '*.shopify.com',
      },
    ],
  },
  // Removed rewrites for checkout to prevent ERR_TOO_MANY_REDIRECTS.
  // We will redirect directly to the canonical Shopify checkout URL.
};

module.exports = nextConfig;