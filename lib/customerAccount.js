// components/SignInForm.jsx
'use client';
import { useState } from 'react';

export default function SignInForm() {
    const [email, setEmail] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();

        const authUrl = `${process.env.NEXT_PUBLIC_CUSTOMER_ACCOUNT_API_URL}/auth/oauth/authorize`;
        const params = new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
            scope: 'openid email',
            response_type: 'code',
            redirect_uri: 'https://server.palshop.app/auth/callback',
            state: crypto.randomUUID(),
            login_hint: email,
        });

        window.location.href = `${authUrl}?${params}`;
    };

    return (
        <form onSubmit={handleSignIn}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
            />
            <button type="submit">Sign In</button>
        </form>
    );
}
