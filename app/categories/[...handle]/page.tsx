"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useStorefrontInfiniteQuery } from "@/hooks/useStorefront";
import { GET_COLLECTION_BY_HANDLE_WITH_PAGINATION_QUERY } from "@/graphql/collections";
import { GetCollectionByHandleQuery, Product } from "@/types/shopify-graphql";
import ProductCard from "@/components/view/ProductCard";
import { Skeleton, ProductCardSkeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, LayoutGrid, Filter, ArrowLeft, Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import MenuCategories from "@/components/view/MenuCategories";

export default function CategoriesDetailPage() {
    const params = useParams();
    const handleSegments = params.handle as string[];
    const targetHandle = handleSegments[handleSegments.length - 1];

    const { ref, inView } = useInView();

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useStorefrontInfiniteQuery<GetCollectionByHandleQuery>(
        ["categories-detail-infinite", targetHandle],
        {
            query: GET_COLLECTION_BY_HANDLE_WITH_PAGINATION_QUERY,
            variables: {
                handle: targetHandle,
                first: 12,
            },
        },
        (lastPage) => {
            const pageInfo = lastPage?.collection?.products?.pageInfo;
            return pageInfo?.hasNextPage ? pageInfo.endCursor : null;
        }
    );

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20">
                <Skeleton className="h-[300px] md:h-[400px] w-full rounded-[3rem] mb-12" />
                <div className="flex justify-between items-center mb-10">
                    <div className="flex gap-4">
                        <Skeleton className="h-12 w-12 rounded-2xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>
                    <Skeleton className="h-12 w-32 rounded-2xl" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-x-4 gap-y-10">
                    {Array.from({ length: 14 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (isError || !data?.pages[0]?.collection) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-32 text-center">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6">Oops! Collection not found</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg">The collection you're looking for might have been moved or renamed.</p>
                <Link href="/categories" className="inline-flex items-center gap-2 px-8 py-4 bg-[#215732] text-white rounded-full font-bold hover:scale-105 transition-transform shadow-xl shadow-[#215732]/20">
                    <ArrowLeft size={20} />
                    Back to Categories
                </Link>
            </div>
        );
    }

    const firstPage = data.pages[0];
    const bannerImage = (firstPage.collection as any)?.image?.url;
    const allProducts = data.pages.flatMap(page => page.collection?.products?.edges || []);

    return (
        <div className="min-h-screen bg-white dark:bg-transparent pb-32">
            {/* dynamic Hero Banner */}
            <div className={`relative w-full h-[300px] md:h-[400px] overflow-hidden ${!bannerImage ? 'bg-gradient-to-br from-[#215732] to-[#1a4528]' : ''}`}>
                {bannerImage && (
                    <Image
                        src={bannerImage}
                        alt={(firstPage?.collection as any)?.image?.altText || firstPage?.collection?.title || "Collection"}
                        fill
                        className="object-cover opacity-60 dark:opacity-40"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0a] via-transparent to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end pb-12 max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#215732] mb-4 dark:text-[#34d399]">
                        <Link href="/categories" className="hover:underline">Categories</Link>
                        {handleSegments.map((seg, i) => (
                            <React.Fragment key={i}>
                                <ChevronRight size={14} className="text-gray-400" />
                                <span className={i === handleSegments.length - 1 ? "text-gray-900 dark:text-white" : ""}>
                                    {seg}
                                </span>
                            </React.Fragment>
                        ))}
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white capitalize drop-shadow-sm"
                    >
                        {firstPage?.collection?.title}
                    </motion.h1>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 mt-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 dark:border-white/10 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl">
                            <LayoutGrid className="text-[#215732] dark:text-[#34d399]" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Available Products</p>
                            <h3 className="text-xl font-bold dark:text-white">{allProducts.length} Items</h3>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl font-bold transition-colors">
                        <Filter size={20} />
                        Filter & Sort
                    </button>
                </div>

                {/* Curated Sub-collections if handle matches */}
                {(targetHandle === 'women' || targetHandle === 'men' || targetHandle === 'home') && (
                    <div className="mb-24 py-12">
                        <div className="flex items-center gap-4 mb-10">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Explore {targetHandle} categories</h2>
                            <div className="h-px flex-1 bg-gray-100 dark:bg-white/5" />
                        </div>
                        <MenuCategories handle={targetHandle} />
                    </div>
                )}

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-x-4 gap-y-10">
                    <AnimatePresence>
                        {allProducts.map((edge, idx) => (
                            <motion.div
                                key={edge.node.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (idx % 12) * 0.05 }}
                            >
                                <ProductCard product={edge.node as Product} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {allProducts.length === 0 && (
                    <div className="text-center py-32 bg-gray-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-white/10">
                        <p className="text-gray-400 text-2xl font-black uppercase tracking-widest">No products found</p>
                    </div>
                )}

                {/* Loading Sensor */}
                <div ref={ref} className="h-20 flex items-center justify-center mt-10">
                    {isFetchingNextPage && (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-[#215732] animate-spin" />
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading more...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
