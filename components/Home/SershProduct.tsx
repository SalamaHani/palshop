'use client';

import React from 'react';
import { ArrowRight, Search as SearchIcon } from 'lucide-react';

export default function SershProduct() {
    return (
        <div className="pointer-events-auto z-10 mx-auto mt-8 flex w-full flex-col md:mt-6 md:max-w-[600px]">
            <div className="mx-auto w-full max-w-[90%] lg:max-w-full">
                <div className="relative">
                    <div className="relative lg:block lg:h-[66px] lg:w-full h-[66px]">
                        <div
                            data-testid="omnibox-container"
                            className="rounded-[32px] p-2 outline-4 outline-bg-overlay-fixed-light-20 lg:w-full lg:overflow-hidden lg:bg-white/90 lg:shadow-[0_4px_24px_0_rgba(0,0,0,0.12),0_0_0_4.5px_rgba(0,0,0,0.04)] lg:outline lg:outline-4 lg:absolute lg:max-h-[45vh] lg:backdrop-blur-lg bg-white/90 shadow-[0_4px_24px_0_rgba(0,0,0,0.12),0_0_0_4.5px_rgba(0,0,0,0.04)]"
                        >
                            <div data-search-mobile-state="closed">
                                <form>
                                    <div className="flex flex-row gap-4 bg-bg-fill lg:bottom-none lg:opacity-100 rounded-[32px] lg:!bg-transparent lg:shadow-none lg:p-0 lg:inset-x-2 lg:block shadow-sm border border-transparent p-0">
                                        <div className="relative flex w-full flex-col items-center lg:h-12">
                                            <input
                                                role="searchbox"
                                                autoComplete="off"
                                                data-testid="search-input"
                                                aria-label="Search products and stores"
                                                placeholder="What are you shopping for today?"
                                                className="lg:bg-gray-50 h-12 w-full bg-transparent px-4 py-1 text-gray-900 lg:rounded-full placeholder:text-gray-400 lg:pl-5 lg:pr-12 lg:placeholder:text-center focus:outline-none placeholder:text-center font-medium"
                                                type="search"
                                                name="search"
                                            />
                                            <div className="z-10 flex h-12 justify-end p-1 absolute right-0 w-12">
                                                <button
                                                    data-testid="search-submit-button"
                                                    className="group flex size-10 items-center justify-center rounded-full bg-[#215732] shadow-[0_4px_12px_0_rgba(33,87,50,0.3)] active:scale-95 lg:absolute lg:right-1"
                                                    type="submit"
                                                    aria-label="Submit search"
                                                >
                                                    <ArrowRight className="text-white group-hover:scale-110 transition-transform" size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}