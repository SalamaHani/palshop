'use client';

import { MapPin, Plus } from "lucide-react";

export default function AddressesPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Addresses</h1>
                    <p className="text-[#677279] dark:text-gray-400 mt-2 font-medium">Manage your shipping and billing addresses</p>
                </div>
                <button className="flex items-center gap-2 bg-[#215732] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#1a4528] transition-all shadow-lg shadow-[#215732]/20 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    Add Address
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Default Address Mock */}
                <div className="bg-white dark:bg-[#0d0d0d] p-6 rounded-2xl border-2 border-[#215732] relative group">
                    <div className="absolute top-6 right-6 px-2 py-1 bg-[#215732] text-white text-[10px] font-bold rounded uppercase">Default</div>
                    <div className="flex flex-col gap-4">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">Shipping Address</p>
                            <div className="mt-2 text-[#677279] dark:text-gray-400 font-medium text-[15px] space-y-0.5">
                                <p>Palestine, Ramallah</p>
                                <p>Al-Irsal Street, Building 5</p>
                                <p>Apartment 12</p>
                                <p>Phone: +970 599 000 000</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <button className="text-sm font-bold text-[#215732] hover:underline cursor-pointer">Edit</button>
                            <button className="text-sm font-bold text-red-500 hover:underline cursor-pointer">Delete</button>
                        </div>
                    </div>
                </div>

                {/* Add New Placeholder */}
                <button className="bg-dashed border-2 border-dashed border-gray-200 dark:border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#215732] transition-colors group cursor-pointer">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center group-hover:bg-[#215732]/10 transition-colors">
                        <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#215732] transition-colors" />
                    </div>
                    <p className="font-bold text-gray-500 group-hover:text-[#215732] transition-colors">Add New Address</p>
                </button>
            </div>
        </div>
    );
}
