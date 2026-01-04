"use client";

import { Star, Heart, Search } from "lucide-react";
import { Product } from "@/types/shopify-graphql";
import React from "react";
import Image from "next/image";
import ProductPrice from "./ProductPrice";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";

const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, setIsAuthModalOpen } = useAuth();
  const [isToggling, setIsToggling] = React.useState(false);
  const isSaved = isInWishlist(product.id);

  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtPrice = (product as any).compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat((product as any).compareAtPriceRange.minVariantPrice.amount)
    : 0;

  const discount = compareAtPrice > price
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (isToggling) return;

    setIsToggling(true);
    try {
      await toggleWishlist(product);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div
      role="button"
      className="group cursor-pointer flex flex-col gap-3.5"
      onClick={() => router.push(`/product/${product.handle}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-100/50 dark:border-white/5 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-[#215732]/10 group-hover:-translate-y-1">
        <Image
          src={product.featuredImage?.url ?? ""}
          alt={product.featuredImage?.altText ?? ""}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
          sizes="(max-w-768px) 50vw, (max-w-1200px) 25vw, 15vw"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-black/90 dark:bg-white/90 text-white dark:text-black px-3.5 py-1.5 rounded-2xl text-[12px] font-black z-10 shadow-xl backdrop-blur-md">
            {discount}% OFF
          </div>
        )}

        {/* Save Button (Bottom Right) */}
        <button
          onClick={toggleSave}
          disabled={isToggling}
          className={cn(
            "absolute bottom-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-xl active:scale-90 z-10",
            isSaved
              ? "bg-[#215732] text-white"
              : "bg-white/80 dark:bg-black/80 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-black",
            isToggling && "opacity-50 cursor-wait"
          )}
        >
          {isToggling ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart className={cn("w-5.5 h-5.5 transition-all", isSaved ? "fill-current scale-110" : "group-hover/btn:scale-110")} />
          )}
        </button>

        {/* Quick View Button (Overlay) - Optional improvement */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 dark:bg-black/90 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Quick View</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-2 flex flex-col gap-1.5">
        <div className="flex flex-col gap-0.5">
          {/* Vendor/Category if available, otherwise just vendor */}
          <span className="text-[10px] font-black text-[#215732] dark:text-[#34d399] uppercase tracking-[0.2em] opacity-80">
            {product.vendor}
          </span>
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white tracking-tight truncate leading-tight group-hover:text-[#215732] transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Rating Section (Stars + Count) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < 4 ? "fill-[#FBBF24] text-[#FBBF24]" : "fill-gray-200 text-gray-200 dark:fill-white/10 dark:text-white/10"
                )}
              />
            ))}
          </div>
          <span className="text-[12px] font-bold text-gray-400 dark:text-gray-500">
            (1.3k)
          </span>
        </div>

        <ProductPrice
          priceRange={product.priceRange}
          compareAtPriceRange={(product as any).compareAtPriceRange}
        />
      </div>
    </div>
  );
};

export default ProductCard;

