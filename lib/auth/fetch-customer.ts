import { cookies } from 'next/headers';
import { refreshAccessToken } from './customer-auth';

export async function fetchCustomerData(query: string) {
  let accessToken = (await cookies()).get('customer_access_token')?.value;

  if (!accessToken) {
    throw new Error('No access token');
  }

  const response = await fetch(`${process.env.CUSTOMER_API_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ query }),
    cache: 'no-store'
  });
  const cookieStore = await cookies();
  // If token expired, try to refresh
  if (response.status === 401) {
    const refreshToken = cookieStore.get('customer_refresh_token')?.value;

    if (refreshToken) {
      const tokens = await refreshAccessToken(refreshToken);

      cookieStore.set('customer_access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: tokens.expires_in
      });

      // Retry request with new token
      return fetch(`${process.env.CUSTOMER_API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access_token}`
        },
        body: JSON.stringify({ query }),
        cache: 'no-store'
      }).then(res => res.json());
    }

    throw new Error('Token expired');
  }

  return response.json();
}
