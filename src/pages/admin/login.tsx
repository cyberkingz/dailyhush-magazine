import { LoginPage } from '../../components/auth';

export default function AdminLogin() {
  const handleSuccess = () => {
    // Redirect to admin dashboard
    window.location.href = '/admin/dashboard';
  };

  return (
    <LoginPage 
      onSuccess={handleSuccess}
      redirectTo="/admin/dashboard"
    />
  );
}

