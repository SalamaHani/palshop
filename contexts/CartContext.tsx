'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
    addItem: (variantId: string, quantity?: number) => Promise<Cart | null>;
    removeItem: (lineId: string) => Promise<void>;
    updateItem: (lineId: string, quantity: number) => Promise<void>;
    checkout: (explicitCartId?: string) => Promise<void>;
    refreshCart: () => Promise<void>;
    cartCount: number;
    isCheckoutLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

    const getCartId = useCallback(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('palshop_cart_id');
        }
        return null;
    }, []);

    const saveCartId = useCallback((id: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('palshop_cart_id', id);
        }
    }, []);

    const clearCartId = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('palshop_cart_id');
        }
    }, []);

    const loadCart = useCallback(async () => {
        const cartId = getCartId();
        if (!cartId) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/cart?cartId=${cartId}`);
            const data = await response.json();

            if (data.cart) {
                setCart(data.cart);
            } else {
                clearCartId();
                setCart(null);
            }
        } catch (error) {
            console.error('[CartContext] Load Error:', error);
            clearCartId();
            setCart(null);
        } finally {
            setIsLoading(false);
        }
    }, [getCartId, clearCartId]);

    const addItem = async (variantId: string, quantity: number = 1): Promise<Cart | null> => {
        setIsUpdating(true);
        try {
            let cartId = getCartId();
            let resultCart: Cart | null = null;

            if (!cartId) {
                // Create new cart
                const response = await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'create',
                        variantId,
                        quantity
                    }),
                });

                const data = await response.json();

                if (response.ok && data.cart) {
                    saveCartId(data.cart.id);
                    resultCart = data.cart;
                    setCart(data.cart);
                    toast.success('Added to cart');
                } else {
                    throw new Error(data.error || 'Failed to create cart');
                }
            } else {
                // Add to existing cart
                const response = await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'addItem',
                        cartId,
                        variantId,
                        quantity
                    }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Fetch updated cart to get full details
                    const cartRes = await fetch(`/api/cart?cartId=${cartId}`);
                    const cartData = await cartRes.json();
                    resultCart = cartData.cart;
                    setCart(cartData.cart);
                    toast.success('Added to cart');
                } else {
                    throw new Error(data.error || 'Failed to add item');
                }
            }
            return resultCart;
        } catch (error) {
            console.error('[CartContext] Add Error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to add item');
            return null;
        } finally {
            setIsUpdating(false);
        }
    };

    const removeItem = async (lineId: string) => {
        setIsUpdating(true);
        try {
            const cartId = getCartId();
            if (!cartId) return;

            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'removeItem',
                    cartId,
                    lineId
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                await loadCart();
                toast.success('Item removed');
            } else {
                throw new Error(data.error || 'Failed to remove item');
            }
        } catch (error) {
            console.error('[CartContext] Remove Error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to remove item');
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

            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'updateItem',
                    cartId,
                    lines: [{ id: lineId, quantity }]
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                await loadCart();
            } else {
                throw new Error(data.error || 'Failed to update quantity');
            }
        } catch (error) {
            console.error('[CartContext] Update Error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update quantity');
        } finally {
            setIsUpdating(false);
        }
    };

    const checkout = async (explicitCartId?: string) => {
        const cartId = explicitCartId || cart?.id || getCartId();

        if (!cartId) {
            toast.error('Unable to proceed to checkout. Please try again.');
            return;
        }

        setIsCheckoutLoading(true);

        try {
            // Update buyer identity before redirecting to ensure customer is synced
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'updateBuyerIdentity',
                    cartId: cartId
                }),
            });

            const data = await response.json();

            // If the API call succeeded and gave us a checkout URL, use it
            if (response.ok && data.cart?.checkoutUrl) {
                window.location.href = data.cart.checkoutUrl;
                return;
            }

            // Fallback: If we have a cart object in state, use its existing checkoutUrl
            if (cart?.checkoutUrl) {
                window.location.href = cart.checkoutUrl;
                return;
            }

            // Ultimate fallback: Try to refresh cart and use its URL
            const refreshRes = await fetch(`/api/cart?cartId=${cartId}`);
            const refreshData = await refreshRes.json();
            if (refreshData.cart?.checkoutUrl) {
                window.location.href = refreshData.cart.checkoutUrl;
            } else {
                throw new Error('Could not determine checkout URL');
            }
        } catch (error) {
            console.error('[CartContext] Checkout Error:', error);
            // If all fails, show an error
            toast.error('Checkout is currently unavailable. Please try again later.');
        } finally {
            setIsCheckoutLoading(false);
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
            checkout,
            refreshCart: loadCart,
            cartCount: cart?.totalQuantity || 0,
            isCheckoutLoading
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
