'use client';

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Login from "@/components/view/Auth/Login";
import { ArrowLeft, ShieldCheck, Zap, Globe } from "lucide-react";
import Link from "next/link";

function LoginContent() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/account";

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push(callbackUrl);
        }
    }, [isLoading, isAuthenticated, router, callbackUrl]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col lg:flex-row overflow-hidden">
            {/* Left Decoration Side (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#215732] relative overflow-hidden items-center justify-center p-12">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-20">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity }}
                        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/20 blur-[120px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1],
                            x: [0, 100, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity }}
                        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-foreground/10 blur-[100px] rounded-full"
                    />
                </div>

                <div className="relative z-10 max-w-lg text-white space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl font-black tracking-tighter mb-6" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                            Welcome to<br />palshop
                        </h1>
                        <p className="text-xl text-white/80 leading-relaxed font-medium">
                            Join our community of conscious shoppers. Access exclusive Palestinian and Middle Eastern products with a single code.
                        </p>
                    </motion.div>

                    {/* Features */}
                    <div className="grid grid-cols-1 gap-6 pt-8">
                        {[
                            { icon: Zap, text: "Fast Passwordless Sign In" },
                            { icon: ShieldCheck, text: "Secure Shopify Integration" },
                            { icon: Globe, text: "Global Palestinian Marketplace" }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10"
                            >
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <feature.icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-semibold">{feature.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Form Side */}
            <div className="w-full lg:w-1/2 flex flex-col relative">
                {/* Mobile Header / Back Button */}
                <div className="p-6 flex items-center justify-between lg:justify-end">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm">Back to store</span>
                    </Link>
                </div>

                <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md bg-white dark:bg-[#0a0a0a] lg:shadow-none shadow-2xl rounded-[3rem] p-8 lg:p-0"
                    >
                        <Login />

                        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 text-center">
                            <p className="text-xs text-gray-400 font-medium">
                                Protected by Shopify Security. By signing in, you agree to our Terms and conditions.
                            </p>
                        </div>
                    </motion.div>
                </main>

                {/* Footer info for mobile */}
                <div className="lg:hidden p-8 text-center text-gray-400 text-sm">
                    © 2025 palshop. All rights reserved.
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
