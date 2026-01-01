// components/CustomSignInForm.tsx
'use client';
import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronDown } from 'lucide-react';

interface Customer {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
}

interface CustomSignInFormProps {
    onSuccess?: (customer: Customer | any) => void;
}
export default function CustomSignInForm({ onSuccess }: CustomSignInFormProps) {
    const [step, setStep] = useState<'email' | 'code'>('email');
    const [email, setEmail] = useState<string>('');
    const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [resendTimer, setResendTimer] = useState<number>(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const emailRef = useRef<HTMLInputElement>(null);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Auto-focus logic for both steps
    useEffect(() => {
        const timer = setTimeout(() => {
            if (step === 'code') {
                inputRefs.current[0]?.focus();
            } else if (step === 'email') {
                emailRef.current?.focus();
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [step]);

    // Send verification code
    const handleSendCode = async (e?: FormEvent<HTMLFormElement>): Promise<void> => {
        e?.preventDefault();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/send-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to send code');
                return;
            }

            setStep('code');
            setResendTimer(60);
        } catch {
            setError('Failed to send code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle pasting the full code
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pastedData) return;

        const newCode = [...code];
        pastedData.split('').forEach((digit, i) => {
            if (i < 6) newCode[i] = digit;
        });
        setCode(newCode);

        // Focus the appropriate input
        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex]?.focus();

        // If complete, verify
        if (pastedData.length === 6) {
            handleVerifyCode(pastedData);
        }
    };

    // Handle code input change
    const handleCodeChange = (index: number, value: string): void => {
        // Only allow digits
        if (!/^\d*$/.test(value)) return;

        // If multiple digits (usually from some browsers' auto-fill/paste fallback)
        if (value.length > 1) {
            const digits = value.replace(/\D/g, '').slice(0, 6).split('');
            const newCode = [...code];
            digits.forEach((digit, i) => {
                if (index + i < 6) newCode[index + i] = digit;
            });
            setCode(newCode);

            if (newCode.every(d => d !== '')) {
                handleVerifyCode(newCode.join(''));
            }
            return;
        }

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (index === 5 && value && newCode.every(d => d !== '')) {
            handleVerifyCode(newCode.join(''));
        }
    };

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
                body: JSON.stringify({ email, code: finalCode }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    onSuccess?.(data.customer || { email: data.email, id: data.customerId });
                }, 1500);
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

    const handleResendCode = async (): Promise<void> => {
        if (resendTimer > 0 || loading) return;
        setCode(['', '', '', '', '', '']);
        setError('');
        await handleSendCode();
    };

    const handleChangeEmail = (): void => {
        setStep('email');
        setCode(['', '', '', '', '', '']);
        setError('');
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {step === 'email' ? (
                    <motion.div
                        key="email-step"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                    >
                        <div className="space-y-3 p-2">
                            <div className="flex items-center justify-start mb-2">
                                <span className="text-xl font-black tracking-tighter text-[#215732]">PAL<span className="text-xl font-medium tracking-tighter text-[#215732]">shop</span></span>
                            </div>

                            <div className="space-y-2 text-center">
                                <h1 className="font-sans font-normal text-sm text-gray-900 dark:text-white tracking-tight">
                                    Sign in or create an account
                                </h1>
                            </div>

                            <form onSubmit={handleSendCode} className="space-y-5">
                                <div className="space-y-1">
                                    <input
                                        id="email"
                                        ref={emailRef}
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-[14px] bg-white dark:bg-black border border-gray-200 dark:border-white/10 focus:border-[#215732] rounded-[14px] outline-none transition-all duration-200 text-base font-medium placeholder:text-gray-400"
                                        placeholder="Email"
                                        required
                                        autoFocus
                                        autoComplete="email"
                                        disabled={loading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                                    className="w-full bg-[#215732] text-white py-[10px] rounded-[14px] font-sans font-normal flex items-center justify-center transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <span className="font-sans font-normal">Continue</span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="code-step"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3 w-full"
                    >
                        <div className="space-y-3 p-2 overflow-hidden">
                            <div className="flex items-center justify-start mb-2">
                                <span className="text-xl font-black tracking-tighter text-[#215732]">PAL<span className="text-xl font-medium tracking-tighter text-[#215732]">shop</span></span>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleChangeEmail}
                                    className="flex items-center gap-2 group"
                                >
                                    <span className="text-base font-bold text-gray-900 dark:text-white">{email}</span>
                                    <ChevronDown className="w-3 h-3 text-gray-900 dark:text-white group-hover:translate-y-0.5 transition-transform" />
                                </button>

                                <div
                                    className="grid grid-cols-6 gap-2 sm:gap-3 cursor-text"
                                    onClick={() => {
                                        const indexToFocus = code.findIndex(d => !d);
                                        inputRefs.current[indexToFocus === -1 ? 5 : indexToFocus]?.focus();
                                    }}
                                >
                                    {code.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => { inputRefs.current[index] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            autoFocus={index === 0 && step === 'code'}
                                            onChange={(e) => handleCodeChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            onPaste={handlePaste}
                                            className="h-14 text-center text-xl font-medium bg-white dark:bg-black border-[1.5px] border-gray-300 dark:border-white/10 focus:border-[#215732] rounded-2xl outline-none transition-all duration-200"
                                            disabled={loading}
                                        />
                                    ))}
                                </div>

                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    Enter code sent to email
                                </p>
                            </div>



                            <div className="flex flex-col items-center gap-6 pt-2">
                                <button
                                    onClick={handleResendCode}
                                    disabled={resendTimer > 0 || loading}
                                    className="text-sm font-bold text-[#215732] disabled:opacity-50 transition-colors"
                                >
                                    {resendTimer > 0
                                        ? `Resend code in ${resendTimer}s`
                                        : 'Request new code'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3"
                    >
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Signed in successfully!</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3"
                    >
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
