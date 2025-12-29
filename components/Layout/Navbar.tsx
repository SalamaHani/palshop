'use client';
interface NavItem {
    id: string;
    icon: React.ComponentType<any>;
    label: string;
    badge?: number;
    showDot?: boolean;
    href?: string;
}

interface NavMobileProps {
    // Array of menu items from Shopify or custom config
    menuItems?: NavItem[];
    // Cart count from Shopify cart
    cartCount?: number;
    // Active tab ID
    defaultActive?: string;
    // Callback when tab changes
    onTabChange?: (tabId: string) => void;
    // Custom colors
    activeColor?: string;
    inactiveColor?: string;
    backgroundColor?: string;
}
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Badge } from '../ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

import useRouteNav from '@/hooks/useRouteNav';
import SignInModal from '../Auth/SignInModal';
export default function Navbar({
    cartCount = 0,
    defaultActive = 'home',
    activeColor = 'bg-[#215732]',
    inactiveColor = 'text-gray-600',
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const router = useRouter();
    const { cart } = useCart();
    const { wishlistCount } = useWishlist();
    const route = useRouteNav();
    const { isAuthenticated, isLoading } = useAuth();

    const handleAccountClick = () => {
        if (isAuthenticated) {
            // User is logged in, go to account page
            router.push('/account');
        } else {
            // User is not logged in, open sign-in modal
            setIsSignInModalOpen(true);
        }
    };

    return (
        <>
            {/* Main Navbar */}
            <nav className="bg-white dark:bg-[#0a0a0a] hidden lg:block z-9999 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-lg ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <Image src="/images/logo.jpeg" alt="Logo" width={150} height={1} />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="flex items-center space-x-8">
                            {route.map((item, index) => {

                                if (item.title == 'Home' || item.title == 'Categories' || item.title == 'Offers') {
                                    return (
                                        <Link
                                            key={index}
                                            aria-label={item.title}
                                            href={item?.href ?? '/'}
                                            className="relative flex items-center justify-center py-2 px-6 rounded-xl  hover:bg-gray-200 transition-all duration-300 ease-out group"
                                        >
                                            <div
                                                className={`absolute inset-0 rounded-xl transition-all   duration-300 ease-out ${item.isActive
                                                    ? `${activeColor} scale-100`
                                                    : 'bg-transparent scale-0'
                                                    }`}
                                            />

                                            {/* Icon with color transitions */}
                                            <p
                                                className={`relative z-10 transition-all  text-[#215732] font-medium duration-300 ${item.isActive
                                                    ? 'text-white scale-110'
                                                    : `${inactiveColor} scale-100 group-hover:bg-gray-200 group-hover:text-[#215734] `
                                                    }`}
                                            >
                                                {item.title}
                                            </p>


                                        </Link>
                                    );
                                }
                            })}

                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center space-x-4">
                            {
                                route.map((item, index) => {
                                    if (item.title == 'Saved') {
                                        return (
                                            <Link key={index} href={item?.href ?? '/'} className={`p-2  relative flex items-center justify-center rounded-full  hover:bg-gray-200 transition-all duration-300 ease-out group `}>
                                                <div
                                                    className={`absolute inset-0 rounded-full transition-all   duration-300 ease-out ${item.isActive
                                                        ? `${activeColor} scale-100`
                                                        : 'bg-transparent scale-0'
                                                        }`}
                                                />
                                                <item.icon className={`relative w-5 h-5 z-10 transition-all  text-[#215732] font-medium duration-300 ${item.isActive
                                                    ? 'text-white scale-110'
                                                    : `${inactiveColor} scale-100 group-hover:bg-gray-200 group-hover:text-[#215734] `
                                                    }`} />
                                                {wishlistCount > 0 && (
                                                    <Badge variant="destructive" className="absolute -top-2 text-white right-0 bg-red-500 text-[10px] min-w-[18px] h-[18px] p-0 flex items-center justify-center">
                                                        {wishlistCount}
                                                    </Badge>
                                                )}
                                            </Link>
                                        );
                                    }
                                    if (item.title == 'Cart') {
                                        return (
                                            <Link key={index} href={item?.href ?? '/'} className={`p-2  relative flex items-center justify-center rounded-full  hover:bg-gray-200 transition-all duration-300 ease-out group `}>
                                                <div
                                                    className={`absolute inset-0  rounded-full transition-all   duration-300 ease-out ${item.isActive
                                                        ? `${activeColor} scale-100`
                                                        : 'bg-transparent scale-0'
                                                        }`}
                                                />
                                                <item.icon className={`relative transition relative grid place-items-center justify-center active:scale-[0.96] p-space-12 rounded-full before:absolute before:inset-0 before:rounded-full before:bg-bg-fill-brand before:shadow-lg before:transition-all before:duration-100 before:ease-in-out before:content-[""] before:scale-100 before:opacity-100 hover:scale-105 hover:opacity-100 w-5 h-5 z-10 transition-all  text-[#215732] font-medium duration-300 ${item.isActive
                                                    ? 'text-white scale-110'
                                                    : `${inactiveColor} scale-100 group-hover:bg-gray-200 group-hover:text-[#215734] `
                                                    }`} />
                                                {item.id === 'cart' && (cart?.totalQuantity ?? 0) > 0 && (
                                                    <Badge variant="default" className="absolute -top-2 text-white right-0 bg-[#215734]">
                                                        {cart?.totalQuantity}
                                                    </Badge>
                                                )}
                                            </Link>
                                        );
                                    }
                                    if (item.title == 'Account') {
                                        return (
                                            <button
                                                key={index}
                                                onClick={handleAccountClick}
                                                className={`p-2  relative flex items-center justify-center  rounded-full  hover:bg-gray-200 transition-all duration-300 ease-out group `}
                                            >
                                                <div
                                                    className={`absolute inset-0 rounded-full  transition-all   duration-300 ease-out ${item.isActive
                                                        ? `${activeColor} scale-100`
                                                        : 'bg-transparent scale-0'
                                                        }`}
                                                />
                                                <item.icon className={`relative w-5 h-5 z-10 transition-all  text-[#215732] font-medium duration-300 ${item.isActive
                                                    ? 'text-white scale-110'
                                                    : `${inactiveColor} scale-100 group-hover:bg-gray-200 group-hover:text-[#215734] `
                                                    }`} />
                                            </button>
                                        );
                                    }
                                })
                            }

                        </div>
                    </div>
                </div>
            </nav>

            {/* Sign In Modal */}
            <SignInModal
                isOpen={isSignInModalOpen}
                onClose={() => setIsSignInModalOpen(false)}
            />
        </>
    );
}
