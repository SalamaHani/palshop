'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, RotateCcw, Loader2, ShoppingBag, Grid } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';

interface ProductResult {
    id: string;
    title: string;
    handle: string;
    image: string;
    price: string;
    currencyCode: string;
}

interface CollectionResult {
    id: string;
    title: string;
    handle: string;
    image: string;
}

export default function ShopifySearchInput() {
    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebounce(query, 300);
    const [isVisible, setIsVisible] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<{ products: ProductResult[]; collections: CollectionResult[] }>({
        products: [],
        collections: []
    });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 200);

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (!debouncedQuery.trim()) {
                setResults({ products: [], collections: [] });
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
                const data = await response.json();
                if (response.ok) {
                    setResults(data);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    const handleRefresh = () => {
        setQuery('');
        setResults({ products: [], collections: [] });
    };

    const handleSearch = () => {
        if (query.trim()) {
            window.location.href = `/shop?q=${encodeURIComponent(query)}`;
        }
    };

    return (
        <div
            ref={containerRef}
            className={`z-[100] w-full absolute transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                } ${showSuggestions ? 'p-4 md:p-6 rounded-[32px] bg-white dark:bg-[#0a0a0a] shadow-[0px_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5 dark:ring-white/5' : ''}`}
        >
            {/* Search Input */}
            <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search for garments, accessories, or collectibles..."
                    className={`w-full h-[64px] pl-14 pr-16 text-[16px] font-medium bg-[#f5f5f7] dark:bg-white/5 border-none rounded-[20px] focus:ring-2 focus:ring-[#215732] focus:bg-white dark:focus:bg-gray-900 transition-all outline-none placeholder:text-gray-500`}
                />
                <button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-6 h-[48px] bg-[#215732] rounded-[16px] text-white font-bold hover:bg-[#1a4527] transition-all flex items-center gap-2 shadow-lg shadow-[#215732]/20"
                >
                    <span className="hidden md:block">Search</span>
                    <Search className="w-4 h-4" />
                </button>
            </div>

            {/* Suggestions/Results Section */}
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${showSuggestions ? 'max-h-[60vh] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}
                style={{ maxHeight: showSuggestions ? '60vh' : '0px' }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-4 pr-2 scrollbar-hide overflow-y-auto max-h-[55vh]">

                    {/* Collections Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-[12px] font-black uppercase tracking-widest text-gray-400">Collections</h3>
                            <button onClick={handleRefresh} className="p-1 hover:rotate-180 transition-all duration-500">
                                <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {results.collections.length > 0 ? (
                                results.collections.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/categories/${item.handle}`}
                                        className="flex items-center gap-4 p-3 rounded-[16px] hover:bg-[#f5f5f7] dark:hover:bg-white/5 transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/10 overflow-hidden flex-shrink-0 relative border border-gray-100 dark:border-white/5">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <Grid className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                                            )}
                                        </div>
                                        <span className="font-bold text-[14px] text-gray-900 dark:text-white group-hover:text-[#215732] transition-colors line-clamp-1">{item.title}</span>
                                    </Link>
                                ))
                            ) : query ? (
                                <p className="text-sm font-medium text-gray-400 px-3 italic">No matching collections</p>
                            ) : (
                                <div className="space-y-1">
                                    {['Traditional Wear', 'Jewelry', 'Artisanal Crafts', 'New Arrivals'].map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setQuery(tag)}
                                            className="block w-full text-left px-4 py-2.5 text-[14px] font-bold text-gray-700 dark:text-gray-300 hover:text-[#215732] hover:bg-[#f5f5f7] dark:hover:bg-white/5 rounded-xl transition-all"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Products Column */}
                    <div className="lg:col-span-8 space-y-6">
                        <h3 className="text-[12px] font-black uppercase tracking-widest text-gray-400 px-1">Products</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {results.products.length > 0 ? (
                                results.products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.handle}`}
                                        className="flex items-center gap-4 p-3 rounded-[20px] border border-transparent hover:border-gray-100 dark:hover:border-white/10 hover:bg-white dark:hover:bg-white/5 hover:shadow-xl hover:shadow-black/5 transition-all group overflow-hidden"
                                    >
                                        <div className="w-16 h-16 rounded-[16px] bg-[#f5f5f7] dark:bg-white/10 overflow-hidden flex-shrink-0 relative border border-gray-100 dark:border-white/5">
                                            {product.image ? (
                                                <Image src={product.image} alt={product.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <ShoppingBag className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                            <span className="font-bold text-[14px] text-gray-900 dark:text-white group-hover:text-[#215732] transition-colors line-clamp-1">{product.title}</span>
                                            <span className="text-[13px] font-black text-[#215732]">{Number(product.price).toFixed(2)} {product.currencyCode}</span>
                                        </div>
                                    </Link>
                                ))
                            ) : query ? (
                                <p className="text-sm font-medium text-gray-400 px-3 col-span-2 italic">
                                    {isLoading ? 'Searching...' : `No products found for "${query}"`}
                                </p>
                            ) : (
                                <div className="col-span-2 grid grid-cols-2 gap-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-20 bg-[#f5f5f7] dark:bg-white/5 rounded-[20px] animate-pulse" />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}