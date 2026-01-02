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

        // GraphQL query to fetch a specific order using the 'query' parameter
        // This is the most robust way to find an order by name, number, or ID
        const query = `
            query getSpecificOrder($customerAccessToken: String!, $orderQuery: String!) {
                customer(customerAccessToken: $customerAccessToken) {
                    orders(first: 5, query: $orderQuery) {
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

        // Support various search formats: name, id, or number
        const orderQuery = orderId.startsWith('#') ? `name:'${orderId}'` : `name:'#${orderId}' OR name:'${orderId}' OR id:${orderId}`;

        // Make request using standard shopifyFetch
        const data = await shopifyFetch<any>({
            query,
            variables: {
                customerAccessToken: sessionDB.shopify_customer_token,
                orderQuery: orderQuery
            },
        });

        if (!data?.customer) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        const orders = data.customer.orders.edges.map((edge: any) => edge.node);

        // Find the specific order in the results
        const order = orders.find((o: any) => {
            const normalizedParamId = orderId.replace('#', '').toLowerCase();
            const normalizedOrderName = o.name.replace('#', '').toLowerCase();

            return (
                o.id === orderId ||
                o.id.split('/').pop() === orderId ||
                o.name.toLowerCase() === orderId.toLowerCase() ||
                normalizedOrderName === normalizedParamId
            );
        });

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
