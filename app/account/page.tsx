'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Heart, Bookmark, CreditCard, Package, Settings, HelpCircle, LogOut, ChevronRight, Calendar, ShoppingBag, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';


export default function AccountPage() {
    const { customer, isAuthenticated, isLoading, signOut } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [isOrdersLoading, setIsOrdersLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsOrdersLoading(false);
        };

        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-[#215732]/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#215732] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!customer) return null;

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const initials = (customer.firstName?.[0] || customer.email[0]).toUpperCase();

    const menuItems = [
        { icon: Package, label: 'Orders', href: '/account/orders', color: 'bg-blue-50 text-blue-600' },
        { icon: Heart, label: 'Wishlist', href: '/saved', color: 'bg-pink-50 text-pink-600' },
        { icon: CreditCard, label: 'Payments', href: '/account/payments', color: 'bg-indigo-50 text-indigo-600' },
        { icon: Settings, label: 'Settings', href: '/account/settings', color: 'bg-gray-100 text-gray-600' },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-[#0a0a0a] pb-20">
            {/* Account Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/5 pt-12 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#215732] to-[#2d7a48] flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-[#215732]/20 ring-4 ring-white dark:ring-white/5"
                        >
                            {initials}
                        </motion.div>

                        <div className="text-center md:text-left space-y-2">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                    {customer.firstName ? `Hello, ${customer.firstName}` : 'My Account'}
                                </h1>
                                <p className="text-gray-500 font-medium text-lg">{customer.email}</p>
                            </motion.div>
                        </div>

                        <div className="md:ml-auto flex gap-4">
                            <button
                                onClick={handleSignOut}
                                className="px-6 py-3 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-bold hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-2"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {menuItems.map((item, idx) => (
                                <Link key={idx} href={item.href}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-transparent hover:border-primary/10 group text-center"
                                    >
                                        <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-white text-sm">{item.label}</span>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>

                        {/* Recent Orders Section */}
                        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <ShoppingBag className="w-7 h-7 text-primary" />
                                    Recent Orders
                                </h3>
                                <Link href="/account/orders" className="text-sm font-bold text-primary hover:underline">View All</Link>
                            </div>

                            {isOrdersLoading ? (
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="h-24 bg-gray-50 dark:bg-white/5 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            ) : orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.id} className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all">
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center font-bold text-primary border border-gray-100 dark:border-white/5">
                                                        #{order.orderNumber}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white">
                                                            {order.totalPrice.currencyCode} {parseFloat(order.totalPrice.amount).toFixed(2)}
                                                        </p>
                                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(order.processedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${order.financialStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {order.financialStatus}
                                                    </span>
                                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 px-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-white/5">
                                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">No orders found yet. Time to start shopping!</p>
                                    <Link href="/shop" className="inline-block mt-4 text-primary font-bold hover:underline">Explore Products</Link>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="bg-[#215732] rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                            <h4 className="text-xl font-black mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6" />
                                Security Info
                            </h4>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">Account ID</p>
                                    <p className="font-mono text-sm opacity-90 truncate">{customer.id}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">Authenticated via</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                        <p className="font-bold">Shopify Customer API</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Need Help?</h4>
                            <div className="space-y-4">
                                <Link href="/support" className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-primary/5 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <HelpCircle className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                                        <span className="font-bold text-sm text-gray-700 dark:text-gray-300">Support Center</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                </Link>
                                <Link href="/contact" className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-primary/5 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                                        <span className="font-bold text-sm text-gray-700 dark:text-gray-300">Contact Us</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
