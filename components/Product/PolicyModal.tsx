'use client';


import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000000] flex items-center justify-center sm:justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    />
                    {/* Modal Content */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative bg-white dark:bg-[#0a0a0a] w-full sm:max-w-md md:max-w-lg h-full sm:h-[95vh] sm:m-4 rounded-none sm:rounded-[2.5rem] shadow-[-20px_0_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 sm:px-8 sm:py-6 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 bg-gray-50 dark:bg-white/10 rounded-full hover:bg-gray-100 dark:hover:bg-white/20 transition-all duration-200 group"
                            >
                                <X className="w-5 h-5 text-gray-500 group-hover:text-black dark:group-hover:text-white" />
                            </button>
                        </div>
                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
                            <div className="space-y-8 sm:space-y-10">
                                {sections.map((section, idx) => (
                                    <div key={idx} className="space-y-4 sm:space-y-5">
                                        {section.heading && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-1.5 h-6 bg-[#215732] rounded-full shrink-0" />
                                                <h3 className="text-gray-900 dark:text-gray-100 font-bold text-lg sm:text-xl tracking-tight">
                                                    {section.heading}
                                                </h3>
                                            </div>
                                        )}
                                        <ul className="space-y-3 sm:space-y-4">
                                            {section.content.map((line, i) => (
                                                <li key={i} className="flex gap-4 text-gray-600 dark:text-gray-400 font-normal text-sm sm:text-base leading-relaxed">
                                                    <span className="text-[#215732] font-black shrink-0">•</span>
                                                    {line}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer / Fade effect */}
                        <div className="h-4 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent pointer-events-none" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
