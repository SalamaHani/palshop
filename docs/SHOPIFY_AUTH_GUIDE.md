# Shopify OAuth Authentication - Complete Implementation Guide

## 🎯 Overview

This implementation provides a **complete, production-ready Shopify Customer Account API authentication system** using:
- **Popup Window** for OAuth flow (no iframe issues!)
- **PostMessage** for secure communication
- **PKCE** (Proof Key for Code Exchange) for enhanced security
- **HttpOnly Cookies** for token storage
- **React Context** for global auth state

---

## 📁 File Structure

```
palshop/
├── app/api/
│   ├── auth/
│   │   ├── shopify/
│   │   │   └── init/
│   │   │       └── route.ts          # OAuth initialization
│   │   ├── callback/
│   │   │   └── route.ts              # OAuth callback handler
│   │   └── signout/
│   │       └── route.ts              # Sign out handler
│   └── customer/
│       └── me/
│           └── route.ts              # Get current customer
├── hooks/
│   └── useShopifyAuth.ts             # Popup auth hook
├── contexts/
│   └── AuthContext.tsx               # Global auth state
├── components/
│   └── CustomSignInForm.tsx          # Sign-in UI
└── lib/auth/
    ├── shopify-auth.ts               # Auth utilities
    └── storage.ts                    # KV storage (with dev fallback)
```

---

## 🔐 Authentication Flow

### **Step 1: User Initiates Login**
```typescript
// User clicks "Sign In" button
<CustomSignInForm />
  ↓
useShopifyAuth().loginWithPopup(email)
```

### **Step 2: Popup Opens**
```
window.open('/api/auth/shopify/init?email=user@example.com')
  ↓
Generates PKCE code_verifier and code_challenge
  ↓
Stores code_verifier in KV storage
  ↓
Redirects to: https://shopify.com/{SHOP_ID}/auth/oauth/authorize
```

### **Step 3: User Authenticates with Shopify**
```
Shopify OAuth page (in popup)
  ↓
User logs in / approves
  ↓
Shopify redirects to: /api/auth/callback?code=xxx&state=yyy
```

### **Step 4: Token Exchange**
```
/api/auth/callback
  ↓
Retrieves code_verifier from storage
  ↓
Exchanges code + code_verifier for access_token
  ↓
Fetches customer data
  ↓
Stores tokens in httpOnly cookies
  ↓
Sends postMessage to parent window
```

### **Step 5: Parent Window Receives Result**
```
window.opener.postMessage({ type: 'SHOPIFY_AUTH_RESULT', ... })
  ↓
Popup closes automatically
  ↓
Parent refreshes customer data from /api/customer/me
  ↓
User redirected to /account
```

---

## 🛠️ Environment Variables

### **Required forProduction:**
```env
# Shopify Configuration
SHOP_ID=97977303354
CUSTOMER_API_CLIENT_ID=your-client-id-here
CUSTOMER_API_URL=https://yoursite.com/api/auth/callback
SHOPIFY_API_VERSION=2024-10

# Vercel KV (for code storage)
KV_REST_API_URL=https://xxx.kv.vercel-storage.com
KV_REST_API_TOKEN=your-token-here
```

### **Development Mode:**
Works without KV (uses in-memory storage with warnings)

---

## 📝 Usage Examples

### **1. Sign-In Component**
```tsx
import { useShopifyAuth } from '@/hooks/useShopifyAuth';

function SignInButton() {
    const { loginWithPopup, isLoading } = useShopifyAuth();
    const [email, setEmail] = useState('');

    const handleSignIn = async () => {
        const success = await loginWithPopup(email);
        if (success) {
            // User is authenticated!
            router.push('/account');
        }
    };

    return (
        <button onClick={handleSignIn} disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Sign In with Shopify'}
        </button>
    );
}
```

### **2. Access Current User**
```tsx
import { useAuth } from '@/contexts/AuthContext';

function UserProfile() {
    const { customer, isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <div>Loading...</div>;
    if (!isAuthenticated) return <div>Please sign in</div>;

    return (
        <div>
            <h1>Welcome, {customer.firstName}!</h1>
            <p>{customer.email}</p>
        </div>
    );
}
```

### **3. Sign Out**
```tsx
import { useAuth } from '@/contexts/AuthContext';

function SignOutButton() {
    const { signOut } = useAuth();

    return (
        <button onClick={signOut}>
            Sign Out
        </button>
    );
}
```

---

## 🎨 Features

### ✅ **Security**
- PKCE flow prevents authorization code interception
- HttpOnly cookies prevent XSS attacks
- PostMessage origin validation
- State parameter prevents CSRF

### ✅ **User Experience**
- Popup window (no page reload)
- Auto-closes after authentication
- Loading states and error messages
- Centered popup positioning

### ✅ **Development Friendly**
- Works without Vercel KV (in-memory fallback)
- Detailed console logging
- Error messages with details
- TypeScript types throughout

### ✅ **Production Ready**
- Proper error handling
- Token refresh support
- Session persistence
- Mobile responsive

---

## 🧪 Testing

### **1. Test Sign-In Flow**
```bash
1. Go to /login or open sign-in modal
2. Enter your email
3. Click "Continue with Shopify"
4. Popup opens with Shopify OAuth
5. Log in / approve
6. Popup closes automatically
7. You're signed in!
```

### **2. Check Console Logs**
```
[Auth Init] 🔐 Initiating Shopify OAuth for user@example.com
[Auth Init] ✅ Redirecting to Shopify OAuth
[Auth Callback] 🔐 Processing OAuth callback
[Auth Callback] ✅ Code verifier found
[Auth Callback] ✅ Tokens obtained
[Auth Callback] ✅ Customer data retrieved
[Auth Callback] ✅ Authentication successful
```

### **3. Verify Cookies**
Open DevTools > Application > Cookies:
- `customer_access_token` (httpOnly)
- `customer_refresh_token` (httpOnly)

---

## 💡 Troubleshooting

### **Popup Blocked**
```typescript
// Error: "Popup blocked. Please allow popups for this site."
```
**Solution**: Enable popups in browser settings

### **Origin Mismatch**
```typescript
// PostMessage ignored due to origin mismatch
```
**Solution**: Ensure popup and parent have same origin

### **Token Exchange Failed**
```typescript
// Error: "Token exchange failed: 400"
```
**Solution**: Check SHOP_ID and CLIENT_ID in environment variables

### **State Invalid**
```typescript
// Error: "Invalid state or expired session"
```
**Solution**: Code verifier might be expired (10 min limit)

---

## 🚀 Deployment Checklist

- [ ] Set all environment variables in Vercel
- [ ] Configure Vercel KV storage
- [ ] Update `CUSTOMER_API_URL` to production domain
- [ ] Add production domain to Shopify Customer Account API settings
- [ ] Test OAuth flow in production
- [ ] Monitor error logs

---

## 📚 API Reference

### **POST /api/auth/shopify/init**
Initiates OAuth flow
- **Query**: `?email=user@example.com`
- **Returns**: Redirect to Shopify OAuth

### **GET /api/auth/callback**
Handles OAuth callback
- **Query**: `?code=xxx&state=yyy`
- **Returns**: HTML with postMessage script

### **GET /api/customer/me**
Gets current customer data
- **Auth**: Requires httpOnly cookie
- **Returns**: `{ customer: {...}, authenticated: true }`

### **POST /api/auth/signout**
Signs out current user
- **Returns**: `{ success: true }`

---

## 🎯 Next Steps

1. **Customize UI**: Update colors and branding in CustomSignInForm
2. **Add Features**: Implement account pages, order history, etc.
3. **Email**: Configure Resend for verification emails (optional)
4. **Analytics**: Track authentication events
5. **Error Tracking**: Integrate Sentry or similar

---

Made with ❤️ for PALshop
