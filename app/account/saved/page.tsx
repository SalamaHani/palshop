'use client';

import { Heart } from "lucide-react";
import Link from "next/link";

export default function AccountSavedPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <div className="w-2 h-8 bg-[#215732] rounded-full" />
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Saved Items</h1>
                <p className="text-[#677279] dark:text-gray-400 mt-2 font-medium">Manage your personal wishlist and favorites</p>
            </div>

            <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-3xl flex items-center justify-center mb-6 transform rotate-6 hover:rotate-0 transition-transform">
                    <Heart className="w-10 h-10 text-rose-300 dark:text-rose-500/20" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
                <p className="text-[#677279] dark:text-gray-400 mb-8 max-w-xs font-medium">
                    Start building your collection of authentic Palestinian treasures.
                </p>
                <Link
                    href="/categories"
                    className="inline-block px-10 py-4 bg-[#215732] text-white font-bold rounded-full hover:bg-[#1a4528] transition-all shadow-lg shadow-[#215732]/20"
                >
                    Explore Products
                </Link>
            </div>
        </div>
    );
}
