'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionText: string;
    actionHref: string;
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionText,
    actionHref,
}: EmptyStateProps) {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 max-w-7xl mx-auto">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner"
            >
                <Icon className="w-12 h-12 text-gray-300" />
            </motion.div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-10 text-center max-w-sm leading-relaxed">
                {description}
            </p>
            <Link
                href={actionHref}
                className="group px-10 py-4 bg-[#215732] text-white font-bold rounded-2xl hover:bg-[#1a4527] transition-all shadow-xl shadow-[#215732]/20 flex items-center gap-3 active:scale-95"
            >
                {actionText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
