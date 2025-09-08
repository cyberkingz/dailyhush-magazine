import React, { useState } from 'react';
import { AuthPageProps } from './types';
import { AuthCard, AuthHeader, AuthForm, AuthDivider, AuthFooter, AuthLink } from './AuthCard';
import InputField from './InputField';
import Button from './Button';
import Alert from './Alert';
import SocialButton from './SocialButton';
import { cn } from '../../lib/utils';

const LoginPage: React.FC<AuthPageProps> = ({
  onSuccess,
  redirectTo,
  className,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);
  const [socialLoading, setSocialLoading] = useState<Record<string, boolean>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      
      // Mock successful login
      setAlert({ type: 'success', message: 'Login successful! Redirecting...' });
      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Invalid email or password. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setSocialLoading(prev => ({ ...prev, [provider]: true }));
    setAlert(null);

    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAlert({ type: 'success', message: `Signed in with ${provider}!` });
      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    } catch (error) {
      setAlert({
        type: 'error',
        message: `Failed to sign in with ${provider}. Please try again.`
      });
    } finally {
      setSocialLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={cn('auth-fade-in', className)}>
      <AuthCard>
        <AuthHeader
          title="Welcome back"
          subtitle="Sign in to your account to continue"
        />

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            dismissible
            onDismiss={() => setAlert(null)}
          />
        )}

        {/* Social Login Options */}
        <div className="space-y-3">
          <SocialButton
            provider="google"
            onClick={() => handleSocialLogin('Google')}
            loading={socialLoading.google}
            disabled={loading}
          />
          <SocialButton
            provider="github"
            onClick={() => handleSocialLogin('GitHub')}
            loading={socialLoading.github}
            disabled={loading}
          />
        </div>

        <AuthDivider text="or continue with email" />

        <AuthForm onSubmit={handleSubmit}>
          <InputField
            type="email"
            label="Email address"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={errors.email}
            placeholder="Enter your email"
            autoComplete="email"
            autoFocus
            required
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

          <InputField
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleInputChange('password')}
            error={errors.password}
            placeholder="Enter your password"
            autoComplete="current-password"
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

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-neutral-300 rounded"
              />
              <span className="ml-2 text-sm text-neutral-600">Remember me</span>
            </label>
            <AuthLink href="/auth/forgot-password" className="text-sm">
              Forgot your password?
            </AuthLink>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Sign in
          </Button>
        </AuthForm>

        <AuthFooter>
          <p className="text-neutral-600">
            Don't have an account?{' '}
            <AuthLink href="/auth/register">
              Sign up for free
            </AuthLink>
          </p>
          <p className="text-xs text-neutral-500">
            By signing in, you agree to our{' '}
            <AuthLink href="/terms" className="text-xs">Terms of Service</AuthLink>
            {' '}and{' '}
            <AuthLink href="/privacy" className="text-xs">Privacy Policy</AuthLink>
          </p>
        </AuthFooter>
      </AuthCard>
    </div>
  );
};

export default LoginPage;