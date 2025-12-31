'use client';

import { HelpCircle, Mail, MessageSquare, Phone, ExternalLink } from "lucide-react";

export default function SupportPage() {
    const faqs = [
        { q: "How do I track my order?", a: "Once your order is shipped, you will receive a tracking number via email." },
        { q: "What is your return policy?", a: "We offer a 30-day return policy for most authentic Palestinian products." },
        { q: "Do you ship internationally?", a: "Yes, we ship globally to support Palestinian artisans everywhere." },
    ];

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Support Center</h1>
                <p className="text-[#677279] dark:text-gray-400 mt-2 font-medium">We're here to help you with anything you need</p>
            </div>

            {/* Support Channels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="mailto:support@palshop.app" className="bg-white dark:bg-[#0d0d0d] p-6 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-[#215732] transition-colors group">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#215732] transition-colors">
                        <Mail className="w-6 h-6 text-[#215732] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Email Us</h3>
                    <p className="text-xs font-medium text-[#677279] dark:text-gray-400 italic">24h Response Time</p>
                </a>

                <div className="bg-white dark:bg-[#0d0d0d] p-6 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-[#215732] transition-colors group cursor-pointer">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                        <MessageSquare className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Live Chat</h3>
                    <p className="text-xs font-medium text-[#677279] dark:text-gray-400 italic">Instant Support</p>
                </div>

                <div className="bg-white dark:bg-[#0d0d0d] p-6 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-[#215732] transition-colors group cursor-pointer">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                        <Phone className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Call Help</h3>
                    <p className="text-xs font-medium text-[#677279] dark:text-gray-400 italic">9am - 6pm EST</p>
                </div>
            </div>

            {/* FAQs */}
            <section className="bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#215732]" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                </div>
                <div className="p-8 flex flex-col gap-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="text-[#215732]">Q:</span>
                                {faq.q}
                            </h4>
                            <p className="text-[15px] font-medium text-[#677279] dark:text-gray-400 pl-6">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                    <button className="flex items-center gap-2 text-sm font-bold text-[#215732] hover:underline mt-4">
                        View All FAQ's <ExternalLink className="w-4 h-4" />
                    </button>
                </div>
            </section>
        </div>
    );
}
