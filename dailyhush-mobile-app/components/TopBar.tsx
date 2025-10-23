/**
 * DailyHush - Top Bar Component
 * Branded app header with navigation
 */

import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Settings, Menu } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/text';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showSettings?: boolean;
  showMenu?: boolean;
  onMenuPress?: () => void;
}

export function TopBar({
  title = 'DailyHush',
  subtitle,
  showBack = false,
  showSettings = false,
  showMenu = false,
  onMenuPress,
}: TopBarProps) {
  const router = useRouter();

  // Center the logo if no back button and no settings
  const shouldCenter = !showBack && !showSettings && !showMenu;

  return (
    <View className="bg-[#0A1612] px-5 pt-14 pb-4 border-b border-[#1A2E26]">
      <View className="flex-row items-center justify-between">
        {/* Left Side - Back Button or Spacer */}
        <View className="flex-row items-center" style={{ width: showBack || shouldCenter ? 'auto' : 40 }}>
          {showBack ? (
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                router.back();
              }}
              className="mr-4 p-2 -ml-2 active:opacity-70"
            >
              <ArrowLeft size={24} color="#E8F4F0" strokeWidth={2} />
            </Pressable>
          ) : shouldCenter ? null : (
            <View style={{ width: 40 }} />
          )}
        </View>

        {/* Center - Logo/Title */}
        <View className={shouldCenter ? "flex-1 items-center" : "flex-1"}>
          <Text className="text-[#E8F4F0] text-xl font-bold" style={{ textAlign: shouldCenter ? 'center' : 'left' }}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-[#95B8A8] text-sm mt-0.5" style={{ textAlign: shouldCenter ? 'center' : 'left' }}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Side - Settings or Menu or Spacer */}
        <View style={{ width: 40 }}>
          {showSettings && (
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/settings' as any);
              }}
              className="p-2 active:opacity-70"
            >
              <Settings size={24} color="#95B8A8" strokeWidth={2} />
            </Pressable>
          )}

          {showMenu && (
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                onMenuPress?.();
              }}
              className="p-2 active:opacity-70"
            >
              <Menu size={24} color="#95B8A8" strokeWidth={2} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
