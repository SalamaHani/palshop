"use client";
import React, { useState } from 'react';
import { Home, Grid, ShoppingCart, Tag, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import useRouteNav from '@/hooks/useRouteNav';
import { useAuth } from '@/contexts/AuthContext';
import SignInModal from '../Auth/SignInModal';

// TypeScript interfaces for props
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

const NavMobile: React.FC<NavMobileProps> = ({
    menuItems,
    cartCount = 0,
    defaultActive = 'home',
    onTabChange,
    activeColor = 'bg-[#215732]',
    inactiveColor = 'text-gray-600',
}) => {
    const route = useRouteNav();
    // Default menu items if none provided

    const router = useRouter();
    const { cart } = useCart();
    const { wishlistCount } = useWishlist();
    const { isAuthenticated } = useAuth();
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

    const handleAccountClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            setIsSignInModalOpen(true);
        }
    };

    return (

        <nav className=" rounded-t-2xl w-full bg-white shadow-[30px_20px_20px_20px_rgba(0,0,0,0.06),0px_-1px_0px_0px_#F2F4F5,0_0_0_0px_#FCFCFC]   z-99 border-b border-gray-200 dark:border-gray-800 fixed bottom-0 z-50 px-6 py-3">
            <div className="flex items-center justify-between  ">
                {route.map((item, index) => {
                    const Icon = item.icon;
                    const isAccount = item.id === 'account';

                    return (
                        <Link
                            key={index}
                            href={item?.href ?? '/'}
                            onClick={isAccount ? handleAccountClick : undefined}
                            className="relative flex items-center justify-center w-12 h-12 transition-all duration-300 ease-out group"
                            aria-label={item.title}
                        >
                            {/* Active background circle with custom color */}
                            <div
                                className={`absolute inset-0 rounded-full transition-all duration-300 ease-out ${item.isActive
                                    ? `${activeColor} scale-100`
                                    : 'bg-transparent scale-0'
                                    }`}
                            />

                            {/* Icon with color transitions */}
                            <Icon
                                className={`relative z-10 transition-all duration-300 ${item.isActive
                                    ? 'text-white scale-110'
                                    : `${inactiveColor} scale-100 group-hover:text-[#215734]`
                                    }`}
                                size={24}
                                strokeWidth={item.isActive ? 2.5 : 2}
                            />
                            {/* Badge for cart or other items */}
                            {item.id === 'cart' && (cart?.totalQuantity ?? 0) > 0 && (
                                <Badge variant="default" className="absolute -top-2 text-white right-0 bg-[#215734]">
                                    {cart?.totalQuantity}
                                </Badge>
                            )}
                            {item.id === 'saved' && wishlistCount > 0 && (
                                <Badge variant="default" className="absolute -top-2 text-white right-0 bg-red-500 text-[10px] min-w-[18px] h-[18px] p-0 flex items-center justify-center">
                                    {wishlistCount}
                                </Badge>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Sign In Modal */}
            <SignInModal
                isOpen={isSignInModalOpen}
                onClose={() => setIsSignInModalOpen(false)}
            />
        </nav>
    );
};

export default NavMobile;

/* 
USAGE EXAMPLES:

1. Basic usage with Shopify cart count:
<NavMobile cartCount={shopifyCart.totalQuantity} />

2. Custom menu items from Shopify:
const shopifyMenu = [
  { id: 'home', icon: Home, label: 'Home', href: '/' },
  { id: 'shop', icon: Grid, label: 'Shop', href: '/collections/all' },
  { id: 'cart', icon: ShoppingCart, label: 'Cart', href: '/cart' },
];
<NavMobile menuItems={shopifyMenu} cartCount={5} />

3. With callback for navigation:
<NavMobile 
  cartCount={3}
  onTabChange={(tabId) => router.push(navItems.find(i => i.id === tabId)?.href)}
/>

4. Custom colors:
<NavMobile 
  activeColor="bg-purple-600"
  inactiveColor="text-gray-500"
  backgroundColor="bg-slate-100"
/>

5. With notification dot:
const customItems = [
  {  icon: Tag, id: 'offers',label: 'Offers', showDot: true },
];
<NavMobile menuItems={customItems} />
*/
