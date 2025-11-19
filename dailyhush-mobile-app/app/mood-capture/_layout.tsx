/**
 * DailyHush - Mood Capture Stack Navigator
 *
 * Navigation layout for the 4-step mood capture flow.
 * Each step is a separate screen with standard navigation.
 */

import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function MoodCaptureLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background.primary, // Deep forest dark emerald
        },
        animation: 'slide_from_right',
        presentation: 'card',
      }}>
      <Stack.Screen name="mood" />
      <Stack.Screen name="intensity" />
      <Stack.Screen name="writing" />
      <Stack.Screen name="suggestion" />
    </Stack>
  );
}
