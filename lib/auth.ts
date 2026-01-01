import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import * as authStorage from './auth/storage';

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'fallback-secret-change-in-production'
);

export interface TokenPayload {
  session_id: string;
  email: string;
  customerId?: string;
  exp?: number;
}

export interface VerificationCodeData {
  email: string;
  code: string;
  expiresAt: number;
  attempts?: number;
}


// Generate a 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store verification code using Redis storage
export async function storeVerificationCode(email: string, code: string): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  const sessionId = normalizedEmail; // Use email as sessionId for simplicity
  await Promise.all([
    authStorage.storeVerificationCode(sessionId, normalizedEmail, code),
    authStorage.resetAttempts(normalizedEmail)
  ]);
}

// Verify the code using Redis storage
export async function verifyCode(
  email: string,
  code: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const sessionId = `verify:${normalizedEmail}`;

    // 1. Check for too many failed attempts (Rate Limiting)
    const attempts = await authStorage.trackAttempt(normalizedEmail);
    if (attempts > 5) {
      return {
        valid: false,
        error: 'Security alert: Too many failed attempts. Please try again in 1 hour.'
      };
    }

    // 2. Retrieve the stored code data
    const data = await authStorage.getVerificationCode(normalizedEmail);

    if (!data) {
      return {
        valid: false,
        error: 'Session expired or invalid. Please request a new verification code.'
      };
    }

    // 3. Handle expiration
    if (Date.now() > data.expiresAt) {
      await authStorage.deleteVerificationCode(normalizedEmail);
      return {
        valid: false,
        error: 'This code has expired for your security. Please request a fresh one.'
      };
    }

    // 4. Validate the code
    if (data.code !== code) {
      return {
        valid: false,
        error: `Incorrect code entered. ${5 - attempts} attempts remaining.`
      };
    }

    // 5. Success - Purge security data immediately
    await Promise.all([
      authStorage.deleteVerificationCode(normalizedEmail),
      authStorage.resetAttempts(normalizedEmail)
    ]);

    return { valid: true };
  } catch (error) {
    console.error('[AuthService] Critical verification error:', error);
    return {
      valid: false,
      error: 'An unexpected security error occurred. Please try again.'
    };
  }
}

// Generate session token
export async function generateSessionToken(
  email: string,
  customerId?: string
): Promise<string> {
  return new SignJWT({ session_id: crypto.randomUUID(), email, customerId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(secret);
}

// Set session cookie
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}
// Get current session
export async function getSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      session_id: payload.session_id as string,
      email: payload.email as string,
      customerId: payload.customerId as string | undefined,
      exp: payload.exp as number | undefined,
    };
  } catch {
    return null;
  }
}

// Clear session
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

// Check if code exists for email (for resend logic)
export async function hasActiveCode(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  const sessionId = normalizedEmail;
  const data = await authStorage.getVerificationCode(sessionId);
  return !!data && Date.now() < data.expiresAt;
}

// Get time remaining for code
export async function getCodeTimeRemaining(email: string): Promise<number> {
  const normalizedEmail = email.toLowerCase().trim();
  const sessionId = normalizedEmail;
  const data = await authStorage.getVerificationCode(sessionId);
  if (!data) return 0;
  return Math.max(0, Math.floor((data.expiresAt - Date.now()) / 1000));
}

export function generateSecurePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  const array = new Uint32Array(32);
  crypto.getRandomValues(array);
  for (let i = 0; i < 32; i++) {
    password += chars[array[i] % chars.length];
  }
  return password;
}