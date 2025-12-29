'use client';
import { Product } from '@/lib/products';
import { Star, Heart } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ProductCardProps {
    product: Product;
    className?: string;
}

export default function ProductCardHero({ product, className = '' }: ProductCardProps) {


    const idNum = parseInt(product.id.split('/').pop() || '0');
    const discount = idNum % 3 === 0 ? 40 : idNum % 2 === 0 ? 15 : null;

    const toggleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

    };

    return (
        <div className={`w-44 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col gap-2 p-1 ${className}`}>
            {/* Image Container */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F3F3F3] flex items-center justify-center">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                />
                {discount && (
                    <div className="absolute top-2 left-2 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                        {discount}% off
                    </div>
                )}


            </div>

            {/* Product Info */}
            <div className="px-2 pb-2 flex flex-col gap-0.5">
                <h3 className="text-[10px] font-bold text-gray-900 truncate">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-2 h-2 ${i < Math.floor(product.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-200 text-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-[8px] text-gray-500 font-medium">
                        ({product.reviews})
                    </span>
                </div>
            </div>
        </div>
    );
};


