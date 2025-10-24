/**
 * DailyHush - Authentication Service
 * Handles anonymous auth and account upgrades
 */

import { supabase } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'dailyhush_session';

export interface AuthResult {
  success: boolean;
  userId?: string;
  error?: string;
}

/**
 * Sign in anonymously - creates a temporary authenticated session
 * This allows database operations while maintaining privacy
 */
export async function signInAnonymously(): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.error('Anonymous sign-in error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'No user returned from anonymous sign-in',
      };
    }

    // Store session for persistence
    if (data.session) {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
    }

    console.log('Anonymous sign-in successful:', data.user.id);

    return {
      success: true,
      userId: data.user.id,
    };
  } catch (error: any) {
    console.error('Exception during anonymous sign-in:', error);
    return {
      success: false,
      error: error.message || 'Failed to sign in anonymously',
    };
  }
}

/**
 * Check if there's an existing session (anonymous or authenticated)
 */
export async function getSession(): Promise<{ userId: string | null; isAnonymous: boolean }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return { userId: null, isAnonymous: false };
    }

    return {
      userId: session.user.id,
      isAnonymous: session.user.is_anonymous || false,
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return { userId: null, isAnonymous: false };
  }
}

/**
 * Restore session on app restart
 * Supabase should handle this automatically, but we can verify
 */
export async function restoreSession(): Promise<AuthResult> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      console.log('Session restored:', session.user.id);
      return {
        success: true,
        userId: session.user.id,
      };
    }

    // No existing session, create anonymous one
    console.log('No session found, creating anonymous session');
    return await signInAnonymously();
  } catch (error: any) {
    console.error('Error restoring session:', error);
    return {
      success: false,
      error: error.message || 'Failed to restore session',
    };
  }
}

/**
 * Upgrade anonymous account to full account
 * Used when user wants to purchase subscription or pair Shift device
 */
export async function upgradeToFullAccount(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    // Check if currently anonymous
    const { userId, isAnonymous } = await getSession();

    if (!userId) {
      return {
        success: false,
        error: 'No active session to upgrade',
      };
    }

    if (!isAnonymous) {
      return {
        success: false,
        error: 'Account is already a full account',
      };
    }

    // Update user with email and password
    const { data, error } = await supabase.auth.updateUser({
      email,
      password,
    });

    if (error) {
      console.error('Account upgrade error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('Account upgraded successfully:', data.user?.id);

    return {
      success: true,
      userId: data.user?.id,
    };
  } catch (error: any) {
    console.error('Exception during account upgrade:', error);
    return {
      success: false,
      error: error.message || 'Failed to upgrade account',
    };
  }
}

/**
 * Sign out - clears session
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Clear stored session
    await AsyncStorage.removeItem(SESSION_KEY);

    console.log('Signed out successfully');

    return { success: true };
  } catch (error: any) {
    console.error('Exception during sign out:', error);
    return {
      success: false,
      error: error.message || 'Failed to sign out',
    };
  }
}

/**
 * Check if user has an authenticated session
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch {
    return false;
  }
}
