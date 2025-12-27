import React, { useState, useEffect } from 'react';
import { Search, RotateCcw } from 'lucide-react';

export default function ShopifySearchInput() {
    const [query, setQuery] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

    const suggestions = [
        'Fun, easy to learn games for pre-teens',
        'K-beauty skincare for sensitive skin',
        'Best eco-friendly baby products',
    ];

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 200);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Open suggestions on any keypress
        if (!showSuggestions) {
            setShowSuggestions(true);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        setSelectedSuggestion(suggestion);
    };

    const handleRefresh = () => {
        setQuery('');
        setSelectedSuggestion(null);
    };

    const handleSearch = () => {
        if (query.trim()) {
            console.log('Searching for:', query);
        }
    };

    return (
        <div
            className={` z-99999999    w-full  absolute ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 z-0 scale-95'
                } ${showSuggestions ? 'p-4  md:p-5  rounded-[32px]  bg-[rgba(255,255,255,0.9)] lg:max-h-[45dvh] lg:backdrop-blur-lg [box-shadow:0px_4px_24px_0_rgba(0,0,0,0.12),0_0_0_4.5px_rgba(0,0,0,0.04)] lg:[box-shadow:0px_4px_24px_0_rgba(0,0,0,0.12),0_0_0_4.5px_rgba(0,0,0,0.04)] ' : 'p-3 rounded-full'}`}
        >
            {/* Search Input */}
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => {
                        // Delay to allow suggestion click to register
                        setTimeout(() => setShowSuggestions(false), 100);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder={showSuggestions ? '' : 'What are you shopping for today?'}
                    className={`${showSuggestions ? ' rounded-full py-4 px-2 pl-3 p-space-8 text outline-1 outline-bg-overlay-fixed-light-20 focus:border-purple-500 w-full lg:overflow-hidden '
                        : ' rounded-[32px]  py-4 px-2 p-space-8 outline-4 outline-bg-overlay-fixed-light-20 lg:w-full lg:overflow-hidden lg:bg-bg-gray-300 lg:[box-shadow:0px_4px_24px_0_rgba(0,0,0,0.12),0_0_0_4.5px_rgba(0,0,0,0.04)] lg:outline lg:outline-4 lg:outline-bg-overlay-fixed-light-20 w-full lg:absolute lg:max-h-[45dvh] lg:backdrop-blur-lg bg-[rgba(255,255,255,0.9)] [box-shadow:0px_4px_24px_0_rgba(0,0,0,0.12),0_0_0_4.5px_rgba(0,0,0,0.04)]'}  `}
                />
                <button
                    onClick={handleSearch}
                    className="absolute right-2 top-7  -translate-y-1/2 p-3 bg-[#215732]  rounded-full text-white hover:scale-105 transition-transform duration-300 shadow-lg"
                >
                    <Search className="w-5 h-5" />
                </button>
            </div>


            {/* Suggestions Section */}
            <div
                className={`transition-all duration-500 ease-out overflow-hidden ${showSuggestions
                    ? 'max-h-[400px] opacity-100 translate-y-0 mt-6'
                    : 'max-h-0  opacity-0 translate-y-4 mt-0'
                    }`}

            >
                <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h3 className={` ${showSuggestions
                            ? ' opacity-100 '
                            : ' opacity-0 '
                            } text-gray-600 font-medium text-sm md:text-base`}>Suggestions</h3>
                        <button
                            onClick={handleRefresh}
                            className="p-1 hover:bg-gray-100  hover:rotate-180"
                            title="Refresh"
                        >
                            <RotateCcw className="w-3 h-3 text-gray-500" />
                        </button>
                    </div>

                    {/* Suggestion Pills */}
                    <div className="space-y-2">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className={` ${showSuggestions
                                    ? ' opacity-100 '
                                    : ' opacity-0 '
                                    } w-fit text-left px-2 md:px-2 cursor-pointer bg-gray-100 py-1 md:py-1 rounded-full text-xs  hover:scale-[1.02] active:scale-95 ${selectedSuggestion === suggestion
                                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-purple-300 shadow-md'
                                        : 'bg-gray-50 hover:bg-gray-50 border-2 border-transparent'
                                    }`}
                                style={{
                                    animation: showSuggestions ? `slideIn 0.4s ease-out ${index * 0.1}s both` : 'none'
                                }}
                            >
                                <span className="text-gray-800 font-medium text-sm md:text-base">{suggestion}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 0.6;
            transform: scale(1);
          }
        }
      `}</style>
        </div>
    );
}