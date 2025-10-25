/**
 * DailyHush - Settings Screen
 * Clean emerald design matching home page
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  User,
  Bluetooth,
  Moon,
  Bell,
  Type,
  HelpCircle,
  Mail,
  Shield,
  ChevronRight,
  LogOut,
  FileText
} from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { useStore, useUser, useNightMode } from '@/store/useStore';
import { signOut } from '@/services/auth';
import { useState } from 'react';

interface SettingRowProps {
  title: string;
  subtitle?: string;
  value?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
}

function SettingRow({
  title,
  subtitle,
  value,
  icon,
  onPress,
  showChevron = true,
  toggle,
  toggleValue,
  onToggle
}: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress && !toggle}
      className="bg-[#1A4D3C] rounded-2xl p-4 mb-3 flex-row items-center active:opacity-90"
    >
      {icon && (
        <View className="bg-[#40916C]/20 p-2 rounded-xl mr-3">
          {icon}
        </View>
      )}

      <View className="flex-1">
        <Text className="text-[#E8F4F0] text-base font-semibold">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-[#95B8A8] text-sm mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>

      {toggle && (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: '#1A2E26', true: '#40916C' }}
          thumbColor="#FFFFFF"
        />
      )}

      {value && (
        <Text className="text-[#95B8A8] text-sm mr-2">
          {value}
        </Text>
      )}

      {showChevron && !toggle && (
        <ChevronRight size={20} color="#95B8A8" strokeWidth={2} />
      )}
    </Pressable>
  );
}

export default function Settings() {
  const router = useRouter();
  const user = useUser();
  const nightMode = useNightMode();
  const { setNightMode } = useStore();
  const insets = useSafeAreaInsets();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check if user is anonymous (guest)
  const isGuest = !user?.email;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      // Sign out from Supabase
      const result = await signOut();

      if (!result.success) {
        console.error('Logout failed:', result.error);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setIsLoggingOut(false);
        return;
      }

      // NOTE: We do NOT call resetStore() here to preserve user data
      // The user's FIRE progress, spiral history, and triggers remain in Supabase
      // When they sign back in, their data will be restored from the database

      console.log('Logged out successfully - user data preserved');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigate to home (which will trigger anonymous signin)
      router.replace('/');
    } catch (error) {
      console.error('Exception during logout:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setIsLoggingOut(false);
    }
  };

  return (
    <View className="flex-1 bg-[#0A1612]">
      <StatusBar style="light" />

      <ScrollFadeView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        fadeColor="#0A1612"
        fadeHeight={48}
        fadeIntensity={0.95}
        fadeVisibility="always"
      >

        {/* Guest Account Upgrade Banner */}
        {isGuest && (
          <View className="mb-6">
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/auth');
              }}
              className="bg-[#2D6A4F] rounded-2xl p-5 active:opacity-90"
            >
              <View className="flex-row items-center mb-2">
                <Shield size={20} color="#B7E4C7" strokeWidth={2} />
                <Text className="text-[#E8F4F0] text-base font-bold ml-2">
                  Create Your Account
                </Text>
              </View>
              <Text className="text-[#B7E4C7] text-sm leading-relaxed mb-3">
                You're using DailyHush as a guest. Create an account to save your progress and patterns across devices.
              </Text>
              <View className="flex-row items-center">
                <Text className="text-[#52B788] text-sm font-semibold">
                  Create Account →
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        {/* Account Section */}
        <Text className="text-[#95B8A8] text-xs font-semibold uppercase mb-3">
          Account
        </Text>

        <SettingRow
          title="Profile"
          subtitle={user?.email || 'Guest Account'}
          icon={<User size={20} color="#52B788" strokeWidth={2} />}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/profile');
          }}
        />

        {/* Logout Button - Only show for authenticated users */}
        {!isGuest && (
          <>
            <SettingRow
              title={isLoggingOut ? "Signing out..." : "Sign Out"}
              subtitle="Sign out of your account"
              icon={<LogOut size={20} color="#E63946" strokeWidth={2} />}
              onPress={isLoggingOut ? undefined : handleLogout}
              showChevron={false}
            />

            <SettingRow
              title="Delete Account"
              subtitle="Permanently delete your account and data"
              icon={<Shield size={20} color="#E63946" strokeWidth={2} />}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                router.push('/settings/delete-account' as any);
              }}
            />
          </>
        )}

        {/* The Shift Section */}
        <Text className="text-[#95B8A8] text-xs font-semibold uppercase mb-3 mt-6">
          The Shift Necklace
        </Text>

        <SettingRow
          title="Pair Necklace"
          subtitle="Connect via Bluetooth"
          icon={<Bluetooth size={20} color="#52B788" strokeWidth={2} />}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/shift-pairing' as any);
          }}
        />

        {/* Preferences Section */}
        <Text className="text-[#95B8A8] text-xs font-semibold uppercase mb-3 mt-6">
          Preferences
        </Text>

        <SettingRow
          title="Night Mode"
          subtitle="Automatically enable from 10PM-6AM"
          icon={<Moon size={20} color="#52B788" strokeWidth={2} />}
          toggle
          toggleValue={nightMode}
          onToggle={(value) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setNightMode(value);
          }}
        />

        <SettingRow
          title="Notifications"
          subtitle="Daily check-ins and reminders"
          icon={<Bell size={20} color="#52B788" strokeWidth={2} />}
          toggle
          toggleValue={true}
          onToggle={(value) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        />

        <SettingRow
          title="Text Size"
          value="Large"
          icon={<Type size={20} color="#52B788" strokeWidth={2} />}
          onPress={() => Haptics.selectionAsync()}
        />

        {/* Support Section */}
        <Text className="text-[#95B8A8] text-xs font-semibold uppercase mb-3 mt-6">
          Support
        </Text>

        <SettingRow
          title="Help & FAQs"
          icon={<HelpCircle size={20} color="#52B788" strokeWidth={2} />}
          onPress={() => Haptics.selectionAsync()}
        />

        <SettingRow
          title="Contact Support"
          subtitle="hello@daily-hush.com"
          icon={<Mail size={20} color="#52B788" strokeWidth={2} />}
          onPress={() => Haptics.selectionAsync()}
        />

        {/* Legal Section */}
        <Text className="text-[#95B8A8] text-xs font-semibold uppercase mb-3 mt-6">
          Legal
        </Text>

        <SettingRow
          title="Privacy Policy"
          subtitle="How we protect your data"
          icon={<Shield size={20} color="#52B788" strokeWidth={2} />}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/legal/privacy');
          }}
        />

        <SettingRow
          title="Terms of Service"
          subtitle="App usage agreement"
          icon={<FileText size={20} color="#52B788" strokeWidth={2} />}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/legal/terms');
          }}
        />

        {/* App Info */}
        <View className="mt-8 items-center">
          <Text className="text-[#95B8A8] text-xs mb-1">
            DailyHush v1.0.0
          </Text>
          <Text className="text-[#95B8A8] text-xs text-center">
            Made with ❤️ for women who deserve peace of mind
          </Text>
        </View>
      </ScrollFadeView>
    </View>
  );
}
