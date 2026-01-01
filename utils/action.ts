
'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { addressSchema, AddressFormData } from '@/utils/zod';
import { shopifyFetch } from '@/lib/shopify';
import { CustomerAddress, CustomerAddressesResult, CustomerCreateAddressResult, CustomerDeleteAddressResult, CustomerUpdateResult } from '@/types';
import { CUSTOMER_ADDRESS_CREATE, CUSTOMER_ADDRESS_DELETE, CUSTOMER_ADDRESS_UPDATE, CUSTOMER_ADDRESSES } from '@/graphql/auth';
import { getSession } from '@/lib/auth';
import { getSessionDB } from '@/lib/cereatAuthpass';
type ActionResult = {
    success: boolean;
    error?: string;
};
export type ShopifyAddressNode = {
    node: AddressFormData;
};
type AddressResult = {
    success: boolean;
    error?: string;
    data?: ShopifyAddressNode[];
};
const session = await getSession();
const sessionDB = await getSessionDB(session?.session_id);
const customerAccessToken = sessionDB?.shopify_customer_token
//update address    
export async function updateCustomerAddress(
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
export async function createCustomerAddress(
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
} export async function getAddresses(): Promise<AddressResult> {
    try {
        const data = await shopifyFetch<CustomerAddressesResult>({
            query: CUSTOMER_ADDRESSES,
            variables: {
                customerAccessToken,
            },
        });
        const result = data.customerAddresses;
        if (result.userErrors.length > 0) {
            return {
                success: false,
                error: result.userErrors[0].message,
            };
        }
        return { success: true, data: result.edges };
    } catch (err) {
        console.log(`Error getting addresses: ${err}`);
        if (err instanceof z.ZodError) {
            return { success: false, error: err.message };
        }
        return { success: false, error: 'Failed to get addresses' };
    }
}