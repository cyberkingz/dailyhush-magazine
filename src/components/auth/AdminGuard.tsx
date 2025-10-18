import React, { useEffect, useState } from 'react';
import { getCurrentUser, isAdmin } from '../../lib/services/auth';
import { BrandLoader } from '../ui/BrandLoader';

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
    return <BrandLoader message="Verifying access..." variant="admin" />;
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