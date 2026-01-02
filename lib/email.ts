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
      subject: `PALshop sign-in code`,
      html: `
          <div style="max-width: 600px; margin: 0 auto;">

            <div style="margin-bottom: 30px; padding-bottom: 15px; border-bottom: 1px solid #eeeeee;">
              <span style="font-size: 24px; font-weight: 900; letter-spacing: -1.5px; color: #215732;">PAL<span style="font-weight: 500;">PAL<span style="font-weight: 500; font-size: 18px;">shop</span></span>
            </div>

            <div style="margin-bottom: 40px;">
              <p style="font-size: 16px; margin-bottom: 24px; color: #333333;">Sign in to PALshop as <a href="mailto:${to}" style="color: #215732; text-decoration: underline;">${to}</a>.</p>
              
              <p style="font-size: 16px; margin-bottom: 32px; color: #333333;">Enter this code to sign in:</p>

              <div style="font-size: 48px; font-weight: 600; color: #215732; margin-bottom: 32px; letter-spacing: -1px;">
                ${code}
              </div>

              <p style="font-size: 16px; color: #333333; margin-bottom: 40px;">This code will expire in 10 minutes and can only be used once.</p>
            </div>

            <!-- Divider -->
            <div style="border-top: 1px solid #eeeeee; padding-top: 30px; margin-bottom: 24px;">
              <span style="font-size: 20px; font-weight: 900; letter-spacing: -1.2px; color: #215732;">PAL<span style="font-weight: 500;">shop</span></span>
            </div>

            <!-- Footer Area -->
            <div style="font-size: 12px; color: #666666; line-height: 1.6;">
              <p style="margin-bottom: 16px;">Note: This email is not monitored for replies. If you need a hand, please visit our <a href="https://palshop.app/help" style="color: #215732; text-decoration: underline;">help center</a></p>
              
              <p style="margin-bottom: 4px;">You are receiving this email because you signed up for PALshop.</p>
              <p style="margin-bottom: 4px;">PALshop | Al-Wahda St, Gaza City, Palestine</p>
              <p>Copyright © 2025 PALshop, all rights reserved.</p>
            </div>
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