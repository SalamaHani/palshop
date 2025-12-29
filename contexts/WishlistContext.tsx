'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchGraphQL, fetchShopify } from '@/shopify/client';
import {
    GET_CUSTOMER_WISHLIST,
    UPDATE_CUSTOMER_WISHLIST,
    GET_WISHLIST_PRODUCTS,
} from '@/graphql/wishlist';



import { toast } from 'sonner';
import { useAuth } from '@/components/AuthProvider';

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
    const { user } = useAuth();

    // 1. Sync local storage to/from state for guest
    useEffect(() => {
        if (!user) {
            const saved = localStorage.getItem('palshop_wishlist');
            if (saved) {
                try {
                    setWishlistIds(JSON.parse(saved));
                } catch (e) {
                    console.error('Failed to parse local wishlist');
                }
            }
        }
    }, [user]);

    useEffect(() => {
        if (!user && wishlistIds.length > 0) {
            localStorage.setItem('palshop_wishlist', JSON.stringify(wishlistIds));
        }
    }, [wishlistIds, user]);

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

    // 3. Load from Shopify for authenticated users
    const loadFromShopify = useCallback(async () => {
        try {
            const data = await fetchShopify(GET_CUSTOMER_WISHLIST, {}, 'customer-account');
            const wishlistValue = data?.customer?.wishlist?.value || '[]';
            const ids = JSON.parse(wishlistValue);
            setWishlistIds(ids);
            await loadProducts(ids);
        } catch (error) {
            console.error('[WishlistContext] Load Shopify Wishlist Error:', error);
            setIsLoading(false);
        }
    }, [loadProducts]);

    useEffect(() => {
        if (user) {
            const syncWishlist = async () => {
                // Fetch Shopify wishlist
                const data = await fetchShopify(GET_CUSTOMER_WISHLIST, {}, 'customer-account');
                const shopifyWishlistValue = data?.customer?.wishlist?.value || '[]';
                const shopifyIds = JSON.parse(shopifyWishlistValue);

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
    }, [user, loadProducts]);

    // 4. Update Wishlist (Shopify or Local)
    const updateWishlist = async (newIds: string[]) => {
        setWishlistIds(newIds);
        if (user) {
            setIsUpdating(true);
            try {
                await fetchShopify(UPDATE_CUSTOMER_WISHLIST, {
                    metafields: [{
                        namespace: "custom",
                        key: "wishlist",
                        value: JSON.stringify(newIds),
                        type: "json"
                    }]
                }, 'customer-account');
            } catch (error) {
                console.error('[WishlistContext] Update Shopify Error:', error);
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
                refreshWishlist: user ? loadFromShopify : async () => { },
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
