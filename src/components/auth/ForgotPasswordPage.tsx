import React, { useState } from 'react';
interface AuthPageProps {
  onSuccess?: () => void;
  redirectTo?: string;
  className?: string;
}
import { AuthCard, AuthHeader, AuthForm, AuthFooter, AuthLink } from './AuthCard';
import InputField from './InputField';
import Button from './Button';
import Alert from './Alert';
import { cn } from '../../lib/utils';

const ForgotPasswordPage: React.FC<AuthPageProps> = ({
  onSuccess: _onSuccess,
  redirectTo: _redirectTo,
  className,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(0);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setLastSentTime(new Date());
      startCountdown();
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setResendLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSentTime(new Date());
      startCountdown();
    } catch (error) {
      setError('Failed to resend email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const startCountdown = () => {
    setCountdown(60);
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

  const handleInputChange = (value: string) => {
    setEmail(value);
    if (error) {
      setError('');
    }
  };

  if (success) {
    return (
      <div className={cn('auth-fade-in', className)}>
        <AuthCard>
          <AuthHeader
            title="Check your email"
            subtitle="We've sent password reset instructions to your email address"
          />

          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-success-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div className="space-y-4">
              <p className="text-neutral-600">
                We've sent a password reset link to:
              </p>
              <p className="font-semibold text-neutral-900 break-all">
                {email}
              </p>
              <p className="text-sm text-neutral-500">
                The link will expire in 1 hour for security reasons.
              </p>
            </div>

            <Alert
              type="info"
              message="Can't find the email? Check your spam folder or try another email address."
              className="text-left"
            />

            <div className="space-y-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
                onClick={handleResend}
                loading={resendLoading}
                disabled={countdown > 0}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend email'}
              </Button>

              {lastSentTime && (
                <p className="text-xs text-neutral-500">
                  Last sent: {lastSentTime.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          <AuthFooter>
            <p className="text-neutral-600">
              Remember your password?{' '}
              <AuthLink href="/auth/login">
                Back to sign in
              </AuthLink>
            </p>
          </AuthFooter>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className={cn('auth-fade-in', className)}>
      <AuthCard>
        <AuthHeader
          title="Forgot your password?"
          subtitle="No worries! Enter your email and we'll send you reset instructions"
        />

        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-brand-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
        </div>

        <AuthForm onSubmit={handleSubmit}>
          <InputField
            type="email"
            label="Email address"
            value={email}
            onChange={handleInputChange}
            error={error}
            placeholder="Enter your email address"
            autoComplete="email"
            autoFocus
            required
            hint="Enter the email address associated with your account"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            }
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Send reset instructions
          </Button>
        </AuthForm>

        <Alert
          type="info"
          message="You'll receive an email with a link to reset your password. The link will be valid for 1 hour."
          className="mt-6"
        />

        <AuthFooter>
          <p className="text-neutral-600">
            Remember your password?{' '}
            <AuthLink href="/auth/login">
              Back to sign in
            </AuthLink>
          </p>
          <p className="text-neutral-600">
            Don't have an account?{' '}
            <AuthLink href="/auth/register">
              Sign up for free
            </AuthLink>
          </p>
        </AuthFooter>
      </AuthCard>
    </div>
  );
};

export default ForgotPasswordPage;