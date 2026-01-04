'use client';

import React from 'react';
import { useStorefrontQuery } from '@/hooks/useStorefront';
import { GET_COLLECTIONS_QUERY } from '@/graphql/collections';
import { GetCollectionsQuery } from '@/types/shopify-graphql';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import MenuCategories from '@/components/view/MenuCategories';

// Matching the reference image colors as closely as possible
const categoriesStyles = [
    { gradient: 'bg-[#9BA5A9]', text: 'Women' }, // Grey-ish
    { gradient: 'bg-[#003B8F]', text: 'Men' },   // Deep Blue
    { gradient: 'bg-[#FF416C]', text: 'Beauty' }, // Hot Pink
    { gradient: 'bg-[#B48FFF]', text: 'Food & drinks' }, // Lavender
    { gradient: 'bg-[#FFB01F]', text: 'Baby & toddler' }, // Yellow/Orange
    { gradient: 'bg-[#E65100]', text: 'Home' },   // Deep Orange
    { gradient: 'bg-[#A5C3A7]', text: 'Fitness & nutrition' }, // Muted Green
    { gradient: 'bg-[#284B90]', text: 'Accessories' }, // Royal Blue
];

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
    const [activeMenu, setActiveMenu] = React.useState('women');
    const { data: allCollectionsData, isLoading: isAllLoading } = useStorefrontQuery<GetCollectionsQuery>(
        ['collections-all'],
        {
            query: GET_COLLECTIONS_QUERY,
        }
    );

    const categories = [
        { id: 'women', label: 'Women' },
        { id: 'men', label: 'Men' },
        { id: 'baby-toddler', label: 'Baby' },
        { id: 'home', label: 'Home' },
    ];

    const allCollections = allCollectionsData?.collections?.edges || [];

    // Grouping Logic
    const groupedCollections: Record<string, { parent?: any; children: any[] }> = {};

    allCollections.forEach((edge) => {
        const title = edge.node.title;
        // Supports "Parent / Child", "Parent > Child", or "Parent - Child"
        const parts = title.split(/\s*[\/\>\-]\s*/);

        if (parts.length > 1) {
            const parentName = parts[0];
            const childName = parts.slice(1).join(' / ');

            if (!groupedCollections[parentName]) {
                groupedCollections[parentName] = { children: [] };
            }
            groupedCollections[parentName].children.push({
                ...edge.node,
                displayTitle: childName
            });
        } else {
            if (!groupedCollections[title]) {
                groupedCollections[title] = { children: [] };
            }
            groupedCollections[title].parent = edge.node;
        }
    });

    const curatedIds = categories.map(c => c.id);
    const displayGroups = Object.entries(groupedCollections)
        .filter(([name]) => !curatedIds.includes(name.toLowerCase())) // Exclude featured categories
        .map(([name, group]) => ({
            name,
            ...group
        }));

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

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-6">
                {isAllLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-64 rounded-[2.5rem] w-full" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-24">
                        {/* Dynamic Curated Section */}
                        <section>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 bg-[#215732] rounded-full" />
                                        <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                            Curated {categories.find(c => c.id === activeMenu)?.label}
                                        </h2>
                                    </div>
                                    <p className="text-gray-500 font-medium max-w-md">
                                        Hand-picked collections featuring the finest Palestinian craftsmanship for {activeMenu}.
                                    </p>
                                </div>

                                {/* High-End Switcher */}
                                <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm self-start">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveMenu(cat.id)}
                                            className={`px-6 py-2.5 rounded-full text-sm font-black transition-all duration-500 uppercase tracking-wider ${activeMenu === cat.id
                                                ? 'bg-[#215732] text-white shadow-xl shadow-[#215732]/30 scale-105'
                                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-white/5'
                                                }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeMenu}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    <MenuCategories handle={activeMenu} />
                                </motion.div>
                            </AnimatePresence>
                        </section>

                        <section>
                            <div className="flex items-center gap-4 mb-10">
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">All Collections</h2>
                                <div className="h-[2px] flex-1 bg-gray-100 dark:bg-white/5" />
                            </div>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {displayGroups.map((group, index) => {
                                    const styleIndex = index % categoriesStyles.length;
                                    const currentStyle = categoriesStyles[styleIndex];
                                    const mainCollection = group.parent || group.children[0];

                                    return (
                                        <motion.div key={group.name} variants={itemVariants} className="group">
                                            <div className={`relative overflow-hidden rounded-[2.5rem] ${currentStyle.gradient} min-h-[16rem] p-10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1`}>
                                                {/* Background Pattern */}
                                                <div className="absolute inset-0 opacity-10 pointer-events-none">
                                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white blur-[80px] rounded-full -mr-20 -mt-20" />
                                                </div>

                                                <div className="relative z-10 flex flex-col h-full justify-between">
                                                    <div>
                                                        <h2 className="text-4xl font-black text-white tracking-tight mb-4 drop-shadow-sm">
                                                            {group.name}
                                                        </h2>

                                                        {/* Sub-categories List */}
                                                        <div className="flex flex-wrap gap-2 mb-6">
                                                            {group.children.map((child) => (
                                                                <Link
                                                                    key={child.id}
                                                                    href={`/categories/${child.handle}`}
                                                                    className="px-4 py-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white text-xs font-bold transition-colors border border-white/10"
                                                                >
                                                                    {child.displayTitle}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <Link
                                                        href={`/categories/${mainCollection.handle}`}
                                                        className="group/btn w-fit flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all shadow-lg active:scale-95"
                                                    >
                                                        Explore
                                                        <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                                    </Link>
                                                </div>

                                                {/* Image Cutout */}
                                                <div className="absolute right-0 bottom-0 top-0 w-[45%] flex items-center justify-end pointer-events-none">
                                                    {mainCollection.image && (
                                                        <div className="relative w-full h-[110%] mr-[-5%] mb-[-5%] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2">
                                                            <Image
                                                                src={mainCollection.image.url}
                                                                alt={mainCollection.title}
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
                            </motion.div>
                        </section>
                    </div>
                )}
            </div>

            {/* Footer Browse Help */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="max-w-7xl mx-auto px-6 mt-20"
            >
                <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100 dark:border-white/10">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Can't find what you're looking for?</h3>
                        <p className="text-gray-500 dark:text-gray-400">Our customer support team is always ready to help you discover the perfect item.</p>
                    </div>
                    <Link
                        href="/categories"
                        className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold hover:scale-105 transition-transform"
                    >
                        Browse All Store
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
