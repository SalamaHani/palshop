import { NextRequest, NextResponse } from 'next/server';
import {
  generateVerificationCode,
  storeVerificationCode,
  hasActiveCode,
  getCodeTimeRemaining,
} from '@/lib/auth';
import { createOrGetShopifyCustomer } from '@/lib/shopify';
import { sendVerificationCodeEmail } from '@/lib/email';



export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if there's already an active code (rate limiting)
    if (await hasActiveCode(normalizedEmail)) {
      const remaining = await getCodeTimeRemaining(normalizedEmail);
      if (remaining > 540) {
        // Less than 1 minute since last code
        return NextResponse.json(
          { error: 'Please wait before requesting a new code', retryAfter: remaining - 540 },
          { status: 429 }
        );
      }
    }

    console.log(`ℹ️ Customer signing in: ${normalizedEmail}`);

    // Create or get customer in Shopify
    const shopifyResult = await createOrGetShopifyCustomer(normalizedEmail);

    if (!shopifyResult.success) {
      console.error('Failed to create/get customer in Shopify:', shopifyResult.error);
      return NextResponse.json(
        { error: shopifyResult.error || 'Failed to process your request' },
        { status: 400 }
      );
    }

    // Log if new customer was created
    if (shopifyResult.isNew) {
      console.log(`✅ New customer created in Shopify: ${normalizedEmail}`);
    } else {
      console.log(`ℹ️ Existing customer signing in: ${normalizedEmail}`);
    }

    // Generate and store verification code
    const code = generateVerificationCode();
    console.log(`Generated code: ${code}`);
    await storeVerificationCode(normalizedEmail, code);

    // Send email
    const emailResult = await sendVerificationCodeEmail({
      to: normalizedEmail,
      code,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      isNewCustomer: shopifyResult.isNew,
      // Include code in development for testing
      ...(process.env.NODE_ENV === 'development' && { code }),
    });
  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
