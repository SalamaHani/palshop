'use client';

import React from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/view/ProductCard';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

export default function WishlistPage() {
    const { wishlist, wishlistCount, isLoading, removeFromWishlist } = useWishlist();
    const { addItem } = useCart();
    const [isAddingAll, setIsAddingAll] = React.useState(false);

    const handleAddAllToCart = async () => {
        setIsAddingAll(true);
        try {
            toast.info('Adding all items to cart...');
            for (const product of wishlist) {
                const variantId = (product as any).variants?.edges[0]?.node?.id || product.id;
                await addItem(variantId, 1);
            }
            toast.success('Successfully added items to cart');
        } catch (error) {
            toast.error('Failed to add some items to cart');
        } finally {
            setIsAddingAll(false);
        }
    };

    const handleClearAll = async () => {
        try {
            toast.info('Clearing wishlist...');
            for (const item of wishlist) {
                await removeFromWishlist(item.id);
            }
            toast.success('Wishlist cleared');
        } catch (error) {
            toast.error('Failed to clear wishlist');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-[#215732]" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex bg-white flex-col gap-8">
                {/* Header */}
                <div className="flex bg-white items-center gap-4 border-b border-gray-100 pb-8">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">
                            Saved Items
                        </h1>
                        <p className="text-gray-500 font-bold">
                            {wishlistCount} {wishlistCount === 1 ? 'Product' : 'Products'}
                        </p>
                    </div>
                    {wishlistCount > 0 && (
                        <div className="flex gap-4">
                            <Button
                                onClick={handleAddAllToCart}
                                disabled={isAddingAll}
                                className="bg-[#215732] hover:bg-[#1a4527] rounded-full font-bold px-6"
                            >
                                {isAddingAll ? 'Adding...' : 'Add All to Cart'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleClearAll}
                                className="rounded-full font-bold text-gray-400 hover:text-red-500 hover:border-red-500"
                            >
                                Clear All
                            </Button>
                        </div>
                    )}
                </div>

                {wishlistCount > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
                        {wishlist.map((product) => (
                            <ProductCard key={product.id} product={product as any} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                            <Heart className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-tight">
                            Your wishlist is empty
                        </h2>
                        <p className="text-gray-500 mb-8 max-w-sm font-medium">
                            Save items you love here to find them easily later.
                        </p>
                        <Link href="/shop">
                            <Button className="bg-[#215732] hover:bg-[#1a4527] h-14 px-10 rounded-full font-bold shadow-xl shadow-[#215732]/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-wider">
                                Explore Shop
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
