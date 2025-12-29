
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'email' | 'code'>('email');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const returnTo = searchParams.get('return_to') || '/account';

    async function handleSendCode(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await fetch('/api/auth/send-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        setLoading(false);

        if (res.ok) {
            setStep('code');
        } else {
            const data = await res.json();
            setError(data.error || 'Failed to send code');
        }
    }

    async function handleVerifyCode(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await fetch('/api/auth/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code, returnTo })
        });

        if (res.ok) {
            const data = await res.json();
            router.push(data.redirectUrl || returnTo);
        } else {
            setLoading(false);
            const data = await res.json();
            setError(data.error || 'Invalid code');
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                {step === 'email' ? (
                    <form onSubmit={handleSendCode} className="login-form">
                        <h1>Sign In</h1>
                        <p>Enter your email to receive a verification code</p>

                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? 'Sending...' : 'Continue'}
                        </button>

                        {error && <p>{error}</p>}
                    </form>
                ) : (
                    <form onSubmit={handleVerifyCode} className="login-form">
                        <h1>Enter Verification Code</h1>
                        <p>We sent a code to <strong>{email}</strong></p>

                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength={6}
                            pattern="[0-9]{6}"
                            required
                            autoFocus
                            disabled={loading}
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify & Sign In'}
                        </button>

                        <button type="button" onClick={() => setStep('email')} disabled={loading}>
                            Change email
                        </button>

                        {error && <p>{error}</p>}
                    </form>
                )}
            </div>
        </div>
    );
}
