'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CustomSignInForm from '../CustomSignInForm';
import { useAuth } from '@/contexts/AuthContext';



interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
    const router = useRouter();
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
    const { refreshCustomer } = useAuth();

    const handleSignInSuccess = async (customer: any) => {
        console.log('Signed in:', customer);
        // Refresh the authentication context to get latest session
        await refreshCustomer();
        // Close modal
        onClose();
        // Redirect to account page
        router.push('/account');
    };

    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 "
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 p-1.5 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-300 group z-[110]"
                        >
                            <X className="w-4 h-4 text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors" />
                        </button>

                        <div className="p-3 pb-3 overflow-y-auto">
                            <CustomSignInForm onSuccess={handleSignInSuccess} />
                        </div>

                        {/* Footer / Policy Info */}
                        <div className="bg-gray-50/50 dark:bg-white/5 p-4 text-center border-t border-gray-100/50 dark:border-white/5">
                            <p className="text-[11px] leading-relaxed text-gray-500 font-medium max-w-[280px] mx-auto">
                                By continuing, you agree to the <span className="text-[#215732] font-bold cursor-pointer hover:underline underline-offset-4 transition-all">Terms of Service</span> and acknowledge the <span className="text-[#215732] font-bold cursor-pointer hover:underline underline-offset-4 transition-all">Privacy Policy</span>.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
