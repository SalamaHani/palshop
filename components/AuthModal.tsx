'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

type Step = 'email' | 'code';

export function AuthModal() {
  const router = useRouter();
  const { isAuthModalOpen, closeAuthModal, sendCode, verifyCode } = useAuth();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [devCode, setDevCode] = useState('');

  const emailInputRef = useRef<HTMLInputElement>(null);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('email');
      setEmail('');
      setCode(['', '', '', '', '', '']);
      setError('');
      setDevCode('');
      setTimeout(() => emailInputRef.current?.focus(), 100);
    }
  }, [isAuthModalOpen]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeAuthModal();
      }
    }



    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isAuthModalOpen, closeAuthModal]);

  // Handle escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeAuthModal();
      }
    }

    if (isAuthModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isAuthModalOpen, closeAuthModal]);

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await sendCode(email);

    setLoading(false);

    if (result.success) {
      setStep('code');
      setCountdown(60);
      if (result.code) {
        setDevCode(result.code);
      }
      setTimeout(() => codeInputRefs.current[0]?.focus(), 100);
    } else {
      setError(result.error || 'Failed to send code');
      triggerShake();
    }
  }

  async function handleCodeSubmit() {
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;

    setError('');
    setLoading(true);

    const result = await verifyCode(email, fullCode);

    setLoading(false);

    if (result.success) {
      router.push(result.redirectTo || '/account');
    } else {
      setError(result.error || 'Invalid code');
      setCode(['', '', '', '', '', '']);
      codeInputRefs.current[0]?.focus();
      triggerShake();
    }
  }

  function handleCodeChange(index: number, value: string) {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-advance to next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (value && index === 5) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        setTimeout(() => handleCodeSubmit(), 100);
      }
    }
  }

  function handleCodeKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  }

  function handleCodePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      codeInputRefs.current[5]?.focus();
      setTimeout(() => handleCodeSubmit(), 100);
    }
  }

  async function handleResendCode() {
    if (countdown > 0) return;

    setError('');
    setLoading(true);

    const result = await sendCode(email);

    setLoading(false);

    if (result.success) {
      setCountdown(60);
      if (result.code) {
        setDevCode(result.code);
      }
      setCode(['', '', '', '', '', '']);
      codeInputRefs.current[0]?.focus();
    } else {
      setError(result.error || 'Failed to resend code');
    }
  }

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-custom animate-fade-in">
      <div
        ref={modalRef}
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-slide-up ${shake ? 'animate-shake' : ''
          }`}
      >
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {step === 'email' ? (
          <>
            {/* Email Step */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Welcome</h2>
              <p className="text-gray-500 mt-1">Sign in with your email</p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  ref={emailInputRef}
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3.5 px-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              We'll send you a verification code
            </p>
          </>
        ) : (
          <>
            {/* Code Step */}
            <div className="text-center mb-8">
              <button
                onClick={() => {
                  setStep('email');
                  setCode(['', '', '', '', '', '']);
                  setError('');
                }}
                className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Check your email</h2>
              <p className="text-gray-500 mt-1">
                We sent a code to <span className="font-medium text-gray-700">{email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Enter 6-digit code
                </label>
                <div className="flex justify-center gap-2" onPaste={handleCodePaste}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { codeInputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      disabled={loading}
                      className="w-12 h-14 text-center text-xl font-semibold font-mono bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-colors disabled:opacity-50"
                    />
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              )}

              <button
                onClick={handleCodeSubmit}
                disabled={loading || code.join('').length !== 6}
                className="w-full py-3.5 px-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={handleResendCode}
                disabled={countdown > 0 || loading}
                className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {countdown > 0 ? (
                  <>Resend code in {countdown}s</>
                ) : (
                  <>Didn't receive a code? <span className="font-medium text-gray-900">Resend</span></>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
