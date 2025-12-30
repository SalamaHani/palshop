import { createClient } from 'redis';

/**
 * Professional Redis Storage for Authentication
 * This file handles all persistent data for the authentication flow.
 */

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

// Singleton Redis Client
let redisClient: any = null;

async function getRedis() {
    if (redisClient) return redisClient;

    const url = process.env.REDIS_URL;
    if (!url) {
        console.warn('[Storage] ⚠️ REDIS_URL not found, using in-memory fallback');
        return null;
    }

    try {
        const client = createClient({ url });
        client.on('error', (err) => console.error('[Redis] Error:', err));
        await client.connect();
        redisClient = client;
        console.log('[Redis] ✅ Connected');
        return redisClient;
    } catch (error) {
        console.error('[Redis] Connection failed:', error);
        return null;
    }
}

// In-memory fallback for development
const memory = new Map<string, any>();

/**
 * Generic Helpers
 */
async function set(key: string, value: any, ttlSeconds: number) {
    const client = await getRedis();
    const str = JSON.stringify(value);
    if (client) {
        await client.set(key, str, { EX: ttlSeconds });
    } else {
        memory.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
    }
}

async function get<T>(key: string): Promise<T | null> {
    const client = await getRedis();
    if (client) {
        const raw = await client.get(key);
        return raw ? JSON.parse(raw) as T : null;
    } else {
        const item = memory.get(key);
        if (!item) return null;
        if (Date.now() > item.expires) {
            memory.delete(key);
            return null;
        }
        return item.value as T;
    }
}

async function del(key: string) {
    const client = await getRedis();
    if (client) {
        await client.del(key);
    } else {
        memory.delete(key);
    }
}

/**
 * Verification Codes
 */
export async function storeVerificationCode(sessionId: string, email: string, code: string) {
    const data: VerificationCodeData = {
        email,
        code,
        expiresAt: Date.now() + 10 * 60 * 1000
    };
    await set(`verify:${sessionId}`, data, 600);
}

export async function getVerificationCode(sessionId: string): Promise<VerificationCodeData | null> {
    return await get<VerificationCodeData>(`verify:${sessionId}`);
}

export async function deleteVerificationCode(sessionId: string) {
    await del(`verify:${sessionId}`);
}

/**
 * OAuth Code Verifiers
 */
export async function storeCodeVerifier(state: string, verifier: string) {
    const data: CodeVerifierData = {
        verifier,
        expiresAt: Date.now() + 10 * 60 * 1000
    };
    await set(`verifier:${state}`, data, 600);
}

export async function getCodeVerifier(state: string): Promise<string | null> {
    const data = await get<CodeVerifierData>(`verifier:${state}`);
    if (data) {
        await del(`verifier:${state}`);
        return data.verifier;
    }
    return null;
}

/**
 * Customer Passwords
 */
export async function storeCustomerPassword(email: string, password: string) {
    const data: CustomerPasswordData = {
        email,
        password,
        expiresAt: Date.now() + 20 * 60 * 1000
    };
    await set(`password:${email.toLowerCase()}`, data, 1200);
}

export async function getCustomerPassword(email: string): Promise<string | null> {
    const data = await get<CustomerPasswordData>(`password:${email.toLowerCase()}`);
    return data?.password || null;
}

export async function deleteCustomerPassword(email: string) {
    await del(`password:${email.toLowerCase()}`);
}

/**
 * Rate Limiting
 */
export async function trackAttempt(email: string): Promise<number> {
    const key = `attempts:${email.toLowerCase()}`;
    const client = await getRedis();
    if (client) {
        const count = await client.incr(key);
        if (count === 1) await client.expire(key, 3600);
        return count;
    } else {
        const item = memory.get(key);
        const count = (item?.value || 0) + 1;
        memory.set(key, { value: count, expires: item?.expires || Date.now() + 3600 * 1000 });
        return count;
    }
}

export async function resetAttempts(email: string) {
    await del(`attempts:${email.toLowerCase()}`);
}
