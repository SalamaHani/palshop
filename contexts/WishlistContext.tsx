'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchGraphQL } from '@/shopify/client';
import {
    GET_WISHLIST_PRODUCTS,
} from '@/graphql/wishlist';
import { useAuth } from './AuthContext';

import { toast } from 'sonner';

interface WishlistItem {
    id: string;
    title: string;
    handle: string;
    vendor?: string;
    featuredImage?: {
        url: string;
        altText?: string | null;
    };
    priceRange: {
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        };
        maxVariantPrice: {
            amount: string;
            currencyCode: string;
        };
    };
}

interface Wishlist {
    id: string;
    lines: {
        edges: Array<{ node: WishlistItem }>;
    };
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    isLoading: boolean;
    isUpdating: boolean;
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    toggleWishlist: (product: any) => Promise<void>;
    wishlistCount: number;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const { isAuthenticated } = useAuth();

    // 1. Sync local storage to/from state for guest
    useEffect(() => {
        if (!isAuthenticated) {
            const saved = localStorage.getItem('palshop_wishlist');
            if (saved) {
                try {
                    setWishlistIds(JSON.parse(saved));
                } catch (e) {
                    console.error('Failed to parse local wishlist');
                }
            }
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated && wishlistIds.length > 0) {
            localStorage.setItem('palshop_wishlist', JSON.stringify(wishlistIds));
        }
    }, [wishlistIds, isAuthenticated]);

    // 2. Load wishlist products whenever IDs change
    const loadProducts = useCallback(async (ids: string[]) => {
        // Only fetch IDs that follow the Shopify GID format (or base64 equivalent)
        const validShopifyIds = ids.filter(id =>
            id.startsWith('gid://shopify/Product/') ||
            (id.length > 20 && !id.includes(' ')) // Heuristic for base64 encoded GIDs
        );

        if (validShopifyIds.length === 0) {
            setWishlistItems([]);
            setIsLoading(false);
            return;
        }

        try {
            const data = await fetchGraphQL(GET_WISHLIST_PRODUCTS, { ids: validShopifyIds });
            if (data?.nodes) {
                setWishlistItems(data.nodes.filter(Boolean));
            }
        } catch (error) {
            console.error('[WishlistContext] Load Products Error:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 3. Load from our wishlist API
    const loadFromShopify = useCallback(async () => {
        try {
            const response = await fetch('/api/customer/wishlist');
            if (response.ok) {
                const data = await response.json();
                const ids = data.wishlist || [];
                setWishlistIds(ids);
                await loadProducts(ids);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error('[WishlistContext] Load API Wishlist Error:', error);
            setIsLoading(false);
        }
    }, [loadProducts]);

    useEffect(() => {
        if (isAuthenticated) {
            const syncWishlist = async () => {
                try {
                    // Fetch Shopify wishlist via our API
                    const response = await fetch('/api/customer/wishlist');
                    let shopifyIds: string[] = [];
                    if (response.ok) {
                        const data = await response.json();
                        shopifyIds = data.wishlist || [];
                    }

                    // Fetch local wishlist
                    const localSaved = localStorage.getItem('palshop_wishlist');
                    const localIds = localSaved ? JSON.parse(localSaved) : [];

                    // Merge unique IDs
                    const mergedIds = Array.from(new Set([...shopifyIds, ...localIds]));

                    // If local had new items, update Shopify
                    if (localIds.length > 0) {
                        await updateWishlist(mergedIds);
                        localStorage.removeItem('palshop_wishlist'); // Clear local after merge
                    } else {
                        setWishlistIds(shopifyIds);
                        await loadProducts(shopifyIds);
                    }
                } catch (error) {
                    console.error('[WishlistContext] Sync Error:', error);
                    setIsLoading(false);
                }
            };
            syncWishlist();
        } else {
            // Guest mode: IDS are already set by the other useEffect, just load products
            const saved = localStorage.getItem('palshop_wishlist');
            if (saved) {
                const ids = JSON.parse(saved);
                setWishlistIds(ids);
                loadProducts(ids);
            } else {
                setIsLoading(false);
            }
        }
    }, [isAuthenticated, loadProducts]);

    // 4. Update Wishlist (Shopify or Local)
    const updateWishlist = async (newIds: string[]) => {
        setWishlistIds(newIds);
        if (isAuthenticated) {
            setIsUpdating(true);
            try {
                const response = await fetch('/api/customer/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ wishlist: newIds })
                });

                if (!response.ok) {
                    throw new Error('Failed to update wishlist');
                }
            } catch (error) {
                console.error('[WishlistContext] Update API Error:', error);
                toast.error('Failed to sync wishlist with account');
            } finally {
                setIsUpdating(false);
            }
        }
        await loadProducts(newIds);
    };

    const addToWishlist = async (productId: string) => {
        if (wishlistIds.includes(productId)) return;
        const newIds = [...wishlistIds, productId];
        await updateWishlist(newIds);
        toast.success('Added to wishlist');
    };

    const removeFromWishlist = async (productId: string) => {
        const newIds = wishlistIds.filter(id => id !== productId);
        await updateWishlist(newIds);
        toast.info('Removed from wishlist');
    };

    const isInWishlist = (productId: string) => {
        return wishlistIds.includes(productId);
    };

    const toggleWishlist = async (product: any) => {
        if (isInWishlist(product.id)) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product.id);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist: wishlistItems,
                isLoading,
                isUpdating,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                toggleWishlist,
                wishlistCount: wishlistItems.length,
                refreshWishlist: isAuthenticated ? loadFromShopify : async () => { },
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
