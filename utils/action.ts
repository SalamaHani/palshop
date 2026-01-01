
'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { addressSchema, AddressFormData } from '@/utils/zod';
import { shopifyFetch } from '@/lib/shopify';
import { CustomerCreateAddressResult, CustomerDeleteAddressResult, CustomerUpdateResult } from '@/types';
import { CUSTOMER_ADDRESS_CREATE, CUSTOMER_ADDRESS_DELETE, CUSTOMER_ADDRESS_UPDATE } from '@/graphql/auth';
type ActionResult = {
    success: boolean;
    error?: string;
};
//update address    
export async function updateCustomerAddress(
    customerAccessToken: string,
    formData: AddressFormData
): Promise<ActionResult> {
    try {
        const address = addressSchema.parse(formData);

        const data = await shopifyFetch<CustomerUpdateResult>({
            query: CUSTOMER_ADDRESS_UPDATE,
            variables: {
                customerAccessToken,
                id: address.id,
                address,
            },
        });

        const result = data.customerUpdate;

        if (result.userErrors.length > 0) {
            return {
                success: false,
                error: result.userErrors[0].message,
            };
        }

        return {
            success: true,
        };
    } catch (err) {
        console.log(`Error updating address: ${err}`);
        if (err instanceof z.ZodError) {
            return { success: false, error: err.message };
        }
        return { success: false, error: 'Failed to update address' };
    }
}
//create address
export async function createAddress(
    customerAccessToken: string,
    formData: AddressFormData
): Promise<ActionResult> {
    try {
        const address = addressSchema.parse(formData);

        const data = await shopifyFetch<CustomerCreateAddressResult>({
            query: CUSTOMER_ADDRESS_CREATE,
            variables: {
                customerAccessToken,
                address
            },
        });

        const result = data.customerAddressCreate;
        if (result.userErrors.length > 0) {
            return {
                success: false,
                error: result.userErrors[0].message,
            };
        }
        revalidatePath('/account/addresses');
        return { success: true };
    } catch (err) {
        console.log(`Error creating address: ${err}`);
        if (err instanceof z.ZodError) {
            return { success: false, error: err.message };
        }
        return { success: false, error: 'Failed to create address' };
    }
}

//delete address
export async function deleteAddress(
    customerAccessToken: string,
    addressId: string
): Promise<ActionResult> {
    try {
        const data = await shopifyFetch<CustomerDeleteAddressResult>({
            query: CUSTOMER_ADDRESS_DELETE,
            variables: {
                customerAccessToken,
                id: addressId
            },
        });

        const result = data.customerAddressDelete;
        if (result.userErrors.length > 0) {
            return {
                success: false,
                error: result.userErrors[0].message,
            };
        }
        revalidatePath('/account/addresses');
        return { success: true };
    } catch (err) {
        console.log(`Error deleting address: ${err}`);
        if (err instanceof z.ZodError) {
            return { success: false, error: err.message };
        }
        return { success: false, error: 'Failed to delete address' };
    }
}
//set default address





// 'use server';
// import { revalidatePath } from 'next/cache';
// import { AddressFormData, addressSchema } from '@/utils/zod';

// import { z } from 'zod';
// // Import your database client (Prisma example)
// // import { prisma } from '@/lib/prisma';

// type ActionResult = {
//   success: boolean;
//   error?: string;
//   data?: any;
// };

// export async function createAddress(
//   userId: string,
//   formData: AddressFormData
// ): Promise<ActionResult> {
//   try {
//     // Validate with Zod
//     const validated = addressSchema.parse(formData);

//     // Save to database (example with Prisma)
//     // const address = await prisma.address.create({
//     //   data: {
//     //     ...validated,
//     //     userId,
//     //     isDefault: false,
//     //   },
//     // });

//     // Mock response for example
//     const address = {
//       id: Date.now().toString(),
//       ...validated,
//       userId,
//       isDefault: false,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     revalidatePath('/account/addresses');

//     return {
//       success: true,
//       data: address,
//     };
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return {
//         success: false,
//         error: error.errors[0]?.message || 'Validation failed',
//       };
//     }

//     return {
//       success: false,
//       error: 'Failed to create address',
//     };
//   }
// }

// export async function updateAddress(
//   addressId: string,
//   userId: string,
//   formData: AddressFormData
// ): Promise<ActionResult> {
//   try {
//     const validated = addressSchema.parse(formData);

//     // Update in database
//     // const address = await prisma.address.update({
//     //   where: { id: addressId, userId },
//     //   data: validated,
//     // });

//     const address = {
//       id: addressId,
//       ...validated,
//       userId,
//       isDefault: false,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     revalidatePath('/account/addresses');

//     return {
//       success: true,
//       data: address,
//     };
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return {
//         success: false,
//         error: error.errors[0]?.message || 'Validation failed',
//       };
//     }

//     return {
//       success: false,
//       error: 'Failed to update address',
//     };
//   }
// }

// export async function deleteAddress(
//   addressId: string,
//   userId: string
// ): Promise<ActionResult> {
//   try {
//     // await prisma.address.delete({
//     //   where: { id: addressId, userId },
//     // });

//     revalidatePath('/account/addresses');

//     return {
//       success: true,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: 'Failed to delete address',
//     };
//   }
// }

// export async function setDefaultAddress(
//   addressId: string,
//   userId: string
// ): Promise<ActionResult> {
//   try {
//     // Set all addresses to non-default
//     // await prisma.address.updateMany({
//     //   where: { userId },
//     //   data: { isDefault: false },
//     // });

//     // Set selected address as default
//     // await prisma.address.update({
//     //   where: { id: addressId, userId },
//     //   data: { isDefault: true },
//     // });

//     revalidatePath('/account/addresses');

//     return {
//       success: true,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: 'Failed to set default address',
//     };
//   }
// }

// export async function getAddresses(userId: string) {
//   try {
//     // const addresses = await prisma.address.findMany({
//     //   where: { userId },
//     //   orderBy: { isDefault: 'desc' },
//     // });

//     // Mock data for example
//     const addresses = [
//       {
//         id: '1',
//         name: 'John Doe',
//         phone: '+1 234 567 8900',
//         addressLine1: '123 Main Street',
//         addressLine2: 'Apt 4B',
//         city: 'New York',
//         state: 'NY',
//         zipCode: '10001',
//         country: 'United States',
//         isDefault: true,
//         userId,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ];

//     return addresses;
//   } catch (error) {
//     throw new Error('Failed to fetch addresses');
//   }
// }