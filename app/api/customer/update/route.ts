import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getCustomerAccessToken, updateCustomerProfile } from '@/lib/shopify';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { firstName, lastName, phone } = await request.json();

        // Get a fresh access token for the customer
        const authResult = await getCustomerAccessToken(session.email);
        if (!authResult.accessToken) {
            return NextResponse.json({ error: 'Failed to authenticate with Shopify' }, { status: 401 });
        }

        // Update the profile
        const result = await updateCustomerProfile(authResult.accessToken, {
            firstName,
            lastName,
            phone,
        });

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            customer: result.customer,
        });
    } catch (error) {
        console.error('API Profile Update Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
