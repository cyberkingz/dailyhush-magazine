import '../global.css';

import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { TopBar } from '@/components/TopBar';

export default function Layout() {
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
            title: 'DailyHush',
            headerBackVisible: false,
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
      </Stack>
      <PortalHost />
    </>
  );
}
