const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
import * as storage from './auth/storage';

interface ShopifyResponse<T> {
    data: T;
    errors?: Array<{ message: string }>;
}

// export async function shopifyFetch<T>({
//     query,
//     variables,
// }: {
//     query: string;
//     variables?: Record<string, unknown>;
// }): Promise<T> {
//     const endpoint = `https://${domain}/api/2024-01/graphql.json`;

//     const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
//         },
//         body: JSON.stringify({ query, variables }),
//     });

//     const json: ShopifyResponse<T> = await response.json();

//     if (json.errors) {
//         console.error('Shopify API Error:', json.errors);
//         throw new Error(json.errors[0]?.message || 'Shopify API error');
//     }

//     return json.data;
// }
export async function shopifyFetch<T>({
    query,
    variables,
}: {
    query: string;
    variables?: Record<string, unknown>;
}): Promise<T> {
    // Check if credentials are set
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

        // Log response status
        console.log('📡 Shopify Response Status:', response.status, response.statusText);

        // Check for non-OK status
        if (!response.ok) {
            const text = await response.text();
            console.error('❌ Shopify API Error Response:', text);
            throw new Error(`Shopify API returned ${response.status}: ${response.statusText}`);
        }

        // Get response text first to debug
        const text = await response.text();

        if (!text) {
            console.error('❌ Shopify returned empty response');
            throw new Error('Shopify returned empty response');
        }

        // Try to parse JSON
        let json: ShopifyResponse<T>;
        try {
            json = JSON.parse(text);
        } catch (parseError) {
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
export const CUSTOMER_BY_EMAIL = `
query CUSTOMER_BY_EMAIL($query: String!) {
  customers(first: 1, query: $query) {
    edges {
      node {
        id
        email
        state
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
// Now using Redis storage from lib/auth/storage.ts

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
): Promise<{
    success: boolean;
    customerId?: string;
    isNew?: boolean;
    error?: string;
}> {
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
        return { success: false, error: 'Invalid email address' };
    }

    try {
        // 1️⃣ Search customer (NO rate limit issue)
        const search = await shopifyFetch<any>({
            query: CUSTOMER_BY_EMAIL,
            variables: {
                query: `email:${normalizedEmail}`,
            },
        });

        const existingCustomer =
            search?.customers?.edges?.[0]?.node;

        if (existingCustomer) {
            if (existingCustomer.state === 'DISABLED') {
                return {
                    success: false,
                    error: 'This account has been disabled.',
                };
            }

            // Existing customer → login continues
            return {
                success: true,
                customerId: existingCustomer.id,
                isNew: false,
            };
        }

        // 2️⃣ Create customer ONLY if not exists
        const create = await shopifyFetch<any>({
            query: CUSTOMER_CREATE,
            variables: {
                input: {
                    email: normalizedEmail,
                    acceptsMarketing: false,
                },
            },
        });

        const { customer, customerUserErrors } = create.customerCreate;

        if (customerUserErrors?.length) {
            return {
                success: false,
                error: customerUserErrors[0].message,
            };
        }

        if (!customer) {
            return { success: false, error: 'Failed to create customer' };
        }

        return {
            success: true,
            customerId: customer.id,
            isNew: true,
        };
    } catch (err: any) {
        console.error('Passwordless customer flow error:', err);
        return {
            success: false,
            error: err?.message ?? 'Failed to process request',
        };
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