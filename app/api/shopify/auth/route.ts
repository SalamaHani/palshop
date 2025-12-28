import { NextRequest, NextResponse } from 'next/server';

/**
 * Shopify GraphQL Proxy API Route
 * 
 * This route handles GraphQL requests to both:
 * - Shopify Storefront API
 * - Shopify Customer Account API
 * 
 * It automatically detects which API to use based on the query or endpointType.
 */

interface ShopifyProxyRequestBody {
    query: string;
    variables?: Record<string, any>;
    endpointType?: 'storefront' | 'customer-account';
}

interface ShopifyErrorResponse {
    errors: Array<{
        message: string;
        details?: string;
    }>;
}

/**
 * Clean domain utility to ensure we have the correct shop prefix
 */
function cleanDomain(domain: string): string {
    if (!domain) return '';
    return domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/**
 * GET handler - Returns API status and configuration info
 */
export async function GET(req: NextRequest) {
    return NextResponse.json({
        status: 'operational',
        version: '1.0.0',
        endpoints: {
            storefront: 'Shopify Storefront API',
            customerAccount: 'Shopify Customer Account API'
        },
        message: 'Send POST requests with GraphQL queries to use this API proxy'
    });
}

/**
 * POST handler - Proxies GraphQL requests to Shopify
 */
export async function POST(req: NextRequest) {
    try {
        const body: ShopifyProxyRequestBody = await req.json();
        const { query, variables = {}, endpointType } = body;

        // Validate request body
        if (!query) {
            return NextResponse.json(
                { errors: [{ message: 'GraphQL query is required' }] } as ShopifyErrorResponse,
                { status: 400 }
            );
        }

        // --- Configuration (Prioritize Server-side environment variables) ---
        const RAW_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN ||
            process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
            'palshop.app';
        let SHOPIFY_DOMAIN = cleanDomain(RAW_DOMAIN);

        // CRITICAL: Prevent self-referential loops
        if (SHOPIFY_DOMAIN === 'palshop.app' ||
            SHOPIFY_DOMAIN === 'www.palshop.app' ||
            !SHOPIFY_DOMAIN) {
            SHOPIFY_DOMAIN = 'palshop.app';
        }

        const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID ||
            process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID ||
            process.env.CUSTOMER_API_CLIENT_ID ||
            '6db50d1a-0c00-4921-8057-35d9b4963233';

        const SHOP_ID = process.env.SHOPIFY_SHOP_ID ||
            process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID ||
            process.env.SHOP_ID ||
            '97977303354';

        const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
            process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
            '08f8598a76c5b5e5eeaf77543d5b2d2d';

        const API_VERSION = process.env.SHOPIFY_API_VERSION ||
            process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION ||
            '2024-10';

        // --- Auto-detection of API Type ---
        const isCustomerAccount = endpointType === 'customer-account' || (query && (
            query.includes('customerSendLoginCode') ||
            query.includes('customerAccessTokenCreateWithCode') ||
            query.includes('customerVerifyCode') ||
            query.includes('customerUpdate') ||
            query.includes('customer {') ||
            query.includes('metafield') ||
            query.includes('customerMetafieldsSet')
        ));

        // --- Build endpoint and headers ---
        let endpoint = '';
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        // Forward Authorization header if present (crucial for authenticated requests)
        const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        if (isCustomerAccount) {
            // Shopify Customer Account API
            endpoint = `https://shopify.com/${SHOP_ID}/account/customer/api/${API_VERSION}/graphql`;
            headers['X-Shopify-Customer-Account-Client-Id'] = CLIENT_ID;

            console.log(`[Shopify Proxy] 🔐 Customer Account API`);
        } else {
            // Standard Storefront API
            endpoint = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;
            headers['X-Shopify-Storefront-Access-Token'] = STOREFRONT_ACCESS_TOKEN;

            console.log(`[Shopify Proxy] 🛒 Storefront API`);
        }

        console.log(`[Shopify Proxy] Endpoint: ${endpoint}`);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({ query, variables }),
            });

            const text = await response.text();
            let data: any;

            // Parse response
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error(`[Shopify Proxy] ❌ Non-JSON Response (${response.status}):`, text.slice(0, 500));
                return NextResponse.json(
                    {
                        errors: [{
                            message: `Shopify API returned ${response.status} with non-JSON content. This usually happens when the Shop ID or Domain is incorrect.`,
                            details: text.slice(0, 200)
                        }]
                    } as ShopifyErrorResponse,
                    { status: response.status }
                );
            }

            // Handle HTTP errors
            if (!response.ok) {
                console.error(`[Shopify Proxy] ❌ HTTP Error ${response.status}:`, JSON.stringify(data));
                return NextResponse.json(data, { status: response.status });
            }

            // Professional Logging for GraphQL errors
            if (data.errors) {
                const message = data.errors[0]?.message;
                console.error(`[Shopify Proxy] ⚠️ GraphQL Error: ${message}`);

                if (message?.includes('Not Found') || message?.includes('Unauthorized')) {
                    console.error('[Shopify Proxy] 🔧 AUTH CONFIG ERROR - Please verify Client ID and Shop ID in your Shopify Admin > Customer Accounts settings.');
                }
            } else {
                console.log(`[Shopify Proxy] ✅ Success`);
            }

            return NextResponse.json(data);

        } catch (fetchError) {
            console.error('[Shopify Proxy] ❌ Fetch Connection Error:', fetchError);

            // Development fallback (ONLY for local testing)
            const isDev = process.env.NODE_ENV === 'development';
            if (isCustomerAccount && isDev) {
                console.warn('[Shopify Proxy] 🧪 Using simulated response for development');
                return NextResponse.json({
                    data: {
                        customerSendLoginCode: { customerUserErrors: [] },
                        customerVerifyCode: {
                            customerAccessToken: {
                                accessToken: `shcat_simulated_token_${Math.random().toString(36).slice(2)}`,
                                expiresAt: new Date(Date.now() + 86400000).toISOString()
                            },
                            customerUserErrors: []
                        }
                    }
                });
            }

            return NextResponse.json(
                {
                    errors: [{
                        message: 'Failed to connect to Shopify API. Please check your network and Shopify credentials.',
                        details: fetchError instanceof Error ? fetchError.message : 'Unknown error'
                    }]
                } as ShopifyErrorResponse,
                { status: 502 }
            );
        }

    } catch (error) {
        console.error('[Shopify Proxy] 💥 Fatal Error:', error);
        return NextResponse.json(
            {
                errors: [{
                    message: 'Internal Server Error',
                    details: error instanceof Error ? error.message : 'Unknown error'
                }]
            } as ShopifyErrorResponse,
            { status: 500 }
        );
    }
}
