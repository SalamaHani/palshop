import { z } from 'zod';

export const addressSchema = z.object({
    id: z.string().optional(),
    phone: z.string()
        .min(1, 'Phone number is required')
        .regex(/^[\d\s\+\-\(\)]+$/, 'Please enter a valid phone number'),
    address1: z.string()
        .min(1, 'Address is required')
        .min(5, 'Address must be at least 5 characters')
        .max(200, 'Address is too long'),
    city: z.string()
        .min(1, 'City is required')
        .min(2, 'City must be at least 2 characters')
        .max(100, 'City name is too long'),
    state: z.string()
        .min(1, 'State/Province is required')
        .max(50, 'State name is too long'),
    zipCode: z.string()
        .min(1, 'Postal/ZIP code is required')
        .max(20, 'Postal code is too long'),
    country: z.string()
        .min(1, 'Country is required'),
});

export type AddressFormData = z.infer<typeof addressSchema>;