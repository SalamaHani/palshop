import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('customer_access_token')?.value;

        if (!accessToken) {
            return NextResponse.json(
                { error: 'Not authenticated', authenticated: false },
                { status: 401 }
            );
        }

        // Fetch customer data from Shopify
        const shopId = process.env.SHOP_ID || process.env.SHOPIFY_SHOP_ID || '97977303354';
        const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-10';

        const response = await fetch(
            `https://shopify.com/${shopId}/account/customer/api/${apiVersion}/graphql`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    query: `
                        query {
                            customer {
                                id
                                email
                                firstName
                                lastName
                                phone
                            }
                        }
                    `
                })
            }
        );

        if (!response.ok) {
            // Token might be expired
            return NextResponse.json(
                { error: 'Failed to fetch customer data', authenticated: false },
                { status: response.status }
            );
        }

        const data = await response.json();

        if (data.errors) {
            return NextResponse.json(
                { error: data.errors[0]?.message || 'GraphQL error', authenticated: false },
                { status: 400 }
            );
        }

        return NextResponse.json({
            customer: data.data.customer,
            authenticated: true
        });
    } catch (error) {
        console.error('Get customer error:', error);
        return NextResponse.json(
            { error: 'Internal server error', authenticated: false },
            { status: 500 }
        );
    }
}
