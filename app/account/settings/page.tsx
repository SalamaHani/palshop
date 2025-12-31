'use client';

import { Settings, Lock, Bell, User, Globe, Moon } from "lucide-react";

export default function SettingsPage() {
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
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile Details</h2>
                    </div>
                    <div className="p-8 flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
                                <input type="text" placeholder="John Doe" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#215732]/20" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Phone Number</label>
                                <input type="tel" placeholder="+970 599 000 000" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-[#215732]/20" />
                            </div>
                        </div>
                        <button className="w-fit bg-[#215732] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1a4528] transition-all shadow-lg shadow-[#215732]/20">Save Profile</button>
                    </div>
                </section>

                {/* Security Settings */}
                <section className="bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
                        <Lock className="w-5 h-5 text-[#215732]" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Security & Privacy</h2>
                    </div>
                    <div className="p-8 flex flex-col gap-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">Order Notifications</p>
                                    <p className="text-xs font-medium text-[#677279] dark:text-gray-400">Receive SMS for order updates</p>
                                </div>
                            </div>
                            <div className="w-12 h-6 bg-[#215732] rounded-full relative p-1 cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">Language / Currency</p>
                                    <p className="text-xs font-medium text-[#677279] dark:text-gray-400">English / USD</p>
                                </div>
                            </div>
                            <button className="text-sm font-bold text-[#215732] hover:underline">Change</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
