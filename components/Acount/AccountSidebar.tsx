'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    User,
    ShoppingBag,
    MapPin,
    Heart,
    Settings,
    HelpCircle,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
    {
        title: 'Profile Overview',
        href: '/account',
        icon: User,
    },
    {
        title: 'My Orders',
        href: '/account/orders',
        icon: ShoppingBag,
    },
    {
        title: 'Saved Items',
        href: '/account/saved',
        icon: Heart,
    },
    {
        title: 'Settings',
        href: '/account/settings',
        icon: Settings,
    },
    {
        title: 'Support',
        href: '/account/support',
        icon: HelpCircle,
    },
];

export function AccountSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="w-full lg:w-64 flex flex-col gap-2">
            <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-white/5 p-3 flex flex-col gap-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200",
                                isActive
                                    ? "bg-[#215732] text-white shadow-lg shadow-[#215732]/20"
                                    : "text-[#677279] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400")} />
                            {item.title}
                        </Link>
                    );
                })}
            </div>

            <button
                onClick={logout}
                className="flex items-center gap-3 px-7 py-4 text-[15px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all duration-200 mt-2 cursor-pointer"
            >
                <LogOut className="w-5 h-5" />
                Sign Out
            </button>
        </aside>
    );
}
