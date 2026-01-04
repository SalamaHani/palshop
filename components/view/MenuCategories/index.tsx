'use client';

import React from 'react';
import { useStorefrontQuery } from '@/hooks/useStorefront';
import { GET_MENU_QUERY } from '@/graphql/collections';
import { GetMenuQuery } from '@/types/menu';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface MenuCategoriesProps {
    handle: string;
}

const categoriesStyles = [
    { gradient: 'bg-[#9BA5A9]' },
    { gradient: 'bg-[#003B8F]' },
    { gradient: 'bg-[#FF416C]' },
    { gradient: 'bg-[#B48FFF]' },
    { gradient: 'bg-[#FFB01F]' },
    { gradient: 'bg-[#E65100]' },
];

export default function MenuCategories({ handle }: MenuCategoriesProps) {
    const { data, isLoading } = useStorefrontQuery<GetMenuQuery>(
        ['menu', handle],
        {
            query: GET_MENU_QUERY,
            variables: { handle },
        }
    );

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-[2.5rem] w-full" />
                ))}
            </div>
        );
    }

    const menuItems = data?.menu?.items || [];

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuItems.map((item, index) => {
                    const styleIndex = index % categoriesStyles.length;
                    const currentStyle = categoriesStyles[styleIndex];
                    const collection = item.resource;

                    if (!collection || !('handle' in collection)) return null;

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className={`relative overflow-hidden rounded-[2.5rem] ${currentStyle.gradient} min-h-[18rem] p-10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1`}>
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <h2 className="text-4xl font-black text-white tracking-tight mb-4 drop-shadow-sm">
                                            {item.title}
                                        </h2>

                                        {/* Sub-items if any */}
                                        {item.items && item.items.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {item.items.map((subItem) => {
                                                    const subCollection = subItem.resource;
                                                    const href = subCollection?.handle
                                                        ? `/categories/${subCollection.handle}`
                                                        : subItem.url.replace(/^https?:\/\/[^\/]+/, '');

                                                    return (
                                                        <Link
                                                            key={subItem.id}
                                                            href={href}
                                                            className="px-4 py-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white text-xs font-bold transition-colors border border-white/10"
                                                        >
                                                            {subItem.title}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href={`/categories/${collection.handle}`}
                                        className="group/btn w-fit flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all shadow-lg active:scale-95"
                                    >
                                        Explore
                                        <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </Link>
                                </div>

                                {/* Collection Image */}
                                <div className="absolute right-0 bottom-0 top-0 w-[50%] flex items-center justify-end pointer-events-none">
                                    {collection.image && (
                                        <div className="relative w-full h-[110%] mr-[-5%] mb-[-5%] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2">
                                            <Image
                                                src={collection.image.url}
                                                alt={collection.title}
                                                fill
                                                className="object-contain object-right-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                                sizes="(max-w-768px) 100vw, 40vw"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
