import { kv } from '@vercel/kv';



export function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeCode(email: any, code: string): Promise<boolean> {
    try {
        const key = `verify:${email.toLowerCase()}`;
        await kv.set(key, code, { ex: 600 });
        return true;
    } catch (error) {
        console.error('Error storing code:', error);
        throw error;
    }
}
export async function verifyCode(email: string, code: string): Promise<boolean> {
    try {
        const key = `verify:${email.toLowerCase()}cvfsvsdfcds`;
        const storedCode = await kv.get(key);

        if (!storedCode) {
            return false;
        }

        if (storedCode === code) {
            await kv.del(key);
            return true;
        }

        return false; // Code doesn't match
    } catch (error) {
        console.error('Error verifying code:', error);
        return false;
    }
}

export async function trackAttempt(email: string): Promise<number> {
    try {
        const key = `attempts:${email.toLowerCase()}`;
        const attempts = await kv.incr(key);
        if (attempts === 1) {
            await kv.expire(key, 3600);
        }

        return attempts;
    } catch (error) {
        console.error('Error tracking attempt:', error);
        return 0;
    }
}

/**
 * Reset attempt counter (optional - use after successful login)
 * @param {string} email - Customer email
 * @returns {Promise<void>}
 */
export async function resetAttempts(email: string): Promise<void> {
    try {
        const key = `attempts:${email.toLowerCase()}`;
        await kv.del(key);
    } catch (error) {
        console.error('Error resetting attempts:', error);
    }
}

/**
 * Check remaining time for a code (optional - for UI feedback)
 * @param {string} email - Customer email
 * @returns {Promise<number>} Seconds remaining, or -1 if no code exists
 */
export async function getCodeTTL(email: string): Promise<number> {
    try {
        const key = `verify:${email.toLowerCase()}`;
        const ttl = await kv.ttl(key);
        return ttl;
    } catch (error) {
        console.error('Error getting TTL:', error);
        return -1;
    }
}
