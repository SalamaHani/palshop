'use client';

import { useState } from 'react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/lib/products';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import AllCollections from '@/components/view/AllCollections';

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('featured');

    const filteredProducts = products.filter(
        (product) =>
            selectedCategory === 'all' ||
            product.category.toLowerCase() === selectedCategory
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0a0a0a] dark:via-[#0f0f0f] dark:to-[#0a0a0a]">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-[#215732] to-[#34d399] bg-clip-text text-transparent">
                            Our Collection
                        </span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Discover authentic Palestinian products
                    </p>
                </div>

                {/* Filters and Controls */}
                <div className="mb-8 space-y-4">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category.slug}
                                onClick={() => setSelectedCategory(category.slug)}
                                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${selectedCategory === category.slug
                                    ? 'bg-gradient-to-r from-[#215732] to-[#34d399] text-white shadow-lg scale-105'
                                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Sort and View Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:outline-none focus:ring-2 focus:ring-[#215732] dark:focus:ring-[#34d399]"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                    ? 'bg-[#215732] dark:bg-[#34d399] text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                                    ? 'bg-[#215732] dark:bg-[#34d399] text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400">
                            {filteredProducts.length} products found
                        </p>
                    </div>
                </div>

                {/* Products Grid/List */}
                <div
                    className={`${viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                        : 'flex flex-col gap-4'
                        }`}
                >
                    {filteredProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className="animate-fadeIn"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Try adjusting your filters
                        </p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
