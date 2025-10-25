/**
 * Custom hook to sync Supabase auth state with Zustand store
 * Handles login, logout, token refresh, and profile updates
 */

import { useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import { useStore } from '@/store/useStore';
import { loadUserProfile } from '@/services/auth';

/**
 * Check if error indicates profile doesn't exist yet
 * Handles multiple Supabase error formats
 */
function isProfileNotFoundError(error: string | undefined): boolean {
  if (!error) return false;
  return (
    error.includes('0 rows') ||
    error.includes('Cannot coerce the result to a single JSON object') ||
    error.includes('PGRST116')
  );
}

export function useAuthSync() {
  const { setUser } = useStore();

  /**
   * Load and set user profile from database
   * Reusable function for both initial load and auth state changes
   * Includes retry logic for new account race conditions
   */
  const syncUserProfile = useCallback(async (userId: string | null, retryCount = 0): Promise<void> => {
    if (!userId) {
      setUser(null);
      return;
    }

    try {
      console.log('Syncing user profile:', userId, retryCount > 0 ? `(retry ${retryCount}/3)` : '');
      const result = await loadUserProfile(userId);

      if (result.success && result.profile) {
        setUser(result.profile);
        console.log('User profile synced successfully');
      } else if (isProfileNotFoundError(result.error) && retryCount < 3) {
        // Profile doesn't exist yet (new account race condition)
        // Retry after a short delay to allow profile creation to complete
        console.log('Profile not found yet, retrying in 500ms...');
        setTimeout(() => {
          syncUserProfile(userId, retryCount + 1);
        }, 500);
      } else if (isProfileNotFoundError(result.error)) {
        // After 3 retries, profile still doesn't exist
        // This is expected for very new accounts - will be created by onboarding flow
        console.log('Profile not found after retries - will be set by onboarding flow');
      } else {
        console.error('Failed to sync user profile:', result.error);
        // Don't clear existing user state on failure
      }
    } catch (error) {
      console.error('Exception syncing user profile:', error);
      // Don't clear existing user state on exception
    }
  }, [setUser]);

  /**
   * Listen for Supabase auth state changes
   * Updates store when user signs in, out, or updates their account
   */
  useEffect(() => {
    let isMounted = true;

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      // Prevent state updates if component unmounted during async operations
      if (!isMounted) return;

      try {
        switch (event) {
          case 'SIGNED_OUT':
            console.log('User signed out - clearing store');
            setUser(null);
            break;

          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
          case 'USER_UPDATED':
            await syncUserProfile(session?.user?.id ?? null);
            break;

          default:
            // Ignore other events (INITIAL_SESSION, PASSWORD_RECOVERY, etc.)
            break;
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
        // Don't crash the app - gracefully handle errors
      }
    });

    // Cleanup on unmount
    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
      console.log('Auth state listener unsubscribed');
    };
  }, [setUser, syncUserProfile]);

  return { syncUserProfile };
}
