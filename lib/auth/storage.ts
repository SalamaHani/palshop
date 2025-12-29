// lib/auth/storage.ts
// Storage for verification codes and code verifiers

export type VerificationCodeData = {
    email: string;
    code: string;
    expiresAt: number;
};

export type CodeVerifierData = {
    verifier: string;
    expiresAt: number;
};

// ---------------- In-memory fallback (development only) ----------------
const devStorage = new Map<string, any>();

// ---------------- KV setup ----------------
let kv: any = null;
const hasVercelKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

if (hasVercelKV) {
    try {
        const vercelKV = require('@vercel/kv');
        kv = vercelKV.kv;
        console.log('[Storage] ✅ Using Vercel KV');
    } catch (error) {
        console.warn('[Storage] ⚠️ @vercel/kv not available, using in-memory storage');
    }
}

if (!kv && process.env.NODE_ENV === 'development') {
    console.warn('[Storage] ⚠️ Using in-memory storage (development only)');
}

// ---------------- Safe JSON parser ----------------
function safeJSONParse<T>(raw: string | null | undefined): T | null {
    if (!raw || raw.trim() === '') return null;
    try {
        return JSON.parse(raw) as T;
    } catch (err) {
        console.error('[Storage] JSON parse failed:', err, raw);
        return null;
    }
}

// ---------------- Verification codes ----------------
export async function storeVerificationCode(sessionId: string, email: string, code: string) {
    const data: VerificationCodeData = {
        email,
        code,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };

    if (kv) {
        await kv.set(`verify:${sessionId}`, JSON.stringify(data), { ex: 600 });
    } else {
        devStorage.set(`verify:${sessionId}`, data);
        setTimeout(() => devStorage.delete(`verify:${sessionId}`), 10 * 60 * 1000);
    }
}

export async function getVerificationCode(sessionId: string): Promise<VerificationCodeData | null> {
    if (kv) {
        const raw = await kv.get(`verify:${sessionId}`);
        return safeJSONParse<VerificationCodeData>(typeof raw === 'string' ? raw : null);
    } else {
        return devStorage.get(`verify:${sessionId}`) ?? null;
    }
}

export async function deleteVerificationCode(sessionId: string) {
    if (kv) {
        await kv.del(`verify:${sessionId}`);
    } else {
        devStorage.delete(`verify:${sessionId}`);
    }
}

// ---------------- Code verifiers ----------------
export async function storeCodeVerifier(state: string, verifier: string) {
    const data: CodeVerifierData = {
        verifier,
        expiresAt: Date.now() + 10 * 60 * 1000
    };

    if (kv) {
        await kv.set(`verifier:${state}`, JSON.stringify(data), { ex: 600 });
    } else {
        devStorage.set(`verifier:${state}`, data);
        setTimeout(() => devStorage.delete(`verifier:${state}`), 10 * 60 * 1000);
    }
}

export async function getCodeVerifier(state: string): Promise<string | null> {
    if (kv) {
        const raw = await kv.get(`verifier:${state}`);
        await kv.del(`verifier:${state}`);
        const data = safeJSONParse<CodeVerifierData>(typeof raw === 'string' ? raw : null);
        return data?.verifier || null;
    } else {
        const data = devStorage.get(`verifier:${state}`) as CodeVerifierData | undefined;
        devStorage.delete(`verifier:${state}`);
        return data?.verifier || null;
    }
}
