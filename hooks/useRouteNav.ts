"use client";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Home, Grid, ShoppingCart, Tag, Heart, User } from "lucide-react";
const useRouteNav = () => {
  const pathname = usePathname();
  const route = useMemo(
    () => [
      {
        id: "home",
        title: "Home",
        href: "/",
        icon: Home,
        isActive: pathname === "/",
      },
      {
        id: "categories",
        title: "Categories",
        href: "/categories",
        icon: Grid,
        isActive: pathname == "/categories" || pathname.startsWith("/categories/") || pathname.startsWith("/product/"),
      },
      {
        id: "cart",
        title: "Cart",
        href: "/cart",
        icon: ShoppingCart,
        isActive: pathname === "/cart",
      },
      {
        id: "saved",
        title: "Saved",
        href: "/saved",
        icon: Heart,
        isActive: pathname === "/saved",
      },
      {
        id: "account",
        title: "Account",
        href: "/account",
        icon: User,
        isActive: pathname.startsWith("/account"),
      },
    ],
    [pathname]
  );
  return route;
};
export default useRouteNav;
