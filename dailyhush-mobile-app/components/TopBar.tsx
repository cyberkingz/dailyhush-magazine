/**
 * DailyHush - Top Bar Component
 * Branded app header with navigation
 */

import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Settings, Menu } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { brandFonts } from '@/constants/profileTypography';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showSettings?: boolean;
  showMenu?: boolean;
  onMenuPress?: () => void;
  onBackPress?: () => void; // Custom back handler
  progressDots?: {
    current: number;
    total: number;
  };
}

export function TopBar({
  title = 'DailyHush',
  subtitle,
  showBack = false,
  showSettings = false,
  showMenu = false,
  onMenuPress,
  onBackPress,
  progressDots,
}: TopBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Center the logo/progress if no back button and no settings
  const shouldCenter = !showBack && !showSettings && !showMenu;

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        paddingTop: insets.top + spacing.safeArea.top,
        backgroundColor: colors.background.primary,
        borderBottomColor: colors.background.border,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left Side - Back Button or Spacer */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: showBack || shouldCenter ? 'auto' : 40,
          }}>
          {showBack ? (
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                if (onBackPress) {
                  onBackPress();
                } else {
                  router.back();
                }
              }}
              style={{ marginRight: 16, padding: 8, marginLeft: -8, opacity: 1 }}>
              {({ pressed }) => (
                <ArrowLeft
                  size={24}
                  color={colors.text.primary}
                  strokeWidth={2}
                  opacity={pressed ? 0.7 : 1}
                />
              )}
            </Pressable>
          ) : shouldCenter ? null : (
            <View style={{ width: 40 }} />
          )}
        </View>

        {/* Center - Logo/Title */}
        <View style={{ flex: 1, alignItems: shouldCenter ? 'center' : 'flex-start' }}>
          {title === 'DailyHush' ? (
            <Text
              style={{
                fontSize: 28,
                fontFamily: brandFonts.headlineBold,
                textAlign: shouldCenter ? 'center' : 'left',
                color: colors.text.primary,
                letterSpacing: 1,
              }}>
              Nœma
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: shouldCenter ? 'center' : 'left',
                color: colors.text.primary,
              }}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              style={{
                fontSize: 14,
                marginTop: 2,
                textAlign: shouldCenter ? 'center' : 'left',
                color: colors.text.secondary,
              }}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Side - Progress Dots or Settings or Menu or Spacer */}
        <View style={{ width: progressDots ? 'auto' : 40 }}>
          {progressDots ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {Array.from({ length: progressDots.total }).map((_, index) => (
                <View
                  key={index}
                  style={{
                    height: 8,
                    borderRadius: 4,
                    width: index === progressDots.current - 1 ? 24 : 8,
                    backgroundColor:
                      index < progressDots.current ? colors.emerald[500] : colors.background.border,
                  }}
                />
              ))}
            </View>
          ) : showSettings ? (
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/settings' as any);
              }}
              style={{ padding: 8, opacity: 1 }}>
              {({ pressed }) => (
                <Settings
                  size={24}
                  color={colors.text.secondary}
                  strokeWidth={2}
                  opacity={pressed ? 0.7 : 1}
                />
              )}
            </Pressable>
          ) : showMenu ? (
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                onMenuPress?.();
              }}
              style={{ padding: 8, opacity: 1 }}>
              {({ pressed }) => (
                <Menu
                  size={24}
                  color={colors.text.secondary}
                  strokeWidth={2}
                  opacity={pressed ? 0.7 : 1}
                />
              )}
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}
