'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, RotateCcw, Loader2, ArrowRight, Clock } from 'lucide-react';
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

    const trendingSuggestions = [
        'Fun, easy to learn games for pre-teens',
        'K-beauty skincare for sensitive skin',
        'Best eco-friendly baby products',
        'Handmade Palestinian ceramics',
        'Traditional Olive Wood crafts'
    ];

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
            className={`z-[100] w-full absolute transition-all duration-500 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                } ${showSuggestions ? 'p-4 md:p-8 rounded-[40px] bg-white dark:bg-[#0d0d0d] shadow-[0px_24px_50px_rgba(0,0,0,0.1)] ring-1 ring-black/5 dark:ring-white/5' : ''}`}
        >
            {/* Search Input Container */}
            <div className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder={showSuggestions ? "" : "What are you shopping for today?"}
                    className={`w-full h-[64px] pl-6 pr-[70px] text-[18px] font-medium bg-transparent dark:text-white border-b-2 transition-all outline-none placeholder:text-gray-400 ${showSuggestions ? 'border-gray-100 dark:border-white/10' : 'border-transparent'}`}
                />
                <button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-[52px] h-[52px] bg-[#215732] rounded-full text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#215732]/20 group"
                >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />}
                </button>
            </div>

            {/* Suggestions/Results Section (Single Column) */}
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${showSuggestions ? 'max-h-[70vh] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
            >
                <div className="flex flex-col gap-8 pb-4">

                    {/* Header with History Icon */}
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[14px] font-bold text-gray-400">Suggestions</h3>
                        <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center hover:bg-gray-100 transition-colors">
                            <Clock className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    {/* Results List - No two columns */}
                    <div className="flex flex-col gap-6">

                        {/* Display real search results if query exists, else trending */}
                        {query.trim().length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {/* Collections (Linear) */}
                                {results.collections.length > 0 && (
                                    <div className="space-y-3">
                                        {results.collections.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/categories/${item.handle}`}
                                                className="flex items-center gap-4 p-2 rounded-[20px] hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[#215732]">
                                                    <GridIcon className="w-5 h-5" />
                                                </div>
                                                <span className="font-bold text-[16px] text-gray-900 dark:text-white group-hover:text-[#215732]">{item.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Products (Linear) */}
                                {results.products.length > 0 && (
                                    <div className="space-y-4">
                                        {results.products.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/product/${product.handle}`}
                                                className="flex items-center gap-5 p-3 rounded-[24px] hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
                                            >
                                                <div className="w-16 h-16 rounded-[20px] bg-gray-50 dark:bg-white/10 overflow-hidden flex-shrink-0 relative">
                                                    {product.image ? (
                                                        <Image src={product.image} alt={product.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-100"><ShoppingBagIcon className="w-6 h-6 text-gray-300" /></div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold text-[16px] text-gray-900 dark:text-white group-hover:text-[#215732] transition-colors line-clamp-1">{product.title}</span>
                                                    <span className="text-[14px] font-black text-[#215732]">{Number(product.price).toFixed(2)} {product.currencyCode}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {results.products.length === 0 && results.collections.length === 0 && !isLoading && (
                                    <div className="px-4 py-8 text-center bg-gray-50 dark:bg-white/5 rounded-[32px]">
                                        <p className="text-gray-400 font-bold">No results found for "{query}"</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Trending Suggestions (Linear list of pills) */
                            <div className="flex flex-col items-start gap-4">
                                {trendingSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setQuery(suggestion)}
                                        className="px-6 py-4 bg-[#f5f5f7] dark:bg-white/5 rounded-full text-[15px] font-bold text-gray-800 dark:text-gray-200 hover:scale-[1.02] active:scale-95 transition-all text-left max-w-full truncate"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}

function GridIcon({ className }: { className?: string }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
        </svg>
    )
}

function ShoppingBagIcon({ className }: { className?: string }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
    )
}