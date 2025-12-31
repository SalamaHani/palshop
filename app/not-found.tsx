'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md"
            >
                <div className="relative mb-8 flex justify-center">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        className="text-[120px] font-black text-gray-100 dark:text-white/5 select-none"
                    >
                        404
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-[#215732]/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Search className="w-10 h-10 text-[#215732]" />
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                    Lost in the Marketplace?
                </h1>
                <p className="text-[#677279] dark:text-gray-400 mb-10 text-[15px] font-medium leading-relaxed">
                    The page you're searching for seems to have vanished. Don't worry, the heart of Palestine's craftsmanship is just a click away.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#215732] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#1a4528] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white px-8 py-3.5 rounded-full font-bold border border-gray-100 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
