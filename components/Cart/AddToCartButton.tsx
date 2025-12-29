'use client';

import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
    variantId: string;
    quantity?: number;
    className?: string;
    variant?: 'default' | 'icon' | 'full';
    onAddedToCart?: () => void;
}

export default function AddToCartButton({
    variantId,
    quantity = 1,
    className = '',
    variant = 'default',
    onAddedToCart,
}: AddToCartButtonProps) {
    const { addToCart, isUpdating } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsAdding(true);
        try {
            await addToCart(variantId, quantity);
            setShowSuccess(true);
            onAddedToCart?.();

            // Reset success state after animation
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error('Add to cart error:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const isLoading = isAdding || isUpdating;

    // Icon variant (small button with just icon)
    if (variant === 'icon') {
        return (
            <button
                onClick={handleAddToCart}
                disabled={isLoading || showSuccess}
                className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                    showSuccess
                        ? "bg-green-500 text-white"
                        : "bg-[#215732] text-white hover:bg-[#1a4428] active:scale-95",
                    className
                )}
                aria-label="Add to cart"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : showSuccess ? (
                    <Check className="w-5 h-5" />
                ) : (
                    <ShoppingCart className="w-5 h-5" />
                )}
            </button>
        );
    }

    // Full variant (large button with text and icon)
    if (variant === 'full') {
        return (
            <button
                onClick={handleAddToCart}
                disabled={isLoading || showSuccess}
                className={cn(
                    "w-full py-4 px-6 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]",
                    showSuccess
                        ? "bg-green-500 text-white"
                        : "bg-[#215732] text-white hover:bg-[#1a4428]",
                    className
                )}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Adding...</span>
                    </>
                ) : showSuccess ? (
                    <>
                        <Check className="w-6 h-6" />
                        <span>Added to Cart!</span>
                    </>
                ) : (
                    <>
                        <ShoppingCart className="w-6 h-6" />
                        <span>Add to Cart</span>
                    </>
                )}
            </button>
        );
    }

    // Default variant (medium button)
    return (
        <button
            onClick={handleAddToCart}
            disabled={isLoading || showSuccess}
            className={cn(
                "px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95",
                showSuccess
                    ? "bg-green-500 text-white"
                    : "bg-[#215732] text-white hover:bg-[#1a4428]",
                className
            )}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Adding...</span>
                </>
            ) : showSuccess ? (
                <>
                    <Check className="w-5 h-5" />
                    <span>Added!</span>
                </>
            ) : (
                <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                </>
            )}
        </button>
    );
}
