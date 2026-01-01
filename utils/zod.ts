import { z } from 'zod';

export const addressSchema = z.object({
    id: z.string().optional(),
    phone: z.string()
        .regex(/^[\d\s\+\-\(\)]+$/, 'Please enter a valid phone number')
        .min(10, 'Phone number must be at least 10 digits'),
    address1: z.string()
        .min(5, 'Address must be at least 5 characters')
        .max(200, 'Address is too long'),
    city: z.string()
        .min(2, 'City must be at least 2 characters')
        .max(100, 'City name is too long'),
    state: z.string()
        .min(2, 'State must be at least 2 characters')
        .max(50, 'State name is too long'),
    zipCode: z.string()
        .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'),
    country: z.string().min(1, 'Country is required'),
});

export type AddressFormData = z.infer<typeof addressSchema>;