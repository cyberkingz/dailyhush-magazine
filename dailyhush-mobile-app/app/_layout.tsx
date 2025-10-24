import '../global.css';

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { TopBar } from '@/components/TopBar';
import { restoreSession } from '@/services/auth';
import { useStore } from '@/store/useStore';
import {
  registerForPushNotifications,
  scheduleDailyQuoteNotification,
} from '@/services/notifications';

export default function Layout() {
  const { setUser } = useStore();

  /**
   * Restore authentication session on app start
   */
  useEffect(() => {
    const initAuth = async () => {
      console.log('Initializing authentication...');
      const result = await restoreSession();

      if (result.success && result.userId) {
        console.log('Session restored successfully:', result.userId);
        // Note: User profile will be loaded by index.tsx
      } else {
        console.log('No existing session or failed to restore:', result.error);
      }
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
                subtitle={options.headerSubtitle as string}
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
            title: 'DailyHush',
            headerSubtitle: 'Welcome back',
            headerBackVisible: false,
            headerRight: () => null, // This triggers showSettings
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
            headerSubtitle: 'Last 7 days',
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="training/index"
          options={{
            title: 'F.I.R.E. Training',
            headerSubtitle: 'Clinical protocol to interrupt rumination',
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
      </Stack>
      <PortalHost />
    </>
  );
}
