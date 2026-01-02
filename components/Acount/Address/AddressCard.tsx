'use client';

import { useState, useTransition } from 'react';
import { MapPin, Phone, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { AddressForm } from './AddressForm';
import { toast } from 'sonner';
import { deleteAddress } from '@/utils/action';
import { AddressFormData } from '@/utils/zod';

export interface AddressCardProps {
    address: AddressFormData;
    userId: string;
    onUpdate?: () => void;
}

import { motion } from 'framer-motion';

export function AddressCard({ address, userId, onUpdate }: AddressCardProps) {
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        startTransition(async () => {
            const result = await deleteAddress(address?.id ?? '');
            if (result.success) {
                toast.success('Address deleted successfully');
                onUpdate?.();
            } else {
                toast.error(result.error || 'Failed to delete');
            }
        });
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white dark:bg-[#0d0d0d] border-gray-100 dark:border-white/5 hover:border-[#215732]/30 rounded-2xl">
                {/* Decorative background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#215732]/5 rounded-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110" />

                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
                        <div className="w-8 h-8 rounded-full bg-[#215732]/10 flex items-center justify-center">
                            <Phone className="w-4 h-4 text-[#215732]" />
                        </div>
                        <span className="text-sm font-bold tracking-tight">{address.phone}</span>
                    </div>

                    <div className="space-y-1">
                        <p className="font-black text-lg text-gray-900 dark:text-white tracking-tight leading-tight">
                            {address.address1}{address.address2 ? `, ${address.address2}` : ''}
                        </p>
                        <p className="text-[#677279] dark:text-gray-400 font-medium text-sm">
                            {address.city}, {address.province} {address.zip}
                        </p>
                        <div className="flex items-center gap-1.5 pt-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{address.country}</p>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex-1">
                            <AddressForm userId={userId} address={address} onSuccess={onUpdate} />
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isPending}
                                    className="rounded-xl border-gray-200 dark:border-white/10 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-300 px-4"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-2xl font-bold">Delete Address?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-500 py-2">
                                        This action cannot be undone. This address will be removed from your account permanently.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-2">
                                    <AlertDialogCancel className="rounded-full px-6 bg-gray-100 border-none font-bold">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="rounded-full px-6 bg-red-500 hover:bg-red-600 font-bold shadow-lg shadow-red-500/20"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}