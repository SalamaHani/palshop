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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[180px] rounded-[2.5rem] w-full" />
                ))}
            </div>
        );
    }

    const menuItems = data?.menu?.items || [];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item, index) => {
                const styleIndex = index % categoriesStyles.length;
                const currentStyle = categoriesStyles[styleIndex];
                const collection = item.resource;

                if (!collection || !('handle' in collection)) return null;

                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link
                            href={`/categories/${collection.handle}`}
                            className="group block relative overflow-hidden rounded-[2.5rem] h-[180px] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                        >
                            {/* Background Color */}
                            <div className={`absolute inset-0 ${currentStyle.gradient} transition-transform duration-700 group-hover:scale-105`} />

                            {/* Title Section */}
                            <div className="relative z-20 h-full flex flex-col justify-center px-8">
                                <h2 className="text-2xl font-black text-white tracking-tight leading-tight w-1/2 drop-shadow-sm">
                                    {item.title}
                                </h2>
                            </div>

                            {/* Collection Image */}
                            <div className="absolute right-0 bottom-0 top-0 w-[55%] pointer-events-none z-10">
                                {collection.image && (
                                    <div className="relative w-full h-[110%] mt-[-5%] mr-[-5%] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2 origin-bottom-right">
                                        <Image
                                            src={collection.image.url}
                                            alt={collection.title}
                                            fill
                                            className="object-contain object-right-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                                            sizes="(max-w-768px) 50vw, 25vw"
                                        />
                                    </div>
                                )}
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}
