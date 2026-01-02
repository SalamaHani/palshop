import { NextRequest, NextResponse } from 'next/server';
import {
  verifyCode,
  generateSessionToken,
  setSessionCookie,
  getSession,
} from '@/lib/auth';
import { authenticateCustomer, getCustomerAccessToken, getCustomerByAccessToken } from '@/lib/shopify';
import { createSession } from '@/lib/cereatAuthpass';

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
    const verification = await verifyCode(normalizedEmail, cleanCode);

    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.error },
        { status: 401 }
      );
    }

    // Authenticate with Shopify using the stored password
    const authResult = await getCustomerAccessToken(normalizedEmail);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    if (!authResult.accessToken) {
      return NextResponse.json(
        { error: 'Failed to obtain access token' },
        { status: 500 }
      );
    }

    // Get actual customer data from Shopify
    const shopifyCustomer = await getCustomerByAccessToken(authResult.accessToken);
    if (!shopifyCustomer) {
      return NextResponse.json(
        { error: 'Failed to fetch customer profile' },
        { status: 500 }
      );
    }
    // Generate session token with ACTUAL Shopify Customer ID
    const sessionToken = await generateSessionToken(normalizedEmail, shopifyCustomer.id);
    // Set session cookie
    await setSessionCookie(sessionToken);
    const session = await getSession();
    //create session in database
    await createSession(session?.session_id, session?.customerId, authResult.accessToken, session?.exp);
    return NextResponse.json({
      success: true,
      email: normalizedEmail,
      customerId: shopifyCustomer.id,
      accessToken: authResult.accessToken,
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

