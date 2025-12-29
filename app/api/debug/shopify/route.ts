import { NextResponse } from 'next/server';

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function GET() {
  // Check env vars
  const checks = {
    SHOPIFY_STORE_DOMAIN: !!domain,
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: !!storefrontAccessToken,
    domain_value: domain ? `${domain.substring(0, 10)}...` : 'NOT SET',
    token_value: storefrontAccessToken ? `${storefrontAccessToken.substring(0, 10)}...` : 'NOT SET',
  };

  if (!domain || !storefrontAccessToken) {
    return NextResponse.json({
      success: false,
      error: 'Missing Shopify credentials',
      checks,
    });
  }

  // Test Shopify connection with a simple query
  try {
    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({
        query: `
          query {
            shop {
              name
              primaryDomain {
                url
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json({
        success: false,
        error: 'Shopify API error',
        details: data.errors,
        checks,
      });
    }

    return NextResponse.json({
      success: true,
      shop: data.data.shop,
      checks,
      message: 'Shopify connection working!',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to connect to Shopify',
      details: error instanceof Error ? error.message : 'Unknown error',
      checks,
    });
  }
}
