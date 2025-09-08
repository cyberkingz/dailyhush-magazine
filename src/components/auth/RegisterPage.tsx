import React, { useState } from 'react';
import { AuthPageProps } from './types';
import { AuthCard, AuthHeader, AuthForm, AuthDivider, AuthFooter, AuthLink } from './AuthCard';
import InputField from './InputField';
import Button from './Button';
import Alert from './Alert';
import SocialButton from './SocialButton';
import { Steps, Progress } from './Progress';
import { cn } from '../../lib/utils';

const RegisterPage: React.FC<AuthPageProps> = ({
  onSuccess,
  redirectTo,
  className,
}) => {
  const [currentStep, setCurrentStep] = useState('account');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    marketingEmails: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);
  const [socialLoading, setSocialLoading] = useState<Record<string, boolean>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const steps = [
    {
      id: 'account',
      title: 'Account',
      description: 'Basic information'
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Password setup'
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Final details'
    }
  ];

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.match(/[a-z]/)) score += 25;
    if (password.match(/[A-Z]/)) score += 25;
    if (password.match(/[0-9]/)) score += 25;
    if (password.match(/[^A-Za-z0-9]/)) score += 25;
    return Math.min(score, 100);
  };

  const validateStep = (step: string) => {
    const newErrors: Record<string, string> = {};

    if (step === 'account') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (step === 'security') {
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
    }

    if (step === 'preferences') {
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'You must accept the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    const stepIndex = steps.findIndex(s => s.id === currentStep);
    const nextStep = steps[stepIndex + 1];

    if (nextStep) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(nextStep.id);
    }
  };

  const handleBack = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    const prevStep = steps[stepIndex - 1];

    if (prevStep) {
      setCompletedSteps(prev => prev.filter(id => id !== prevStep.id));
      setCurrentStep(prevStep.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep('preferences')) return;

    setLoading(true);
    setAlert(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAlert({ 
        type: 'success', 
        message: 'Account created successfully! Please check your email for verification.' 
      });
      
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to create account. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = async (provider: string) => {
    setSocialLoading(prev => ({ ...prev, [provider]: true }));
    setAlert(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAlert({ type: 'success', message: `Account created with ${provider}!` });
      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    } catch (error) {
      setAlert({
        type: 'error',
        message: `Failed to create account with ${provider}. Please try again.`
      });
    } finally {
      setSocialLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleInputChange = (field: string) => (value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'password' && typeof value === 'string') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);
  const progress = ((getCurrentStepIndex() + 1) / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 'account':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                type="text"
                label="First name"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                error={errors.firstName}
                placeholder="John"
                autoComplete="given-name"
                autoFocus
                required
              />
              <InputField
                type="text"
                label="Last name"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                error={errors.lastName}
                placeholder="Doe"
                autoComplete="family-name"
                required
              />
            </div>

            <InputField
              type="email"
              label="Email address"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              placeholder="john@example.com"
              autoComplete="email"
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
          </>
        );

      case 'security':
        return (
          <>
            <div className="space-y-4">
              <InputField
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                placeholder="Create a strong password"
                autoComplete="new-password"
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
                label="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
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
          </>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleInputChange('acceptTerms')(e.target.checked)}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-neutral-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-neutral-700">
                    I agree to the Terms and Conditions
                  </label>
                  <p className="text-neutral-500 text-xs mt-1">
                    By creating an account, you agree to our{' '}
                    <AuthLink href="/terms" className="text-xs">Terms of Service</AuthLink>
                    {' '}and{' '}
                    <AuthLink href="/privacy" className="text-xs">Privacy Policy</AuthLink>
                  </p>
                  {errors.acceptTerms && (
                    <p className="text-error-600 text-xs mt-1">{errors.acceptTerms}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="marketing"
                    type="checkbox"
                    checked={formData.marketingEmails}
                    onChange={(e) => handleInputChange('marketingEmails')(e.target.checked)}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-neutral-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="marketing" className="font-medium text-neutral-700">
                    Send me product updates and news
                  </label>
                  <p className="text-neutral-500 text-xs mt-1">
                    Get the latest features, tips, and product announcements. You can unsubscribe at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('auth-fade-in', className)}>
      <AuthCard wide>
        <AuthHeader
          title="Create your account"
          subtitle="Join thousands of users already growing with our platform"
        />

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            dismissible
            onDismiss={() => setAlert(null)}
          />
        )}

        {/* Social Registration - Only show on first step */}
        {currentStep === 'account' && (
          <>
            <div className="space-y-3">
              <SocialButton
                provider="google"
                onClick={() => handleSocialRegister('Google')}
                loading={socialLoading.google}
                disabled={loading}
              />
              <SocialButton
                provider="github"
                onClick={() => handleSocialRegister('GitHub')}
                loading={socialLoading.github}
                disabled={loading}
              />
            </div>

            <AuthDivider text="or create account with email" />
          </>
        )}

        {/* Progress Steps */}
        <Steps
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        <AuthForm onSubmit={currentStep === 'preferences' ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {currentStep !== 'account' && (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleBack}
                disabled={loading}
                className="flex-1"
              >
                Back
              </Button>
            )}
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading && currentStep === 'preferences'}
              disabled={loading}
              className="flex-1"
            >
              {currentStep === 'preferences' ? 'Create Account' : 'Continue'}
            </Button>
          </div>
        </AuthForm>

        <AuthFooter>
          <p className="text-neutral-600">
            Already have an account?{' '}
            <AuthLink href="/auth/login">
              Sign in instead
            </AuthLink>
          </p>
        </AuthFooter>
      </AuthCard>
    </div>
  );
};

export default RegisterPage;