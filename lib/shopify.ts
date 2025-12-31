const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
import { ADMIN_CUSTOMER_BY_EMAIL, ADMIN_CUSTOMER_CREATE, CUSTOMER_ACCESS_TOKEN_CREATE, CUSTOMER_QUERY } from '@/graphql/auth';
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
        throw new Error('Shopify credentials not configured');
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

        console.log('📡 Shopify Response Status:', response.status, response.statusText);

        if (!response.ok) {
            const text = await response.text();
            console.error('❌ Shopify API Error Response:', text);
            throw new Error(`Shopify API returned ${response.status}: ${response.statusText}`);
        }

        const text = await response.text();
        if (!text) throw new Error('Shopify returned empty response');

        let json: ShopifyResponse<T>;
        try {
            json = JSON.parse(text);
        } catch {
            console.error('❌ Failed to parse Shopify response:', text.substring(0, 500));
            throw new Error('Invalid JSON response from Shopify');
        }

        if (json.errors) {
            console.error('❌ Shopify GraphQL Errors:', json.errors);
            throw new Error(json.errors[0]?.message || 'Shopify API error');
        }

        console.log('✅ Shopify API Success');
        return json.data;
    } catch (error) {
        console.error('❌ Shopify Fetch Error:', error);
        throw error;
    }
}

// ===========================================
// ADMIN API FETCH
// ===========================================
export async function shopifyAdminFetch<T = any>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const response = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2025-10/graphql.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
        },
        body: JSON.stringify({ query, variables }),
    });

    const text = await response.text();

    if (!response.ok) {
        console.error("❌ Shopify HTTP Error:", response.status);
        console.error("❌ Raw response:", text);
        throw new Error(`Shopify HTTP ${response.status}`);
    }

    let json;
    try { json = JSON.parse(text); }
    catch { throw new Error("Shopify returned invalid JSON"); }

    if (json.errors) throw new Error(json.errors[0]?.message || "Shopify Admin API error");
    console.log("✅ Shopify Admin API Success" + json.data);
    return json.data as T; // ✅ now the return type is T
}




// ===========================================
// FIND CUSTOMER BY EMAIL (ADMIN API)
// ===========================================

export async function findShopifyCustomerByEmail(email: string): Promise<{ id: string; email: string; state: string } | null> {
    const normalizedEmail = email.toLowerCase().trim();
    const result = await shopifyAdminFetch<AdminCustomerByEmailResult>(
        ADMIN_CUSTOMER_BY_EMAIL,
        { email: `email:${normalizedEmail}` } // pass variables as 2nd argument
    );
    const customer = result?.customers?.edges?.[0]?.node;
    return customer ?? null;
}

/**
 * Create a new customer via Shopify Admin API
 */


async function createShopifyCustomer(email: string): Promise<{ id: string; email: string; password: string }> {
    const password = generateSecurePassword();
    const mutation = ADMIN_CUSTOMER_CREATE;
    const variables = {
        input: {
            email,
            password,
        },
    };
    const result = await shopifyAdminFetch<{
        customerCreate: {
            customer: { id: string; email: string; state: string } | null;
            customerUserErrors: Array<{ message: string; code?: string; field?: string[] }>;
        };
    }>(mutation, variables);
    const { customer, customerUserErrors } = result.customerCreate;
    if (customerUserErrors?.length) {
        throw new Error(customerUserErrors[0].message);
    }

    if (!customer) {
        throw new Error('Failed to create customer');
    }
    const customerID = customer.id;
    //cereat user databes
    await createUser(email, password, customerID);

    return { id: customer.id, email: customer.email, password: password };
}

/**
 * Create or get existing Shopify customer (Admin API)
 */
// ===========================================
// CREATE OR GET CUSTOMER (ADMIN API)
// ===========================================

export async function createOrGetShopifyCustomer(email: string): Promise<{ success: boolean; customerId?: string; isNew?: boolean; error?: string }> {
    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail || !normalizedEmail.includes('@')) return { success: false, error: 'Invalid email address' };

    try {
        // Generate a fresh password for this session
        // 1️⃣ Search existing customer
        const existingCustomer = await findShopifyCustomerByEmail(normalizedEmail);
        if (existingCustomer) {
            if (existingCustomer.state === 'DISABLED') {
                return { success: false, error: 'This account has been disabled.' };
            }
            const user = await getUserByEmail(normalizedEmail)
            // Store the password in Redis so we can use it during verification
            await storage.storeCustomerPassword(normalizedEmail, user?.password);
            // NOTE: In a real "passwordless" system, you might want to use the Admin API 
            // to update the customer's password to this new one, but for simplicity 
            // and security, we rely on the flow where we create/update the account.
            // For now, we will update the password via Admin API if we can, 
            // but setting it only on creation is what we had before.
            return { success: true, customerId: existingCustomer.id, isNew: false };
        }
        // 2️⃣ Create customer via Admin API
        const newCustomer = await createShopifyCustomer(normalizedEmail);

        // Store the password in Redis
        await storage.storeCustomerPassword(normalizedEmail, newCustomer.password);

        console.log(`✅ Shopify Admin API Success: Created customer ${newCustomer.email}`);
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
        const password = await storage.getCustomerPassword(email);
        if (!password) return { error: 'Authentication session expired. Please request a new code.' };
        const result = await shopifyFetch<CustomerAccessTokenResult>({
            query: CUSTOMER_ACCESS_TOKEN_CREATE,
            variables: { input: { email: email, password } },
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