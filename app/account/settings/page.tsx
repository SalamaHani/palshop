'use client';

import { Lock, Bell, User, Globe, ExternalLink, } from "lucide-react";
import Link from "next/link";

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
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Settings</h1>
                <p className="text-[#677279] dark:text-gray-400 mt-2 font-medium">Manage your personal preferences and account security</p>
            </div>
            <div className="flex flex-col gap-4">
                {/* Profile Settings */}
                <section className="bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
                        <User className="w-5 h-5 text-[#215732]" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Details</h2>
                    </div>
                    <form onSubmit={updateProfile} className="p-8 flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#215732]/20"
                                />
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+970599000000"
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#215732]/20"
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-red-600 text-sm font-semibold">{error}</p>
                        )}

                        {/* Success */}
                        {success && (
                            <p className="text-green-600 text-sm font-semibold">
                                Profile updated successfully
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-fit bg-[#215732] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1a4528] transition-all shadow-lg shadow-[#215732]/20 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </section>

                {/* Security Settings */}
                <section className="bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
                        <Lock className="w-5 h-5 text-[#215732]" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Data & privacy</h2>
                    </div>
                    <div className="p-8 flex flex-col gap-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                                    <p className="font-semibold text-gray-900 dark:text-white">Opt out of data sharing</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">We use your personal information to show you more of what you like and to make your ads experience better on other websites.</p>
                                    <p className="text-xs font-semibold text-[#677279] dark:text-gray-400">If you don’t want to share your personal information for targeted ads, you can opt out.</p>
                                    <Link href="https://privacy.shopify.com/en/opt_out_requests/ads-sharing/new" className="text-[#215732] cursor-pointer hover:underline">opt_ou<ExternalLink className="w-4 h-4" /></Link>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Delete your Shop account</p>
                                    <p className="text-xs font-medium text-[#677279] dark:text-gray-400">This action cannot be undone.</p>
                                </div>
                            </div>
                            <button className="text-sm font-normal py-2 px-4 text-red-600 hover:bg-red-50 border border-red-100 rounded-full w-fit">Delete</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
