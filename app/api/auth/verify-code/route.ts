import { NextRequest, NextResponse } from 'next/server';
import {
  verifyCode,
  generateSessionToken,
  setSessionCookie,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    // Validate inputs
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      );
    }

    // Clean up code (remove spaces, etc.)
    const cleanCode = code.replace(/\s/g, '').trim();

    if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit code' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify the code
    const result = verifyCode(normalizedEmail, cleanCode);

    if (!(await result).valid) {
      return NextResponse.json(
        { error: (await result).error },
        { status: 401 }
      );
    }

    // Generate a customer ID (in production, fetch from Shopify)
    const customerId = `gid://shopify/Customer/${Buffer.from(normalizedEmail).toString('base64')}`;

    // Generate session token
    const sessionToken = await generateSessionToken(normalizedEmail, customerId);

    // Set session cookie
    await setSessionCookie(sessionToken);

    return NextResponse.json({
      success: true,
      email: normalizedEmail,
      redirectTo: '/account',
    });
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}

