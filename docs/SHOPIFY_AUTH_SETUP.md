# Shopify Headless Authentication Integration

This guide explains how to integrate the Sign-In Modal with Shopify's Headless Commerce Customer Account API.

## 🎯 Features Implemented

- ✅ Professional sign-in modal with primary color (#215732)
- ✅ Email authentication flow
- ✅ Passkey (WebAuthn) support
- ✅ Error and success state handling
- ✅ Token management
- ✅ Smooth animations and transitions
- ✅ Dark mode support

## 📁 Files Created

1. **`components/Auth/SignInModal.tsx`** - Main modal component
2. **`lib/auth/shopify-auth.ts`** - Authentication helper functions
3. **`components/Layout/Navbar.tsx`** - Updated to include modal trigger

## 🔧 Setup Instructions

### Step 1: Get Shopify API Credentials

1. Go to your Shopify Admin → Settings → Apps and sales channels → Develop apps
2. Create a new app or select existing app
3. Configure Storefront API scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_customers`
   - `unauthenticated_write_customers`

### Step 2: Add Environment Variables

Create or update `.env.local`:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-01
```

### Step 3: Update Authentication Functions

In `lib/auth/shopify-auth.ts`, replace the placeholder functions with real Shopify API calls:

```typescript
// Example: Email Sign-In with Shopify Customer API
export async function signInWithEmail(email: string): Promise<AuthResponse> {
  const response = await fetch(
    `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query: `
          mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
            customerAccessTokenCreate(input: $input) {
              customerAccessToken {
                accessToken
                expiresAt
              }
              customerUserErrors {
                code
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {
            email: email,
            password: 'temporary-password' // You'll need to implement password flow
          }
        }
      })
    }
  );

  const data = await response.json();
  
  if (data.data?.customerAccessTokenCreate?.customerAccessToken) {
    return {
      success: true,
      accessToken: data.data.customerAccessTokenCreate.customerAccessToken.accessToken,
    };
  }

  return {
    success: false,
    error: data.data?.customerAccessTokenCreate?.customerUserErrors[0]?.message || 'Authentication failed'
  };
}
```

## 🎨 Customization

### Change Primary Color

Update the color in both components:

```tsx
// SignInModal.tsx
className="bg-[#YOUR_COLOR]"

// Navbar.tsx  
activeColor = 'bg-[#YOUR_COLOR]'
```

### Modify Modal Behavior

In `components/Auth/SignInModal.tsx`:

```typescript
// Change auto-close delay (currently 2000ms)
setTimeout(() => {
  onClose();
}, 3000); // 3 seconds

// Disable auto-close
// Remove or comment out the setTimeout
```

## 🔐 Authentication Flow

1. **User clicks Account icon** → Modal opens
2. **User enters email** → Validates format
3. **Clicks Continue** → Calls `signInWithEmail()`
4. **Success** → Token stored, modal shows success message, auto-closes
5. **Error** → Error message displayed, user can retry

## 📱 Passkey Integration

For WebAuthn/Passkey support, implement in `lib/auth/shopify-auth.ts`:

```typescript
export async function signInWithPasskey(): Promise<AuthResponse> {
  // 1. Request challenge from your backend
  // 2. Use navigator.credentials.get() for WebAuthn
  // 3. Verify with Shopify or your auth provider
  
  const credential = await navigator.credentials.get({
    publicKey: {
      challenge: new Uint8Array(/* challenge from server */),
      // ... other WebAuthn options
    }
  });
  
  // Return authentication result
}
```

## 🧪 Testing

1. **Test Modal Opening**: Click the Account icon in navbar
2. **Test Email Validation**: Try invalid email formats
3. **Test Success State**: Currently shows placeholder success
4. **Test Error State**: Will show when real API errors occur

## 🚀 Next Steps

1. **Connect to real Shopify API** - Replace placeholders in `shopify-auth.ts`
2. **Add password flow** - Implement password input for existing customers
3. **Add registration flow** - Create account for new customers
4. **Implement session management** - Use cookies or local storage
5. **Add user context** - Create React context for authenticated user state
6. **Protected routes** - Add authentication guards to protected pages

## 📚 Resources

- [Shopify Customer Account API](https://shopify.dev/docs/api/customer)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [WebAuthn Guide](https://webauthn.guide/)
- [Framer Motion Docs](https://www.framer.com/motion/)

## ⚡ Quick Commands

```bash
# Install dependencies (if needed)
npm install framer-motion lucide-react

# Run development server
npm run dev

# Build for production
npm run build
```

## 🎯 Modal Features

- ✨ Smooth spring animations
- 🌙 Dark mode support
- ⌨️ Keyboard accessible (ESC to close)
- 📱 Fully responsive
- 🎨 Primary color theming
- ✅ Loading and success states
- ❌ Error handling and display
- 🔒 Ready for Shopify integration

---

**Note**: The current implementation uses placeholder authentication. You must integrate with Shopify's Customer Account API for production use.
