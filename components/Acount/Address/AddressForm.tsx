'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Plus, User, Phone, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { createCustomerAddress, updateCustomerAddress } from '@/utils/action';
import { toast } from 'sonner';
import { useState, useTransition } from 'react';
import { Address } from '@/types';
import { AddressFormData, addressSchema } from '@/utils/zod';

interface AddressFormProps {
    userId: string;
    address?: Address;
    onSuccess?: () => void;
}

export function AddressForm({ userId, address, onSuccess }: AddressFormProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: address || {
            name: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'United States',
        },
    });

    async function onSubmit(data: AddressFormData) {
        startTransition(async () => {
            const result = address
                ? await updateCustomerAddress(data)
                : await createCustomerAddress(data);

            if (result.success) {
                toast.success(address ? 'Address updated!' : 'Address added!');
                setOpen(false);
                form.reset();
                onSuccess?.();
            } else {
                toast.error(result.error || 'Something went wrong');
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {address ? (
                    <Button variant="outline" size="sm">
                        Edit
                    </Button>
                ) : (
                    <Button
                        className="bg-[#215732] hover:bg-[#215732]/90 text-white shadow-lg shadow-[#215732]/20"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Address
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-[#215732]">
                        {address ? 'Edit Address' : 'Add New Address'}
                    </DialogTitle>
                    <DialogDescription>
                        {address ? 'Update your shipping address' : 'Add a new shipping address'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-[#215732]" />
                                            Full Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="John Doe"
                                                className="focus-visible:ring-[#215732] focus-visible:border-[#215732] focus-visible:shadow-lg focus-visible:shadow-[#215732]/20"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-[#215732]" />
                                            Phone Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="+1 234 567 8900"
                                                className="focus-visible:ring-[#215732] focus-visible:border-[#215732] focus-visible:shadow-lg focus-visible:shadow-[#215732]/20"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="addressLine1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Home className="w-4 h-4 text-[#215732]" />
                                        Address Line 1
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Street address"
                                            className="focus-visible:ring-[#215732] focus-visible:border-[#215732] focus-visible:shadow-lg focus-visible:shadow-[#215732]/20"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="addressLine2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address Line 2 (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Apartment, suite, etc."
                                            className="focus-visible:ring-[#215732] focus-visible:border-[#215732] focus-visible:shadow-lg focus-visible:shadow-[#215732]/20"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="New York"
                                                className="focus-visible:ring-[#215732] focus-visible:border-[#215732] focus-visible:shadow-lg focus-visible:shadow-[#215732]/20"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="NY"
                                                className="focus-visible:ring-[#215732] focus-visible:border-[#215732] focus-visible:shadow-lg focus-visible:shadow-[#215732]/20"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="zipCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ZIP Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="10001"
                                                className="focus-visible:ring-[#215732] focus-visible:border-[#215732] focus-visible:shadow-lg focus-visible:shadow-[#215732]/20"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="focus:ring-[#215732] focus:border-[#215732] focus:shadow-lg focus:shadow-[#215732]/20">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="United States">United States</SelectItem>
                                            <SelectItem value="Canada">Canada</SelectItem>
                                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                            <SelectItem value="Australia">Australia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="flex-1"
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-[#215732] hover:bg-[#215732]/90 text-white shadow-lg shadow-[#215732]/30"
                                disabled={isPending}
                            >
                                {isPending ? 'Saving...' : address ? 'Update Address' : 'Add Address'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}