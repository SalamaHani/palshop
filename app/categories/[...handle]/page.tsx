"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useStorefrontQuery } from "@/hooks/useStorefront";
import { GET_COLLECTION_BY_HANDLE_WITH_PAGINATION_QUERY } from "@/graphql/collections";
import { GetCollectionByHandleQuery, Product } from "@/types/shopify-graphql";
import ProductCard from "@/components/view/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, LayoutGrid, Filter, ArrowLeft } from "lucide-react";

export default function CategoriesDetailPage() {
    const params = useParams();
    const handleSegments = params.handle as string[];
    const targetHandle = handleSegments[handleSegments.length - 1];

    // Pagination state
    const [currentCursor, setCurrentCursor] = useState<string | null>(null);
    const [previousCursors, setPreviousCursors] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, isError } = useStorefrontQuery<GetCollectionByHandleQuery>(
        ["categories-detail", targetHandle, currentCursor],
        {
            query: GET_COLLECTION_BY_HANDLE_WITH_PAGINATION_QUERY,
            variables: {
                handle: targetHandle,
                first: 12,
                after: currentCursor,
            },
        }
    );

    const handleNextPage = () => {
        if (data?.collection?.products?.pageInfo?.hasNextPage) {
            setPreviousCursors([...previousCursors, currentCursor as string]);
            setCurrentCursor(data.collection.products.pageInfo.endCursor || null);
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePreviousPage = () => {
        if (previousCursors.length > 0) {
            const prev = previousCursors[previousCursors.length - 1];
            setPreviousCursors(previousCursors.slice(0, -1));
            setCurrentCursor(prev);
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20">
                <Skeleton className="h-48 w-full rounded-[2.5rem] mb-12" />
                <div className="flex justify-between items-center mb-10">
                    <Skeleton className="h-10 w-48 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Skeleton key={index} className="h-[450px] w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError || !data?.collection) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-32 text-center">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6">Oops! Category not found</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg">The collection you're looking for might have been moved or renamed.</p>
                <Link href="/categories" className="inline-flex items-center gap-2 px-8 py-4 bg-[#215732] text-white rounded-full font-bold hover:scale-105 transition-transform shadow-xl shadow-[#215732]/20">
                    <ArrowLeft size={20} />
                    Back to Categories
                </Link>
            </div>
        );
    }

    const products = data.collection.products?.edges || [];
    const bannerImage = (data?.collection as any)?.image?.url;

    return (
        <div className="min-h-screen bg-white dark:bg-transparent pb-32">
            {/* dynamic Hero Banner */}
            <div className={`relative w-full h-[300px] md:h-[400px] overflow-hidden ${!bannerImage ? 'bg-gradient-to-br from-[#215732] to-[#1a4528]' : ''}`}>
                {bannerImage && (
                    <Image
                        src={bannerImage}
                        alt={(data.collection as any)?.image?.altText || data.collection.title}
                        fill
                        className="object-cover opacity-60 dark:opacity-40"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0a] via-transparent to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end pb-12 max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#215732] mb-4 dark:text-[#34d399]">
                        <Link href="/categories" className="hover:underline">Collections</Link>
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
                        {data.collection.title}
                    </motion.h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12">
                {/* Stats & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 dark:border-white/10 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl">
                            <LayoutGrid className="text-[#215732] dark:text-[#34d399]" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Available Products</p>
                            <h3 className="text-xl font-bold dark:text-white">{(data?.collection?.products?.edges?.length || 0)} {(data?.collection?.products?.edges?.length === 1 ? 'Item' : 'Items')}</h3>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl font-bold transition-colors">
                        <Filter size={20} />
                        Filter & Sort
                    </button>
                </div>

                {/* Product Grid */}
                <AnimatePresence mode="wait">
                    {products.length > 0 ? (
                        <motion.div
                            key={currentCursor || 'initial'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 xl:grid-cols-7 gap-x-6 gap-y-10"
                        >
                            {products.map((edge, idx) => (
                                <motion.div
                                    key={edge.node.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <ProductCard product={edge.node as Product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-32 bg-gray-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-white/10">
                            <p className="text-gray-400 text-2xl font-black uppercase tracking-widest">No products found</p>
                        </div>
                    )}
                </AnimatePresence>

                {/* Pagination */}
                {products.length > 0 && (
                    <div className="mt-20">
                        <Pagination>
                            <PaginationContent className="gap-4">
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={handlePreviousPage}
                                        className={`h-12 px-6 rounded-2xl font-bold transition-all ${previousCursors.length === 0
                                            ? "pointer-events-none opacity-30"
                                            : "cursor-pointer bg-gray-100 dark:bg-white/5 hover:bg-[#215732] hover:text-white"
                                            }`}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <div className="h-12 w-12 flex items-center justify-center bg-[#215732] text-white rounded-2xl font-black shadow-lg shadow-[#215732]/30">
                                        {currentPage}
                                    </div>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={handleNextPage}
                                        className={`h-12 px-6 rounded-2xl font-bold transition-all ${!data.collection.products.pageInfo.hasNextPage
                                            ? "pointer-events-none opacity-30"
                                            : "cursor-pointer bg-gray-100 dark:bg-white/5 hover:bg-[#215732] hover:text-white"
                                            }`}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    );
}
