'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Heart, Bookmark, CreditCard, Package, Settings, HelpCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AccountPage() {
    const { customer, isAuthenticated, isLoading, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#215732]"></div>
            </div>
        );
    }

    if (!customer) {
        return null;
    }

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const getInitials = () => {
        if (customer.firstName && customer.lastName) {
            return `${customer.firstName[0]}${customer.lastName[0]}`.toUpperCase();
        }
        return customer.email[0].toUpperCase();
    };

    const menuItems = [
        { icon: Heart, label: 'Following', href: '/account/following' },
        { icon: Bookmark, label: 'Saved', href: '/account/saved' },
        { icon: CreditCard, label: 'Installments', href: '/account/installments' },
        { icon: Package, label: 'Subscriptions', href: '/account/subscriptions' },
        { icon: Package, label: 'Order history', href: '/account/orders' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
                            {/* Profile Section */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                                <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xl font-semibold text-gray-700 dark:text-gray-300">
                                    {getInitials()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {customer.email}
                                    </p>
                                </div>
                            </div>

                            {/* Account Menu */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <User className="w-5 h-5 text-gray-900 dark:text-white" />
                                    <h2 className="font-semibold text-gray-900 dark:text-white">Account</h2>
                                </div>
                                <nav className="space-y-1">
                                    {menuItems.map((item) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <item.icon className="w-4 h-4" />
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                            {/* Settings */}
                            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                                <Link
                                    href="/account/settings"
                                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span className="text-sm">Settings</span>
                                </Link>
                            </div>

                            {/* Contact */}
                            <div className="mb-4">
                                <Link
                                    href="/contact"
                                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <HelpCircle className="w-5 h-5" />
                                    <span className="text-sm">Contact</span>
                                </Link>
                            </div>

                            {/* Sign Out */}
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Sign Out</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-9"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Saved Card */}
                            <Link href="/account/saved">
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                    <div className="flex flex-col items-center justify-center h-48">
                                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Bookmark className="w-10 h-10 text-[#215732] dark:text-[#2d7a48]" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Saved</h3>
                                    </div>
                                </div>
                            </Link>

                            {/* Following Card */}
                            <Link href="/account/following">
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                    <div className="flex flex-col items-center justify-center h-48">
                                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Heart className="w-10 h-10 text-[#215732] dark:text-[#2d7a48]" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Following</h3>
                                    </div>
                                </div>
                            </Link>

                            {/* Shop Pay Card */}
                            <div className="md:col-span-2">
                                <div className="bg-gradient-to-br from-[#5b57d6] to-[#7c78e8] rounded-2xl p-8 shadow-lg">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Shop Pay</h3>
                                            <p className="text-white/80 text-sm">Fast, secure checkout</p>
                                        </div>
                                        <CreditCard className="w-12 h-12 text-white/80" />
                                    </div>
                                    <Link
                                        href="/account/shop-pay"
                                        className="inline-block px-6 py-3 bg-white text-[#5b57d6] font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        Set up Shop Pay
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Contact Information
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="text-gray-900 dark:text-white">{customer.email}</p>
                                </div>
                                {customer.firstName && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                        <p className="text-gray-900 dark:text-white">
                                            {customer.firstName} {customer.lastName}
                                        </p>
                                    </div>
                                )}
                                {customer.phone && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                        <p className="text-gray-900 dark:text-white">{customer.phone}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
