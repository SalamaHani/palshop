"use client";

import { ProductPriceRange } from "@/types/shopify-graphql";
import React from "react";

const ProductPrice = ({
  priceRange,
  compareAtPriceRange
}: {
  priceRange: ProductPriceRange;
  compareAtPriceRange?: ProductPriceRange;
}) => {
  const formatPrice = (amount: string, currencyCode: string) => {
    try {
      const val = parseFloat(amount).toFixed(2);
      const displayCurrency = currencyCode === "USD" ? "US$" : currencyCode;
      return `${val} ${displayCurrency}`;
    } catch (e) {
      return `${amount} ${currencyCode}`;
    }
  };

  const minPrice = formatPrice(
    priceRange.minVariantPrice.amount,
    priceRange.minVariantPrice.currencyCode
  );

  const comparePrice = compareAtPriceRange?.minVariantPrice?.amount
    ? formatPrice(
      compareAtPriceRange.minVariantPrice.amount,
      compareAtPriceRange.minVariantPrice.currencyCode
    )
    : null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <p suppressHydrationWarning className="text-[16px] font-bold text-gray-900">
        {minPrice}
      </p>
      {comparePrice && parseFloat(compareAtPriceRange?.minVariantPrice?.amount || "0") > parseFloat(priceRange.minVariantPrice.amount) && (
        <p suppressHydrationWarning className="text-[13px] font-bold text-gray-400 line-through">
          {comparePrice}
        </p>
      )}
    </div>
  );
};

export default ProductPrice;
