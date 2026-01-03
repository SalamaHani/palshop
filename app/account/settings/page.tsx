'use client';

import { Lock, Bell, User, Globe, ExternalLink, Plane, } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { useState } from "react";


export default function SettingsPage() {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    async function updateProfile(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // 🔎 Validation
        if (!fullName.trim()) {
            setError('Full name is required');
            return;
        }

        if (!phone.startsWith('+')) {
            setError('Phone number must include country code (e.g. +970)');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, phone }),
            });

            if (!res.ok) {
                throw new Error(await res.text());
            }

            setSuccess(true);
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex flex-col gap-8">
            <div>
                <div className="w-2 h-8 bg-[#215732] rounded-full" />

                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Settings</h1>
                <p className="text-[#677279] dark:text-gray-400 mt-2 font-medium">Manage your personal preferences and account security</p>
            </div>
            <div className="flex flex-col gap-4">
                {/* Profile Settings */}
                <section className="bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                    <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
                        <User className="w-5 h-5 text-[#215732]" />
                        <h2 className="text-[17px] font-bold text-gray-900 dark:text-white">Profile Details</h2>
                    </div>
                    <form onSubmit={updateProfile} className="p-6 md:p-8 flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Full Name */}
                            <div className="flex flex-col gap-2.5">
                                <label className="text-[13px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full bg-[#f8f9fa] dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[18px] px-5 py-4 font-bold text-[16px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#215732]/20 focus:border-[#215732]/30 transition-all placeholder:text-gray-400"
                                />
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col gap-2.5">
                                <label className="text-[13px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+970599000000"
                                    className="w-full bg-[#f8f9fa] dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[18px] px-5 py-4 font-bold text-[16px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#215732]/20 focus:border-[#215732]/30 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Status Messages */}
                        <div className="min-h-[20px]">
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-600 text-[14px] font-bold flex items-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                    {error}
                                </motion.p>
                            )}
                            {success && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[#215732] text-[14px] font-bold flex items-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#215732]" />
                                    Profile updated successfully
                                </motion.p>
                            )}
                        </div>

                        <div className="flex justify-start">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#215732] text-white px-10 py-4 rounded-[20px] font-bold text-[16px] hover:bg-[#1a4528] transition-all shadow-lg shadow-[#215732]/20 disabled:opacity-50 active:scale-[0.98] flex items-center justify-center min-w-[160px]"
                            >
                                {loading ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Data & Privacy Settings */}
                <section className="bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                    <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
                        <Lock className="w-5 h-5 text-[#215732]" />
                        <h2 className="text-[17px] font-bold text-gray-900 dark:text-white">Data & privacy</h2>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col gap-5">
                        {/* Opt out block */}
                        <div className="flex items-start gap-4 p-5 bg-[#f8f9fa] dark:bg-white/5 rounded-[24px]">
                            <div className="w-10 h-10 bg-[#f0f3ff] dark:bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <Plane className="w-5 h-5 text-[#7c3aed]" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <p className="font-bold text-[16px] text-gray-900 dark:text-white">Opt out of data sharing</p>
                                <p className="text-[13px] font-bold text-gray-900 dark:text-white leading-tight">
                                    We use your personal information to show you more of what you like and to make your ads experience better on other websites.
                                </p>
                                <p className="text-[12px] font-semibold text-gray-500 dark:text-gray-400">
                                    If you don’t want to share your personal information for targeted ads, you can opt out.
                                </p>
                                <div className="mt-2">
                                    <Link
                                        target="_blank"
                                        href="https://privacy.shopify.com/en/opt_out_requests/ads-sharing/new"
                                        className="inline-flex flex-col gap-0.5 group"
                                    >
                                        <span className="text-[14px] font-bold text-[#215732] group-hover:underline">opt_ou</span>
                                        <ExternalLink className="w-4 h-4 text-[#215732]" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Delete account block */}
                        <div className="flex items-center justify-between p-5 bg-[#f8f9fa] dark:bg-white/5 rounded-[24px]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#f5f3ff] dark:bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Globe className="w-5 h-5 text-[#7c3aed]" />
                                </div>
                                <div>
                                    <p className="font-bold text-[16px] text-gray-900 dark:text-white">Delete your Palshop account</p>
                                    <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
                                </div>
                            </div>
                            <button className="text-[13px] font-bold py-2.5 px-6 text-[#dc2626] bg-white dark:bg-transparent hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-full transition-all active:scale-95 shadow-sm">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
