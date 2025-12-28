
import { generateCode, storeCode, trackAttempt } from '@/lib/verification-codes';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Check rate limiting
    const attempts = await trackAttempt(email);
    if (attempts > 5) {
      return Response.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }

    // Generate 6-digit code
    const code = generateCode();

    // Store code in KV with 10-minute expiry
    await storeCode(email, code);

    // Send email with code
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

    return Response.json({ success: true });
  } catch (error) {
    console.error('Send code error:', error);
    return Response.json({ error: 'Failed to send code' }, { status: 500 });
  }
}
