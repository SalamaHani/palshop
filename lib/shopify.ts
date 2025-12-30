const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
import * as storage from './auth/storage';

interface ShopifyResponse<T> {
    data: T;
    errors?: Array<{ message: string }>;
}

export async function shopifyFetch<T>({
    query,
    variables,
}: {
    query: string;
    variables?: Record<string, unknown>;
}): Promise<T> {
    const endpoint = `https://${domain}/api/2024-01/graphql.json`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        },
        body: JSON.stringify({ query, variables }),
    });

    const json: ShopifyResponse<T> = await response.json();

    if (json.errors) {
        console.error('Shopify API Error:', json.errors);
        throw new Error(json.errors[0]?.message || 'Shopify API error');
    }

    return json.data;
}

// ===========================================
// CUSTOMER MUTATIONS (Storefront API)
// ===========================================

export const CUSTOMER_CREATE = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_CREATE = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      phone
      acceptsMarketing
      createdAt
      defaultAddress {
        id
        address1
        address2
        city
        country
        province
        zip
      }
      orders(first: 10) {
        edges {
          node {
            id
            orderNumber
            totalPrice {
              amount
              currencyCode
            }
            processedAt
            fulfillmentStatus
          }
        }
      }
    }
  }
`;

// ===========================================
// TYPES
// ===========================================

interface CustomerCreateResult {
    customerCreate: {
        customer: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        } | null;
        customerUserErrors: Array<{
            code: string;
            field: string[];
            message: string;
        }>;
    };
}

interface CustomerAccessTokenResult {
    customerAccessTokenCreate: {
        customerAccessToken: {
            accessToken: string;
            expiresAt: string;
        } | null;
        customerUserErrors: Array<{
            code: string;
            field: string[];
            message: string;
        }>;
    };
}

interface CustomerQueryResult {
    customer: ShopifyCustomer | null;
}

export interface ShopifyCustomer {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    acceptsMarketing: boolean;
    createdAt: string;
    defaultAddress: {
        id: string;
        address1: string;
        address2: string | null;
        city: string;
        country: string;
        province: string;
        zip: string;
    } | null;
    orders: {
        edges: Array<{
            node: {
                id: string;
                orderNumber: number;
                totalPrice: {
                    amount: string;
                    currencyCode: string;
                };
                processedAt: string;
                fulfillmentStatus: string;
            };
        }>;
    };
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

// Store for customer passwords (in production, use Redis or database)
// Now using KV storage from lib/auth/storage.ts

/**
 * Generate a secure random password
 */
function generateSecurePassword(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    const array = new Uint32Array(32);
    crypto.getRandomValues(array);
    for (let i = 0; i < 32; i++) {
        password += chars[array[i] % chars.length];
    }
    return password;
}

/**
 * Create a new customer in Shopify or get existing one
 */
export async function createOrGetShopifyCustomer(
    email: string
): Promise<{ success: boolean; customerId?: string; isNew?: boolean; error?: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    try {
        // Generate a random password for new customers
        const password = generateSecurePassword();

        const result = await shopifyFetch<CustomerCreateResult>({
            query: CUSTOMER_CREATE,
            variables: {
                input: {
                    email: normalizedEmail,
                    password: password,
                    acceptsMarketing: false,
                },
            },
        });

        const { customer, customerUserErrors } = result.customerCreate;

        if (customerUserErrors.length > 0) {
            const error = customerUserErrors[0];

            // Customer already exists - that's fine for passwordless
            if (error.code === 'TAKEN') {
                console.log(`Customer ${normalizedEmail} already exists in Shopify`);
                return {
                    success: true,
                    isNew: false,
                };
            }

            // Customer is disabled
            if (error.code === 'CUSTOMER_DISABLED') {
                return {
                    success: false,
                    error: 'This account has been disabled. Please contact support.',
                };
            }

            return { success: false, error: error.message };
        }

        if (customer) {
            // Store password for this session (for getting access token later)
            await storage.storeCustomerPassword(normalizedEmail, password);

            console.log(`Created new Shopify customer: ${customer.id}`);
            return {
                success: true,
                customerId: customer.id,
                isNew: true,
            };
        }

        return { success: false, error: 'Failed to create customer' };
    } catch (error) {
        console.error('Create/get customer error:', error);
        return { success: false, error: 'Failed to process customer' };
    }
}

/**
 * Get customer access token
 */
export async function getCustomerAccessToken(
    email: string,
    password: string
): Promise<{ accessToken?: string; expiresAt?: string; error?: string }> {
    try {
        const result = await shopifyFetch<CustomerAccessTokenResult>({
            query: CUSTOMER_ACCESS_TOKEN_CREATE,
            variables: {
                input: {
                    email: email.toLowerCase().trim(),
                    password,
                },
            },
        });

        const { customerAccessToken, customerUserErrors } =
            result.customerAccessTokenCreate;

        if (customerUserErrors.length > 0) {
            return { error: customerUserErrors[0].message };
        }

        if (customerAccessToken) {
            return {
                accessToken: customerAccessToken.accessToken,
                expiresAt: customerAccessToken.expiresAt,
            };
        }

        return { error: 'Failed to get access token' };
    } catch (error) {
        console.error('Get access token error:', error);
        return { error: 'Failed to authenticate' };
    }
}

/**
 * Helper to authenticate customer using stored password
 */
export async function authenticateCustomer(email: string): Promise<{ accessToken?: string; expiresAt?: string; error?: string }> {
    const password = await storage.getCustomerPassword(email);
    if (!password) {
        return { error: 'Authentication session expired. Please request a new code.' };
    }

    const result = await getCustomerAccessToken(email, password);

    // Clean up password after use
    if (result.accessToken) {
        await storage.deleteCustomerPassword(email);
    }

    return result;
}

/**
 * Get customer data using access token
 */
export async function getCustomerByAccessToken(
    accessToken: string
): Promise<ShopifyCustomer | null> {
    try {
        const result = await shopifyFetch<CustomerQueryResult>({
            query: CUSTOMER_QUERY,
            variables: {
                customerAccessToken: accessToken,
            },
        });

        return result.customer;
    } catch (error) {
        console.error('Get customer error:', error);
        return null;
    }
}