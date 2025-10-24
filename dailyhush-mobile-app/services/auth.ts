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

    // Create user profile for anonymous user
    // This is required because fire_training_progress has a foreign key to user_profiles
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: data.user.id,
        email: '', // Anonymous users don't have email
        onboarding_completed: false, // They might complete onboarding later
        has_shift_necklace: false,
        shift_paired: false,
        fire_progress: {
          focus: false,
          interrupt: false,
          reframe: false,
          execute: false,
        },
        triggers: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (profileError) {
      console.error('Error creating user profile for anonymous user:', profileError);
      // Don't fail the sign-in, but log the error
    } else {
      console.log('User profile created for anonymous user');
    }

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

/**
 * Sign up with email and password
 * Creates a new full account (not anonymous)
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: {
    name?: string;
    age?: number;
  }
): Promise<AuthResult> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    // Validate password (minimum 8 characters)
    if (password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters',
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      console.error('Email signup error:', error);

      // Provide user-friendly error messages
      if (error.message.includes('already registered')) {
        return {
          success: false,
          error: 'This email is already registered. Try signing in instead.',
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'Account created but no user returned',
      };
    }

    // Store session for persistence
    if (data.session) {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
    }

    console.log('Email signup successful:', data.user.id);

    // Create user profile
    // This is required because fire_training_progress has a foreign key to user_profiles
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: data.user.id,
        email: email,
        name: metadata?.name,
        age: metadata?.age,
        onboarding_completed: false, // They might complete onboarding later
        has_shift_necklace: false,
        shift_paired: false,
        fire_progress: {
          focus: false,
          interrupt: false,
          reframe: false,
          execute: false,
        },
        triggers: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // Don't fail the sign-up, but log the error
    } else {
      console.log('User profile created for email user');
    }

    return {
      success: true,
      userId: data.user.id,
    };
  } catch (error: any) {
    console.error('Exception during email signup:', error);
    return {
      success: false,
      error: error.message || 'Failed to create account',
    };
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Email sign-in error:', error);

      // Provide user-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        return {
          success: false,
          error: 'Email or password is incorrect. Please try again.',
        };
      }

      if (error.message.includes('Email not confirmed')) {
        return {
          success: false,
          error: 'Please verify your email address before signing in.',
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'Sign in successful but no user returned',
      };
    }

    // Store session for persistence
    if (data.session) {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
    }

    console.log('Email sign-in successful:', data.user.id);

    return {
      success: true,
      userId: data.user.id,
    };
  } catch (error: any) {
    console.error('Exception during email sign-in:', error);
    return {
      success: false,
      error: error.message || 'Failed to sign in',
    };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'dailyhush://reset-password', // Deep link for mobile
    });

    if (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('Password reset email sent to:', email);

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Exception during password reset:', error);
    return {
      success: false,
      error: error.message || 'Failed to send reset email',
    };
  }
}

/**
 * Update password (after reset or for existing user)
 */
export async function updatePassword(
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate password (minimum 8 characters)
    if (newPassword.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters',
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Password update error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('Password updated successfully');

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Exception during password update:', error);
    return {
      success: false,
      error: error.message || 'Failed to update password',
    };
  }
}

/**
 * Sign in with Apple
 * NOTE: Requires Apple Developer account and proper Supabase configuration
 * This is scaffolded for future implementation
 */
export async function signInWithApple(): Promise<AuthResult> {
  try {
    // This will be implemented once Apple Developer account is active
    // Required steps:
    // 1. Install expo-apple-authentication
    // 2. Configure Supabase Apple provider
    // 3. Add Apple credentials from developer account

    console.log('Apple Sign-In not yet configured');

    return {
      success: false,
      error: 'Apple Sign-In is not yet available. Please use email to sign in.',
    };

    /* Future implementation:
    import * as AppleAuthentication from 'expo-apple-authentication';

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
      nonce: credential.nonce,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.session) {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
    }

    return {
      success: true,
      userId: data.user?.id,
    };
    */
  } catch (error: any) {
    console.error('Exception during Apple sign-in:', error);
    return {
      success: false,
      error: error.message || 'Failed to sign in with Apple',
    };
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  return { valid: true };
}

/**
 * Load user profile from database
 * Used to restore user data after session restoration
 */
export async function loadUserProfile(
  userId: string
): Promise<{ success: boolean; profile?: any; error?: string }> {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error loading user profile:', error);
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'User profile not found' };
    }

    console.log('User profile loaded successfully:', data.user_id);
    return { success: true, profile: data };
  } catch (error: any) {
    console.error('Exception loading user profile:', error);
    return { success: false, error: error.message || 'Failed to load profile' };
  }
}

/**
 * Validate password strength
 * Simple validation: minimum 8 characters (no complexity for 55-70 demographic)
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  return { valid: true };
}
