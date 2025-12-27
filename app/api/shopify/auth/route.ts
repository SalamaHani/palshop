import { NextRequest, NextResponse } from 'next/server';

/**
 * Clean domain utility to ensure we have the correct shop prefix
 */
function cleanDomain(domain: string) {
    if (!domain) return '';
    return domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { query, variables, endpointType } = body;

        // --- Configuration ---
        // For REAL codes, these MUST be set correctly in Shopify Admin > Customer Accounts
        const RAW_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'palshop-9445.myshopify.com';
        const SHOPIFY_DOMAIN = cleanDomain(RAW_DOMAIN);
        const CLIENT_ID = process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID || '6db50d1a-0c00-4921-8057-35d9b4963233';
        const STOREFRONT_ACCESS_TOKEN = '08f8598a76c5b5e5eeaf77543d5b2d2d';

        // --- Detection of API Type ---
        // Use explicit endpointType if provided, otherwise auto-detect
        const isCustomerAccount = endpointType === 'customer-account' || (query && (
            query.includes('customerSendLoginCode') ||
            query.includes('customerAccessTokenCreateWithCode') ||
            query.includes('customerVerifyCode') ||
            query.includes('customerUpdate') ||
            query.includes('metafield') ||
            query.includes('customerMetafieldsSet')
        ));

        let endpoint = '';
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        if (isCustomerAccount) {
            // Shopify Customer Account API (unstable/2024-04)
            // This is what sends the REAL verification codes.
            endpoint = `https://shopify.com/${CLIENT_ID}/account/customer/api/unstable/graphql`;
            headers['X-Shopify-Customer-Account-Client-Id'] = CLIENT_ID;
        } else {
            // Standard Storefront API (for products/cart)
            endpoint = `https://${SHOPIFY_DOMAIN}/api/2024-07/graphql.json`;
            headers['X-Shopify-Storefront-Access-Token'] = STOREFRONT_ACCESS_TOKEN;
        }

        console.log(`[Shopify Proxy] Routing to ${isCustomerAccount ? 'Customer Account' : 'Storefront'} API`);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({ query, variables }),
            });

            const data = await response.json();

            // Handle potential Shopify API initialization errors
            if (data.errors) {
                const message = data.errors[0]?.message;

                // If the error suggests the Client ID is wrong or endpoint is invalid
                if (message?.includes('Not Found') || message?.includes('Unauthorized')) {
                    console.error('[Shopify Proxy] AUTH ERROR - Please check NEXT_PUBLIC_SHOPIFY_CLIENT_ID and Shopify Admin settings.');
                }
            }

            return NextResponse.json(data);
        } catch (fetchError) {
            console.error('[Shopify Proxy] Fetch Error:', fetchError);

            // IF the real connection fails (e.g. offline or bad domain), we can FALLBACK to simulation
            // ONLY if the user is in a development environment or if specifically requested.
            const isDev = process.env.NODE_ENV === 'development';

            if (isCustomerAccount && isDev) {
                console.warn('[Shopify Proxy] Real Shopify request failed. Falling back to Simulation Mode for UI continuity.');
                return NextResponse.json({
                    data: {
                        customerSendLoginCode: { customerUserErrors: [] },
                        customerVerifyCode: {
                            customerAccessToken: {
                                accessToken: "shcat_simulated_" + Math.random().toString(36).slice(2),
                                expiresAt: new Date(Date.now() + 86400000).toISOString()
                            },
                            customerUserErrors: []
                        }
                    }
                });
            }

            return NextResponse.json(
                { errors: [{ message: 'Failed to connect to Shopify. Please check your network and configuration.' }] },
                { status: 502 }
            );
        }
    } catch (error) {
        console.error('Shopify API Proxy Fatal Error:', error);
        return NextResponse.json({ errors: [{ message: 'Internal Server Error' }] }, { status: 500 });
    }
}
