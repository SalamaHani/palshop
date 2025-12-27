/**
 * Shopify Headless Authentication Helper
 * 
 * This file provides authentication utilities for Shopify Headless Commerce.
 * It handles requests to both the Storefront API and the Customer Account API.
 */

import {
    CUSTOMER_ACCESS_TOKEN_CREATE,
    CUSTOMER_SEND_LOGIN_CODE,
    CUSTOMER_VERIFY_CODE,
    CUSTOMER_QUERY,
    CUSTOMER_ACCESS_TOKEN_DELETE
} from '@/graphql/auth';

import { fetchShopify } from '@/shopify/client';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

export interface AuthResponse {
    success: boolean;
    customer?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
    };
    error?: string;
    accessToken?: string;
    encryptedState?: string;
}

/**
 * Helper for Storefront API requests
 */
async function storefrontFetch(query: any, variables: any = {}) {
    return fetchShopify(query, variables, 'storefront');
}

/**
 * Helper for Customer Account API requests
 */
async function customerAccountFetch(query: any, variables: any = {}) {
    return fetchShopify(query, variables, 'customer-account');
}

/**
 * Sends a verification code to the user's email.
 * Uses the Customer Account API (with the NextStep pattern).
 */
export async function sendVerificationCode(email: string): Promise<AuthResponse> {
    try {
        console.log(`[Shopify Auth] Requesting verification code for ${email}`);

        const data = await customerAccountFetch(CUSTOMER_SEND_LOGIN_CODE, { email });
        const loginData = data.customerSendLoginCode;

        // Handle Customer Account API errors (both old and new structure)
        const userErrors = loginData?.emailInputNextStep?.userErrors || [];
        const customerErrors = loginData?.customerUserErrors || [];
        const allErrors = [...userErrors, ...customerErrors];

        if (allErrors.length > 0) {
            return { success: false, error: allErrors[0].message };
        }

        return {
            success: true,
            encryptedState: loginData?.emailInputNextStep?.encryptedState
        };
    } catch (error) {
        console.error('Send verification code error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send code'
        };
    }
}

/**
 * Verifies the code and returns a token.
 * Uses the Customer Account API (with the NextStep pattern).
 */
export async function verifyCode(email: string, code: string, encryptedState?: string): Promise<AuthResponse> {
    try {
        console.log(`[Shopify Auth] Verifying code for ${email}`);

        const data = await customerAccountFetch(CUSTOMER_VERIFY_CODE, {
            email,
            code,
            encryptedState
        });

        const verifyData = data.customerVerifyCode;
        const { customerAccessToken } = verifyData || {};

        // Handle errors
        const userErrors = verifyData?.customerAccessTokenNextStep?.userErrors || [];
        const customerErrors = verifyData?.customerUserErrors || [];
        const allErrors = [...userErrors, ...customerErrors];

        if (allErrors.length > 0) {
            return { success: false, error: allErrors[0].message };
        }

        if (customerAccessToken?.accessToken) {
            const customerData = await getCurrentCustomer(customerAccessToken.accessToken);
            return {
                success: true,
                accessToken: customerAccessToken.accessToken,
                customer: customerData.customer
            };
        }

        return { success: false, error: 'Failed to obtain access token' };
    } catch (error) {
        console.error('Verify code error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Verification failed',
        };
    }
}

/**
 * Sign in with email and password (Storefront API)
 * Note: Password auth is deprecated in favor of email verification codes.
 */
export async function signInWithEmail(email: string, password: string = 'customer123'): Promise<AuthResponse> {
    try {
        const data = await storefrontFetch(CUSTOMER_ACCESS_TOKEN_CREATE, {
            input: { email, password }
        });

        const { customerAccessToken, customerUserErrors } = data.customerAccessTokenCreate;

        if (customerUserErrors?.length > 0) {
            return { success: false, error: customerUserErrors[0].message };
        }

        if (customerAccessToken?.accessToken) {
            const customerData = await getCurrentCustomer(customerAccessToken.accessToken);
            return {
                success: true,
                accessToken: customerAccessToken.accessToken,
                customer: customerData.customer
            };
        }

        return { success: false, error: 'Authentication failed' };
    } catch (error) {
        console.error('Sign in error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Authentication failed',
        };
    }
}

/**
 * Get current authenticated customer details (Storefront API)
 */
export async function getCurrentCustomer(accessToken: string): Promise<AuthResponse> {
    try {
        const data = await storefrontFetch(CUSTOMER_QUERY, { customerAccessToken: accessToken });

        if (data.customer) {
            return {
                success: true,
                customer: data.customer,
            };
        }

        return { success: false, error: 'Customer not found' };
    } catch (error) {
        console.error('Get customer error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to query customer',
        };
    }
}

/**
 * Sign out current customer (Storefront API)
 */
export async function signOut(accessToken: string): Promise<boolean> {
    try {
        await storefrontFetch(CUSTOMER_ACCESS_TOKEN_DELETE, { customerAccessToken: accessToken });

        if (typeof window !== 'undefined') {
            localStorage.removeItem('shopify_customer_token');
            destroyCookie(null, 'customerAccessToken');
        }
        return true;
    } catch (error) {
        console.error('Sign out error:', error);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('shopify_customer_token');
            destroyCookie(null, 'customerAccessToken');
        }
        return true;
    }
}

/**
 * Token Persistence utilities
 */
export function storeAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
        setCookie(
            null,
            "customerAccessToken",
            token,
            {
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                sameSite: 'Lax',
                secure: process.env.NODE_ENV === 'production'
            }
        );
    }
}

export function getStoredAccessToken(): string | null {
    if (typeof window !== 'undefined') {
        const cookies = parseCookies();
        return cookies.customerAccessToken || null;
    }
    return null;
}

/**
 * Mock Passkey Sign In
 */
export async function signInWithPasskey(): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
        success: true,
        accessToken: 'passkey_mock_token',
        customer: {
            id: 'gid://shopify/Customer/9999',
            email: 'passkey.user@example.com',
            firstName: 'Passkey',
            lastName: 'User'
        }
    };
}
