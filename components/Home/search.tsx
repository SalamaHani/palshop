'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Loader2, ArrowRight, Clock } from 'lucide-react';
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
            className={`z-[100] w-full absolute transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                } ${showSuggestions
                    ? 'p-4 md:p-6 rounded-[40px] bg-white dark:bg-[#0a0a09] shadow-[0px_20px_60px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.03] dark:ring-white/[0.05]'
                    : 'p-0.5 rounded-full'}`}
        >
            {/* Search Input Container - Professional Pill Style */}
            <div className={`relative flex items-center transition-all duration-500 overflow-hidden ${!showSuggestions ? 'bg-white dark:bg-white/[0.03] rounded-full shadow-[0px_8px_30px_rgba(0,0,0,0.06)] ring-[4.5px] ring-black/[0.02] dark:ring-white/[0.02]' : ''}`}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="What are you shopping for today?"
                    className={`w-full h-[72px] bg-transparent text-gray-700 dark:text-white font-medium text-[16px] md:text-[18px] transition-all outline-none placeholder:text-gray-400/80 ${showSuggestions ? 'pl-4 border-b border-gray-100 dark:border-white/10' : 'pl-10 text-center pr-[80px]'}`}
                />

                <button
                    onClick={handleSearch}
                    className={`absolute right-2.5 w-[56px] h-[56px] bg-[#215732] rounded-full text-white flex items-center justify-center hover:bg-[#1a4528] active:scale-95 transition-all duration-300 shadow-[0px_4px_15px_rgba(33,87,50,0.3)] z-10 ${showSuggestions ? 'top-1/2 -translate-y-1/2' : ''}`}
                >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-white/90" /> : <ArrowRight className="w-6 h-6" />}
                </button>
            </div>

            {/* Suggestions/Results Section */}
            <div
                className={`transition-all duration-500 ease-in-out overflow-y-auto scrollbar-professional ${showSuggestions ? 'max-h-[65vh] opacity-100 mt-8' : 'max-h-0 opacity-0 mt-0'}`}
            >
                <div className="flex flex-col gap-8 pb-10 px-2 lg:px-4">
                    {/* Header with History Icon */}
                    <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-[#0a0a09] z-20 pb-4 pt-1">
                        <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-400">Suggestions</h3>
                        <div
                            className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center shadow-inner cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={handleRefresh}
                        >
                            <Clock className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col gap-4">
                        {query.trim().length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {/* Collection List */}
                                {results.collections.length > 0 && (
                                    <div className="space-y-2">
                                        {results.collections.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/categories/${item.handle}`}
                                                className="flex items-center gap-4 p-3 rounded-[20px] hover:bg-[#f8f9fa] dark:hover:bg-white/5 transition-all group"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                                                    <GridIcon className="w-5 h-5 text-[#215732]" />
                                                </div>
                                                <span className="font-bold text-[16px] text-gray-900 dark:text-gray-100 group-hover:text-[#215732]">{item.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Product List */}
                                {results.products.length > 0 && (
                                    <div className="space-y-3">
                                        {results.products.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/product/${product.handle}`}
                                                className="flex items-center gap-3 p-3.5 rounded-[20px] bg-white hover:bg-[#f8f9fa] dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-[#215732]/20 hover:shadow-xl hover:shadow-black/[0.03] transition-all group"
                                            >
                                                <div className="w-10 h-10 rounded-[18px] bg-gray-50 dark:bg-white/10 overflow-hidden flex-shrink-0 relative">
                                                    {product.image ? (
                                                        <Image src={product.image} alt={product.title} fill className="object-cover rounded-full group-hover:scale-105 transition-transform duration-700" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center"><ShoppingBagIcon className="w-6 h-6 text-gray-200" /></div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-bold text-sm text-gray-900 dark:text-gray-100 group-hover:text-[#215732] line-clamp-1">{product.title}</span>
                                                    <span className="text-[14px] font-black text-[#215732] flex items-center gap-1.5">
                                                        {Number(product.price).toFixed(2)}
                                                        <span className="text-xs opacity-60">{product.currencyCode}</span>
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Trending Pills Column */
                            <div className="flex flex-col items-start gap-4">
                                {trendingSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setQuery(suggestion)}
                                        className="px-6 py-4 bg-[#f1f3f5] dark:bg-white/5 rounded-full text-[15px] font-bold text-gray-800 dark:text-gray-200 hover:bg-[#e9ecef] dark:hover:bg-white/10 hover:scale-[1.01] active:scale-[0.98] transition-all text-left max-w-full"
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
                .scrollbar-professional::-webkit-scrollbar {
                    width: 5px;
                }
                .scrollbar-professional::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-professional::-webkit-scrollbar-thumb {
                    background: rgba(33, 87, 50, 0.1);
                    border-radius: 20px;
                }
                .scrollbar-professional::-webkit-scrollbar-thumb:hover {
                    background: rgba(33, 87, 50, 0.2);
                }
                
                /* Dark mode scrollbar */
                :global(.dark) .scrollbar-professional::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                }
                :global(.dark) .scrollbar-professional::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
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