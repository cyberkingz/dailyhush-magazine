import React, { useState, useEffect } from 'react';
import { AuthPageProps } from './types';
import { AuthCard, AuthHeader, AuthFooter, AuthLink } from './AuthCard';
import Button from './Button';
import Alert from './Alert';
import { cn } from '../../lib/utils';

interface EmailVerificationPageProps extends AuthPageProps {
  token?: string;
  email?: string;
}

const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({
  token,
  email,
  onSuccess,
  redirectTo,
  className,
}) => {
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      // If no token, show the "check your email" state
      setVerificationState('success');
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      // Simulate email verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, different token values simulate different outcomes
      if (token === 'expired') {
        setVerificationState('expired');
        setAlert({
          type: 'error',
          message: 'This verification link has expired. Please request a new one.'
        });
      } else if (token === 'invalid') {
        setVerificationState('error');
        setAlert({
          type: 'error',
          message: 'This verification link is invalid. Please check the URL or request a new one.'
        });
      } else {
        setVerificationState('success');
        setAlert({
          type: 'success',
          message: 'Your email has been successfully verified!'
        });
        
        // Redirect after success
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      }
    } catch (error) {
      setVerificationState('error');
      setAlert({
        type: 'error',
        message: 'Failed to verify your email. Please try again.'
      });
    }
  };

  const handleResendVerification = async () => {
    if (countdown > 0) return;

    setResendLoading(true);
    setAlert(null);

    try {
      // Simulate resend verification email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLastSentTime(new Date());
      startCountdown();
      setAlert({
        type: 'success',
        message: 'Verification email sent! Check your inbox and spam folder.'
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to send verification email. Please try again.'
      });
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

  const renderContent = () => {
    switch (verificationState) {
      case 'loading':
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
              <div className="auth-spinner w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-neutral-900">
                Verifying your email...
              </h3>
              <p className="text-neutral-600">
                Please wait while we verify your email address.
              </p>
            </div>
          </div>
        );

      case 'success':
        if (token) {
          // Email verification successful
          return (
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Email verified successfully!
                </h3>
                <p className="text-neutral-600">
                  Your email address has been verified. You can now access all features of your account.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => window.location.href = '/auth/login'}
              >
                Continue to sign in
              </Button>
            </div>
          );
        } else {
          // Show "check your email" state
          return (
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-info-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-info-600"
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
                <h3 className="text-lg font-semibold text-neutral-900">
                  Check your email
                </h3>
                <p className="text-neutral-600">
                  We've sent a verification link to your email address. Click the link to verify your account.
                </p>
                {email && (
                  <p className="font-semibold text-neutral-900 break-all">
                    {email}
                  </p>
                )}
                <p className="text-sm text-neutral-500">
                  The verification link will expire in 24 hours.
                </p>
              </div>

              <Alert
                type="info"
                message="Can't find the email? Check your spam folder or make sure you entered the correct email address."
                className="text-left"
              />

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={handleResendVerification}
                  loading={resendLoading}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend verification email'}
                </Button>

                {lastSentTime && (
                  <p className="text-xs text-neutral-500">
                    Last sent: {lastSentTime.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          );
        }

      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-error-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-error-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Verification failed
              </h3>
              <p className="text-neutral-600">
                We couldn't verify your email address. The link may be invalid or corrupted.
              </p>
            </div>
            <div className="space-y-3">
              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleResendVerification}
                loading={resendLoading}
                disabled={countdown > 0}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Send new verification email'}
              </Button>
            </div>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-warning-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Verification link expired
              </h3>
              <p className="text-neutral-600">
                This verification link has expired. Verification links are valid for 24 hours for security reasons.
              </p>
            </div>
            <div className="space-y-3">
              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleResendVerification}
                loading={resendLoading}
                disabled={countdown > 0}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Send new verification email'}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('auth-fade-in', className)}>
      <AuthCard>
        <AuthHeader
          title="Email verification"
          subtitle={
            verificationState === 'loading' ? 'Verifying your email address' :
            verificationState === 'success' && token ? 'Your email has been verified' :
            verificationState === 'success' ? 'Almost there! One more step' :
            verificationState === 'expired' ? 'Verification link expired' :
            'Something went wrong'
          }
        />

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            dismissible={alert.type !== 'success'}
            onDismiss={() => setAlert(null)}
          />
        )}

        {renderContent()}

        <AuthFooter>
          <p className="text-neutral-600">
            Need help?{' '}
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

export default EmailVerificationPage;