# User Authentication Flow

## 🎯 Overview

The authentication system now supports user session management with conditional navigation based on authentication status.

## 🔄 How It Works

### Account Icon Click Behavior

1. **User NOT Logged In** → Opens Sign-In Modal
2. **User Logged In** → Navigates to Account Page

### Sign-In Flow

```
1. Click Account Icon (User not authenticated)
   ↓
2. Sign-In Modal Opens
   ↓
3. User enters email and clicks "Continue"
   ↓
4. Authentication processed
   ↓
5. Success → Auth context refreshed → Redirect to /account
   ↓
6. Account page displays with user info
```

## 📁 Files Involved

### Authentication Context
- **`contexts/AuthContext.tsx`** - Manages user session state
  - Provides: `customer`, `isAuthenticated`, `isLoading`, `signOut`, `refreshCustomer`
  - Auto-loads customer on app start
  - Handles token management

### Pages
- **`app/account/page.tsx`** - User account dashboard
  - Shows when user is authenticated
  - Displays: Profile, Saved items, Following, Orders, Settings
  - Includes sign-out functionality

### Components
- **`components/Auth/SignInModal.tsx`** - Sign-in modal
  - Handles email and passkey authentication
  - Refreshes auth context after success
  - Redirects to /account page

- **`components/Layout/Navbar.tsx`** - Navigation bar
  - Checks authentication status
  - Conditionally shows modal or navigates to account

### Providers
- **`providers.tsx`** - App-level providers
  - Wraps app with `AuthProvider`
  - Enables authentication context throughout app

## 🎨 Account Page Features

Matching the uploaded design:

- ✅ User profile section with avatar (initials)
- ✅ Email display
- ✅ Sidebar menu:
  - Following
  - Saved
  - Installments
  - Subscriptions
  - Order history
- ✅ Settings link
- ✅ Support link
- ✅ Sign-out button
- ✅ Main content cards:
  - Saved items
  - Following
  - Shop Pay setup
- ✅ Account information section
- ✅ Smooth animations
- ✅ Dark mode support

## 🔐 Testing the Flow

### Test as Unauthenticated User
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Click Account icon → Modal opens ✅
4. Enter email → Click Continue
5. After success → Redirects to /account ✅

### Test as Authenticated User
1. Sign in first (follow above steps)
2. Click Account icon → Goes to /account ✅
3. No modal appears ✅

## 🚀 Next Steps

To enable real authentication:

1. **Configure Shopify API**
   - Add environment variables
   - Update `lib/auth/shopify-auth.ts` with real API calls

2. **Implement Additional Pages**
   - `/account/saved` - Saved products
   - `/account/following` - Followed brands
   - `/account/orders` - Order history
   - `/account/settings` - User settings

3. **Add Protected Routes**
   - Create middleware to protect routes
   - Redirect unauthenticated users

4. **Enhance Features**
   - Add password reset
   - Email verification
   - Profile editing
   - Avatar upload

## 💡 Usage Examples

### Using Auth Context in Components

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { customer, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <p>Welcome, {customer?.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Protecting a Page

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>Protected Content</div>;
}
```

## 🎯 Key Benefits

- ✅ Seamless user experience
- ✅ Automatic session management
- ✅ Conditional navigation based on auth status
- ✅ Professional account page design
- ✅ Easy to extend and customize
- ✅ Type-safe with TypeScript
- ✅ Ready for Shopify integration

---

**Status**: ✅ Fully Implemented and Ready for Testing
