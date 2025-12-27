'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentCustomer, getStoredAccessToken, signOut as shopifySignOut } from '@/lib/auth/shopify-auth';

interface Customer {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
}

interface AuthContextType {
    customer: Customer | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signOut: () => Promise<void>;
    refreshCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadCustomer = async () => {
        const token = getStoredAccessToken();

        if (!token) {
            setCustomer(null);
            setIsLoading(false);
            return;
        }

        try {
            const response = await getCurrentCustomer(token);

            if (response.success && response.customer) {
                setCustomer(response.customer);
            } else {
                setCustomer(null);
            }
        } catch (error) {
            console.error('Failed to load customer:', error);
            setCustomer(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        const token = getStoredAccessToken();
        if (token) {
            await shopifySignOut(token);
        }
        setCustomer(null);
    };

    useEffect(() => {
        loadCustomer();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                customer,
                isAuthenticated: !!customer,
                isLoading,
                signOut: handleSignOut,
                refreshCustomer: loadCustomer,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
