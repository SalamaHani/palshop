'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, X, ChevronDown, RefreshCw, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationStepProps {
    email: string;
    onVerify: (code: string) => Promise<boolean>;
    onResend: () => Promise<void>;
    onChangeEmail: () => void;
    onClose?: () => void;
}

export default function VerificationStep({
    email,
    onVerify,
    onResend,
    onChangeEmail,
    onClose,
}: VerificationStepProps) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value) || isSuccess) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        } else if (!value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Auto verify if all filled
        const finalCode = newOtp.join('');
        if (finalCode.length === 6) {
            triggerVerify(finalCode);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const triggerVerify = async (code: string) => {
        if (isVerifying || isSuccess) return;
        setIsVerifying(true);
        try {
            const success = await onVerify(code);
            if (success) {
                setIsSuccess(true);
            } else {
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (timeLeft > 0 || isResending || isSuccess) return;
        setIsResending(true);
        try {
            await onResend();
            setTimeLeft(60);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header: Logo */}
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-black text-primary tracking-tighter" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                    shop
                </h1>
            </div>

            {/* Content */}
            <div className="space-y-8">
                {/* Email with Dropdown trigger */}
                <div className="flex items-center justify-center">
                    <button
                        onClick={onChangeEmail}
                        className="text-lg font-bold text-gray-900 flex items-center gap-1 hover:opacity-70 transition-opacity"
                    >
                        {email}
                        <ChevronDown className="w-4 h-4 text-gray-900" />
                    </button>
                </div>

                {/* 6 separate digit boxes */}
                <div className="flex justify-between gap-2 px-1">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={cn(
                                "w-12 h-16 text-center text-3xl font-bold rounded-2xl border transition-all outline-none",
                                isSuccess
                                    ? "border-green-500 bg-green-50/30 text-green-600"
                                    : "border-gray-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10"
                            )}
                            maxLength={1}
                            autoFocus={index === 0}
                            disabled={isSuccess || isVerifying}
                        />
                    ))}
                </div>

                {/* Footer text */}
                <div className="space-y-4 text-center">
                    {isSuccess ? (
                        <div className="flex flex-col items-center gap-2 animate-in zoom-in duration-300">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                            <p className="text-lg font-bold text-green-600">Verified Successfully</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-lg font-bold text-gray-900">
                                Enter code sent to email
                            </p>

                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={timeLeft > 0 || isResending}
                                    className={cn(
                                        "text-sm font-bold transition-colors",
                                        timeLeft > 0 ? "text-gray-300" : "text-primary hover:underline"
                                    )}
                                >
                                    {isResending ? "Resending..." : timeLeft > 0 ? `Resend code in ${timeLeft}s` : "Resend code"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Optional Loading Overlay for verification */}
            {isVerifying && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-50 rounded-3xl">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            )}
        </div>
    );
}
