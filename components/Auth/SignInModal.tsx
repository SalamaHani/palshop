'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CustomSignInForm from '../CustomSignInForm';



interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
    const router = useRouter();
    const handleSignInSuccess = (customer: any) => {
        console.log('Signed in:', customer);
        // Redirect to account page
        router.push('/account');
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors z-[110]"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>

                            <div className="p-10 pb-6 overflow-y-auto">
                                <CustomSignInForm onSuccess={handleSignInSuccess} />
                            </div>

                            {/* Footer / Policy Info */}
                            <div className="bg-gray-50/50 dark:bg-white/5 p-8 text-center border-t border-gray-100/50 dark:border-white/5">
                                <p className="text-[11px] leading-relaxed text-gray-500 font-medium max-w-[280px] mx-auto">
                                    By continuing, you agree to the <span className="text-primary cursor-pointer">Terms of Service</span> and acknowledge the <span className="text-primary cursor-pointer">Privacy Policy</span>.
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
