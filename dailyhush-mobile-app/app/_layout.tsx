import '../global.css';

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { PostHogProvider } from 'posthog-react-native';
import { TopBar } from '@/components/TopBar';
import { BottomNav } from '@/components/BottomNav';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { restoreSession } from '@/services/auth';
import { useStore } from '@/store/useStore';
import { useAuthSync } from '@/hooks/useAuthSync';
import {
  registerForPushNotifications,
  scheduleDailyQuoteNotification,
} from '@/services/notifications';
import { initializeRevenueCat } from '@/utils/revenueCat';
import { useFonts } from 'expo-font';
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const { setLoading } = useStore();

  // Load custom fonts
  const [fontsLoaded, fontError] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  // Sync auth state changes with store (login/logout/token refresh)
  const { syncUserProfile } = useAuthSync();

  /**
   * Restore authentication session on app start
   * Also initializes RevenueCat SDK
   */
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      console.log('Initializing authentication...');

      const result = await restoreSession();

      if (result.success && result.userId) {
        console.log('Session restored successfully:', result.userId);

        // Initialize RevenueCat with user ID
        try {
          await initializeRevenueCat(result.userId);
          console.log('RevenueCat initialized with user:', result.userId);
        } catch (error) {
          console.error('Failed to initialize RevenueCat:', error);
        }

        // Pass false for manageLoadingState since we're managing it here
        await syncUserProfile(result.userId, 0, false);
      } else {
        console.log('No existing session or failed to restore:', result.error);

        // Initialize RevenueCat without user ID (anonymous)
        try {
          await initializeRevenueCat();
          console.log('RevenueCat initialized (anonymous)');
        } catch (error) {
          console.error('Failed to initialize RevenueCat:', error);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, [syncUserProfile, setLoading]);

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

  /**
   * Hide splash screen when fonts are loaded
   */
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render app until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <PostHogProvider
      apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY || ''}
      options={{
        host: process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        // Enable autocapture for screen views
        captureAppLifecycleEvents: true,
        captureScreens: true,
        // Privacy settings
        enableSessionReplay: false, // Disable session replay for privacy (mental health app)
      }}
    >
      <ErrorBoundary>
        <Stack
        screenOptions={{
          headerShown: true,
          contentStyle: { backgroundColor: '#0A1612' },
          animation: 'slide_from_right',
          header: ({ options }) => {
            // Don't show header if explicitly disabled
            if (options.headerShown === false) return null;

            return (
              <TopBar
                title={options.title || 'Nœma'}
                subtitle={undefined}
                showBack={options.headerBackVisible !== false}
                showSettings={options.headerRight !== undefined}
              />
            );
          },
        }}>
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
        <Stack.Screen
          name="subscription"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="settings/subscription"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="mood-capture"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="anna/conversation"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="modules/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="modules/[moduleId]/method"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="exercises/cyclic-sigh"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="exercises/grounding"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="exercises/breathing"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="exercises/emotion-wheel"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="exercises/brain-dump"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="exercises/mind-clear"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <PortalHost />
      <BottomNav
        hideOnPaths={[
          '/spiral',
          '/anna/conversation',
          '/anna',
          '/onboarding',
          '/settings',
          '/subscription',
          '/auth',
          '/faq',
          '/legal/privacy',
          '/legal/terms',
          '/mood-capture',
          '/training/focus',
          '/training/interrupt',
          '/training/reframe',
          '/training/execute',
          '/modules',
          '/exercises/cyclic-sigh',
          '/exercises/grounding',
          '/exercises/breathing',
          '/exercises/emotion-wheel',
          '/exercises/brain-dump',
          '/exercises/mind-clear',
        ]}
      />
    </ErrorBoundary>
    </PostHogProvider>
  );
}
