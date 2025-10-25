import '../global.css';

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { TopBar } from '@/components/TopBar';
import { BottomNav } from '@/components/BottomNav';
import { restoreSession, loadUserProfile } from '@/services/auth';
import { useStore } from '@/store/useStore';
import {
  registerForPushNotifications,
  scheduleDailyQuoteNotification,
} from '@/services/notifications';

export default function Layout() {
  const { setUser, setLoading } = useStore();

  /**
   * Restore authentication session on app start
   */
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true); // Start loading
      console.log('Initializing authentication...');

      const result = await restoreSession();

      if (result.success && result.userId) {
        console.log('Session restored successfully:', result.userId);

        // Load user profile from database
        const profileResult = await loadUserProfile(result.userId);

        if (profileResult.success && profileResult.profile) {
          setUser(profileResult.profile);
          console.log('User profile loaded:', profileResult.profile.user_id, 'onboarding_completed:', profileResult.profile.onboarding_completed);
        } else {
          console.log('Failed to load user profile:', profileResult.error);
        }
      } else {
        console.log('No existing session or failed to restore:', result.error);
      }

      setLoading(false); // Done loading
    };

    initAuth();
  }, []);

  /**
   * Setup push notifications for daily quotes
   */
  useEffect(() => {
    const setupNotifications = async () => {
      console.log('Setting up notifications...');
      const granted = await registerForPushNotifications();

      if (granted) {
        await scheduleDailyQuoteNotification();
        console.log('Daily quote notifications enabled');
      } else {
        console.log('Notification permissions denied');
      }
    };

    setupNotifications();
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          contentStyle: { backgroundColor: '#0A1612' },
          animation: 'fade',
          header: ({ options }) => {
            // Don't show header if explicitly disabled
            if (options.headerShown === false) return null;

            return (
              <TopBar
                title={options.title || 'DailyHush'}
                subtitle={undefined}
                showBack={options.headerBackVisible !== false}
                showSettings={options.headerRight !== undefined}
              />
            );
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="onboarding/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="spiral"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Settings',
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="insights"
          options={{
            title: 'Pattern Insights',
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="training/index"
          options={{
            title: 'F.I.R.E. Training',
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="training/focus"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="training/interrupt"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="training/reframe"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="training/execute"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="auth/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="auth/signup"
          options={{
            title: 'Create Account',
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="auth/login"
          options={{
            title: 'Sign In',
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="auth/forgot-password"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <PortalHost />
      <BottomNav hideOnPaths={[
        '/spiral',
        '/onboarding',
        '/settings',
        '/profile',
        '/training',
        '/auth'
      ]} />
    </>
  );
}
