import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY!
  ? new Resend(process.env.RESEND_API_KEY!)
  : null;

interface SendCodeEmailParams {
  to: string;
  code: string;
}

export async function sendVerificationCodeEmail({
  to,
  code,
}: SendCodeEmailParams): Promise<{ success: boolean; error?: string }> {
  // If no Resend API key, log for development
  if (!resend) {
    console.log('========================================');
    console.log('📧 VERIFICATION CODE EMAIL');
    console.log(`To: ${to}`);
    console.log(`Code: ${code}`);
    console.log('========================================');
    return { success: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: 'support@palshop.app',
      to,
      subject: 'Your Sign-In Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your Verification Code</h2>
          <p>Enter this code to sign in to your account:</p>
          <div style="background: #215732; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #666;">This code expires in 10 minutes.</p>
        </div>
      `
    })

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Email service error:', err);
    return { success: false, error: 'Failed to send email' };
  }
}