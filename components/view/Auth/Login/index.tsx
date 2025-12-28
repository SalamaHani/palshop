import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  sendVerificationCode,
  verifyCode,
  storeAccessToken
} from "@/lib/auth/shopify-auth";
import VerificationStep from "./VerificationStep";

type LoginFormProps = {
  onClose?: () => void;
};

const Login = ({ onClose }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [encryptedState, setEncryptedState] = useState<string | null>(null);

  const router = useRouter();
  const { refreshCustomer } = useAuth();

  /**
   * Step 1: Send the login code to user's email
   */
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const authUrl = `shopify.com/97977303354/auth/oauth/authorize?` +
        new URLSearchParams({
          client_id: '6db50d1a-0c00-4921-8057-35d9b4963233',
          scope: "openid email customer_read",
          redirect_uri: 'https://shopify.com/97977303354/account',
          response_type: "code",
          state: "random_state_string",
        }).toString();

      window.location.href = authUrl;
      const response = await sendVerificationCode(email);

      if (response.success) {
        setEncryptedState(response.encryptedState || null);
        setShowVerification(true);
        toast.success("Verification code sent to your email");
      } else {
        toast.error(response.error || "Failed to send code");
      }
    } catch (error) {
      console.error("Login send error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Step 2: Verify the code entered by the user
   */
  const handleVerifyCode = async (code: string): Promise<boolean> => {
    try {
      const response = await verifyCode(email, code, encryptedState || undefined);

      if (response.success && response.accessToken) {
        // Store the real Shopify Access Token
        storeAccessToken(response.accessToken);

        // Refresh the global auth state to populate the 'customer' object
        await refreshCustomer();

        // Success animation will trigger in VerificationStep
        // Modal closure handled after a short delay to see success state
        setTimeout(() => {
          setShowVerification(false);
          onClose?.();
          toast.success("Successfully signed in!");
          router.push("/account");
        }, 1500);

        return true;
      }

      if (response.error) {
        toast.error(response.error);
      }
      return false;
    } catch (err) {
      console.error("Login verify error:", err);
      toast.error("Verification failed");
      return false;
    }
  };

  if (showVerification) {
    return (
      <VerificationStep
        email={email}
        onVerify={handleVerifyCode}
        onResend={async () => {
          await sendVerificationCode(email);
        }}
        onChangeEmail={() => {
          setShowVerification(false);
          setEncryptedState(null);
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Brand Header */}
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-black text-primary tracking-tighter" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
          shop
        </h1>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Sign in
        </h2>
      </div>

      <form onSubmit={handleSendCode} className="space-y-4">
        <div className="space-y-2">
          <div className="relative group">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-16 rounded-2xl border-gray-200 bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-lg px-6 placeholder:text-gray-400"
              required
              autoComplete="email"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !email}
          className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Continue"
          )}
        </Button>

        {/* Passkey Mock Option for completeness */}
        <div className="pt-2 text-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-gray-900 dark:text-gray-100 font-bold hover:opacity-80 transition-opacity"
          >
            <span className="flex items-center justify-center w-5 h-5">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </span>
            Sign in with a passkey
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
