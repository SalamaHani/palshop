'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { AddressFormData, addressSchema } from '@/utils/zod';
import { COUNTRIES } from '@/utils/countries';
import { createCustomerAddress, updateCustomerAddress } from '@/utils/action';

export interface AddressFormProps {
    userId: string;
    address?: AddressFormData;
    onSuccess?: () => void;
}

export function AddressForm({ userId, address, onSuccess }: AddressFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: address || {
            phone: '',
            address1: '',
            address2: '',
            city: '',
            province: '',
            zip: '',
            country: 'Palestine',
        },
    });

    const selectedCountry = watch('country');

    useState(() => {
        setMounted(true);
    });

    async function onSubmit(data: AddressFormData) {
        setIsLoading(true);
        try {
            const result = address
                ? await updateCustomerAddress(data)
                : await createCustomerAddress(data);

            if (result.success) {
                toast.success(address ? 'Address updated successfully' : 'Address added successfully');
                setIsOpen(false);
                reset();
                onSuccess?.();
            } else {
                toast.error(result.error || 'Something went wrong');
            }
        } catch (error) {
            console.error('Address error:', error);
            toast.error('Failed to save address');
        } finally {
            setIsLoading(false);
        }
    }

    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-300 group z-10"
                        >
                            <X className="w-5 h-5 text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors" />
                        </button>

                        {/* Header */}
                        <div className="px-8 pt-8 pb-6 border-b border-gray-100 dark:border-white/5">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {address ? 'Edit Address' : 'Add New Address'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {address ? 'Update your shipping address' : 'Add a new shipping address'}
                            </p>
                        </div>

                        {/* Form Content - Scrollable */}
                        <div className="overflow-y-auto flex-1 px-8 py-6">
                            <form id="address-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Phone Number
                                    </label>
                                    <input
                                        {...register('phone')}
                                        type="tel"
                                        placeholder="+970 599 000 000"
                                        className={`w-full px-4 py-3 bg-white dark:bg-black border rounded-xl outline-none transition-all duration-200 text-base font-medium placeholder:text-gray-400 ${errors.phone
                                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                            : 'border-gray-200 dark:border-white/10 focus:border-[#215732] focus:ring-2 focus:ring-[#215732]/20'
                                            }`}
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>

                                {/* Address */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Street Address
                                    </label>
                                    <input
                                        {...register('address1')}
                                        type="text"
                                        placeholder="123 Main Street"
                                        className={`w-full px-4 py-3 bg-white dark:bg-black border rounded-xl outline-none transition-all duration-200 text-base font-medium placeholder:text-gray-400 ${errors.address1
                                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                            : 'border-gray-200 dark:border-white/10 focus:border-[#215732] focus:ring-2 focus:ring-[#215732]/20'
                                            }`}
                                    />
                                    {errors.address1 && (
                                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                            {errors.address1.message}
                                        </p>
                                    )}
                                </div>

                                {/* Address 2 */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Apartment, suite, etc. (optional)
                                    </label>
                                    <input
                                        {...register('address2')}
                                        type="text"
                                        placeholder="Apt 4B, Building C"
                                        className={`w-full px-4 py-3 bg-white dark:bg-black border rounded-xl outline-none transition-all duration-200 text-base font-medium placeholder:text-gray-400 ${errors.address2
                                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                            : 'border-gray-200 dark:border-white/10 focus:border-[#215732] focus:ring-2 focus:ring-[#215732]/20'
                                            }`}
                                    />
                                </div>

                                {/* City, State, ZIP - Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* City */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            City
                                        </label>
                                        <input
                                            {...register('city')}
                                            type="text"
                                            placeholder="Ramallah"
                                            className={`w-full px-4 py-3 bg-white dark:bg-black border rounded-xl outline-none transition-all duration-200 text-base font-medium placeholder:text-gray-400 ${errors.city
                                                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                                : 'border-gray-200 dark:border-white/10 focus:border-[#215732] focus:ring-2 focus:ring-[#215732]/20'
                                                }`}
                                        />
                                        {errors.city && (
                                            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                                {errors.city.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* State/Province */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            State/Province
                                        </label>
                                        <input
                                            {...register('province')}
                                            type="text"
                                            placeholder="West Bank"
                                            className={`w-full px-4 py-3 bg-white dark:bg-black border rounded-xl outline-none transition-all duration-200 text-base font-medium placeholder:text-gray-400 ${errors.province
                                                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                                : 'border-gray-200 dark:border-white/10 focus:border-[#215732] focus:ring-2 focus:ring-[#215732]/20'
                                                }`}
                                        />
                                        {errors.province && (
                                            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                                {errors.province.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* ZIP/Postal Code */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            ZIP/Postal
                                        </label>
                                        <input
                                            {...register('zip')}
                                            type="text"
                                            placeholder="12345"
                                            className={`w-full px-4 py-3 bg-white dark:bg-black border rounded-xl outline-none transition-all duration-200 text-base font-medium placeholder:text-gray-400 ${errors.zip
                                                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                                : 'border-gray-200 dark:border-white/10 focus:border-[#215732] focus:ring-2 focus:ring-[#215732]/20'
                                                }`}
                                        />
                                        {errors.zip && (
                                            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                                {errors.zip.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Country */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Country
                                    </label>
                                    <select
                                        {...register('country')}
                                        className={`w-full px-4 py-3 bg-white dark:bg-black border rounded-xl outline-none transition-all duration-200 text-base font-medium ${errors.country
                                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                            : 'border-gray-200 dark:border-white/10 focus:border-[#215732] focus:ring-2 focus:ring-[#215732]/20'
                                            }`}
                                    >
                                        {COUNTRIES.map((country) => (
                                            <option key={country} value={country}>
                                                {country}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.country && (
                                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                            {errors.country.message}
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-8 py-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-3 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white font-semibold rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="address-form"
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-3 bg-[#215732] text-white font-semibold rounded-full hover:bg-[#1a4528] transition-all shadow-lg shadow-[#215732]/20 disabled:opacity-50 flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : address ? (
                                        'Update Address'
                                    ) : (
                                        'Save Address'
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            {/* Trigger Button */}
            {address ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg transition-all"
                >
                    Edit
                </button>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-6 py-3 bg-[#215732] text-white font-semibold rounded-full hover:bg-[#1a4528] transition-all shadow-lg shadow-[#215732]/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add New Address
                </button>
            )}

            {/* Modal Portal */}
            {mounted && createPortal(modalContent, document.body)}
        </>
    );
}