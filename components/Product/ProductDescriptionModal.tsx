'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Link as LinkIcon } from 'lucide-react';

interface ProductDescriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    vendor?: string;
}

export default function ProductDescriptionModal({
    isOpen,
    onClose,
    title,
    description,
    vendor
}: ProductDescriptionModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Split description into sections based on typical Shopify formatting or newlines
    const lines = description.split('\n').filter(line => line.trim());

    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000000] flex items-center justify-center sm:justify-end p-4 sm:p-6 lg:p-8 pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] cursor-pointer pointer-events-auto"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="relative bg-white dark:bg-[#0f0f0f] w-full max-w-lg h-fit max-h-[90vh] rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden pointer-events-auto"
                    >
                        {/* Header Container */}
                        <div className="px-8 pt-10 pb-2 flex items-center justify-between">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                                Description
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 group"
                            >
                                <X className="w-5 h-5 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Scrolling Content Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6 mb-4">
                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-8 bg-[#215732] rounded-full shrink-0" />
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                            Product Details
                                        </h3>
                                    </div>
                                    <ul className="space-y-5">
                                        {lines.map((line, i) => (
                                            <li key={i} className="flex gap-4 text-gray-600 dark:text-gray-400 font-medium text-[15px] leading-relaxed group">
                                                <span className="text-[#215732] font-black text-lg leading-none pt-1 shrink-0">•</span>
                                                <span>{line}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {vendor && (
                                    <div className="pt-8 border-t border-gray-100 dark:border-white/5">
                                        <div className="flex items-center gap-3 text-gray-900 dark:text-white font-bold hover:text-[#215732] transition-colors cursor-pointer group text-[15px]">
                                            <LinkIcon className="w-5 h-5 text-[#215732]" />
                                            <span>More details at {vendor}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Subtle bottom fade */}
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-[#0f0f0f] to-transparent pointer-events-none rounded-b-[2.5rem]" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
