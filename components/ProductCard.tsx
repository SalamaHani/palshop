'use client';

import React, { useState } from 'react';
import { Star, Heart, Search } from 'lucide-react';
import { Product } from '@/lib/products';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
    product: Product;
    className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isSaved = isInWishlist(product.id.toString());

    const toggleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist({
            id: product.id.toString(),
            handle: product.name.toLowerCase().replace(/ /g, '-'), // fallback handle
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
        <div className={cn("group cursor-pointer flex flex-col gap-4", className)}>
            {/* Image Container */}
            <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100">
                {/* Product Image */}
                <div className="relative w-full h-full">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                </div>

                {/* Save Button (Top Right) */}
                <button
                    onClick={toggleSave}
                    className={cn(
                        "absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-md active:scale-95 z-10",
                        isSaved
                            ? "bg-[#215732] text-white"
                            : "bg-white/80 text-gray-400 hover:text-red-500"
                    )}
                >
                    <Heart className={cn("w-5 h-5", isSaved && "fill-current")} />
                </button>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-1 px-1">
                {/* Product Name (Bold, All Caps) */}
                <h3 className="text-sm lg:text-[15px] font-black text-gray-900 uppercase tracking-tight truncate leading-tight">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "w-3.5 h-3.5",
                                    i < Math.floor(product.rating)
                                        ? "fill-[#FBBF24] text-[#FBBF24]"
                                        : "fill-gray-200 text-gray-200"
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                        ({product.reviews})
                    </span>
                </div>

                {/* Price */}
                <p className="text-lg font-black text-gray-900">
                    {product.price.toFixed(2)} USD
                </p>
            </div>
        </div>
    );
}

