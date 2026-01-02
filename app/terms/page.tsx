'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
    const lastUpdated = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const sections = [
        {
            title: "1. About PalShop",
            content: "PalShop is an independent online store that sells products created, curated, or inspired by Palestinian culture and craftsmanship. We operate using secure e-commerce technology to provide a smooth and safe shopping experience."
        },
        {
            title: "2. Eligibility",
            content: "You must be at least 18 years old or have permission from a parent or legal guardian to place an order. By using PalShop, you confirm that the information you provide is accurate and up to date."
        },
        {
            title: "3. Orders & Payments",
            content: "All prices are shown in the selected currency and may include applicable taxes. Payments are processed securely through trusted third-party payment providers. PalShop does not store your full payment details. We reserve the right to cancel or refuse any order in cases of fraud, incorrect pricing, or availability issues."
        },
        {
            title: "4. Shipping & Delivery",
            content: "Shipping times vary depending on your location. Estimated delivery dates are provided but not guaranteed. PalShop is not responsible for delays caused by customs, carriers, or external factors beyond our control."
        },
        {
            title: "5. Returns & Refunds",
            content: "Items may be eligible for return within 30 days of delivery. Products must be unused and in original condition. Some items (such as custom or personal products) may not be eligible for return. Refunds are processed after the returned item is inspected."
        },
        {
            title: "6. Customer Accounts",
            content: "You are responsible for keeping your login information secure. Any activity under your account is your responsibility. If you believe your account has been compromised, contact us immediately."
        },
        {
            title: "7. Product Information",
            content: "We strive to display accurate product descriptions and images. However, minor variations in color, size, or design may occur due to screen settings or handmade production."
        },
        {
            title: "8. Intellectual Property",
            content: "All content on PalShop (logos, images, text, designs) belongs to PalShop or its partners and may not be copied or reused without permission."
        },
        {
            title: "9. Prohibited Use",
            content: "You agree not to: Use our site for illegal activities, attempt to access or damage our systems, or misuse product reviews or submit false information."
        },
        {
            title: "10. Limitation of Liability",
            content: "PalShop is not liable for indirect or consequential damages arising from the use of our website or products, to the maximum extent allowed by law."
        },
        {
            title: "11. Privacy",
            content: "We respect your privacy. Your personal data is used only to process orders, provide support, and improve your experience. Our full handle on your data is outlined in our Privacy Policy."
        },
        {
            title: "12. Changes to These Policies",
            content: "We may update these policies from time to time. Any changes will be posted on this page with an updated date."
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-10 pb-24  overflow-hidden">
            <div className="max-w-5xl mx-auto">
                {/* Navigation Back */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#215732] hover:gap-3 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </motion.div>

                {/* Header Section */}
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-16 h-16 bg-[#215732]/10 rounded-2xl flex items-center justify-center mb-8"
                    >
                        <ShieldCheck className="w-8 h-8 text-[#215732]" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[42px] leading-[1.1] font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
                    >
                        Store Policies & <br />
                        <span className="text-[#215732]">Terms of Use</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-6 text-[15px] text-gray-500 font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Last updated: {lastUpdated}</span>
                        </div>
                        <div className="flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-gray-300 before:rounded-full">
                            <span>Palestine 🇵🇸</span>
                        </div>
                    </motion.div>
                </div>

                {/* Introduction */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-8 bg-gray-50 dark:bg-gray-900 rounded-[32px] mb-16 border border-gray-100 dark:border-gray-800"
                >
                    <p className="text-[18px] leading-relaxed text-gray-700 dark:text-gray-300 font-medium italic">
                        "Welcome to PalShop, an online store offering authentic Palestinian products. By using our website, services, or placing an order, you agree to the policies outlined below."
                    </p>
                </motion.div>

                {/* Policy Sections */}
                <div className="space-y-16">
                    {sections.map((section, index) => (
                        <motion.section
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5 }}
                            className="group"
                        >
                            <h2 className="text-[22px] font-bold text-gray-900 dark:text-white mb-6 group-hover:text-[#215732] transition-colors flex items-center gap-4">
                                <span className="w-8 h-[2px] bg-[#215732]/20 group-hover:w-12 group-hover:bg-[#215732] transition-all duration-500" />
                                {section.title}
                            </h2>
                            <p className="text-[17px] leading-relaxed text-[#555] dark:text-gray-400 font-medium pl-12">
                                {section.content}
                            </p>
                        </motion.section>
                    ))}
                </div>

                {/* Contact Footer Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-24 pt-16 border-t border-gray-100 dark:border-gray-800"
                >
                    <div className="bg-[#215732] rounded-[40px] p-10 md:p-16 text-center text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-6">Have Questions?</h3>
                            <p className="text-white/80 text-lg mb-10 max-w-md mx-auto">
                                If you have any questions or concern regarding our Terms of Service, we're here to help.
                            </p>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                <a
                                    href="mailto:support@palshop.com"
                                    className="px-8 py-4 bg-white text-[#215732] rounded-full font-bold hover:bg-gray-100 transition-all active:scale-95"
                                >
                                    support@palshop.com
                                </a>
                                <Link
                                    href="/contact"
                                    className="px-8 py-4 bg-[#1a4527] text-white border border-white/20 rounded-full font-bold hover:bg-[#153a20] transition-all active:scale-95"
                                >
                                    Contact Support
                                </Link>
                            </div>
                        </div>

                        {/* Decorative background element */}
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
                    </div>

                    <div className="text-center mt-12 text-gray-400 font-medium text-sm">
                        <p>© 2025 PalShop. Made with pride in Palestine 🇵🇸</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
