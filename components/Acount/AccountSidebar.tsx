'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, MapPin, Settings, HelpCircle, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/account', icon: LayoutDashboard },
    { name: 'Orders', href: '/account/orders', icon: ShoppingBag },
    { name: 'Addresses', href: '/account/addresses', icon: MapPin },
    { name: 'Settings', href: '/account/settings', icon: Settings },
    { name: 'Support', href: '/account/support', icon: HelpCircle },
];

export function AccountSidebar() {
    const pathname = usePathname();
    const { logout, customer } = useAuth();

    return (
        <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden sticky top-8">
                {/* User Profile Header */}
                <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gradient-to-br from-[#215732]/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#215732] to-[#2d7d45] rounded-full flex items-center justify-center border-2 border-white dark:border-[#0d0d0d] shadow-lg">
                            <span className="text-xl font-bold text-white">
                                {customer?.email?.[0]?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                {customer?.email?.split('@')[0] || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {customer?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="p-3 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200',
                                    isActive
                                        ? 'bg-[#215732] text-white shadow-lg shadow-[#215732]/20'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                                )}
                            >
                                <Icon className={cn(
                                    'w-5 h-5',
                                    isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                                )} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-3 border-t border-gray-100 dark:border-white/5">
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
