import { kv } from '@vercel/kv';

/**
 * Generate a random 6-digit verification code
 * @returns {string} 6-digit code
 */
export function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store verification code in KV with expiry
 * @param {string} email - Customer email
 * @param {string} code - 6-digit verification code
 * @returns {Promise<boolean>}
 */
export async function storeCode(email, code) {
    try {
        const key = `verify:${email.toLowerCase()}`;
        // Store code with 10-minute expiry (600 seconds)
        await kv.set(key, code, { ex: 600 });
        return true;
    } catch (error) {
        console.error('Error storing code:', error);
        throw error;
    }
}

/**
 * Verify the code matches what's stored in KV
 * @param {string} email - Customer email
 * @param {string} code - Code to verify
 * @returns {Promise<boolean>}
 */
export async function verifyCode(email, code) {
    try {
        const key = `verify:${email.toLowerCase()}`;
        const storedCode = await kv.get(key);

        if (!storedCode) {
            return false; // Code expired or doesn't exist
        }

        if (storedCode === code) {
            // Delete code after successful verification (one-time use)
            await kv.del(key);
            return true;
        }

        return false; // Code doesn't match
    } catch (error) {
        console.error('Error verifying code:', error);
        return false;
    }
}

/**
 * Track login attempts to prevent abuse
 * @param {string} email - Customer email
 * @returns {Promise<number>} Number of attempts
 */
export async function trackAttempt(email) {
    try {
        const key = `attempts:${email.toLowerCase()}`;

        // Increment attempt counter
        const attempts = await kv.incr(key);

        // Set expiry to 1 hour if this is the first attempt
        if (attempts === 1) {
            await kv.expire(key, 3600); // 3600 seconds = 1 hour
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
export async function resetAttempts(email) {
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
export async function getCodeTTL(email) {
    try {
        const key = `verify:${email.toLowerCase()}`;
        const ttl = await kv.ttl(key);
        return ttl;
    } catch (error) {
        console.error('Error getting TTL:', error);
        return -1;
    }
}
