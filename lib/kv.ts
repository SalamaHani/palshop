import { kv } from '@vercel/kv';

/**
 * Unified Key-Value Storage Utility
 * Uses Vercel KV (Redis) in production and maintains a fallback for development.
 */

const IS_DEV = process.env.NODE_ENV === 'development';
const HAS_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

// In-memory fallback for local development without Redis
const localCache = new Map<string, { value: any; expires: number | null }>();

export const storage = {
    /**
     * Set a value with optional TTL (in seconds)
     */
    async set(key: string, value: any, ttl?: number): Promise<void> {
        try {
            if (HAS_KV) {
                if (ttl) {
                    await kv.set(key, value, { ex: ttl });
                } else {
                    await kv.set(key, value);
                }
            } else {
                const expires = ttl ? Date.now() + ttl * 1000 : null;
                localCache.set(key, { value, expires });
            }
        } catch (error) {
            console.error(`[Storage] Error setting key ${key}:`, error);
            // Fallback to local cache on error if in dev
            if (IS_DEV) {
                const expires = ttl ? Date.now() + ttl * 1000 : null;
                localCache.set(key, { value, expires });
            }
        }
    },

    /**
     * Get a value
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            if (HAS_KV) {
                return await kv.get<T>(key);
            } else {
                const item = localCache.get(key);
                if (!item) return null;
                if (item.expires && Date.now() > item.expires) {
                    localCache.delete(key);
                    return null;
                }
                return item.value as T;
            }
        } catch (error) {
            console.error(`[Storage] Error getting key ${key}:`, error);
            return null;
        }
    },

    /**
     * Delete a key
     */
    async del(key: string): Promise<void> {
        try {
            if (HAS_KV) {
                await kv.del(key);
            } else {
                localCache.delete(key);
            }
        } catch (error) {
            console.error(`[Storage] Error deleting key ${key}:`, error);
        }
    },

    /**
     * Increment a numeric value
     */
    async incr(key: string): Promise<number> {
        try {
            if (HAS_KV) {
                return await kv.incr(key);
            } else {
                const item = localCache.get(key);
                const current = typeof item?.value === 'number' ? item.value : 0;
                const next = current + 1;
                localCache.set(key, { value: next, expires: item?.expires || null });
                return next;
            }
        } catch (error) {
            console.error(`[Storage] Error incrementing key ${key}:`, error);
            return 0;
        }
    },

    /**
     * Set expiration for a key (in seconds)
     */
    async expire(key: string, seconds: number): Promise<void> {
        try {
            if (HAS_KV) {
                await kv.expire(key, seconds);
            } else {
                const item = localCache.get(key);
                if (item) {
                    item.expires = Date.now() + seconds * 1000;
                }
            }
        } catch (error) {
            console.error(`[Storage] Error setting expiry for key ${key}:`, error);
        }
    },

    /**
     * Get Time To Live (TTL) in seconds
     */
    async ttl(key: string): Promise<number> {
        try {
            if (HAS_KV) {
                return await kv.ttl(key);
            } else {
                const item = localCache.get(key);
                if (!item || !item.expires) return -1;
                const remaining = Math.floor((item.expires - Date.now()) / 1000);
                return remaining > 0 ? remaining : -1;
            }
        } catch (error) {
            console.error(`[Storage] Error getting TTL for key ${key}:`, error);
            return -1;
        }
    }
};
