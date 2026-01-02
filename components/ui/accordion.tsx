"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionProps {
    children: React.ReactNode;
    className?: string;
}

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const Accordion = ({ children, className }: AccordionProps) => {
    return <div className={cn("w-full space-y-2", className)}>{children}</div>;
};

export const AccordionItem = ({ title, children, className }: AccordionItemProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className={cn("border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-[#0d0d0d]", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
                <span className="text-[16px] font-bold text-gray-900 dark:text-white">{title}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-6 text-[15px] font-medium text-[#677279] dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-4">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
