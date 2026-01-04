'use client';
import { Product } from '@/lib/products';
import { Star, Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
    product: Product;
    className?: string;
}

export default function ProductCardHero({ product, className = '' }: ProductCardProps) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isSaved = isInWishlist(product.id.toString());
    const idNum = parseInt(product.id.split('/').pop() || '0');
    const discount = idNum % 3 === 0 ? 40 : idNum % 2 === 0 ? 15 : null;

    const toggleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist({
            id: product.id.toString(),
            handle: product.name.toLowerCase().replace(/ /g, '-'),
            title: product.name,
            featuredImage: { url: product.image, altText: product.name },
            priceRange: {
                minVariantPrice: {
                    amount: product.price.toString(),
                    currencyCode: 'USD'
                },
                maxVariantPrice: {
                    amount: product.price.toString(),
                    currencyCode: 'USD'
                }
            },
            vendor: product.category
        });
    };

    return (
        <div className={`w-44 bg-white dark:bg-[#0d0d0d] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 dark:border-white/5 hover:shadow-2xl hover:shadow-[#215732]/10 transition-all duration-700 hover:-translate-y-2 cursor-pointer flex flex-col gap-2 p-1.5 ${className}`}>
            {/* Image Container */}
            <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-[#F8F9FA] dark:bg-white/[0.02] flex items-center justify-center">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-[85%] h-[85%] object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 hover:scale-110"
                />
                {discount && (
                    <div className="absolute top-3 left-3 bg-black dark:bg-white text-white dark:text-black text-[9px] font-black px-2 py-0.5 rounded-lg shadow-xl backdrop-blur-md">
                        {discount}% OFF
                    </div>
                )}

                {/* Heart Toggle Button */}
                <button
                    onClick={toggleSave}
                    className={cn(
                        "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-xl active:scale-95 z-10",
                        isSaved
                            ? "bg-[#215732] text-white"
                            : "bg-white/90 dark:bg-black/80 text-gray-400 hover:text-red-500"
                    )}
                >
                    <Heart className={cn("w-4 h-4 transition-all", isSaved && "fill-current scale-110")} />
                </button>
            </div>

            {/* Product Info */}
            <div className="px-2.5 pb-2.5 flex flex-col gap-1">
                <h3 className="text-[11px] font-black text-gray-900 dark:text-white truncate tracking-tight">
                    {product.name}
                </h3>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-[#FBBF24] text-[#FBBF24]" />
                        <span className="text-[10px] text-gray-900 dark:text-white font-black">
                            {product.rating}
                        </span>
                    </div>
                    <span className="text-[11px] font-black text-[#215732] dark:text-[#34d399]">
                        ${product.price.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
};


