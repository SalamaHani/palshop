'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function OrderConfirmationPage() {
    const searchParams = useSearchParams();
    const [orderNumber, setOrderNumber] = useState<string | null>(null);

    useEffect(() => {
        // Get order number from URL params
        const order = searchParams.get('order');
        if (order) {
            setOrderNumber(order);

            // Trigger confetti celebration
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 px-4">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="inline-block mb-8"
                    >
                        <div className="w-32 h-32 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-20 h-20 text-green-600 dark:text-green-400" />
                        </div>
                    </motion.div>

                    {/* Success Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Order Confirmed!
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                            Thank you for your purchase. Your order has been successfully placed.
                        </p>
                    </motion.div>

                    {/* Order Number */}
                    {orderNumber && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8"
                        >
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Order Number
                            </p>
                            <p className="text-3xl font-bold text-[#215732]">
                                #{orderNumber}
                            </p>
                        </motion.div>
                    )}

                    {/* What's Next */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            What's Next?
                        </h2>

                        <div className="space-y-6 text-left">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-[#215732] rounded-full flex items-center justify-center">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        Order Confirmation Email
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        You'll receive a confirmation email with your order details shortly.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-[#215732] rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold">2</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        Processing Your Order
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        We're preparing your items for shipment. You can track your order status in your account.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-[#215732] rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold">3</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        Shipping Updates
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        We'll send you tracking information once your order ships.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link
                            href="/account/orders"
                            className="inline-flex items-center justify-center gap-2 bg-[#215732] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#1a4428] transition-colors shadow-lg hover:shadow-xl"
                        >
                            View Order Details
                            <ArrowRight className="w-5 h-5" />
                        </Link>

                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-700"
                        >
                            <Home className="w-5 h-5" />
                            Continue Shopping
                        </Link>
                    </motion.div>

                    {/* Customer Support */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="mt-12 text-center text-gray-600 dark:text-gray-400"
                    >
                        <p className="mb-2">Need help with your order?</p>
                        <Link
                            href="/contact"
                            className="text-[#215732] font-semibold hover:underline"
                        >
                            Contact Customer Support
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
