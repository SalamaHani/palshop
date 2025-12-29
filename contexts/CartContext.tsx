'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchGraphQL } from '@/shopify/client';
import {
    CREATE_CART,
    ADD_TO_CART,
    UPDATE_CART_LINES,
    REMOVE_FROM_CART,
    GET_CART,
    APPLY_DISCOUNT,
    UPDATE_BUYER_IDENTITY,
} from '@/graphql/cart';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthProvider';

// Types
export interface CartLine {
    id: string;
    quantity: number;
    merchandise: {
        id: string;
        title: string;
        priceV2: {
            amount: string;
            currencyCode: string;
        };
        image?: {
            url: string;
            altText?: string;
        };
        product: {
            id: string;
            title: string;
            handle: string;
            vendor?: string;
        };
        selectedOptions: Array<{
            name: string;
            value: string;
        }>;
    };
    cost: {
        totalAmount: {
            amount: string;
            currencyCode: string;
        };
        subtotalAmount: {
            amount: string;
            currencyCode: string;
        };
    };
}

export interface Cart {
    id: string;
    checkoutUrl: string;
    totalQuantity: number;
    lines: {
        edges: Array<{
            node: CartLine;
        }>;
    };
    cost: {
        totalAmount: {
            amount: string;
            currencyCode: string;
        };
        subtotalAmount: {
            amount: string;
            currencyCode: string;
        };
        totalTaxAmount?: {
            amount: string;
            currencyCode: string;
        };
    };
    discountCodes?: Array<{
        code: string;
        applicable: boolean;
    }>;
}

interface CartContextType {
    cart: Cart | null;
    isLoading: boolean;
    isUpdating: boolean;
    addToCart: (variantId: string, quantity?: number) => Promise<void>;
    updateQuantity: (lineId: string, quantity: number) => Promise<void>;
    removeFromCart: (lineId: string) => Promise<void>;
    applyDiscount: (code: string) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
    checkout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = 'palshop_cart_id';

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const { user } = useAuth();

    // Load cart from localStorage or create new one
    const initializeCart = useCallback(async () => {
        try {
            const savedCartId = localStorage.getItem(CART_ID_KEY);

            if (savedCartId) {
                // Try to fetch existing cart
                const data = await fetchGraphQL(GET_CART, { id: savedCartId });

                if (data?.cart) {
                    setCart(data.cart);

                    // Update buyer identity if user is logged in
                    if (user?.email) {
                        await updateBuyerIdentity(data.cart.id, user.email);
                    }
                } else {
                    // Cart not found, create new one
                    await createNewCart();
                }
            } else {
                // No saved cart, create new one
                await createNewCart();
            }
        } catch (error) {
            console.error('[Cart] Initialize Error:', error);
            await createNewCart();
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Create a new cart
    const createNewCart = async () => {
        try {
            const data = await fetchGraphQL(CREATE_CART, {
                input: {
                    lines: [],
                    ...(user?.email && {
                        buyerIdentity: {
                            email: user.email,
                        },
                    }),
                },
            });

            if (data?.cartCreate?.cart) {
                setCart(data.cartCreate.cart);
                localStorage.setItem(CART_ID_KEY, data.cartCreate.cart.id);
            }
        } catch (error) {
            console.error('[Cart] Create Error:', error);
            toast.error('Failed to create cart');
        }
    };

    // Update buyer identity when user logs in
    const updateBuyerIdentity = async (cartId: string, email: string) => {
        try {
            const data = await fetchGraphQL(UPDATE_BUYER_IDENTITY, {
                cartId,
                buyerIdentity: {
                    email,
                },
            });

            if (data?.cartBuyerIdentityUpdate?.cart) {
                setCart(data.cartBuyerIdentityUpdate.cart);
            }
        } catch (error) {
            console.error('[Cart] Update Buyer Identity Error:', error);
        }
    };

    // Initialize cart on mount
    useEffect(() => {
        initializeCart();
    }, [initializeCart]);

    // Update buyer identity when user logs in/out
    useEffect(() => {
        if (cart?.id) {
            if (user?.email) {
                updateBuyerIdentity(cart.id, user.email);
            }
        }
    }, [user?.email, cart?.id]);

    // Add items to cart
    const addToCart = async (variantId: string, quantity: number = 1) => {
        if (!cart) {
            toast.error('Cart not ready. Please try again.');
            return;
        }

        setIsUpdating(true);
        try {
            const data = await fetchGraphQL(ADD_TO_CART, {
                cartId: cart.id,
                lines: [
                    {
                        merchandiseId: variantId,
                        quantity,
                    },
                ],
            });

            if (data?.cartLinesAdd?.cart) {
                setCart(data.cartLinesAdd.cart);
                toast.success('Added to cart!');
            } else if (data?.cartLinesAdd?.userErrors?.length > 0) {
                toast.error(data.cartLinesAdd.userErrors[0].message);
            }
        } catch (error) {
            console.error('[Cart] Add Item Error:', error);
            toast.error('Failed to add item to cart');
        } finally {
            setIsUpdating(false);
        }
    };

    // Update item quantity
    const updateQuantity = async (lineId: string, quantity: number) => {
        if (!cart) return;

        setIsUpdating(true);
        try {
            if (quantity === 0) {
                // Remove item if quantity is 0
                await removeFromCart(lineId);
                return;
            }

            const data = await fetchGraphQL(UPDATE_CART_LINES, {
                cartId: cart.id,
                lines: [
                    {
                        id: lineId,
                        quantity,
                    },
                ],
            });

            if (data?.cartLinesUpdate?.cart) {
                setCart(data.cartLinesUpdate.cart);
                toast.success('Cart updated');
            } else if (data?.cartLinesUpdate?.userErrors?.length > 0) {
                toast.error(data.cartLinesUpdate.userErrors[0].message);
            }
        } catch (error) {
            console.error('[Cart] Update Quantity Error:', error);
            toast.error('Failed to update quantity');
        } finally {
            setIsUpdating(false);
        }
    };

    // Remove item from cart
    const removeFromCart = async (lineId: string) => {
        if (!cart) return;

        setIsUpdating(true);
        try {
            const data = await fetchGraphQL(REMOVE_FROM_CART, {
                cartId: cart.id,
                lineIds: [lineId],
            });

            if (data?.cartLinesRemove?.cart) {
                setCart(data.cartLinesRemove.cart);
                toast.success('Item removed from cart');
            } else if (data?.cartLinesRemove?.userErrors?.length > 0) {
                toast.error(data.cartLinesRemove.userErrors[0].message);
            }
        } catch (error) {
            console.error('[Cart] Remove Item Error:', error);
            toast.error('Failed to remove item');
        } finally {
            setIsUpdating(false);
        }
    };

    // Apply discount code
    const applyDiscount = async (code: string) => {
        if (!cart) return;

        setIsUpdating(true);
        try {
            const data = await fetchGraphQL(APPLY_DISCOUNT, {
                cartId: cart.id,
                discountCodes: [code],
            });

            if (data?.cartDiscountCodesUpdate?.cart) {
                setCart(data.cartDiscountCodesUpdate.cart);
                const applicable = data.cartDiscountCodesUpdate.cart.discountCodes?.some(
                    (d: any) => d.code === code && d.applicable
                );

                if (applicable) {
                    toast.success('Discount code applied!');
                } else {
                    toast.error('Discount code is not valid');
                }
            } else if (data?.cartDiscountCodesUpdate?.userErrors?.length > 0) {
                toast.error(data.cartDiscountCodesUpdate.userErrors[0].message);
            }
        } catch (error) {
            console.error('[Cart] Apply Discount Error:', error);
            toast.error('Failed to apply discount code');
        } finally {
            setIsUpdating(false);
        }
    };

    // Clear cart (create a new one)
    const clearCart = async () => {
        localStorage.removeItem(CART_ID_KEY);
        await createNewCart();
        toast.success('Cart cleared');
    };

    // Refresh cart data
    const refreshCart = async () => {
        if (!cart?.id) return;

        try {
            const data = await fetchGraphQL(GET_CART, { id: cart.id });
            if (data?.cart) {
                setCart(data.cart);
            }
        } catch (error) {
            console.error('[Cart] Refresh Error:', error);
        }
    };

    // Navigate to checkout
    const checkout = () => {
        if (cart?.checkoutUrl) {
            window.location.href = cart.checkoutUrl;
        } else {
            toast.error('Unable to proceed to checkout');
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                isLoading,
                isUpdating,
                addToCart,
                updateQuantity,
                removeFromCart,
                applyDiscount,
                clearCart,
                refreshCart,
                checkout,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
