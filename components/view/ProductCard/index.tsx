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

  // Mock rating/reviews since they might not be in Shopify basic GraphQL by default
  const rating = 4.8;
  const reviews = 245;

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
      className="group cursor-pointer flex flex-col gap-4"
      onClick={() => router.push(`/product/${product.handle}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100">
        <Image
          src={product.featuredImage?.url ?? ""}
          alt={product.featuredImage?.altText ?? ""}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Save Button (Top Right) */}
        <button
          onClick={toggleSave}
          disabled={isToggling}
          className={cn(
            "absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-md active:scale-95 z-10",
            isSaved
              ? "bg-[#215732] text-white"
              : "bg-white/80 text-gray-400 hover:text-red-500",
            isToggling && "opacity-50 cursor-wait"
          )}
        >
          {isToggling ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart className={cn("w-5 h-5", isSaved && "fill-current")} />
          )}
        </button>
      </div>

      {/* Info Section */}
      <div className="px-1 flex flex-col gap-1">
        {/* Brand/Vendor */}
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
          {product.vendor}
        </p>

        {/* Product Title (Bold, All Caps) */}
        <h3 className="text-sm lg:text-[15px] font-black text-gray-900 uppercase tracking-tight truncate leading-tight">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3.5 h-3.5",
                  i < Math.floor(rating)
                    ? "fill-[#FBBF24] text-[#FBBF24]"
                    : "fill-gray-200 text-gray-200"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-gray-900">
            ({reviews})
          </span>
        </div>
        <ProductPrice priceRange={product.priceRange} />
      </div>
    </div>
  );
};

export default ProductCard;

