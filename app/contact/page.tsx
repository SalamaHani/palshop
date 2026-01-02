'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ContactPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: 'hanidiaab@gmail.com',
        phone: '',
        topic: 'Topic',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.message || formData.topic === 'Topic') {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setFormData({
                    name: '',
                    email: 'hanidiaab@gmail.com',
                    phone: '',
                    topic: 'Topic',
                    message: ''
                });
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-20 pb-20 px-4">
            <div className="max-w-2xl mx-auto text-center">
                {/* Header */}
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[40px] font-bold text-gray-900 dark:text-white mb-4 tracking-tight"
                >
                    Contact
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-[17px] text-gray-900 dark:text-gray-300 mb-12 max-w-lg mx-auto leading-snug font-medium"
                >
                    If you can't find what you're looking for, complete this contact form and a support specialist will reach out.
                </motion.p>

                {/* Form Container */}
                <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4 text-left"
                    onSubmit={handleSubmit}
                >
                    {/* Name Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Your name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-5 h-[68px] text-[16px] bg-white dark:bg-gray-900 border-[1.5px] border-gray-200 dark:border-gray-800 rounded-[20px] focus:ring-2 focus:ring-[#215732] focus:border-[#215732] outline-none transition-all placeholder:text-gray-500 font-medium disabled:opacity-50"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Email Input */}
                    <div className="relative group">
                        <div className="absolute left-5 top-3.5 text-[12px] text-gray-500 font-medium h-4">
                            Email address *
                        </div>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-5 pt-7 pb-2 h-[68px] text-[16px] bg-white dark:bg-gray-900 border-[1.5px] border-gray-200 dark:border-gray-800 rounded-[20px] focus:ring-2 focus:ring-[#215732] focus:border-[#215732] outline-none transition-all font-medium disabled:opacity-50"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Phone Input */}
                    <div className="relative">
                        <input
                            type="tel"
                            placeholder="Your phone number (optional)"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-5 h-[68px] text-[16px] bg-white dark:bg-gray-900 border-[1.5px] border-gray-200 dark:border-gray-800 rounded-[20px] focus:ring-2 focus:ring-[#215732] focus:border-[#215732] outline-none transition-all placeholder:text-gray-500 font-medium disabled:opacity-50"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Topic Select */}
                    <div className="relative group">
                        <div className="absolute left-5 top-3.5 text-[12px] text-gray-500 font-medium h-4">
                            Topic
                        </div>
                        <select
                            required
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                            className="w-full px-5 pt-7 pb-2 h-[68px] text-[16px] bg-white dark:bg-gray-900 border-[1.5px] border-gray-200 dark:border-gray-800 rounded-[20px] focus:ring-2 focus:ring-[#215732] focus:border-[#215732] outline-none transition-all font-medium appearance-none disabled:opacity-50"
                            disabled={isLoading}
                        >
                            <option value="Topic" disabled>Topic</option>
                            <option value="Order Support">Order Support</option>
                            <option value="Shipping & Delivery">Shipping & Delivery</option>
                            <option value="Product Inquiries">Product Inquiries</option>
                            <option value="Business Partnership">Business Partnership</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900 pointer-events-none" />
                    </div>

                    {/* Message Textarea */}
                    <div className="relative">
                        <textarea
                            placeholder="How can we help you?"
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-5 py-5 h-[160px] text-[16px] bg-white dark:bg-gray-900 border-[1.5px] border-gray-200 dark:border-gray-800 rounded-[24px] focus:ring-2 focus:ring-[#215732] focus:border-[#215732] outline-none transition-all placeholder:text-gray-500 font-medium resize-none disabled:opacity-50"
                            disabled={isLoading}
                        />
                        <div className="absolute bottom-3 right-5">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-300">
                                <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {/* reCAPTCHA Placeholder */}
                    <div className="flex justify-center mt-6">
                        <div className="w-[300px] h-[74px] bg-[#f9f9f9] dark:bg-gray-800 border border-[#d3d3d3] dark:border-gray-700 rounded-sm flex items-center px-3 gap-3">
                            <div className="flex flex-col items-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#4a90e2]">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" />
                                    <path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor" />
                                </svg>
                                <span className="text-[9px] text-gray-500 mt-0.5">reCAPTCHA</span>
                                <div className="flex gap-1 text-[8px] text-gray-400 mt-0.5">
                                    <span>الخصوصية</span>
                                    <span>-</span>
                                    <span>البنود</span>
                                </div>
                            </div>
                            <div className="flex-1 text-right">
                                <p className="text-[13px] text-gray-700 dark:text-gray-300 font-medium">أنا لست برنامج روبوت</p>
                                <p className="text-[8px] text-gray-400 leading-tight">سیتم تعییر بنود خدمة reCAPTCHA . <span className="underline">یجب اتخاذ إجراء</span></p>
                            </div>
                            <div className="w-6 h-6 border-2 border-gray-300 rounded bg-white"></div>
                        </div>
                    </div>

                    {/* Submit Button with Loading State */}
                    <div className="mt-8">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-[#215732] hover:bg-[#1a4527] text-white text-[17px] font-bold rounded-[20px] shadow-lg shadow-[#215732]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Message'
                            )}
                        </Button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
}
