'use client';

import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { cart, isLoading, updateItem, removeItem, cartCount, refreshCart, checkout, isCheckoutLoading } = useCart();
    const { isAuthenticated, isLoading: isAuthLoading, setIsAuthModalOpen } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            router.push('/');
            setIsAuthModalOpen(true);
        }
    }, [isAuthLoading, isAuthenticated, router, setIsAuthModalOpen]);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    if (isLoading && !cart) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#215732]"></div>
            </div>
        );
    }

    if (!cart || cartCount === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-gray-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
                    Looks like you haven't added anything to your cart yet. Explore our products and find something special.
                </p>
                <Link
                    href="/shop"
                    className="px-8 py-3 bg-[#215732] text-white font-semibold rounded-xl hover:bg-[#1a4527] transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-8 space-y-6">
                    <AnimatePresence mode="popLayout">
                        {cart.lines.edges.map(({ node: item }) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-6"
                            >
                                {/* Product Image */}
                                <div className="relative w-full sm:w-32 h-32 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.merchandise.product.images.edges[0]?.node.url || '/images/placeholder.jpg'}
                                        alt={item.merchandise.product.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Item Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Link
                                                href={`/product/${item.merchandise.product.handle}`}
                                                className="text-lg font-semibold text-gray-900 dark:text-white hover:text-[#215732] transition-colors"
                                            >
                                                {item.merchandise.product.title}
                                            </Link>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {item.merchandise.title !== 'Default Title' ? item.merchandise.title : ''}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1">
                                            <button
                                                onClick={() => updateItem(item.id, item.quantity - 1)}
                                                className="p-1 hover:text-[#215732] transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateItem(item.id, item.quantity + 1)}
                                                className="p-1 hover:text-[#215732] transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 dark:text-white text-lg">
                                                {item.cost.totalAmount.currencyCode} {parseFloat(item.cost.totalAmount.amount).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.merchandise.price.currencyCode} {item.merchandise.price.amount} each
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                                <span>Subtotal ({cartCount} items)</span>
                                <span>{cart.cost.subtotalAmount.currencyCode} {parseFloat(cart.cost.subtotalAmount.amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                                <span>Shipping</span>
                                <span className="text-green-600">Calculated at checkout</span>
                            </div>
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    {cart.cost.totalAmount.currencyCode} {parseFloat(cart.cost.totalAmount.amount).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={checkout}
                            disabled={isCheckoutLoading}
                            className="w-full py-4 bg-[#215732] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#1a4527] transition-all shadow-lg shadow-[#215732]/20 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isCheckoutLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="mt-6 flex flex-col items-center gap-4">
                            <p className="text-xs text-gray-500 text-center">
                                Secure checkout with Shopify. Prices include VAT where applicable.
                            </p>
                            <Link
                                href="/shop"
                                className="text-sm font-medium text-[#215732] hover:underline"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}