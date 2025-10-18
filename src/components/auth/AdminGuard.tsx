import React, { useEffect, useState } from 'react';
import { getCurrentUser, isAdmin } from '../../lib/services/auth';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children, fallback }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        const adminStatus = await isAdmin();
        
        if (user && adminStatus) {
          setIsAuthorized(true);
        } else {
          // Redirect to login if not authorized
          window.location.href = '/admin/login';
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/admin/login';
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white/80 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-8">
          {/* Logo with pulsing ring */}
          <div className="relative w-20 h-20 animate-float">
            {/* Pulsing ring */}
            <div className="absolute -inset-2 rounded-full border-2 border-emerald-500/50 animate-pulse-ring" />

            {/* Logo */}
            <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-emerald-500/30 shadow-[0_8px_32px_rgba(16,185,129,0.25)]">
              <img
                src="/rounded-logo.png"
                alt="DailyHush"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Status indicator dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </div>

          {/* Spinner */}
          <div className="relative">
            <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          </div>

          {/* Loading text */}
          <div className="text-center space-y-2">
            <p className="text-emerald-900 font-medium text-base tracking-wide animate-fade">
              Verifying access...
            </p>
            <div className="flex gap-1 justify-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950">
        <div className="text-center max-w-md px-6">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/70 mb-6">You need admin privileges to access this page.</p>
          <a
            href="/admin/login"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;