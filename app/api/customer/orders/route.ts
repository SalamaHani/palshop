import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSessionDB } from '@/lib/cereatAuthpass';

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

interface ShopifyOrder {
    id: string;
    name: string;
    createdAt: string;
    totalPrice: {
        amount: string;
        currencyCode: string;
    };
    fulfillmentStatus: string;
    financialStatus: string;
    lineItems: {
        edges: Array<{
            node: {
                title: string;
                quantity: number;
                variant: {
                    price: {
                        amount: string;
                        currencyCode: string;
                    };
                    image?: {
                        url: string;
                    };
                };
            };
        }>;
    };
}

export async function GET() {
    try {
        // Get current session
        const session = await getSession();

        if (!session?.session_id) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Get Shopify customer access token from MongoDB
        const sessionDB = await getSessionDB(session.session_id);

        if (!sessionDB?.shopify_customer_token) {
            return NextResponse.json({ error: 'No Shopify token found' }, { status: 401 });
        }

        // GraphQL query to fetch customer orders
        const query = `
            query getCustomerOrders($customerAccessToken: String!) {
                customer(customerAccessToken: $customerAccessToken) {
                    id
                    email
                    orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
                        edges {
                            node {
                                id
                                name
                                orderNumber
                                processedAt
                                financialStatus
                                fulfillmentStatus
                                totalPrice {
                                    amount
                                    currencyCode
                                }
                                lineItems(first: 10) {
                                    edges {
                                        node {
                                            title
                                            quantity
                                            variant {
                                                price {
                                                    amount
                                                    currencyCode
                                                }
                                                image {
                                                    url
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        // Make request to Shopify Storefront API
        const response = await fetch(
            `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
                },
                body: JSON.stringify({
                    query,
                    variables: {
                        customerAccessToken: sessionDB.shopify_customer_token,
                    },
                }),
            }
        );

        const data = await response.json();

        if (data.errors) {
            console.error('Shopify GraphQL errors:', data.errors);
            return NextResponse.json(
                { error: 'Failed to fetch orders', details: data.errors },
                { status: 500 }
            );
        }

        if (!data.data?.customer) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        // Extract orders
        const orders = data.data.customer.orders.edges.map((edge: any) => edge.node);

        return NextResponse.json({
            success: true,
            orders,
            count: orders.length,
        });

    } catch (error) {
        console.error('Orders fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
