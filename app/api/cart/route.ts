import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSessionDB } from '@/lib/cereatAuthpass';

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyFetch(query: string, variables: any = {}) {
    const response = await fetch(
        `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN!,
            },
            body: JSON.stringify({ query, variables }),
        }
    );

    const data = await response.json();

    if (data.errors) {
        console.error('Shopify GraphQL errors:', data.errors);
        throw new Error(data.errors[0]?.message || 'GraphQL error');
    }

    return data.data;
}

// Get cart - with customer association if logged in
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const cartId = searchParams.get('cartId');

        if (!cartId) {
            return NextResponse.json({ cart: null });
        }

        const query = `
            query getCart($cartId: ID!) {
                cart(id: $cartId) {
                    id
                    checkoutUrl
                    totalQuantity
                    lines(first: 100) {
                        edges {
                            node {
                                id
                                quantity
                                cost {
                                    totalAmount {
                                        amount
                                        currencyCode
                                    }
                                }
                                merchandise {
                                    ... on ProductVariant {
                                        id
                                        title
                                        selectedOptions {
                                            name
                                            value
                                        }
                                        price {
                                            amount
                                            currencyCode
                                        }
                                        product {
                                            id
                                            title
                                            handle
                                            images(first: 1) {
                                                edges {
                                                    node {
                                                        url
                                                        altText
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    cost {
                        subtotalAmount {
                            amount
                            currencyCode
                        }
                        totalAmount {
                            amount
                            currencyCode
                        }
                    }
                }
            }
        `;

        const data = await shopifyFetch(query, { cartId });

        return NextResponse.json({ cart: data.cart });
    } catch (error) {
        console.error('Get cart error:', error);
        return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }
}

// Create or update cart - associate with customer if logged in
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, cartId, variantId, quantity, lineId, lines } = body;

        // Try to get customer access token
        let buyerIdentity = {};
        try {
            const session = await getSession();
            if (session?.session_id) {
                const sessionDB = await getSessionDB(session.session_id);
                if (sessionDB?.shopify_customer_token) {
                    buyerIdentity = {
                        customerAccessToken: sessionDB.shopify_customer_token
                    };
                }
            }
        } catch (err) {
            // Not logged in, continue with anonymous cart
            console.log('No customer session, creating anonymous cart');
        }

        switch (action) {
            case 'create': {
                const query = `
                    mutation createCart($lineItems: [CartLineInput!]!, $buyerIdentity: CartBuyerIdentityInput) {
                        cartCreate(input: { lines: $lineItems, buyerIdentity: $buyerIdentity }) {
                            cart {
                                id
                                checkoutUrl
                                totalQuantity
                                lines(first: 100) {
                                    edges {
                                        node {
                                            id
                                            quantity
                                            merchandise {
                                                ... on ProductVariant {
                                                    id
                                                    title
                                                    price {
                                                        amount
                                                        currencyCode
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            userErrors {
                                field
                                message
                            }
                        }
                    }
                `;

                const data = await shopifyFetch(query, {
                    lineItems: [{ merchandiseId: variantId, quantity: quantity || 1 }],
                    buyerIdentity
                });

                if (data.cartCreate.userErrors.length > 0) {
                    return NextResponse.json(
                        { error: data.cartCreate.userErrors[0].message },
                        { status: 400 }
                    );
                }

                return NextResponse.json({ cart: data.cartCreate.cart });
            }

            case 'addItem': {
                const query = `
                    mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
                        cartLinesAdd(cartId: $cartId, lines: $lines) {
                            cart {
                                id
                                totalQuantity
                            }
                            userErrors {
                                field
                                message
                            }
                        }
                    }
                `;

                const data = await shopifyFetch(query, {
                    cartId,
                    lines: [{ merchandiseId: variantId, quantity: quantity || 1 }]
                });

                if (data.cartLinesAdd.userErrors.length > 0) {
                    return NextResponse.json(
                        { error: data.cartLinesAdd.userErrors[0].message },
                        { status: 400 }
                    );
                }

                return NextResponse.json({ success: true, cart: data.cartLinesAdd.cart });
            }

            case 'removeItem': {
                const query = `
                    mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
                        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
                            cart {
                                id
                                totalQuantity
                            }
                            userErrors {
                                field
                                message
                            }
                        }
                    }
                `;

                const data = await shopifyFetch(query, {
                    cartId,
                    lineIds: [lineId]
                });

                if (data.cartLinesRemove.userErrors.length > 0) {
                    return NextResponse.json(
                        { error: data.cartLinesRemove.userErrors[0].message },
                        { status: 400 }
                    );
                }

                return NextResponse.json({ success: true, cart: data.cartLinesRemove.cart });
            }

            case 'updateItem': {
                const query = `
                    mutation updateCartItems($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
                        cartLinesUpdate(cartId: $cartId, lines: $lines) {
                            cart {
                                id
                                totalQuantity
                            }
                            userErrors {
                                field
                                message
                            }
                        }
                    }
                `;

                const data = await shopifyFetch(query, {
                    cartId,
                    lines
                });

                if (data.cartLinesUpdate.userErrors.length > 0) {
                    return NextResponse.json(
                        { error: data.cartLinesUpdate.userErrors[0].message },
                        { status: 400 }
                    );
                }

                return NextResponse.json({ success: true, cart: data.cartLinesUpdate.cart });
            }

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Cart operation error:', error);
        return NextResponse.json(
            { error: 'Failed to process cart operation' },
            { status: 500 }
        );
    }
}
