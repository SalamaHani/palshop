// components/CustomSignInForm.tsx
'use client';
import { useState, useRef, useEffect, FormEvent, ChangeEvent, KeyboardEvent } from 'react';

interface Customer {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
}

interface CustomSignInFormProps {
    onSuccess?: (customer: Customer) => void;
}

export default function CustomSignInForm({ onSuccess }: CustomSignInFormProps) {
    const [step, setStep] = useState<'email' | 'code'>('email');
    const [email, setEmail] = useState<string>('');
    const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
    const [sessionId, setSessionId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [resendTimer, setResendTimer] = useState<number>(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Send verification code
    const handleSendCode = async (e?: FormEvent<HTMLFormElement>): Promise<void> => {
        e?.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/send-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                setSessionId(data.sessionId);
                setStep('code');
                setResendTimer(60);
                setTimeout(() => inputRefs.current[0]?.focus(), 100);
            } else {
                setError(data.error || 'Failed to send verification code');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle code input change
    const handleCodeChange = (index: number, value: string): void => {
        // Only allow digits
        if (!/^\d*$/.test(value)) return;

        // Handle paste
        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split('');
            const newCode = [...code];
            pastedCode.forEach((digit, i) => {
                if (index + i < 6) {
                    newCode[index + i] = digit;
                }
            });
            setCode(newCode);

            const lastFilledIndex = Math.min(index + pastedCode.length, 5);
            inputRefs.current[lastFilledIndex]?.focus();

            if (newCode.every(d => d !== '')) {
                handleVerifyCode(newCode.join(''));
            }
            return;
        }

        // Single digit input
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-verify when all 6 digits entered
        if (index === 5 && value && newCode.every(d => d !== '')) {
            handleVerifyCode(newCode.join(''));
        }
    };

    // Handle backspace
    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Backspace') {
            if (!code[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            } else {
                const newCode = [...code];
                newCode[index] = '';
                setCode(newCode);
            }
        }
    };

    // Verify code
    const handleVerifyCode = async (codeString: string = ''): Promise<void> => {
        const finalCode = codeString || code.join('');

        if (finalCode.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, code: finalCode })
            });

            const data = await response.json();

            if (data.success) {
                if (onSuccess) {
                    onSuccess(data.customer);
                }
            } else {
                setError(data.error || 'Invalid verification code');
                setCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    // Resend code
    const handleResendCode = async (): Promise<void> => {
        if (resendTimer > 0) return;

        setCode(['', '', '', '', '', '']);
        setError('');
        await handleSendCode();
    };

    // Change email
    const handleChangeEmail = (): void => {
        setStep('email');
        setCode(['', '', '', '', '', '']);
        setError('');
        setSessionId('');
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {step === 'email' ? 'Welcome back' : 'Check your email'}
                </h1>
                <p className="text-gray-600">
                    {step === 'email'
                        ? 'Sign in to access your account'
                        : `We sent a code to ${email}`
                    }
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Email Step */}
            {step === 'email' && (
                <form onSubmit={handleSendCode} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition text-base"
                            placeholder="you@example.com"
                            required
                            autoFocus
                            autoComplete="email"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Sending code...
                            </span>
                        ) : (
                            'Continue with email'
                        )}
                    </button>

                    <p className="text-xs text-center text-gray-500">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </form>
            )}

            {/* Code Verification Step */}
            {step === 'code' && (
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                            Enter 6-digit code
                        </label>
                        <div className="flex gap-2 justify-center mb-6">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleCodeChange(index, e.target.value)}
                                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-black focus:ring-2 focus:ring-black outline-none transition"
                                    disabled={loading}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => handleVerifyCode()}
                        disabled={loading || code.join('').length !== 6}
                        className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Verifying...
                            </span>
                        ) : (
                            'Verify code'
                        )}
                    </button>

                    <div className="flex flex-col gap-3 text-center">
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={resendTimer > 0}
                            className="text-sm text-gray-600 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {resendTimer > 0
                                ? `Resend code in ${resendTimer}s`
                                : 'Resend code'
                            }
                        </button>

                        <button
                            type="button"
                            onClick={handleChangeEmail}
                            className="text-sm text-gray-600 hover:text-black transition"
                        >
                            Use a different email
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}



