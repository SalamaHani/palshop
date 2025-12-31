'use client';

import React, { useEffect } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/view/ProductCard';
import { useRouter } from 'next/navigation';

export default function SavedPage() {
    const { wishlist, isLoading, wishlistCount, refreshWishlist } = useWishlist();
    const { isAuthenticated, isLoading: isAuthLoading, setIsAuthModalOpen } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            router.push('/');
            setIsAuthModalOpen(true);
        }
    }, [isAuthLoading, isAuthenticated, router, setIsAuthModalOpen]);

    useEffect(() => {
        if (isAuthenticated) {
            refreshWishlist();
        }
    }, [isAuthenticated, refreshWishlist]);

    if (isAuthLoading || (isLoading && wishlist.length === 0)) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#215732] animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Loading your treasures...</p>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    if (wishlistCount === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 max-w-7xl mx-auto">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner"
                >
                    <Heart className="w-12 h-12 text-gray-300" />
                </motion.div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Your wishlist is empty</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-10 text-center max-w-sm leading-relaxed">
                    Save items you love to find them easily later. Explore our community of artisans and find something special.
                </p>
                <Link
                    href="/"
                    className="group px-10 py-4 bg-[#215732] text-white font-bold rounded-2xl hover:bg-[#1a4527] transition-all shadow-xl shadow-[#215732]/20 flex items-center gap-3 active:scale-95"
                >
                    Start Exploring
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-2 h-8 bg-[#215732] rounded-full" />
                        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                            Saved
                        </h1>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium ml-5 italic">
                        {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} curated by you
                    </p>
                </div>

                <Link
                    href="/"
                    className="ml-5 md:ml-0 text-sm font-bold text-[#215732] hover:underline underline-offset-8 transition-all flex items-center gap-2"
                >
                    Back to Shop
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </header>

            <motion.div
                layout
                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-16"
            >
                <AnimatePresence mode="popLayout">
                    {wishlist.map((product) => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        >
                            <ProductCard product={product as any} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Bottom Section */}
            <div className="mt-24 pt-12 border-t border-gray-100 dark:border-white/5 flex flex-col items-center text-center">
                <div className="w-16 h-1 bg-gray-100 dark:bg-white/5 rounded-full mb-8" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 italic">Looking for more?</h2>
                <p className="text-gray-500 mb-8 max-w-sm">Our artisans are constantly adding new authentic Palestinian treasures.</p>
                <Link
                    href="/"
                    className="px-8 py-3 rounded-full border-2 border-gray-100 dark:border-white/10 text-gray-900 dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95"
                >
                    Browse New Arrivals
                </Link>
            </div>
        </div>
    );
}
