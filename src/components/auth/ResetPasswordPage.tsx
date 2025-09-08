import React, { useState, useEffect } from 'react';
import { AuthPageProps } from './types';
import { AuthCard, AuthHeader, AuthForm, AuthFooter, AuthLink } from './AuthCard';
import InputField from './InputField';
import Button from './Button';
import Alert from './Alert';
import { Progress } from './Progress';
import { cn } from '../../lib/utils';

interface ResetPasswordPageProps extends AuthPageProps {
  token?: string;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  token,
  onSuccess,
  redirectTo,
  className,
}) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

  useEffect(() => {
    // Validate token on component mount
    validateToken();
  }, [token]);

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.match(/[a-z]/)) score += 25;
    if (password.match(/[A-Z]/)) score += 25;
    if (password.match(/[0-9]/)) score += 25;
    if (password.match(/[^A-Za-z0-9]/)) score += 25;
    return Math.min(score, 100);
  };

  const validateToken = async () => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    try {
      // Simulate token validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, consider token valid if it's not 'invalid'
      if (token === 'invalid') {
        setTokenValid(false);
        setAlert({
          type: 'error',
          message: 'This reset link is invalid or has expired.'
        });
      } else {
        setTokenValid(true);
      }
    } catch (error) {
      setTokenValid(false);
      setAlert({
        type: 'error',
        message: 'Unable to validate reset link. Please try again.'
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 75) {
      newErrors.password = 'Password is too weak. Use a mix of letters, numbers, and symbols.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setAlert(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setAlert({
        type: 'success',
        message: 'Your password has been reset successfully!'
      });
      
      // Redirect after a delay
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to reset password. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <div className={cn('auth-fade-in', className)}>
        <AuthCard>
          <div className="text-center py-12">
            <div className="auth-spinner w-8 h-8 mx-auto mb-4" />
            <p className="text-neutral-600">Validating reset link...</p>
          </div>
        </AuthCard>
      </div>
    );
  }

  // Invalid token state
  if (tokenValid === false) {
    return (
      <div className={cn('auth-fade-in', className)}>
        <AuthCard>
          <AuthHeader
            title="Invalid reset link"
            subtitle="This password reset link is invalid or has expired"
          />

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
              <p className="text-neutral-600">
                The password reset link you clicked is either invalid or has expired.
              </p>
              <p className="text-sm text-neutral-500">
                Reset links are only valid for 1 hour for security reasons.
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => window.location.href = '/auth/forgot-password'}
            >
              Request new reset link
            </Button>
          </div>

          <AuthFooter>
            <p className="text-neutral-600">
              <AuthLink href="/auth/login">
                Back to sign in
              </AuthLink>
            </p>
          </AuthFooter>
        </AuthCard>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className={cn('auth-fade-in', className)}>
        <AuthCard>
          <AuthHeader
            title="Password updated!"
            subtitle="Your password has been successfully reset"
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <div className="space-y-4">
              <p className="text-neutral-600">
                You can now use your new password to sign in to your account.
              </p>
              <p className="text-sm text-neutral-500">
                For your security, you've been signed out of all other devices.
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
        </AuthCard>
      </div>
    );
  }

  return (
    <div className={cn('auth-fade-in', className)}>
      <AuthCard>
        <AuthHeader
          title="Create new password"
          subtitle="Enter a strong password for your account"
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            dismissible
            onDismiss={() => setAlert(null)}
          />
        )}

        <AuthForm onSubmit={handleSubmit}>
          <div className="space-y-4">
            <InputField
              type="password"
              label="New password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={errors.password}
              placeholder="Enter your new password"
              autoComplete="new-password"
              autoFocus
              required
              showPasswordToggle
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
            />

            {formData.password && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Password strength</span>
                  <span className={cn('font-medium', {
                    'text-error-600': passwordStrength < 25,
                    'text-warning-600': passwordStrength >= 25 && passwordStrength < 50,
                    'text-info-600': passwordStrength >= 50 && passwordStrength < 75,
                    'text-success-600': passwordStrength >= 75,
                  })}>
                    {passwordStrength < 25 ? 'Weak' : 
                     passwordStrength < 50 ? 'Fair' : 
                     passwordStrength < 75 ? 'Good' : 'Strong'}
                  </span>
                </div>
                <Progress value={passwordStrength} />
                <ul className="text-xs text-neutral-500 space-y-1">
                  <li className={cn('flex items-center', formData.password.length >= 8 ? 'text-success-600' : '')}>
                    <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    At least 8 characters
                  </li>
                  <li className={cn('flex items-center', formData.password.match(/[a-z]/) && formData.password.match(/[A-Z]/) ? 'text-success-600' : '')}>
                    <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Mixed case letters
                  </li>
                  <li className={cn('flex items-center', formData.password.match(/[0-9]/) ? 'text-success-600' : '')}>
                    <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    At least one number
                  </li>
                </ul>
              </div>
            )}

            <InputField
              type="password"
              label="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={errors.confirmPassword}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              required
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Update password
          </Button>
        </AuthForm>

        <Alert
          type="info"
          message="After updating your password, you'll be signed out of all other devices for security."
          className="mt-6"
        />

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
};

export default ResetPasswordPage;