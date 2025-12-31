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
    logout: () => Promise<void>;
    refreshCustomer: () => Promise<void>;
    isAuthModalOpen: boolean;
    setIsAuthModalOpen: (open: boolean) => void;
    updateProfile: (firstName: string, phone: string) => Promise<void>;
}
interface User {
    email: string;
    customerId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

    const loadCustomer = async () => {
        try {
            const response = await fetch('/api/auth/session');
            const data = await response.json();
            if (response.ok && data.authenticated) {
                setCustomer({
                    id: data.customerId || '',
                    email: data.email,
                });
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
    useEffect(() => {
        loadCustomer();
    }, []);
    async function logout() {
        try {
            await fetch('/api/auth/signout', { method: 'POST' });
            setCustomer(null);
        } catch (error) {
            console.error('Sign out error:', error);
            // Still clear local state even if API call fails
            setCustomer(null);
        }
        setCustomer(null);
    }
    async function updateProfile(firstName: string, phone: string) {
        try {
            await fetch('/api/customer/update', { method: 'POST' });
            setCustomer(null);
        } catch (error) {
            console.error('Sign out error:', error);
            // Still clear local state even if API call fails
            setCustomer(null);
        }
        setCustomer(null);
    }

    return (
        <AuthContext.Provider
            value={{
                customer,
                isAuthenticated: !!customer,
                isLoading,
                logout,
                refreshCustomer: loadCustomer,
                isAuthModalOpen,
                setIsAuthModalOpen,
                updateProfile,
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
