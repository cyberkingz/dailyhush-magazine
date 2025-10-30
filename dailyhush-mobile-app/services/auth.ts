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
  needsEmailConfirmation?: boolean;
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
    const { error: profileError } = await supabase.from('user_profiles').upsert(
      {
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
      },
      {
        onConflict: 'user_id',
      }
    );

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
    const {
      data: { session },
    } = await supabase.auth.getSession();

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
    const {
      data: { session },
    } = await supabase.auth.getSession();

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
export async function upgradeToFullAccount(email: string, password: string): Promise<AuthResult> {
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
    const {
      data: { session },
    } = await supabase.auth.getSession();
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

    // IMPORTANT: Migrate all guest user data before signing out
    let guestData: any = null;
    const { userId: guestUserId, isAnonymous } = await getSession();

    if (guestUserId && isAnonymous) {
      console.log('Migrating guest user data:', guestUserId);

      // Fetch complete guest profile
      const { data: guestProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', guestUserId)
        .single();

      if (guestProfile) {
        guestData = {
          onboarding_completed: guestProfile.onboarding_completed,
          fire_progress: guestProfile.fire_progress,
          triggers: guestProfile.triggers,
          has_shift_necklace: guestProfile.has_shift_necklace,
          shift_paired: guestProfile.shift_paired,
        };
        console.log('Guest data to migrate:', guestData);
      }
    }

    // IMPORTANT: Sign out any existing session (e.g., guest user)
    // This prevents auth context conflicts when creating the profile
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.warn('Error signing out before signup:', signOutError);
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

      // IMPORTANT: Set the session on the Supabase client
      // This ensures subsequent queries use the NEW user's auth context
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    }

    console.log('Email signup successful:', data.user.id);

    // Check if email confirmation is required
    const needsEmailConfirmation = !data.session;

    // Only create profile if we have a session (email confirmed or confirmation disabled)
    if (data.session) {
      if (guestData && guestUserId) {
        // Migrate guest data to new account
        console.log('Migrating guest data to new account...');
        const { error: migrationError } = await supabase.rpc('migrate_guest_to_email_account', {
          p_new_user_id: data.user.id,
          p_guest_user_id: guestUserId,
          p_email: email,
          p_name: metadata?.name || null,
          p_age: metadata?.age || null,
          p_onboarding_completed: guestData.onboarding_completed,
          p_fire_progress: guestData.fire_progress,
          p_triggers: guestData.triggers,
          p_has_shift_necklace: guestData.has_shift_necklace,
          p_shift_paired: guestData.shift_paired,
        });

        if (migrationError) {
          console.error('Error migrating guest data:', migrationError);
        } else {
          console.log('Guest data migrated successfully to new account');
        }
      } else {
        // No guest data, create fresh profile
        const { error: profileError } = await supabase.rpc('create_user_profile', {
          p_user_id: data.user.id,
          p_email: email,
          p_name: metadata?.name || null,
          p_age: metadata?.age || null,
          p_onboarding_completed: false,
        });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        } else {
          console.log('User profile created for email user');
        }
      }
    }

    return {
      success: true,
      userId: data.user.id,
      needsEmailConfirmation,
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
export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
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
      // Don't log "profile not found" errors as they're expected for new accounts
      const isProfileNotFound =
        error.code === 'PGRST116' ||
        error.message?.includes('0 rows') ||
        error.message?.includes('Cannot coerce the result to a single JSON object');

      if (!isProfileNotFound) {
        console.error('Error loading user profile:', error);
      }

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

/**
 * Check if an email already has an existing account
 * Used during onboarding to prevent duplicate accounts
 *
 * Checks both user_profiles AND Supabase Auth to catch all cases:
 * - Accounts that completed onboarding (in user_profiles)
 * - Accounts created but not yet onboarded (in auth.users only)
 *
 * @param email - Email address to check
 * @returns Object indicating if account exists and details
 */
export async function checkExistingAccount(email: string): Promise<{
  exists: boolean;
  accountCompleted: boolean;
  userId?: string;
  error?: string;
}> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    console.log('🔍 Checking for existing account with email:', normalizedEmail);

    // STEP 1: Check user_profiles table (accounts that have profiles)
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_id, email, onboarding_completed')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      // PGRST116 = "no rows returned", which is fine
      console.error('❌ Error checking user_profiles:', profileError);
    }

    if (existingProfile) {
      console.log('🔍 Profile found in user_profiles - verifying auth account exists:', {
        userId: existingProfile.user_id,
        email: existingProfile.email,
        onboardingCompleted: existingProfile.onboarding_completed,
      });

      // CRITICAL: Check if this is an anonymous user with an email
      // Anonymous users have profiles but their auth account has no email
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const isCurrentUser = session?.user?.id === existingProfile.user_id;
      const isAnonymous = session?.user?.is_anonymous || false;

      if (isCurrentUser && isAnonymous) {
        console.warn('⚠️ Anonymous user with email in profile - NOT a real account:', {
          userId: existingProfile.user_id,
          profileEmail: existingProfile.email,
          authEmail: session?.user?.email || 'none',
          isAnonymous: true,
        });

        // Treat as "account doesn't exist" - allow signup to upgrade anonymous account
        return {
          exists: false,
          accountCompleted: false,
          userId: undefined,
        };
      }

      // Not an anonymous user - verify BOTH user_id AND email in auth
      const { data: authCheck, error: authCheckError } = await supabase.rpc('get_user_by_email', {
        email_param: normalizedEmail,
      });

      if (authCheckError) {
        console.warn('⚠️ Could not verify auth account exists:', authCheckError.message);
        // Assume it exists if we can't check (fail safe)
      } else if (!authCheck || authCheck.length === 0) {
        console.warn('⚠️ Orphaned profile - profile exists but NO auth account with this email:', {
          userId: existingProfile.user_id,
          email: existingProfile.email,
        });

        // Treat as "account doesn't exist" - allow signup to proceed
        return {
          exists: false,
          accountCompleted: false,
          userId: undefined,
        };
      } else {
        // CRITICAL: Verify the user_id in profile matches the user_id in auth
        const authUser = authCheck[0];
        if (authUser.id !== existingProfile.user_id) {
          console.error('🚨 DATA INTEGRITY ISSUE - Profile user_id does NOT match auth user_id:', {
            profileUserId: existingProfile.user_id,
            authUserId: authUser.id,
            email: existingProfile.email,
          });

          // This is a serious data corruption issue
          // Treat as "doesn't exist" to allow account creation
          // The new signup will create a fresh profile with correct user_id
          return {
            exists: false,
            accountCompleted: false,
            userId: undefined,
          };
        }

        console.log('✅ Verified BOTH user_id AND email match in auth:', {
          userId: existingProfile.user_id,
          email: existingProfile.email,
          authEmail: authUser.email,
          onboardingCompleted: existingProfile.onboarding_completed,
        });
      }

      return {
        exists: true,
        accountCompleted: existingProfile.onboarding_completed || false,
        userId: existingProfile.user_id,
      };
    }

    // STEP 2: Check Supabase Auth (accounts that might not have profiles yet)
    // This catches cases where user created an account but hasn't completed onboarding
    const { data: authUsers, error: authError } = await supabase.rpc('get_user_by_email', {
      email_param: normalizedEmail,
    });

    if (authError) {
      console.warn('⚠️ Could not check auth.users (function may not exist):', authError.message);
      // Continue - this is not a critical error
    } else if (authUsers && authUsers.length > 0) {
      console.log('✅ Existing account found in auth.users:', {
        userId: authUsers[0].id,
        email: normalizedEmail,
        note: 'Account exists but no profile found',
      });

      return {
        exists: true,
        accountCompleted: false, // No profile means onboarding not completed
        userId: authUsers[0].id,
      };
    }

    console.log('✅ No existing account found for:', normalizedEmail);
    return {
      exists: false,
      accountCompleted: false,
    };
  } catch (error: any) {
    console.error('❌ Exception checking for existing account:', error);
    return {
      exists: false,
      accountCompleted: false,
      error: error.message || 'Failed to check account',
    };
  }
}
