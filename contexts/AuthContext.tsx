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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);


    const loadCustomer = async () => {
        try {
            const response = await fetch('/api/auth/session');
            const data = await response.json();

            if (response.ok && data.authenticated) {
                setIsAuthenticated(true);
                setCustomer({
                    id: data.customerId || '',
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
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
            await fetch('/api/auth/logout', { method: 'POST' });
            setCustomer(null);
        } catch (error) {
            console.error('Sign out error:', error);
            setCustomer(null);
        }
    }

    async function updateProfile(firstName: string, phone: string) {
        try {
            const response = await fetch('/api/customer/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, phone }),
            });

            if (response.ok) {
                // Refresh customer data after update
                await loadCustomer();
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    }

    return (
        <AuthContext.Provider
            value={{
                customer,
                isAuthenticated,
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
