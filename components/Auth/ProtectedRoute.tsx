'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * Wraps pages that require authentication
 * Automatically redirects to home if user is not authenticated
 */
export function ProtectedRoute({ children, redirectTo = '/' }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, setIsAuthModalOpen } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Show auth modal instead of redirecting
            setIsAuthModalOpen(true);
            // Optionally redirect after a delay
            const timer = setTimeout(() => {
                router.push(redirectTo);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, isLoading, router, redirectTo, setIsAuthModalOpen]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#215732]/20 border-t-[#215732] rounded-full animate-spin" />
                    <p className="text-sm font-medium text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render children if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
