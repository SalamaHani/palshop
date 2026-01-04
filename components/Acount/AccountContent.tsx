'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { ShoppingBag, MapPin, Heart, Shield, Clock } from "lucide-react";
import Link from "next/link";

export function AccountContent() {
    const { customer } = useAuth();
    const { wishlistCount } = useWishlist();

    return (
        <div className="flex flex-col gap-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    Hello, <span className="text-[#215732]">
                        {customer?.firstName || customer?.email?.split('@')[0]}
                    </span>
                </h1>
                <p className="text-[#677279] dark:text-gray-400 mt-2 font-medium">
                    Welcome to your personal dashboard. Manage your orders and preferences here.
                </p>
            </div>

            {/* Stats/Quick Glance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/account/orders" className="bg-white dark:bg-[#0d0d0d] p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col gap-3 hover:border-[#215732]/20 transition-all group">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShoppingBag className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{customer?.orderCount || 0}</p>
                        <p className="text-sm font-semibold text-[#677279] dark:text-gray-400">Total Orders</p>
                    </div>
                </Link>

                <Link href="/account/saved" className="bg-white dark:bg-[#0d0d0d] p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col gap-3 hover:border-rose-200 dark:hover:border-rose-500/20 transition-all group">
                    <div className="w-12 h-12 bg-rose-50 dark:bg-rose-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Heart className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{wishlistCount || 0}</p>
                        <p className="text-sm font-semibold text-[#677279] dark:text-gray-400">Wishlist Items</p>
                    </div>
                </Link>

                <Link href="/account/addresses" className="bg-white dark:bg-[#0d0d0d] p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col gap-3 hover:border-blue-200 dark:hover:border-blue-500/20 transition-all group">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{customer?.addressCount || 0}</p>
                        <p className="text-sm font-semibold text-[#677279] dark:text-gray-400">Saved Addresses</p>
                    </div>
                </Link>
            </div>

            {/* Account Security Card */}
            <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-[#215732]" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Account Security</h2>
                    </div>
                    <Link href="/account/settings" className="text-sm font-bold text-[#215732] hover:underline">Manage Settings</Link>
                </div>
                <div className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 rounded-full flex items-center justify-center border border-gray-200/50 dark:border-white/10">
                            <span className="text-2xl font-bold text-[#215732]">
                                {customer?.email?.[0]?.toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{customer?.email}</p>
                            <p className="text-sm font-medium text-[#677279] dark:text-gray-400 flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                Secure Passkey Authentication Active
                            </p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                            <p className="text-xs font-bold text-[#677279] dark:text-gray-500 uppercase tracking-widest mb-1.5">Primary Email</p>
                            <p className="font-bold text-gray-900 dark:text-white">{customer?.email}</p>
                        </div>
                        <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                            <p className="text-xs font-bold text-[#677279] dark:text-gray-500 uppercase tracking-widest mb-1.5">Login Method</p>
                            <p className="font-bold text-[#215732]">Shopify Secure</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
