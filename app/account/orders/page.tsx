'use client';

import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">My Orders</h1>
                <p className="text-[#677279] dark:text-gray-400 mt-2 font-medium">Track and manage your orders</p>
            </div>

            <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6 transform -rotate-3 transition-transform hover:rotate-0">
                    <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-white/10" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No orders found</h2>
                <p className="text-[#677279] dark:text-gray-400 mb-8 max-w-xs font-medium">
                    You haven't placed any orders yet. Once you do, they will appear here.
                </p>
                <Link
                    href="/shop"
                    className="inline-block px-10 py-4 bg-[#215732] text-white font-bold rounded-full hover:bg-[#1a4528] transition-all shadow-lg shadow-[#215732]/20"
                >
                    Check out the Shop
                </Link>
            </div>
        </div>
    );
}
