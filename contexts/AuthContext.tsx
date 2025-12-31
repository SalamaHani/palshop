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
}
interface User {
    email: string;
    customerId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

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



    useEffect(() => {
        loadCustomer();
    }, []);
    async function checkSession() {
        try {
            const res = await fetch('/api/auth/session');
            const data = await res.json();

            if (data.authenticated) {
                setUser({ email: data.email, customerId: data.customerId });
            }
        } catch (error) {
            console.error('Session check failed:', error);
        } finally {
            setLoading(false);
        }
    }
    async function sendCode(email: string) {
        try {
            const res = await fetch('/api/auth/send-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.error };
            }

            return { success: true, code: data.code }; // code only in dev
        } catch {
            return { success: false, error: 'Failed to send code. Please try again.' };
        }
    }

    async function verifyCode(email: string, code: string) {
        try {
            const res = await fetch('/api/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.error };
            }

            // Update user state
            setUser({ email: data.email });

            // Close modal
            setIsAuthModalOpen(false);

            return { success: true, redirectTo: pendingRedirect || '/account' };
        } catch {
            return { success: false, error: 'Verification failed. Please try again.' };
        }
    }

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
