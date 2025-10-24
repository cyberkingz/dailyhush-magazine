/**
 * DailyHush - Bottom Navigation Bar
 * Glassmorphism design with blur effect
 * Optimized for 55-70 demographic with large touch targets
 */

import { View, Pressable, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
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
        height: 48 + insets.bottom,
        zIndex: 1000,
      }}
    >
      {/* Glassmorphism Bottom Bar */}
      <BlurView
        intensity={95}
        tint="dark"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 48 + insets.bottom,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(10, 22, 18, 0.6)',
            borderTopWidth: 1,
            borderTopColor: 'rgba(64, 145, 108, 0.25)',
            ...Platform.select({
              ios: {
                shadowColor: colors.emerald[500],
                shadowOffset: { width: 0, height: -1 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
              },
            }),
          }}
        />
      </BlurView>

      {/* Elevated Center Button */}
      <View
        style={{
          position: 'absolute',
          top: -20,
          left: '50%',
          marginLeft: -28,
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
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.button.primary,
            alignItems: 'center',
            justifyContent: 'center',
            ...Platform.select({
              ios: {
                shadowColor: colors.emerald[500],
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
              },
              android: {
                elevation: 10,
              },
            }),
          }}
          className="active:opacity-90"
        >
          <Shield size={26} color={colors.white} strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
}
