// lib/auth/storage.ts
import { storage } from '@/lib/kv';

export type VerificationCodeData = {
    email: string;
    code: string;
    expiresAt: number;
};

export type CodeVerifierData = {
    verifier: string;
    expiresAt: number;
};

export type CustomerPasswordData = {
    email: string;
    password: string;
    expiresAt: number;
};

/**
 * Verification Codes
 */
export async function storeVerificationCode(sessionId: string, email: string, code: string) {
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    const data: VerificationCodeData = { email, code, expiresAt };
    await storage.set(`verify:${sessionId}`, data, 600);
}

export async function getVerificationCode(sessionId: string): Promise<VerificationCodeData | null> {
    return await storage.get<VerificationCodeData>(`verify:${sessionId}`);
}

export async function deleteVerificationCode(sessionId: string) {
    await storage.del(`verify:${sessionId}`);
}

/**
 * OAuth Code Verifiers
 */
export async function storeCodeVerifier(state: string, verifier: string) {
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const data: CodeVerifierData = { verifier, expiresAt };
    await storage.set(`verifier:${state}`, data, 600);
}

export async function getCodeVerifier(state: string): Promise<string | null> {
    const key = `verifier:${state}`;
    const data = await storage.get<CodeVerifierData>(key);
    if (data) {
        await storage.del(key);
        return data.verifier;
    }
    return null;
}

/**
 * Temporary Customer Passwords
 */
export async function storeCustomerPassword(email: string, password: string) {
    const expiresAt = Date.now() + 20 * 60 * 1000;
    const data: CustomerPasswordData = { email, password, expiresAt };
    await storage.set(`password:${email.toLowerCase()}`, data, 1200);
}

export async function getCustomerPassword(email: string): Promise<string | null> {
    const data = await storage.get<CustomerPasswordData>(`password:${email.toLowerCase()}`);
    return data?.password || null;
}

export async function deleteCustomerPassword(email: string) {
    await storage.del(`password:${email.toLowerCase()}`);
}

/**
 * Rate Limiting / Attempts
 */
export async function trackAttempt(email: string): Promise<number> {
    const key = `attempts:${email.toLowerCase()}`;
    const attempts = await storage.incr(key);
    if (attempts === 1) {
        await storage.expire(key, 3600); // 1 hour block window
    }
    return attempts;
}

export async function resetAttempts(email: string) {
    await storage.del(`attempts:${email.toLowerCase()}`);
}
