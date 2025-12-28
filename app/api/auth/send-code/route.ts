
import { NextResponse } from 'next/server';
import { Resend } from 'resend'; import { storeVerificationCode } from '@/lib/auth/storage';
export async function POST(request: Request) {
  const { email } = await request.json();
  try {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionId = crypto.randomUUID();

    await storeVerificationCode(sessionId, email, code);
    console.log(sessionId, email, code);

    console.log('Verification code sent successfully');
    return NextResponse.json({
      success: true,
      sessionId
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}



