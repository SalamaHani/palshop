"use client";

import { ProductPriceRange } from "@/types/shopify-graphql";
import React from "react";

const ProductPrice = ({ priceRange }: { priceRange: ProductPriceRange }) => {
  const formatPrice = (amount: string, currencyCode: string) => {
    try {
      // Handle legacy/invalid "US$" code if it still exists
      const code = currencyCode === "US$" ? "USD" : currencyCode;

      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: code,
        currencyDisplay: "narrowSymbol",
      }).format(parseFloat(amount));
    } catch (e) {
      console.warn("Invalid currency code:", currencyCode);
      return `${amount} ${currencyCode}`;
    }
  };

  const minPrice = formatPrice(
    priceRange.minVariantPrice.amount,
    priceRange.minVariantPrice.currencyCode
  );

  const hasRange = priceRange.maxVariantPrice?.amount && priceRange.maxVariantPrice.amount !== priceRange.minVariantPrice.amount;

  return (
    <div className="flex items-center gap-2">
      <p suppressHydrationWarning className="text-sm font-bold text-gray-900">
        {minPrice}
        {hasRange && <span className="text-xs font-normal text-gray-500 ml-1">+</span>}
      </p>
    </div>
  );
};

export default ProductPrice;
