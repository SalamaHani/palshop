import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSessionDB } from '@/lib/cereatAuthpass';
import { shopifyFetch } from '@/lib/shopify';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const orderId = params.id;
        const fullOrderId = `gid://shopify/Order/${orderId}`;

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

        // GraphQL query to fetch a specific order
        // In Storefront API, we can use the node query if we have the GID
        // But we must ensure it belongs to the customer. 
        // Another way is to fetch customer and filter orders, but node is more efficient.
        const query = `
            query getOrder($id: ID!, $customerAccessToken: String!) {
                customer(customerAccessToken: $customerAccessToken) {
                    orders(first: 1, query: $id) {
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
                                subtotalPrice {
                                    amount
                                    currencyCode
                                }
                                totalTax {
                                    amount
                                    currencyCode
                                }
                                totalShippingPrice {
                                    amount
                                    currencyCode
                                }
                                shippingAddress {
                                    firstName
                                    lastName
                                    address1
                                    address2
                                    city
                                    province
                                    zip
                                    country
                                    phone
                                }
                                lineItems(first: 50) {
                                    edges {
                                        node {
                                            title
                                            quantity
                                            variant {
                                                title
                                                price {
                                                    amount
                                                    currencyCode
                                                }
                                                image {
                                                    url
                                                    altText
                                                }
                                                product {
                                                    handle
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

        // Make request using standard shopifyFetch
        const data = await shopifyFetch<any>({
            query,
            variables: {
                customerAccessToken: sessionDB.shopify_customer_token,
                id: `id:${orderId}` // Search by order number or ID part
            },
        });

        // The query filter in Storefront API for orders is limited.
        // Let's try matching the full ID in the returned list.
        // Or better, fetch the last N orders and find the one.
        // Given Storefront API limitations, the most reliable way is often to fetch recent orders.

        const orders = data?.customer?.orders?.edges?.map((edge: any) => edge.node) || [];
        const order = orders.find((o: any) => o.id.endsWith(orderId));

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            order
        });

    } catch (error) {
        console.error('Order fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch order details' },
            { status: 500 }
        );
    }
}
