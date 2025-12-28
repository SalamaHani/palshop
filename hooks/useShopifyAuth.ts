// hooks/useShopifyAuth.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function useShopifyAuth() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshCustomer } = useAuth();

    // Check for auth success/error on page load
    useEffect(() => {
        const authSuccess = searchParams.get('auth_success');
        const authError = searchParams.get('auth_error');
        const message = searchParams.get('message');

        if (authSuccess === 'true') {
            console.log('[Auth] ✅ Authentication successful');

            // Refresh customer data
            refreshCustomer();

            // Clean up URL parameters
            const url = new URL(window.location.href);
            url.searchParams.delete('auth_success');
            window.history.replaceState({}, '', url.toString());
        }

        if (authError) {
            console.error('[Auth] ❌ Authentication error:', authError);
            setError(message || 'Authentication failed');

            // Clean up URL parameters
            const url = new URL(window.location.href);
            url.searchParams.delete('auth_error');
            url.searchParams.delete('message');
            window.history.replaceState({}, '', url.toString());
        }
    }, [searchParams, refreshCustomer]);

    /**
     * Redirects to Shopify OAuth (same-page flow like shop.app)
     */
    const loginWithRedirect = useCallback((email: string) => {
        setIsLoading(true);
        setError(null);

        // Validate email
        if (!email || !email.includes('@')) {
            setError('Valid email is required');
            setIsLoading(false);
            return;
        }

        console.log('[Auth] 🔐 Redirecting to Shopify OAuth...');

        // Get current page URL to return to after auth
        const returnTo = window.location.pathname + window.location.search;

        // Redirect to auth init (which will redirect to Shopify, then back here)
        window.location.href = `/api/auth/shopify/init?email=${encodeURIComponent(email)}&returnTo=${encodeURIComponent(returnTo)}`;
    }, []);

    /**
     * Opens Shopify OAuth in a popup window (alternative method)
     */
    const loginWithPopup = useCallback(async (email: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            // Validate email
            if (!email || !email.includes('@')) {
                throw new Error('Valid email is required');
            }

            // Calculate popup position (centered on screen)
            const width = 500;
            const height = 700;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;

            // Get return URL
            const returnTo = window.location.pathname;

            // Open popup window
            const popup = window.open(
                `/api/auth/shopify/init?email=${encodeURIComponent(email)}&returnTo=${encodeURIComponent(returnTo)}`,
                'shopify-auth',
                `width=${width},height=${height},left=${left},top=${top},` +
                `toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
            );

            if (!popup) {
                throw new Error('Popup blocked. Please allow popups for this site.');
            }

            console.log('[Auth] 🔐 Popup opened, waiting for completion...');

            // Wait for popup to close or redirect
            const result = await waitForPopupClose(popup);

            if (result) {
                console.log('[Auth] ✅ Authentication successful');

                // Refresh customer data
                await refreshCustomer();

                setIsLoading(false);
                return true;
            } else {
                throw new Error('Authentication cancelled');
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
            console.error('[Auth] ❌ Error:', errorMessage);
            setError(errorMessage);
            setIsLoading(false);
            return false;
        }
    }, [refreshCustomer]);

    return {
        loginWithRedirect,
        loginWithPopup,
        isLoading,
        error,
        clearError: () => setError(null)
    };
}

/**
 * Waits for popup to close (either canceled or successful auth redirect)
 */
function waitForPopupClose(popup: Window): Promise<boolean> {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkInterval);
                clearTimeout(timeout);
                // Check if we have auth cookies (popup successfully authenticated)
                // We'll know from the URL params when page reloads
                resolve(true);
            }
        }, 500);

        // Timeout after 5 minutes
        const timeout = setTimeout(() => {
            clearInterval(checkInterval);
            if (!popup.closed) {
                popup.close();
            }
            resolve(false);
        }, 5 * 60 * 1000);
    });
}
