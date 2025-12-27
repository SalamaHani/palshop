'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    sections: {
        heading?: string;
        content: string[];
    }[];
}

export default function PolicyModal({
    isOpen,
    onClose,
    title,
    sections
}: PolicyModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60  z-[1999] cursor-pointer"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[1999] flex items-center justify-end p-6 pointer-events-none">
                        <motion.div
                            initial={{ x: '110%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '110%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 250 }}
                            className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] shadow-[-20px_0_50px_rgba(0,0,0,0.15)] relative overflow-hidden pointer-events-auto h-[90vh] lg:h-[80vh] lg:mt-12 flex flex-col"
                        >
                            {/* Header with Close Button */}
                            <div className="p-8 pb-4 flex items-start justify-between">
                                <button
                                    onClick={onClose}
                                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-900 dark:text-white" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="px-10 pb-10 overflow-y-auto overflow-x-hidden custom-scrollbar">
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">
                                    {title}
                                </h2>

                                <div className="space-y-8">
                                    {sections.map((section, idx) => (
                                        <div key={idx} className="space-y-4">
                                            {section.heading && (
                                                <p className="text-gray-900 dark:text-gray-100 font-bold text-lg">
                                                    {section.heading}
                                                </p>
                                            )}
                                            <ul className="space-y-3">
                                                {section.content.map((line, i) => (
                                                    <li key={i} className="flex gap-3 text-gray-700 dark:text-gray-300 font-medium text-base">
                                                        <span className="text-gray-400 font-black">•</span>
                                                        {line}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
