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
    let shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

    // If shopifyDomain is missing or is set to the custom domain, 
    // we should ideally use the .myshopify.com domain for rewrites to avoid loops.
    // For now, we'll just ensure it's defined.
    if (!shopifyDomain) return [];

    // Force .myshopify.com for rewrites if it looks like the custom domain
    if (shopifyDomain === 'palshop.app') {
      // We should advise the user to use the internal domain here
    }

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