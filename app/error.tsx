'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-lg"
            >
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full" />
                        <div className="relative w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-100 dark:border-red-500/20">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                    Something went wrong
                </h1>
                <p className="text-[#677279] dark:text-gray-400 mb-10 text-[15px] font-medium leading-relaxed">
                    We encountered an unexpected glitch while loading this part of the shop. Our team has been notified.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => reset()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#215732] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#1a4528] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white px-8 py-3.5 rounded-full font-bold border border-gray-100 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-12 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 text-left">
                        <p className="text-xs font-mono text-red-500 break-words">
                            {error.message}
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
