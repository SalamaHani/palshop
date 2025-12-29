'use client';

import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus, Tag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
    const { cart, isLoading, isUpdating, updateQuantity, removeFromCart, applyDiscount, checkout } = useCart();
    const [discountCode, setDiscountCode] = useState('');
    const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

    const handleApplyDiscount = async () => {
        if (!discountCode.trim()) return;
        setIsApplyingDiscount(true);
        await applyDiscount(discountCode);
        setIsApplyingDiscount(false);
        setDiscountCode('');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#215732] mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading your cart...</p>
                </div>
            </div>
        );
    }

    const cartLines = cart?.lines?.edges || [];
    const isEmpty = cartLines.length === 0;

    if (isEmpty) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 shadow-lg">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-12 h-12 text-gray-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Your cart is empty
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-[#215732] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#1a4428] transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || '0');
    const total = parseFloat(cart?.cost?.totalAmount?.amount || '0');
    const currency = cart?.cost?.totalAmount?.currencyCode || 'USD';
    const savings = subtotal - total;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-8 px-4 pb-24">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#215732] transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Continue Shopping
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Shopping Cart
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {cart?.totalQuantity || 0} {cart?.totalQuantity === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {cartLines.map(({ node: line }) => (
                                <motion.div
                                    key={line.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex gap-6">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                {line.merchandise.image?.url ? (
                                                    <Image
                                                        src={line.merchandise.image.url}
                                                        alt={line.merchandise.image.altText || line.merchandise.product.title}
                                                        width={128}
                                                        height={128}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ShoppingBag className="w-12 h-12 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                        {line.merchandise.product.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {line.merchandise.title !== 'Default Title' && line.merchandise.title}
                                                    </p>
                                                    {line.merchandise.selectedOptions.map((option) => (
                                                        option.name !== 'Title' && (
                                                            <p key={option.name} className="text-sm text-gray-500 dark:text-gray-500">
                                                                {option.name}: {option.value}
                                                            </p>
                                                        )
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(line.id)}
                                                    disabled={isUpdating}
                                                    className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 p-2"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {/* Quantity & Price */}
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                                                    <button
                                                        onClick={() => updateQuantity(line.id, line.quantity - 1)}
                                                        disabled={isUpdating || line.quantity <= 1}
                                                        className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                                    </button>
                                                    <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                                                        {line.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                                                        disabled={isUpdating}
                                                        className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-[#215732]">
                                                        {currency} {parseFloat(line.cost.totalAmount.amount).toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-500">
                                                        {currency} {parseFloat(line.merchandise.priceV2.amount).toFixed(2)} each
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm sticky top-24">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Order Summary
                            </h2>

                            {/* Discount Code */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Discount Code
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={discountCode}
                                            onChange={(e) => setDiscountCode(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
                                            placeholder="Enter code"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#215732] focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        onClick={handleApplyDiscount}
                                        disabled={isApplyingDiscount || !discountCode.trim()}
                                        className="px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                                    >
                                        {isApplyingDiscount ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            'Apply'
                                        )}
                                    </button>
                                </div>
                                {cart?.discountCodes && cart.discountCodes.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {cart.discountCodes.map((discount) => (
                                            <span
                                                key={discount.code}
                                                className={`text-sm px-3 py-1 rounded-full ${discount.applicable
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                                    }`}
                                            >
                                                {discount.code} {discount.applicable ? '✓' : '✗'}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-800 pt-6 space-y-4">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">
                                        {currency} {subtotal.toFixed(2)}
                                    </span>
                                </div>

                                {savings > 0 && (
                                    <div className="flex justify-between text-green-600 dark:text-green-400">
                                        <span>Savings</span>
                                        <span className="font-semibold">
                                            - {currency} {savings.toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-500">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                                        <span>Total</span>
                                        <span className="text-[#215732]">
                                            {currency} {total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={checkout}
                                disabled={isUpdating}
                                className="w-full mt-6 bg-[#215732] text-white py-4 rounded-full font-bold text-lg hover:bg-[#1a4428] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {isUpdating ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    'Proceed to Checkout'
                                )}
                            </button>

                            <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-4">
                                Secure checkout powered by Shopify
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}