'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

interface User {
  email: string;
  customerId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (redirectTo?: string) => void;
  closeAuthModal: () => void;
  sendCode: (email: string) => Promise<{ success: boolean; error?: string; code?: string }>;
  verifyCode: (email: string, code: string) => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
  logout: () => Promise<void>;
  pendingRedirect: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  // Check session on mount
  useEffect(() => {
    checkSession();
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

  const openAuthModal = useCallback((redirectTo?: string) => {
    setPendingRedirect(redirectTo || '/account');
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    // Don't clear pendingRedirect here - it's used after successful login
  }, []);

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
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        sendCode,
        verifyCode,
        logout,
        pendingRedirect,
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
