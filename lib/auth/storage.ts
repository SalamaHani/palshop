// lib/auth/storage.ts
// Storage for verification codes using Vercel KV (or in-memory fallback for development)

export type VerificationCodeData = {
    email: string;
    code: string;
    expiresAt: number;
};

// In-memory storage for development (not for production!)
const devStorage = new Map<string, VerificationCodeData>();

// Check if we have Vercel KV configured
const hasVercelKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

let kv: any = null;

if (hasVercelKV) {
    try {
        // Dynamically import Vercel KV only if configured
        const vercelKV = require('@vercel/kv');
        kv = vercelKV.kv;
        console.log('[Storage] ✅ Using Vercel KV');
    } catch (error) {
        console.warn('[Storage] ⚠️ @vercel/kv not available, using in-memory storage');
    }
}

if (!kv && process.env.NODE_ENV === 'development') {
    console.warn('[Storage] ⚠️ Using in-memory storage (development only)');
    console.warn('[Storage] 💡 Set KV_REST_API_URL and KV_REST_API_TOKEN for production');
}

export async function storeVerificationCode(sessionId: string, email: string, code: string): Promise<void> {
    const data: VerificationCodeData = {
        email,
        code,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };

    if (kv) {
        await kv.set(`verify:${sessionId}`, data, {
            ex: 600 // Auto-expire in 600 seconds
        });
    } else {
        // Development in-memory storage
        devStorage.set(`verify:${sessionId}`, data);

        // Auto-cleanup after 10 minutes
        setTimeout(() => {
            devStorage.delete(`verify:${sessionId}`);
        }, 10 * 60 * 1000);
    }
}

export async function getVerificationCode(sessionId: string): Promise<VerificationCodeData | null> {
    if (kv) {
        return await kv.get(`verify:${sessionId}`);
    } else {
        // Development in-memory storage
        const data = devStorage.get(`verify:${sessionId}`);
        return data || null;
    }
}

export async function deleteVerificationCode(sessionId: string): Promise<void> {
    if (kv) {
        await kv.del(`verify:${sessionId}`);
    } else {
        // Development in-memory storage
        devStorage.delete(`verify:${sessionId}`);
    }
}

export async function storeCodeVerifier(state: string, verifier: string): Promise<void> {
    if (kv) {
        await kv.set(`verifier:${state}`, verifier, {
            ex: 600 // 10 minutes
        });
    } else {
        // Development in-memory storage
        devStorage.set(`verifier:${state}`, {
            email: '', // Not needed for verifier
            code: verifier,
            expiresAt: Date.now() + 10 * 60 * 1000
        });

        // Auto-cleanup after 10 minutes
        setTimeout(() => {
            devStorage.delete(`verifier:${state}`);
        }, 10 * 60 * 1000);
    }
}

export async function getCodeVerifier(state: string): Promise<string | null> {
    if (kv) {
        const verifier = await kv.get(`verifier:${state}`);
        await kv.del(`verifier:${state}`); // Delete after use
        return verifier as string | null;
    } else {
        // Development in-memory storage
        const data = devStorage.get(`verifier:${state}`);
        devStorage.delete(`verifier:${state}`); // Delete after use
        return data?.code || null;
    }
}
