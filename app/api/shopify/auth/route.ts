import { NextRequest, NextResponse } from "next/server";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query, variables, endpointType } = body;

        const authHeader = request.headers.get("Authorization");

        // Determine endpoint based on type
        // Storefront API is standard YYYY-MM
        // Customer Account API uses a different path but can often be proxied similarly if authorized correctly
        let endpoint = `https://${domain}/api/2024-01/graphql.json`;

        if (endpointType === "customer-account") {
            // Note: Native Headless Customer Account API usually has a different endpoint scheme
            // but for this hybrid implementation, we proxy to the Storefront API
            // and use the provided customer access token if present.
            endpoint = `https://${domain}/api/2024-01/graphql.json`;
        }

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": storefrontAccessToken as string,
                ...(authHeader ? { "X-Shopify-Customer-Access-Token": authHeader.replace("Bearer ", "") } : {})
            },
            body: JSON.stringify({ query, variables }),
        });

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Shopify Proxy Error:", error);
        return NextResponse.json(
            { errors: [{ message: "Internal Server Error during Shopify Proxying" }] },
            { status: 500 }
        );
    }
}
