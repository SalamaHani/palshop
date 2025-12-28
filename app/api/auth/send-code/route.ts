
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { storeVerificationCode } from '@/lib/auth/storage';
export async function POST(request: Request) {
  const { email } = await request.json();
  try {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionId = crypto.randomUUID();
    const resend = new Resend(process.env.RSEND_API_KEY!);
    await storeVerificationCode(sessionId, email, code);
    console.log(sessionId, email, code);
    console.log(email);
    await resend.emails.send({
      from: 'support@palshop.app',
      to: email,
      subject: 'Your Sign-In Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your Verification Code</h2>
          <p>Enter this code to sign in to your account:</p>
          <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #666;">This code expires in 10 minutes.</p>
        </div>
      `
    })

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



