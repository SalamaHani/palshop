'use client';

import React from 'react';
import { HelpCircle, Mail, MessageSquare, Phone, ExternalLink, Package, Heart, Globe, CreditCard, ShieldCheck, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import Link from 'next/link';

export default function SupportPage() {
    const featuredTopics = [
        {
            title: "Track your orders",
            description: "Learn how to track your orders with PalShop to receive shipping updates locally and globally throughout the delivery journey.",
            icon: Package
        },
        {
            title: "Support Artisans",
            description: "Learn how PalShop supports Palestinian artisans and crafters by bringing their authentic products to the international market.",
            icon: Heart
        },
        {
            title: "Global Shipping",
            description: "We ship Palestinian heritage worldwide. Learn about delivery times, international customs, and global courier partners.",
            icon: Globe
        },
        {
            title: "Local Payments",
            description: "Securely pay using local Palestinian payment methods, international credit cards, or bank transfers.",
            icon: CreditCard
        },
        {
            title: "Authenticity Guarantee",
            description: "Every product on PalShop is verified for authentic Palestinian origin, quality, and ethical craftsmanship.",
            icon: ShieldCheck
        },
        {
            title: "Contact Support",
            description: "Have questions about your order? Reach out to our specialized support team based in Palestine for direct assistance.",
            icon: ShoppingBag
        }
    ];

    const faqs = [
        {
            q: "How long does international shipping take?",
            a: "International shipping typically takes 7-14 business days depending on the destination country and customs processing. We provide full tracking for every order."
        },
        {
            q: "Can I return a handmade item?",
            a: "We accept returns for defective or damaged items. Due to the unique nature of handmade Palestinian crafts, minor variations are expected and celebrated as part of the authentic process."
        },
        {
            q: "How do I wholesale Palestinian products?",
            a: "For bulk orders or retail partnerships, please contact our business team directly at partnerships@palshop.store for specialized pricing and shipping."
        }
    ];

    return (
        <div className="flex flex-col gap-12 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-[#215732] rounded-full" />
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Support Center</h1>
                    </div>
                    <p className="text-[#677279] dark:text-gray-400 mt-2 font-medium italic">Your gateway to the heart of Palestinian craftsmanship</p>
                </div>
            </div>

            {/* Featured Box Grid */}
            <section>
                <h2 className="text-[20px] font-bold text-gray-900 dark:text-white mb-6">Most viewed topics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {featuredTopics.map((topic, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white dark:bg-[#0d0d0d] p-6 rounded-[24px] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#215732]/10 rounded-full flex items-center justify-center">
                                        <topic.icon className="w-5 h-5 text-[#215732]" />
                                    </div>
                                    <h3 className="font-bold text-[17px] text-gray-900 dark:text-white">{topic.title}</h3>
                                </div>
                                <p className="text-[14px] leading-relaxed font-bold text-gray-900 dark:text-white">
                                    {topic.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Quick Contact Bar */}
            <div className="flex flex-wrap items-center justify-between p-8 bg-gray-50 dark:bg-white/5 rounded-[32px] border border-gray-100 dark:border-white/5 gap-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Still need help?</h3>
                    <p className="text-gray-500 font-medium">Our Palestinian-based support team is here for you.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/contact" className="px-6 py-3 bg-[#215732] text-white rounded-full font-bold hover:bg-[#1a4527] transition-all flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Support
                    </Link>
                    <button className="px-6 py-3 bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-full font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Live Chat
                    </button>
                </div>
            </div>

            {/* FAQ Accordion */}
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <HelpCircle className="w-6 h-6 text-[#215732]" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                </div>

                <Accordion className="max-w-4xl">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} title={faq.q}>
                            {faq.a}
                        </AccordionItem>
                    ))}
                </Accordion>

                <div className="mt-8 flex justify-center">
                    <button className="flex items-center gap-2 text-[15px] font-bold text-[#215732] hover:underline">
                        View Complete Support Documentation <ExternalLink className="w-4 h-4" />
                    </button>
                </div>
            </section>
        </div>
    );
}
