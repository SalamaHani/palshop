'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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


        try {
            const response = await fetch('/api/customer/me');
            const data = await response.json();

            if (response.ok && data.authenticated && data.customer) {
                setCustomer(data.customer);
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
        try {
            await fetch('/api/auth/signout', { method: 'POST' });
            setCustomer(null);
        } catch (error) {
            console.error('Sign out error:', error);
            // Still clear local state even if API call fails
            setCustomer(null);
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
