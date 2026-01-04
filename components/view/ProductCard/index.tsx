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
      className="group cursor-pointer flex flex-col gap-3"
      onClick={() => router.push(`/product/${product.handle}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100">
        <Image
          src={product.featuredImage?.url ?? ""}
          alt={product.featuredImage?.altText ?? ""}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-black text-white px-3.5 py-1.5 rounded-full text-[13px] font-black z-10 shadow-lg">
            {discount}% off
          </div>
        )}

        {/* Save Button (Bottom Right) */}
        <button
          onClick={toggleSave}
          disabled={isToggling}
          className={cn(
            "absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-md active:scale-95 z-10",
            isSaved
              ? "bg-[#215732] text-white"
              : "bg-black/30 text-white hover:bg-black/50",
            isToggling && "opacity-50 cursor-wait"
          )}
        >
          {isToggling ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart className={cn("w-6 h-6", isSaved && "fill-current")} />
          )}
        </button>
      </div>

      {/* Info Section */}
      <div className="px-1 flex flex-col gap-1.5">
        {/* Product Title (Bold, Professional) */}
        <h3 className="text-[17px] font-bold text-gray-900 tracking-tight truncate leading-tight">
          {product.title}
        </h3>

        <ProductPrice
          priceRange={product.priceRange}
          compareAtPriceRange={(product as any).compareAtPriceRange}
        />
      </div>
    </div>
  );
};

export default ProductCard;

