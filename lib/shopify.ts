
const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

import { ADMIN_CUSTOMER_BY_EMAIL, ADMIN_CUSTOMER_CREATE, CUSTOMER_ACCESS_TOKEN_CREATE, CUSTOMER_CREATE, CUSTOMER_QUERY, CUSTOMER_UPDATE_PROFILE } from '@/graphql/auth';
import * as storage from './auth/storage';
import { CustomerAccessTokenResult, CustomerQueryResult, ShopifyCustomer } from '@/types';
import { createUser, getUserByEmail } from './cereatAuthpass';
import { generateSecurePassword } from './auth';

interface ShopifyResponse<T> {
    data: T;
    errors?: Array<{ message: string }>;
}
interface AdminCustomerByEmailResult {
    customers: {
        edges: Array<{
            node: { id: string; email: string; state: string };
        }>;
    };
}

// ===========================================
// STOREFRONT API FETCH
// ===========================================
export async function shopifyFetch<T>({
    query,
    variables,
}: {
    query: string;
    variables?: Record<string, unknown>;
}): Promise<T> {
    if (!domain || !storefrontAccessToken) {
        console.error('❌ Missing Shopify credentials:');
        console.error('   SHOPIFY_STORE_DOMAIN:', domain ? '✓ Set' : '✗ Missing');
        console.error('   SHOPIFY_STOREFRONT_ACCESS_TOKEN:', storefrontAccessToken ? '✓ Set' : '✗ Missing');
        throw new Error('Shopify credentials not configured. Please check your .env file.');
    }

    const endpoint = `https://${domain}/api/2024-01/graphql.json`;
    console.log('🔄 Shopify API Request:', endpoint);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
            },
            body: JSON.stringify({ query, variables }),
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('❌ Shopify API Error Response:', text);
            throw new Error(`Shopify API returned ${response.status}: ${response.statusText}`);
        }

        const data: ShopifyResponse<T> = await response.json();

        if (data.errors) {
            console.error('❌ Shopify GraphQL Errors:', data.errors);
            throw new Error(data.errors[0]?.message || 'Shopify API error');
        }

        return data.data;
    } catch (error) {
        console.error('❌ Shopify Fetch Error:', error);
        throw error;
    }
}

// ===========================================
// ADMIN API FETCH
// ===========================================
export async function shopifyAdminFetch<T = any>(query: string, variables?: Record<string, unknown>): Promise<T> {
    if (!domain || !adminAccessToken) {
        throw new Error("Shopify Admin credentials not configured");
    }

    const response = await fetch(`https://${domain}/admin/api/2025-10/graphql.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": adminAccessToken,
        },
        body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("❌ Shopify Admin HTTP Error:", response.status);
        console.error("❌ Raw response:", text);
        throw new Error(`Shopify Admin HTTP ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) throw new Error(json.errors[0]?.message || "Shopify Admin API error");
    return json.data as T;
}

// ===========================================
// FIND CUSTOMER BY EMAIL (ADMIN API)
// ===========================================

export async function findShopifyCustomerByEmail(email: string): Promise<{ id: string; email: string; state: string } | null> {
    const normalizedEmail = email.toLowerCase().trim();
    const result = await shopifyAdminFetch<AdminCustomerByEmailResult>(
        ADMIN_CUSTOMER_BY_EMAIL,
        { email: `email:${normalizedEmail}` }
    );
    const customer = result?.customers?.edges?.[0]?.node;
    return customer ?? null;
}

/**
 * Create a new customer via Shopify Admin API
 */
async function createShopifyCustomer(email: string): Promise<{ id: string; email: string; password: string }> {
    const password = generateSecurePassword();
    const result = await shopifyFetch<{
        customerCreate: {
            customer: { id: string; email: string; state: string } | null;
            customerUserErrors: Array<{ message: string; code?: string; field?: string[] }>;
        };
    }>({
        query: CUSTOMER_CREATE,
        variables: { input: { email, password, acceptsMarketing: true } },
    });
    const { customer, customerUserErrors } = result.customerCreate;
    if (customerUserErrors?.length) {
        throw new Error(customerUserErrors[0].message);
    }

    if (!customer) {
        throw new Error('Failed to create customer');
    }
    const customerID = customer.id;
    await createUser(email, password, customerID);
    return { id: customer.id, email: customer.email, password: password };
}

/**
 * Create or get existing Shopify customer (Admin API)
 */
export async function createOrGetShopifyCustomer(email: string): Promise<{ success: boolean; customerId?: string; isNew?: boolean; error?: string }> {
    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail || !normalizedEmail.includes('@')) return { success: false, error: 'Invalid email address' };

    try {
        const existingCustomer = await findShopifyCustomerByEmail(normalizedEmail);
        if (existingCustomer) {
            if (existingCustomer.state === 'DISABLED') {
                return { success: false, error: 'This account has been disabled.' };
            }
            return { success: true, customerId: existingCustomer.id, isNew: false };
        }
        const newCustomer = await createShopifyCustomer(normalizedEmail);
        return { success: true, customerId: newCustomer.id, isNew: true };
    } catch (err: any) {
        console.error('Create/Get customer (Admin) error:', err);
        return { success: false, error: err?.message ?? 'Failed to process customer' };
    }
}

// ===========================================
// CUSTOMER ACCESS TOKEN
// ===========================================

export async function getCustomerAccessToken(email: string): Promise<{ accessToken?: string; expiresAt?: string; error?: string }> {
    try {
        const user = await getUserByEmail(email);
        if (!user || !user.password) return { error: 'Authentication session expired. Please request a new code.' };
        const result = await shopifyFetch<CustomerAccessTokenResult>({
            query: CUSTOMER_ACCESS_TOKEN_CREATE,
            variables: { input: { email: email, password: user.password } },
        });
        const { customerAccessToken, customerUserErrors } = result.customerAccessTokenCreate;
        if (customerUserErrors.length > 0) return { error: customerUserErrors[0].message };
        if (customerAccessToken) return { accessToken: customerAccessToken.accessToken, expiresAt: customerAccessToken.expiresAt };
        return { error: 'Failed to get access token' };
    } catch (error) {
        console.error('Get access token error:', error);
        return { error: 'Failed to authenticate' };
    }
}

// ===========================================
// AUTHENTICATE CUSTOMER (PASSWORDLESS FLOW)
// ===========================================
export async function authenticateCustomer(email: string): Promise<{ accessToken?: string; expiresAt?: string; error?: string }> {
    const password = await storage.getCustomerPassword(email);
    if (!password) return { error: 'Authentication session expired. Please request a new code.' };
    const result = await getCustomerAccessToken(email);
    if (result.accessToken) await storage.deleteCustomerPassword(email);
    return result;
}

// ===========================================
// GET CUSTOMER DATA
// ===========================================
export async function getCustomerByAccessToken(accessToken: string): Promise<ShopifyCustomer | null> {
    try {
        const result = await shopifyFetch<CustomerQueryResult>({ query: CUSTOMER_QUERY, variables: { customerAccessToken: accessToken } });
        return result.customer;
    } catch (error) {
        console.error('Get customer error:', error);
        return null;
    }
}

export async function updateCustomerProfile(accessToken: string, customerData: { firstName?: string; lastName?: string; phone?: string }): Promise<{ customer: ShopifyCustomer | null; error?: string }> {
    try {
        const result = await shopifyFetch<{
            customerUpdate: {
                customer: ShopifyCustomer | null;
                customerUserErrors: Array<{ message: string; field: string[] }>;
            }
        }>({
            query: CUSTOMER_UPDATE_PROFILE,
            variables: {
                customerAccessToken: accessToken,
                customer: customerData
            }
        });

        if (result.customerUpdate.customerUserErrors?.length > 0) {
            return {
                customer: null,
                error: result.customerUpdate.customerUserErrors[0].message
            };
        }

        return { customer: result.customerUpdate.customer, error: undefined };
    } catch (error: any) {
        console.error('Update customer profile error:', error);
        return { customer: null, error: error?.message || 'Failed to update profile' };
    }
}
