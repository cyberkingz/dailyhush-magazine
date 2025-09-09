import { supabase } from '../supabase';

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

// Check if user is authenticated
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      role: user.user_metadata?.role || 'user'
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  // Check for the specific admin email or admin role
  return user?.email === 'admin@daily-hush.com' || user?.role === 'admin';
}

// Validate admin credentials (additional security layer)
export function validateAdminAccess(email: string): boolean {
  return email === 'admin@daily-hush.com';
}

// Sign out user
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
  localStorage.removeItem('admin_session');
}

// Auth state change listener
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        role: session.user.user_metadata?.role || 'user'
      });
    } else {
      callback(null);
    }
  });
}

// Create admin user (for initial setup)
export async function createAdminUser(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: _data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin'
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
