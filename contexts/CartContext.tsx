'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchGraphQL } from '@/shopify/client';
import {
    GET_CART,
    CREATE_CART,
    ADD_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_ITEMS
} from '@/graphql/cart';
import { toast } from 'sonner';

interface CartItem {
    id: string;
    quantity: number;
    cost: {
        totalAmount: {
            amount: string;
            currencyCode: string;
        };
    };
    merchandise: {
        id: string;
        title: string;
        selectedOptions: Array<{ name: string; value: string }>;
        price: {
            amount: string;
            currencyCode: string;
        };
        product: {
            id: string;
            title: string;
            handle: string;
            images: {
                edges: Array<{
                    node: {
                        url: string;
                        altText: string | null;
                    };
                }>;
            };
        };
    };
}

interface Cart {
    id: string;
    checkoutUrl: string;
    totalQuantity: number;
    lines: {
        edges: Array<{ node: CartItem }>;
    };
    cost: {
        subtotalAmount: {
            amount: string;
            currencyCode: string;
        };
        totalAmount: {
            amount: string;
            currencyCode: string;
        };
    };
}

interface CartContextType {
    cart: Cart | null;
    isLoading: boolean;
    isUpdating: boolean;
    addItem: (variantId: string, quantity?: number) => Promise<void>;
    removeItem: (lineId: string) => Promise<void>;
    updateItem: (lineId: string, quantity: number) => Promise<void>;
    refreshCart: () => Promise<void>;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const getCartId = useCallback(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('cartId');
        }
        return null;
    }, []);

    const saveCartId = useCallback((id: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cartId', id);
        }
    }, []);

    const loadCart = useCallback(async () => {
        const cartId = getCartId();
        if (!cartId) {
            setIsLoading(false);
            return;
        }

        try {
            const data = await fetchGraphQL(GET_CART, { cartId });
            if (data?.cart) {
                setCart(data.cart);
            } else {
                localStorage.removeItem('cartId');
                setCart(null);
            }
        } catch (error) {
            console.error('[CartContext] Load Error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [getCartId]);

    const addItem = async (variantId: string, quantity: number = 1) => {
        setIsUpdating(true);
        try {
            let cartId = getCartId();

            if (!cartId) {
                const data = await fetchGraphQL(CREATE_CART, {
                    lineItems: [{ merchandiseId: variantId, quantity }]
                });
                if (data?.cartCreate?.cart) {
                    cartId = data.cartCreate.cart.id;
                    saveCartId(cartId!);
                    setCart(data.cartCreate.cart);
                    toast.success('Added to cart');
                }
            } else {
                const data = await fetchGraphQL(ADD_TO_CART, {
                    cartId,
                    lines: [{ merchandiseId: variantId, quantity }]
                });
                if (data?.cartLinesAdd?.cart) {
                    await loadCart();
                    toast.success('Added to cart');
                }
            }
        } catch (error) {
            console.error('[CartContext] Add Error:', error);
            toast.error('Failed to add item');
        } finally {
            setIsUpdating(false);
        }
    };

    const removeItem = async (lineId: string) => {
        setIsUpdating(true);
        try {
            const cartId = getCartId();
            if (!cartId) return;

            const data = await fetchGraphQL(REMOVE_FROM_CART, {
                cartId,
                lineIds: [lineId]
            });

            if (data?.cartLinesRemove?.cart) {
                await loadCart();
                toast.success('Item removed');
            }
        } catch (error) {
            console.error('[CartContext] Remove Error:', error);
            toast.error('Failed to remove item');
        } finally {
            setIsUpdating(false);
        }
    };

    const updateItem = async (lineId: string, quantity: number) => {
        if (quantity < 1) {
            await removeItem(lineId);
            return;
        }

        setIsUpdating(true);
        try {
            const cartId = getCartId();
            if (!cartId) return;

            const data = await fetchGraphQL(UPDATE_CART_ITEMS, {
                cartId,
                lines: [{ id: lineId, quantity }]
            });

            if (data?.cartLinesUpdate?.cart) {
                await loadCart();
            }
        } catch (error) {
            console.error('[CartContext] Update Error:', error);
            toast.error('Failed to update quantity');
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    return (
        <CartContext.Provider value={{
            cart,
            isLoading,
            isUpdating,
            addItem,
            removeItem,
            updateItem,
            refreshCart: loadCart,
            cartCount: cart?.totalQuantity || 0
        }}>
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
