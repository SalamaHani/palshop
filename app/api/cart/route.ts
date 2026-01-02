import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSessionDB } from '@/lib/cereatAuthpass';
import { shopifyFetch } from '@/lib/shopify';

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

        const data = await shopifyFetch<any>({ query, variables: { cartId } });

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
        let buyerIdentity: any = undefined;
        try {
            const session = await getSession();
            if (session?.session_id) {
                const sessionDB = await getSessionDB(session.session_id);
                if (sessionDB?.shopify_customer_token) {
                    buyerIdentity = {
                        customerAccessToken: sessionDB.shopify_customer_token,
                        email: session.email
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

                const data = await shopifyFetch<any>({
                    query,
                    variables: {
                        lineItems: [{ merchandiseId: variantId, quantity: quantity || 1 }],
                        buyerIdentity
                    }
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

                const data = await shopifyFetch<any>({
                    query,
                    variables: {
                        cartId,
                        lines: [{ merchandiseId: variantId, quantity: quantity || 1 }]
                    }
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

                const data = await shopifyFetch<any>({
                    query,
                    variables: {
                        cartId,
                        lineIds: [lineId]
                    }
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

                const data = await shopifyFetch<any>({
                    query,
                    variables: {
                        cartId,
                        lines
                    }
                });

                if (data.cartLinesUpdate.userErrors.length > 0) {
                    return NextResponse.json(
                        { error: data.cartLinesUpdate.userErrors[0].message },
                        { status: 400 }
                    );
                }

                return NextResponse.json({ success: true, cart: data.cartLinesUpdate.cart });
            }

            case 'updateBuyerIdentity': {
                if (!cartId) {
                    return NextResponse.json({ error: 'Cart ID is required' }, { status: 400 });
                }

                // If no buyer identity can be found, just return the current cart info
                if (!buyerIdentity) {
                    const query = `
                        query getCart($cartId: ID!) {
                            cart(id: $cartId) {
                                id
                                checkoutUrl
                            }
                        }
                    `;
                    const data = await shopifyFetch<any>({ query, variables: { cartId } });
                    return NextResponse.json({ success: true, cart: data.cart });
                }

                const query = `
                    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
                        cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
                            cart {
                                id
                                checkoutUrl
                            }
                            userErrors {
                                field
                                message
                            }
                        }
                    }
                `;

                const data = await shopifyFetch<any>({
                    query,
                    variables: {
                        cartId,
                        buyerIdentity
                    }
                });

                if (data.cartBuyerIdentityUpdate.userErrors.length > 0) {
                    return NextResponse.json(
                        { error: data.cartBuyerIdentityUpdate.userErrors[0].message },
                        { status: 400 }
                    );
                }

                return NextResponse.json({ success: true, cart: data.cartBuyerIdentityUpdate.cart });
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
