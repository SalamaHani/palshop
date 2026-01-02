import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSessionDB } from '@/lib/cereatAuthpass';
import { shopifyFetch } from '@/lib/shopify';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: orderId } = await params;
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

        // GraphQL query to fetch customer orders
        // Fetching the last 100 orders is the most reliable way to find a specific one
        // because the Storefront API 'query' parameter is limited to status filters.
        const query = `
            query getCustomerOrders($customerAccessToken: String!) {
                customer(customerAccessToken: $customerAccessToken) {
                    orders(first: 100, sortKey: PROCESSED_AT, reverse: true) {
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
                                lineItems(first: 100) {
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
                customerAccessToken: sessionDB.shopify_customer_token
            },
        });

        if (!data?.customer) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        const orders = data.customer.orders.edges.map((edge: any) => edge.node);

        // Find the specific order in the results with high resilience
        const order = orders.find((o: any) => {
            const normalizedParamId = decodeURIComponent(orderId).replace('#', '').toLowerCase();
            const normalizedOrderName = o.name.replace('#', '').toLowerCase();
            const gIDPart = o.id.split('/').pop();

            return (
                o.id === orderId ||                          // Exact GID match
                gIDPart === orderId ||                       // Numeric tail match
                o.name.toLowerCase() === orderId.toLowerCase() || // Display name match (e.g. #1001)
                normalizedOrderName === normalizedParamId || // Normalized name match (e.g. 1001)
                o.orderNumber?.toString() === normalizedParamId // Order number match
            );
        });

        if (!order) {
            console.warn(`[API] Order ${orderId} not found among ${orders.length} orders for customer.`);
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
