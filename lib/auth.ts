import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import * as kvStorage from './auth/storage';

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'fallback-secret-change-in-production'
);

export interface TokenPayload {
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

// Store verification code using KV storage
export async function storeVerificationCode(email: string, code: string): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  const sessionId = normalizedEmail; // Use email as sessionId for simplicity

  await kvStorage.storeVerificationCode(sessionId, normalizedEmail, code);
}

// Verify the code using KV storage
export async function verifyCode(
  email: string,
  code: string
): Promise<{ valid: boolean; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  const sessionId = normalizedEmail; // Use email as sessionId

  const data = await kvStorage.getVerificationCode(sessionId);

  if (!data) {
    return { valid: false, error: 'No verification code found. Please request a new one.' };
  }

  if (Date.now() > data.expiresAt) {
    await kvStorage.deleteVerificationCode(sessionId);
    return { valid: false, error: 'Code expired. Please request a new one.' };
  }

  if (data.code !== code) {
    // Note: The KV storage doesn't track attempts yet, but the code is still validated
    return { valid: false, error: 'Invalid code. Please try again.' };
  }

  // Code is valid - remove it
  await kvStorage.deleteVerificationCode(sessionId);
  return { valid: true };
}

// Generate session token
export async function generateSessionToken(
  email: string,
  customerId?: string
): Promise<string> {
  return new SignJWT({ email, customerId })
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
  const data = await kvStorage.getVerificationCode(sessionId);
  return !!data && Date.now() < data.expiresAt;
}

// Get time remaining for code
export async function getCodeTimeRemaining(email: string): Promise<number> {
  const normalizedEmail = email.toLowerCase().trim();
  const sessionId = normalizedEmail;
  const data = await kvStorage.getVerificationCode(sessionId);
  if (!data) return 0;
  return Math.max(0, Math.floor((data.expiresAt - Date.now()) / 1000));
}