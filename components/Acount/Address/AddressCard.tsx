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
    onUpdate: () => void;
}

export function AddressCard({ address, userId, onUpdate }: AddressCardProps) {
    const [isPending, startTransition] = useTransition();



    function handleDelete() {
        startTransition(async () => {
            const result = await deleteAddress(address?.id ?? '');
            if (result.success) {
                toast.success('Address deleted!');
                onUpdate();
            } else {
                toast.error(result.error || 'Failed to delete');
            }
        });
    }

    return (
        <Card className="relative hover:shadow-xl transition-all duration-300 bg-white border-slate-200 hover:border-[#215732]/30">
            {!address && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#215732] shadow-md">
                    Default
                </div>
            )}
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4 text-[#215732]" />
                    <span className="text-sm">{address.phone}</span>
                </div>

                <div className="text-sm text-slate-700 leading-relaxed">
                    <p>{address.address1}</p>
                    {address.address1 && <p>{address.address1}</p>}
                    <p>
                        {address.city}, {address.province} {address.zip}
                    </p>
                    <p>{address.country}</p>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                    <AddressForm userId={userId} address={address} onSuccess={onUpdate} />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isPending}
                                className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Address?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this address.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-red-500 hover:bg-red-600"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}