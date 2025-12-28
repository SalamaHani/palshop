// app/api/auth/verify-code/route.ts
import { NextResponse } from 'next/server';
import { getVerificationCode, deleteVerificationCode } from '@/lib/auth/storage';
import { authenticateWithShopify } from '@/lib/auth/shopify-auth';
import { cookies } from 'next/headers';

type CustomerSession = {
    accessToken: string;
    expiresAt: number;
    customer?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
};

export async function POST(request: Request) {
    try {
        const { sessionId, code } = await request.json();

        // Validate input
        if (!sessionId || !code) {
            return NextResponse.json(
                { error: 'Session ID and code are required' },
                { status: 400 }
            );
        }

        console.log(`[Verify Code] Verifying code for session: ${sessionId}`);

        // Retrieve stored verification data
        const storedData = await getVerificationCode(sessionId);

        if (!storedData) {
            console.log('[Verify Code] ❌ Session not found or expired');
            return NextResponse.json(
                { error: 'Session expired or not found' },
                { status: 400 }
            );
        }

        // Verify the code matches
        if (storedData.code !== code) {
            console.log('[Verify Code] ❌ Invalid code');
            return NextResponse.json(
                { error: 'Invalid verification code' },
                { status: 400 }
            );
        }

        // Check if code has expired
        if (Date.now() > storedData.expiresAt) {
            console.log('[Verify Code] ❌ Code expired');
            await deleteVerificationCode(sessionId);
            return NextResponse.json(
                { error: 'Verification code has expired' },
                { status: 400 }
            );
        }

        console.log(`[Verify Code] ✅ Code verified for email: ${storedData.email}`);

        // Authenticate with Shopify
        const authResult = await authenticateWithShopify(storedData.email);

        // Clean up verification code
        await deleteVerificationCode(sessionId);

        // Create customer session
        const customerSession: CustomerSession = {
            accessToken: authResult.state, // Using state as session identifier
            expiresAt: Date.now() + 3600000, // 1 hour
            customer: {
                id: crypto.randomUUID(),
                email: storedData.email,
                firstName: storedData.email.split('@')[0]
            }
        };

        // Store in httpOnly cookie
        const cookieStore = await cookies();
        cookieStore.set('customer_access_token', customerSession.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600, // 1 hour
            path: '/'
        });

        console.log('[Verify Code] ✅ Authentication successful');

        return NextResponse.json({
            success: true,
            message: 'Authentication successful',
            customer: customerSession.customer,
            // Note: Don't send accessToken to client, it's in httpOnly cookie
            redirectUrl: '/account'
        });

    } catch (error) {
        console.error('[Verify Code] Fatal error:', error);
        return NextResponse.json(
            {
                error: 'Authentication failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
