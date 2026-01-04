import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSessionDB } from '@/lib/cereatAuthpass';

export async function GET() {
  try {
    const session = await getSession();


    if (!session || !session.email) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    // Fetch full customer data from Shopify
    const { getCustomerAccessToken, getCustomerByAccessToken } = await import('@/lib/shopify');
    const authResult = await getCustomerAccessToken(session.email);

    let customerData: any = null;
    if (authResult.accessToken) {
      customerData = await getCustomerByAccessToken(authResult.accessToken);
    }

    return NextResponse.json({
      authenticated: true,
      email: session.email,
      customerId: session.customerId,
      firstName: customerData?.firstName || '',
      lastName: customerData?.lastName || '',
      phone: customerData?.phone || '',
      orderCount: customerData?.orders?.edges?.length || 0,
      addressCount: customerData?.addresses?.edges?.length || 0,
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({
      authenticated: false,
    });
  }
}
