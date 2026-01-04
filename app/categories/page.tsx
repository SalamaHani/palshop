'use client';

import React from 'react';
import { useStorefrontQuery, useStorefrontInfiniteQuery } from '@/hooks/useStorefront';
import { GET_COLLECTIONS_QUERY } from '@/graphql/collections';
import { GET_PRODUCTS_QUERY } from '@/graphql/products';
import { GetCollectionsQuery, Product } from '@/types/shopify-graphql';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton, ProductCardSkeleton } from '@/components/ui/skeleton';
import { useInView } from 'react-intersection-observer';
import ProductCard from '@/components/view/ProductCard';
import { Loader2 } from 'lucide-react';

// Matching the reference image colors as closely as possible
const categoriesStyles: Record<string, string> = {
    'women': 'bg-[#9BA5A9]',
    'men': 'bg-[#003B8F]',
    'kids & baby': 'bg-[#FFB01F]',
    'kids': 'bg-[#FFB01F]',
    'home & living': 'bg-[#E65100]',
    'home': 'bg-[#E65100]',
    'accessories': 'bg-[#284B90]',
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
} as const;

export default function CategoriesPage() {
    const { ref, inView } = useInView();

    // 1. Fetch Categories
    const { data: allCollectionsData, isLoading: isCollectionsLoading } = useStorefrontQuery<GetCollectionsQuery>(
        ['collections-all'],
        {
            query: GET_COLLECTIONS_QUERY,
        }
    );

    // 2. Fetch Infinite Products (50 per page)
    const {
        data: productsData,
        isLoading: isProductsLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useStorefrontInfiniteQuery<{ products: any }>(
        ['all-products-infinite'],
        {
            query: GET_PRODUCTS_QUERY,
            variables: { first: 50 },
        },
        (lastPage) => {
            const pageInfo = lastPage?.products?.pageInfo;
            return pageInfo?.hasNextPage ? pageInfo.endCursor : null;
        }
    );

    React.useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allCollections = allCollectionsData?.collections?.edges || [];

    // Filter for specific categories requested
    const targetCategories = ["Women", "Men", "Kids & baby", "Home & Living", "Accessories"];
    const featuredCollections = allCollections
        .filter(edge => targetCategories.some(cat => edge.node.title.toLowerCase() === cat.toLowerCase()))
        .sort((a, b) => {
            const indexA = targetCategories.findIndex(cat => a.node.title.toLowerCase() === cat.toLowerCase());
            const indexB = targetCategories.findIndex(cat => b.node.title.toLowerCase() === cat.toLowerCase());
            return indexA - indexB;
        });

    const allProducts = productsData?.pages?.flatMap(page => page.products?.edges || []) || [];

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-32">
            {/* Header */}
            <header className="max-w-7xl mx-auto px-6 pt-16 pb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col items-start"
                >
                    <h1 className="text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-2">
                        Collections
                    </h1>
                    <div className="h-1.5 w-24 bg-[#215732] rounded-full mb-6" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl font-medium">
                        Explore our world of premium Palestinian craftsmanship. Find everything from modern apparel to traditional treasures.
                    </p>
                </motion.div>
            </header>

            {/* Section 1: Categories */}
            <div className="max-w-[1400px] mx-auto px-6 mb-32">
                <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Featured Categories</h2>
                    <div className="h-px flex-1 bg-gray-100 dark:bg-white/5" />
                </div>

                {isCollectionsLoading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-[200px] rounded-[2.5rem] w-full" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
                    >
                        {featuredCollections.map((edge) => {
                            const title = edge.node.title.toLowerCase();
                            const gradient = categoriesStyles[title] || 'bg-gray-400';

                            return (
                                <motion.div key={edge.node.id} variants={itemVariants}>
                                    <Link
                                        href={`/categories/${edge.node.handle}`}
                                        className="group block relative overflow-hidden rounded-[2.5rem] bg-gray-50 dark:bg-white/5 h-[240px] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                                    >
                                        {/* Background Color Layer */}
                                        <div className={`absolute inset-0 ${gradient} transition-transform duration-700 group-hover:scale-105`} />

                                        {/* Text Layer */}
                                        <div className="relative z-20 h-full flex flex-col justify-center px-8">
                                            <h2 className="text-2xl font-black text-white tracking-tight leading-tight w-1/2 drop-shadow-sm">
                                                {edge.node.title}
                                            </h2>
                                        </div>

                                        {/* Image Layer */}
                                        <div className="absolute right-0 bottom-0 top-0 w-[60%] pointer-events-none z-10">
                                            {edge.node.image && (
                                                <div className="relative w-full h-[110%] mt-[-5%] mr-[-5%] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2 origin-bottom-right">
                                                    <Image
                                                        src={edge.node.image.url}
                                                        alt={edge.node.title}
                                                        fill
                                                        className="object-contain object-right-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                                                        sizes="(max-w-768px) 50vw, 20vw"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>

            {/* Section 2: Products (Infinite Scroll 50 per page) */}
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Explore All Products</h2>
                    <div className="h-px flex-1 bg-gray-100 dark:bg-white/5" />
                </div>

                {isProductsLoading && allProducts.length === 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
                        {Array.from({ length: 12 }).map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
                        <AnimatePresence>
                            {allProducts.map((edge: any, idx) => (
                                <motion.div
                                    key={edge.node.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (idx % 24) * 0.02 }}
                                >
                                    <ProductCard product={edge.node as Product} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Loading Sensor */}
                <div ref={ref} className="h-40 flex items-center justify-center mt-10">
                    {isFetchingNextPage && (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-[#215732] animate-spin" />
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading more items...</p>
                        </div>
                    )}
                    {!hasNextPage && allProducts.length > 0 && (
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">You've reached the end</p>
                    )}
                </div>
            </div>
        </div>
    );
}
