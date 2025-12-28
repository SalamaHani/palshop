import { NextResponse } from 'next/server';

import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code') as string;
    if (!code) {
        return NextResponse.redirect(new URL('/account/login?error=no_code', request.url));
    }
    async function exchangeCodeForToken(code: string) {
        const response = await fetch(
            `https://shopify.com/${process.env.SHOP_ID}/auth/oauth/token`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    grant_type: 'authorization_code',
                    client_id: process.env.CUSTOMER_API_CLIENT_ID!,
                    client_secret: process.env.CUSTOMER_API_CLIENT_SECRET!,
                    code,
                    redirect_uri: `${process.env.NEXT_PUBLIC_STORE_DOMAIN!}/api/auth/callback`
                })
            }
        );
        if (!response.ok) {
            throw new Error('Failed to exchange code for token');
        }
        const data = await response.json();
        return data;
    }
    try {
        // Exchange authorization code for tokens
        const tokens = await exchangeCodeForToken(code);
        const cookieStore = await cookies();
        // Set cookies
        cookieStore.set('customer_access_token', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: tokens.expires_in
        });

        if (tokens.refresh_token) {
            cookieStore.set('customer_refresh_token', tokens.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 90
            });
        }

        if (tokens.id_token) {
            cookieStore.set('customer_id_token', tokens.id_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: tokens.expires_in
            });
        }

        // Redirect to account page
        return NextResponse.redirect(new URL('/account', request.url));
    } catch (error) {
        console.error('OAuth callback error:', error);
        return NextResponse.redirect(new URL('/account/login?error=auth_failed', request.url));
    }
}
