import React, { useState, useEffect } from 'react';
import { AuthPageProps } from './types';
import { AuthCard, AuthHeader, AuthForm, AuthFooter, AuthLink } from './AuthCard';
import Button from './Button';
import Alert from './Alert';
import TwoFactorInput from './TwoFactorInput';
import { cn } from '../../lib/utils';

interface TwoFactorAuthPageProps extends AuthPageProps {
  email?: string;
  method?: '2fa' | 'sms' | 'email';
}

const TwoFactorAuthPage: React.FC<TwoFactorAuthPageProps> = ({
  email,
  method = '2fa',
  onSuccess,
  redirectTo,
  className,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

  const maxAttempts = 3;
  const lockDuration = 300; // 5 minutes in seconds

  useEffect(() => {
    // Start initial countdown for resend
    if (method === 'sms' || method === 'email') {
      startCountdown();
    }
  }, [method]);

  const getMethodConfig = () => {
    switch (method) {
      case 'sms':
        return {
          title: 'Enter SMS code',
          subtitle: "We've sent a verification code to your phone",
          icon: (
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          ),
          resendText: 'Resend SMS code',
          description: 'Enter the 6-digit code sent to your phone number',
        };
      case 'email':
        return {
          title: 'Enter email code',
          subtitle: "We've sent a verification code to your email",
          icon: (
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
          resendText: 'Resend email code',
          description: 'Enter the 6-digit code sent to your email address',
        };
      default: // '2fa'
        return {
          title: 'Two-Factor Authentication',
          subtitle: 'Enter your authenticator code',
          icon: (
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
          resendText: null,
          description: 'Enter the 6-digit code from your authenticator app',
        };
    }
  };

  const config = getMethodConfig();

  const startCountdown = () => {
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startLockCountdown = () => {
    setLockCountdown(lockDuration);
    const timer = setInterval(() => {
      setLockCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLocked(false);
          setAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setError('Please enter a complete 6-digit code');
      return;
    }

    if (isLocked) {
      return;
    }

    setLoading(true);
    setError('');
    setAlert(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, '123456' is the correct code
      if (code === '123456') {
        setAlert({
          type: 'success',
          message: 'Verification successful! Signing you in...'
        });
        
        setTimeout(() => {
          onSuccess?.();
        }, 1500);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= maxAttempts) {
          setIsLocked(true);
          startLockCountdown();
          setAlert({
            type: 'error',
            message: `Too many incorrect attempts. Please wait ${lockDuration / 60} minutes before trying again.`
          });
        } else {
          setError(`Incorrect code. ${maxAttempts - newAttempts} attempts remaining.`);
        }
        setCode('');
      }
    } catch (error) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || !config.resendText) return;

    setResendLoading(true);
    setAlert(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      startCountdown();
      setAlert({
        type: 'success',
        message: `New verification code sent!`
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to send new code. Please try again.'
      });
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('auth-fade-in', className)}>
      <AuthCard>
        <AuthHeader
          title={config.title}
          subtitle={config.subtitle}
        />

        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
            {config.icon}
          </div>
          <p className="text-sm text-neutral-600">
            {config.description}
          </p>
          {email && (
            <p className="text-sm font-medium text-neutral-900 mt-2">
              {method === 'email' ? email : '••••••••••' + email.slice(-4)}
            </p>
          )}
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            dismissible={alert.type !== 'success'}
            onDismiss={() => setAlert(null)}
          />
        )}

        {isLocked && (
          <Alert
            type="error"
            title="Account temporarily locked"
            message={`Too many incorrect attempts. Try again in ${formatTime(lockCountdown)}.`}
          />
        )}

        <AuthForm onSubmit={handleSubmit}>
          <TwoFactorInput
            value={code}
            onChange={setCode}
            error={error}
            disabled={loading || isLocked}
            autoFocus
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading || isLocked || code.length !== 6}
          >
            {isLocked ? 'Account Locked' : 'Verify Code'}
          </Button>
        </AuthForm>

        {/* Resend Section */}
        {config.resendText && !isLocked && (
          <div className="text-center mt-6">
            <p className="text-sm text-neutral-600 mb-3">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              loading={resendLoading}
              disabled={countdown > 0}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : config.resendText}
            </Button>
          </div>
        )}

        {/* Alternative Methods */}
        <div className="mt-6 space-y-3">
          {method !== 'email' && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              fullWidth
              onClick={() => window.location.href = '/auth/2fa?method=email'}
            >
              Use email verification instead
            </Button>
          )}
          
          {method !== '2fa' && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              fullWidth
              onClick={() => window.location.href = '/auth/2fa?method=2fa'}
            >
              Use authenticator app instead
            </Button>
          )}
        </div>

        {/* Help Text */}
        {method === '2fa' && (
          <Alert
            type="info"
            message="Open your authenticator app (Google Authenticator, Authy, etc.) and enter the 6-digit code for this account."
            className="mt-6"
          />
        )}

        <AuthFooter>
          <p className="text-neutral-600">
            Having trouble?{' '}
            <AuthLink href="/support">
              Contact support
            </AuthLink>
          </p>
          <p className="text-neutral-600">
            <AuthLink href="/auth/login">
              Back to sign in
            </AuthLink>
          </p>
        </AuthFooter>
      </AuthCard>
    </div>
  );
};

export default TwoFactorAuthPage;