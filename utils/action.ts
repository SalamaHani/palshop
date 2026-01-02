
'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { addressSchema, AddressFormData } from '@/utils/zod';
import { shopifyFetch } from '@/lib/shopify';
import { CustomerAddressesResult, CustomerCreateAddressResult, CustomerDeleteAddressResult, CustomerUpdateAddressResult } from '@/types';
import { CUSTOMER_ADDRESS_CREATE, CUSTOMER_ADDRESS_DELETE, CUSTOMER_ADDRESS_UPDATE, CUSTOMER_ADDRESSES } from '@/graphql/auth';
import { getSessionHelper } from './session';
import serverBugsnag from '@/lib/bugsangSerever';

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

export async function fetchShopifyToken() {
    const sessionDB = await getSessionHelper();

    if (!sessionDB?.shopify_customer_token) {
        throw new Error("Customer not logged in or token missing");
    }

    const customerAccessToken = sessionDB.shopify_customer_token;
    return customerAccessToken;
}

// update address    
export async function updateCustomerAddress(
    formData: AddressFormData
): Promise<ActionResult> {
    try {
        const validatedData = addressSchema.parse(formData);
        const { id, ...addressInput } = validatedData;

        if (!id) {
            return { success: false, error: 'Address ID is missing' };
        }

        const data = await shopifyFetch<CustomerUpdateAddressResult>({
            query: CUSTOMER_ADDRESS_UPDATE,
            variables: {
                customerAccessToken: await fetchShopifyToken(),
                id: id,
                address: addressInput,
            },
        });

        const result = data.customerAddressUpdate;

        if (result?.customerUserErrors?.length > 0) {
            return {
                success: false,
                error: result.customerUserErrors[0].message,
            };
        }

        revalidatePath('/account/addresses');
        return {
            success: true,
        };
    } catch (err) {
        console.log(`Error updating address: ${err}`);
        if (err instanceof z.ZodError) {
            return { success: false, error: err.message };
        }
        serverBugsnag.notify(err instanceof Error ? err : new Error(String(err)));
        return { success: false, error: 'Failed to update address. Please check your connection.' };
    }
}

// create address
export async function createCustomerAddress(
    formData: AddressFormData
): Promise<ActionResult> {
    try {
        const validatedData = addressSchema.parse(formData);
        const { id, ...addressInput } = validatedData;

        const data = await shopifyFetch<CustomerCreateAddressResult>({
            query: CUSTOMER_ADDRESS_CREATE,
            variables: {
                customerAccessToken: await fetchShopifyToken(),
                address: addressInput
            },
        });
        const result = data.customerAddressCreate;
        if (result?.customerUserErrors?.length > 0) {
            return {
                success: false,
                error: result.customerUserErrors[0].message,
            };
        }
        revalidatePath('/account/addresses');
        return { success: true };
    } catch (err) {
        console.log(`Error creating address: ${err}`);
        if (err instanceof z.ZodError) {
            return { success: false, error: err.message };
        }
        serverBugsnag.notify(err instanceof Error ? err : new Error(String(err)));
        return { success: false, error: 'Failed to create address. Please check your connection.' };
    }
}

// delete address
export async function deleteAddress(
    addressId: string
): Promise<ActionResult> {
    try {
        const data = await shopifyFetch<CustomerDeleteAddressResult>({
            query: CUSTOMER_ADDRESS_DELETE,
            variables: {
                customerAccessToken: await fetchShopifyToken(),
                id: addressId
            },
        });

        const result = data.customerAddressDelete;
        if (result?.customerUserErrors?.length > 0) {
            return {
                success: false,
                error: result.customerUserErrors[0].message,
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

export async function getAddresses(): Promise<AddressResult> {
    try {
        const data = await shopifyFetch<CustomerAddressesResult>({
            query: CUSTOMER_ADDRESSES,
            variables: {
                customerAccessToken: await fetchShopifyToken(),
            },
        });

        const customer = data?.customer;

        if (!customer || !customer.addresses) {
            return {
                success: false,
                error: 'Customer or addresses not found',
            };
        }

        return {
            success: true,
            data: customer.addresses.edges
        };
    } catch (err) {
        console.log(`Error getting addresses: ${err}`);
        if (err instanceof z.ZodError) {
            return { success: false, error: err.message };
        }
        return { success: false, error: 'Failed to get addresses' };
    }
}