'use client';

import { useAuth } from "@/contexts/AuthContext";
import { AccountSidebar } from "@/components/Acount/AccountSidebar";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading, setIsAuthModalOpen } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            setIsAuthModalOpen(true);
            redirect("/");
        }
    }, [isAuthenticated, isLoading, setIsAuthModalOpen]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#215732]/20 border-t-[#215732] rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-[#0a0a0a] pt-8 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-20 lg:mt-30">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Sidebar */}
                    <AccountSidebar />

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
}
