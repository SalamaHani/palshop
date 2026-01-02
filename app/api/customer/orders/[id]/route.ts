import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSessionDB } from '@/lib/cereatAuthpass';
import { shopifyFetch } from '@/lib/shopify';
import { orderDetailQuery } from '@/graphql/orders';

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

        // Make request using standard shopifyFetch
        const data = await shopifyFetch<any>({
            query: orderDetailQuery,
            variables: {
                id: fullOrderId,
                customerAccessToken: sessionDB.shopify_customer_token
            },
        });

        if (!data?.order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const orders = data.order;

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

        if (!order) {
            console.warn(`[API] Order "${orderId}" not found among ${orders.length} customer orders.`);
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
