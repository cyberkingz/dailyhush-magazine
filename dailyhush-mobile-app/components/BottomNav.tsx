/**
 * DailyHush - Bottom Navigation Bar
 * Clean bottom bar with centered emergency button
 * Optimized for 55-70 demographic with large touch targets
 */

import { View, Pressable, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shield } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

interface BottomNavProps {
  hideOnPaths?: string[];
}

export function BottomNav({ hideOnPaths = ['/spiral', '/onboarding'] }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Hide on specific paths (like spiral protocol or onboarding)
  const shouldHide = hideOnPaths.some(path => pathname.startsWith(path));

  if (shouldHide) return null;

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64 + insets.bottom,
        zIndex: 1000,
      }}
    >
      {/* Bottom Bar */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 64 + insets.bottom,
          backgroundColor: colors.background.primary,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
          }),
        }}
      >
        {/* Top border with notch cutout */}
        <View style={{ flexDirection: 'row', height: 1 }}>
          {/* Left border */}
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: colors.background.border,
            }}
          />
          {/* Notch gap */}
          <View style={{ width: 80 }} />
          {/* Right border */}
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: colors.background.border,
            }}
          />
        </View>
      </View>

      {/* Elevated Center Button */}
      <View
        style={{
          position: 'absolute',
          top: -24,
          left: '50%',
          marginLeft: -32,
          zIndex: 2,
        }}
      >
        <Pressable
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/spiral');
          }}
          accessible={true}
          accessibilityLabel="Emergency spiral interrupt"
          accessibilityHint="Tap to start 90-second spiral interrupt protocol"
          accessibilityRole="button"
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.button.primary,
            alignItems: 'center',
            justifyContent: 'center',
            ...Platform.select({
              ios: {
                shadowColor: colors.emerald[500],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
              },
              android: {
                elevation: 8,
              },
            }),
          }}
          className="active:opacity-90"
        >
          <Shield size={30} color={colors.white} strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
}
