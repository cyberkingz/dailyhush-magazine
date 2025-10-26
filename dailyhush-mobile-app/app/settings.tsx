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
import { useStore, useUser } from '@/store/useStore';
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
        // Don't return early - user clicked logout, we should honor that intent
        // The auth state listener will handle clearing the user from store
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        console.log('Logged out successfully - user data preserved');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // NOTE: We do NOT call resetStore() here to preserve user data
      // The user's FIRE progress, spiral history, and triggers remain in Supabase
      // When they sign back in, their data will be restored from the database
      // The auth state listener (useAuthSync) will clear the user from store

      // Always navigate to onboarding, even if signOut had issues
      // This ensures the user isn't stuck in an inconsistent UI state
      router.replace('/onboarding');
    } catch (error) {
      console.error('Exception during logout:', error);

      // Even if there's an exception, navigate to onboarding
      // The user clicked logout - honor that intent
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      router.replace('/onboarding');
    } finally {
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
                router.push('/onboarding');
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

        {/* Preferences Section */}
        <Text className="text-[#95B8A8] text-xs font-semibold uppercase mb-3 mt-6">
          Preferences
        </Text>

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
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/faq' as any);
          }}
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
