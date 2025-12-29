'use client';

import { useCart } from '@/contexts/CartContext';
import { X, ShoppingBag, Plus, Minus, ArrowRight, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { cart, isUpdating, updateQuantity, removeFromCart, checkout } = useCart();

    const cartLines = cart?.lines?.edges || [];
    const isEmpty = cartLines.length === 0;
    const total = parseFloat(cart?.cost?.totalAmount?.amount || '0');
    const currency = cart?.cost?.totalAmount?.currencyCode || 'USD';

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                    />
                )}
            </AnimatePresence>

            {/* Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white dark:bg-gray-900 shadow-2xl z-[9999] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-6 h-6 text-[#215732]" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Cart
                                </h2>
                                {!isEmpty && (
                                    <span className="bg-[#215732] text-white text-sm font-semibold px-2.5 py-1 rounded-full">
                                        {cart?.totalQuantity}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {isEmpty ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                        <ShoppingBag className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        Your cart is empty
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        Add some products to get started!
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="bg-[#215732] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1a4428] transition-colors"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {cartLines.map(({ node: line }) => (
                                            <motion.div
                                                key={line.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                                            >
                                                {/* Product Image */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                        {line.merchandise.image?.url ? (
                                                            <Image
                                                                src={line.merchandise.image.url}
                                                                alt={line.merchandise.image.altText || line.merchandise.product.title}
                                                                width={96}
                                                                height={96}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <ShoppingBag className="w-8 h-8 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                                                {line.merchandise.product.title}
                                                            </h4>
                                                            {line.merchandise.title !== 'Default Title' && (
                                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                    {line.merchandise.title}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(line.id)}
                                                            disabled={isUpdating}
                                                            className="ml-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Quantity & Price */}
                                                    <div className="flex items-center justify-between mt-3">
                                                        <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-full p-1">
                                                            <button
                                                                onClick={() => updateQuantity(line.id, line.quantity - 1)}
                                                                disabled={isUpdating || line.quantity <= 1}
                                                                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="w-6 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                                                {line.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(line.id, line.quantity + 1)}
                                                                disabled={isUpdating}
                                                                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>

                                                        <p className="font-bold text-[#215732]">
                                                            {currency} {parseFloat(line.cost.totalAmount.amount).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {!isEmpty && (
                            <div className="border-t border-gray-200 dark:border-gray-800 p-6 space-y-4">
                                {/* Total */}
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        Subtotal
                                    </span>
                                    <span className="font-bold text-2xl text-[#215732]">
                                        {currency} {total.toFixed(2)}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                    Shipping and taxes calculated at checkout
                                </p>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={checkout}
                                        disabled={isUpdating}
                                        className="w-full bg-[#215732] text-white py-4 rounded-full font-bold hover:bg-[#1a4428] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        Checkout
                                        <ArrowRight className="w-5 h-5" />
                                    </button>

                                    <Link
                                        href="/cart"
                                        onClick={onClose}
                                        className="w-full block text-center py-3 rounded-full font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-300 dark:border-gray-700"
                                    >
                                        View Full Cart
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
