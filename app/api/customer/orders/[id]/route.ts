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
        // We decode Base64 IDs which are common in Storefront API
        let order = orders.find((o: any) => {
            const rawId = o.id; // Usually Base64
            let decodedId = rawId;

            // Attempt to decode Base64
            if (!rawId.startsWith('gid://')) {
                try {
                    const decoded = Buffer.from(rawId, 'base64').toString('utf-8');
                    if (decoded.startsWith('gid://')) {
                        decodedId = decoded;
                    }
                } catch (e) {
                    // Not base64 or failed, continue with rawId
                }
            }

            const numericId = decodedId.split('/').pop();
            const paramId = decodeURIComponent(orderId).trim();
            const normalizedParamId = paramId.replace('#', '').toLowerCase();
            const normalizedOrderName = (o.name || '').replace('#', '').toLowerCase();

            return (
                rawId === paramId ||                         // Match raw GID (Base64)
                decodedId === paramId ||                     // Match decoded GID (gid://...)
                numericId === paramId ||                     // Match numeric tail (e.g. 63001002)
                (o.name && o.name.toLowerCase() === paramId.toLowerCase()) || // Match name (#63001002PAL)
                normalizedOrderName === normalizedParamId || // Match normalized name (63001002pal)
                o.orderNumber?.toString() === paramId ||     // Match numeric order number
                o.orderNumber?.toString() === normalizedParamId
            );
        });

        // ===========================================
        // ULTIMATE FALLBACK: Admin API Search
        // ===========================================
        // If storefront API fails (often due to sync delay or list limits), 
        // we use the Admin API as a fallback, verifying the customer email.
        if (!order) {
            try {
                const { shopifyAdminFetch } = require('@/lib/shopify');
                const adminQuery = `
                    query findOrder($query: String!) {
                        orders(first: 1, query: $query) {
                            edges {
                                node {
                                    id
                                    name
                                    orderNumber
                                    processedAt
                                    financialStatus
                                    fulfillmentStatus
                                    customer {
                                        email
                                    }
                                    totalPriceSet {
                                        presentmentMoney {
                                            amount
                                            currencyCode
                                        }
                                    }
                                    subtotalPriceSet {
                                        presentmentMoney {
                                            amount
                                            currencyCode
                                        }
                                    }
                                    totalTaxSet {
                                        presentmentMoney {
                                            amount
                                            currencyCode
                                        }
                                    }
                                    totalShippingPriceSet {
                                        presentmentMoney {
                                            amount
                                            currencyCode
                                        }
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
                                                    price
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
                `;

                const adminData = await shopifyAdminFetch(adminQuery, {
                    query: `name:${orderId} OR id:${orderId}`
                });

                const adminOrder = adminData?.orders?.edges?.[0]?.node;

                // CRITICAL SECURITY: Verify this order actually belongs to the logged-in customer
                if (adminOrder && adminOrder.customer?.email?.toLowerCase() === session.email?.toLowerCase()) {
                    // Map Admin API experimental structure back to Storefront structure for the UI
                    order = {
                        ...adminOrder,
                        totalPrice: adminOrder.totalPriceSet.presentmentMoney,
                        subtotalPrice: adminOrder.subtotalPriceSet.presentmentMoney,
                        totalTax: adminOrder.totalTaxSet.presentmentMoney,
                        totalShippingPrice: adminOrder.totalShippingPriceSet.presentmentMoney,
                        lineItems: {
                            edges: adminOrder.lineItems.edges.map((edge: any) => ({
                                node: {
                                    ...edge.node,
                                    variant: {
                                        ...edge.node.variant,
                                        price: {
                                            amount: edge.node.variant.price,
                                            currencyCode: adminOrder.totalPriceSet.presentmentMoney.currencyCode
                                        }
                                    }
                                }
                            }))
                        }
                    };
                }
            } catch (adminError) {
                console.error('Admin API fallback error:', adminError);
            }
        }

        if (!order) {
            console.warn(`[API] Order "${orderId}" totally not found for customer ${session.email}`);
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
