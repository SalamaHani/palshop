"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GET_PRODUCT_BY_HANDLE_QUERY } from "@/graphql/products";
import { useStorefrontQuery } from "@/hooks/useStorefront";
import {
  GetProductByHandleQuery,
  ImageEdge,
  ProductOption,
  ProductVariant,
} from "@/types/shopify-graphql";
import ProductCarousel from "@/components/view/ProductCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ProductOptions from "@/components/view/ProductOptions";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Star, Heart, Share2, MoreHorizontal, Check, Truck, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ProductDescriptionModal from "@/components/Product/ProductDescriptionModal";
import PolicyModal from "@/components/Product/PolicyModal";

const Product = () => {
  const params = useParams();
  const { addItem, isUpdating } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [isAdded, setIsAdded] = useState(false);

  // States
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>();
  const [quantity, setQuantity] = useState(1);
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  const { data, isLoading } = useStorefrontQuery<GetProductByHandleQuery>(
    ["product", params.handle],
    {
      query: GET_PRODUCT_BY_HANDLE_QUERY,
      variables: { handle: params.handle },
    }
  );

  useEffect(() => {
    if (data?.product?.variants?.edges) {
      // Select first variant by default
      const firstVariant = data.product.variants.edges[0]?.node as ProductVariant;
      if (firstVariant) {
        setSelectedVariant(firstVariant);
        const options: Record<string, string> = {};
        firstVariant.selectedOptions.forEach(opt => {
          options[opt.name] = opt.value;
        });
        setSelectedOptions(options);
      }
    }
  }, [data]);

  const handleSelectOptions = (options: Record<string, string>) => {
    const variant = data?.product?.variants?.edges.find((variant) => {
      return Object.keys(options).every((key) => {
        return variant.node.selectedOptions.some(
          (option) => option.name === key && option.value === options[key]
        );
      });
    });
    setSelectedVariant(variant?.node as ProductVariant);
    setSelectedOptions(options);
  };

  if (isLoading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="space-y-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-24" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-10 rounded-full" />)}
          </div>
          <Skeleton className="h-14 w-full rounded-full" />
        </div>
      </div>
    );

  const product = data?.product;
  if (!product) return <div>Product not found</div>;

  const isSaved = isInWishlist(product.id);

  const handleToggleWishlist = () => {
    if (product) {
      toggleWishlist({
        id: product.id,
        handle: product?.handle,
        title: product.title,
        featuredImage: product.images.edges[0]?.node ? { url: product.images.edges[0].node.url, altText: product.images.edges[0].node.altText ?? undefined } : undefined,
        priceRange: product.priceRange,
        vendor: product.vendor
      });
    }
  };

  const handleAddtoCart = async () => {
    if (selectedVariant) {
      try {
        await addItem(selectedVariant.id, quantity);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      } catch (error) {
        console.error("Add to cart error:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 lg:py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12">
        {/* Left Side: Images */}
        <div className="md:col-span-12 lg:col-span-7 lg:sticky lg:top-28 lg:self-start">
          <ProductCarousel images={product.images.edges as ImageEdge[]} />
        </div>

        {/* Right Side: Product Info */}
        <div className="md:col-span-12 lg:col-span-5 flex flex-col lg:sticky lg:top-28 lg:self-start gap-1">
          {/* Brand Info & Menu */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-black text-black" />
                    <span className="text-xs font-bold text-gray-900">4.6</span>
                    <span className="text-[10px] text-gray-400 font-medium">(140.6k)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {product.title}
          </h1>

          {/* Price */}
          <div className="flex flex-col gap-1 mb-8">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-gray-900 italic">
                {selectedVariant?.price.amount} {selectedVariant?.price.currencyCode}
              </span>
              {selectedVariant?.compareAtPrice && (
                <span className="text-lg text-gray-400 line-through font-medium">
                  {selectedVariant.compareAtPrice.amount} {selectedVariant.compareAtPrice.currencyCode}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 text-[13px] font-bold text-gray-700">
                <Truck className="w-4 h-4" />
                <span>Shipping calculated at checkout</span>
              </div>
              <button className="text-[#215732] text-[13px] font-bold w-fit hover:underline pl-6">
                Add address
              </button>
            </div>
          </div>

          {/* Options/Sizes */}
          <div className="mb-8">
            <ProductOptions
              selectedOptions={selectedOptions}
              setSelectedOptions={handleSelectOptions}
              options={product.options as ProductOption[]}
              variants={product.variants.edges}
            />
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <label className="text-sm font-bold text-gray-900 block mb-3">
              Quantity
            </label>
            <div className="inline-flex items-center border border-gray-100 rounded-full h-12 px-2 bg-gray-50/50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-all text-gray-400 hover:text-black"
              >
                <span className="text-xl font-light">−</span>
              </button>
              <span className="w-10 text-center font-bold text-gray-900 text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-all text-gray-400 hover:text-black"
              >
                <span className="text-xl font-light">+</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              className={cn(
                "w-full h-14 rounded-full text-white text-lg font-bold shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2",
                isAdded
                  ? "bg-green-600 hover:bg-green-700 shadow-green-600/20"
                  : "bg-[#215732] hover:bg-[#1a4527] shadow-[#215732]/30"
              )}
              disabled={!selectedVariant || isUpdating}
              onClick={handleAddtoCart}
            >
              {isUpdating ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : isAdded ? (
                <>
                  <Check className="w-6 h-6" />
                  Added!
                </>
              ) : (
                "Add to cart"
              )}
            </Button>

            <Button
              className="w-full h-14 rounded-full bg-black text-white hover:bg-gray-900 text-lg font-bold shadow-xl transition-all active:scale-[0.98]"
              disabled={!selectedVariant}
            >
              Buy now
            </Button>


            <div className="flex gap-4 mt-2">
              <Button
                variant="outline"
                className={cn(
                  "flex-1 h-12 rounded-full border-gray-200 gap-2 font-bold hover:bg-gray-100 transition-all group",
                  isSaved && "border-red-500 text-red-500 hover:bg-red-50"
                )}
                onClick={handleToggleWishlist}
              >
                <Heart className={cn("w-5 h-5 transition-colors", isSaved ? "fill-red-500 text-red-500" : "group-hover:fill-red-500 group-hover:text-red-500")} />
                Save
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-full border-gray-200 gap-2 font-bold hover:bg-gray-100 transition-all"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard!');
                }}
              >
                <Share2 className="w-5 h-5" />
                Share
              </Button>
            </div>
          </div>

          {/* Description Preview */}
          <div className="mt-10 border-t border-gray-100 pt-8">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                {product.description.length > 150
                  ? `${product.description.substring(0, 150)}...`
                  : product.description}
              </p>
              {product.description.length > 150 && (
                <button
                  onClick={() => setIsDescModalOpen(true)}
                  className="text-[#215732] text-sm font-bold hover:underline w-fit"
                >
                  Read more
                </button>
              )}
            </div>
          </div>

          <ProductDescriptionModal
            isOpen={isDescModalOpen}
            onClose={() => setIsDescModalOpen(false)}
            title={product.title}
            description={product.description}
            vendor={product.vendor}
          />


          {/* Policy Links (Updated to match Save/Share style) */}
          <div className="flex gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setIsShippingModalOpen(true)}
              className="flex-1 h-12 rounded-full border-gray-200 gap-2 font-bold hover:bg-gray-100 transition-all"
            >
              <Truck className="w-5 h-5 text-gray-500" />
              Shipping Policy
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsRefundModalOpen(true)}
              className="flex-1 h-12 rounded-full border-gray-200 gap-2 font-bold hover:bg-gray-100 transition-all"
            >
              <ShieldCheck className="w-5 h-5 text-gray-500" />
              Refund Policy
            </Button>
          </div>

          {/* Policy Modals */}
          <PolicyModal
            isOpen={isShippingModalOpen}
            onClose={() => setIsShippingModalOpen(false)}
            title="Shipping Policy"
            sections={[
              {
                heading: "Order Confirmation & Processing",
                content: [
                  "All verified orders will receive an initial email confirming the purchase.",
                  "Once the order ships, a second email with tracking information will be sent.",
                  "Orders are typically processed within 1–3 business days after payment verification.",
                  "Orders placed on Friday evening, weekends, or holidays will be processed on the next business day.",
                  "During peak seasons, processing and shipping times may be slightly longer."
                ]
              },
              {
                heading: "Shipping Times (After Shipment)",
                content: [
                  "Shipping times are estimates and not guaranteed, especially during holidays.",
                  "Standard: 4–8 business days",
                  "Standard (AK, HI & PR): 4–10 business days",
                  "Expedited: 2–4 business days",
                  "Express: 1–2 business days",
                  "If your order exceeds the estimated delivery time, please contact us."
                ]
              }
            ]}
          />

          <PolicyModal
            isOpen={isRefundModalOpen}
            onClose={() => setIsRefundModalOpen(false)}
            title="Refund Policy"
            sections={[
              {
                heading: "Return Conditions",
                content: [
                  "Returns are accepted within 30 days of receipt.",
                  "Items must be in original condition with tags attached.",
                  "Underwear and swimwear cannot be returned due to hygiene reasons."
                ]
              },
              {
                heading: "Refund Process",
                content: [
                  "Refunds will be processed back to the original payment method.",
                  "Please allow 5-7 business days for the credit to appear.",
                  "Store credit is also available for instantaneous returns."
                ]
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Product;
