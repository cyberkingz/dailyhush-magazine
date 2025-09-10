import React, { useState } from 'react';
import Button from './Button';
import Alert from './Alert';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { validateAdminAccess } from '../../lib/services/auth';

interface AuthPageProps {
  onSuccess?: () => void;
  redirectTo?: string;
  className?: string;
}

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
      // Additional validation for admin access
      if (!validateAdminAccess(formData.email)) {
        throw new Error('Access denied. Admin privileges required.');
      }

      // Use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      // Check if user is authenticated and has admin privileges
      if (data.user && validateAdminAccess(data.user.email || '')) {
        setAlert({ type: 'success', message: 'Login successful! Redirecting to dashboard...' });
        
        // Store admin session
        if (formData.rememberMe) {
          localStorage.setItem('admin_session', 'true');
        }
        
        setTimeout(() => {
          onSuccess?.();
          window.location.href = redirectTo || '/admin/dashboard';
        }, 1000);
      } else {
        throw new Error('Access denied. Admin privileges required.');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setAlert({
        type: 'error',
        message: error.message || 'Invalid credentials. Please check your email and password.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page
    window.location.href = '/admin/forgot-password';
  };

  return (
    <div className={cn('min-h-screen bg-gradient-to-b from-yellow-50 to-white', className)}>
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Brand Header */}
            <div className="text-center">
              <img src="/inline-logo.png" alt="DailyHush" className="h-8 mx-auto mb-3" />
              <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full mb-8"></div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Admin Access</h2>
              <p className="text-gray-600 mb-8">Sign in to manage your content and settings</p>
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-8">
              {alert && (
                <Alert
                  type={alert.type}
                  message={alert.message}
                  dismissible
                  onDismiss={() => setAlert(null)}
                />
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email')(e.target.value)}
                    className="border border-gray-300 px-5 py-3 rounded-full w-full bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Enter your admin email"
                    autoComplete="email"
                    autoFocus
                    required
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password')(e.target.value)}
                    className="border border-gray-300 px-5 py-3 rounded-full w-full bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                      className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-neutral-300 rounded"
                    />
                    <span className="ml-2 text-sm text-neutral-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-yellow-600 hover:text-yellow-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold border-0 focus:ring-yellow-400"
                >
                  {loading ? 'Signing in...' : 'Sign in to Dashboard'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Admin access only • Secure authentication
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  DailyHush Content Management System
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
