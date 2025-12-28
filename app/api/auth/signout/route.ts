import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();

        // Delete the authentication cookies
        cookieStore.delete('customer_access_token');
        cookieStore.delete('customer_refresh_token');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Sign out error:', error);
        return NextResponse.json(
            { error: 'Failed to sign out' },
            { status: 500 }
        );
    }
}
