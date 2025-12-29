// Generate authorization URL for Customer Account API
export function getAuthorizationUrl(state: string, nonce: string) {
  const params = new URLSearchParams({
    client_id: process.env.CUSTOMER_API_CLIENT_ID as string,
    scope: 'openid email https://api.customers.com/auth/customer.graphql',
    response_type: 'code',
    redirect_uri: `${process.env.NEXT_PUBLIC_STORE_DOMAIN}/api/auth/callback`,
    state,
    nonce
  });

  return `https://shopify.com/${process.env.SHOP_ID}/auth/oauth/authorize?${params}`;
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code: string) {
  const response = await fetch(
    `https://shopify.com/${process.env.SHOP_ID}/auth/oauth/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.CUSTOMER_API_CLIENT_ID,
        client_secret: process.env.CUSTOMER_API_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_STORE_DOMAIN}/api/auth/callback`
      })
    }
  );

  if (!response.ok) {
    throw new Error('Token exchange failed');
  }

  return response.json();
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string) {
  const response = await fetch(
    `https://shopify.com/${process.env.SHOP_ID}/auth/oauth/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: process.env.CUSTOMER_API_CLIENT_ID,
        client_secret: process.env.CUSTOMER_API_CLIENT_SECRET,
        refresh_token: refreshToken
      })
    }
  );

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  return response.json();
}

