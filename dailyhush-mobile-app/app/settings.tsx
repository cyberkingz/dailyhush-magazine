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
  User,
  Bell,
  Type,
  HelpCircle,
  Mail,
  Shield,
  ChevronRight,
  LogOut,
  FileText,
  Crown,
} from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { ScrollControlProvider } from '@/components/mood-widget/ScrollControlContext';
import { useUser } from '@/store/useStore';
import { signOut } from '@/services/auth';
import { useState } from 'react';
import { colors } from '@/constants/colors';

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
  onToggle,
}: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress && !toggle}
      style={{
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: colors.background.secondary,
        padding: 16,
      }}>
      {icon && (
        <View
          style={{
            marginRight: 12,
            borderRadius: 12,
            backgroundColor: colors.lime[500] + '20',
            padding: 8,
          }}>
          {icon}
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text.primary }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ marginTop: 2, fontSize: 14, color: colors.text.secondary }}>
            {subtitle}
          </Text>
        )}
      </View>

      {toggle && (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: colors.background.border, true: colors.lime[500] }}
          thumbColor="#FFFFFF"
        />
      )}

      {value && (
        <Text style={{ marginRight: 8, fontSize: 14, color: colors.text.secondary }}>{value}</Text>
      )}

      {showChevron && !toggle && (
        <ChevronRight size={20} color={colors.text.secondary} strokeWidth={2} />
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
    <ScrollControlProvider>
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <StatusBar style="light" />

        <ScrollFadeView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        fadeColor={colors.background.primary}
        fadeHeight={48}
        fadeIntensity={0.95}
        fadeVisibility="always">
        {/* Guest Account Upgrade Banner */}
        {isGuest && (
          <View className="mb-6">
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/onboarding');
              }}
              style={{
                borderRadius: 16,
                backgroundColor: colors.lime[600],
                padding: 20,
              }}>
              <View style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
                <Shield size={20} color={colors.lime[200]} strokeWidth={2} />
                <Text
                  style={{
                    marginLeft: 8,
                    fontSize: 16,
                    fontWeight: '700',
                    color: colors.text.primary,
                  }}>
                  Create Your Account
                </Text>
              </View>
              <Text
                style={{
                  marginBottom: 12,
                  fontSize: 14,
                  lineHeight: 20,
                  color: colors.lime[200],
                }}>
                You&apos;re using DailyHush as a guest. Create an account to save your progress and
                patterns across devices.
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.lime[300] }}>
                  Create Account →
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        {/* Account Section */}
        <Text
          style={{
            marginBottom: 12,
            fontSize: 12,
            fontWeight: '600',
            textTransform: 'uppercase',
            color: colors.text.secondary,
          }}>
          Account
        </Text>

        <SettingRow
          title="Profile"
          subtitle={user?.email || 'Guest Account'}
          icon={<User size={20} color={colors.lime[500]} strokeWidth={2} />}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/profile');
          }}
        />

        {/* Subscription Management - Only show for authenticated users */}
        {!isGuest && (
          <SettingRow
            title="Subscription"
            subtitle="Manage your Premium plan"
            icon={<Crown size={20} color={colors.lime[500]} strokeWidth={2} />}
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/settings/subscription');
            }}
          />
        )}

        {/* Logout Button - Only show for authenticated users */}
        {!isGuest && (
          <>
            <SettingRow
              title={isLoggingOut ? 'Signing out...' : 'Sign Out'}
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
        <Text
          style={{
            marginBottom: 12,
            marginTop: 24,
            fontSize: 12,
            fontWeight: '600',
            textTransform: 'uppercase',
            color: colors.text.secondary,
          }}>
          Preferences
        </Text>

        <SettingRow
          title="Notifications"
          subtitle="Daily check-ins and reminders"
          icon={<Bell size={20} color={colors.lime[500]} strokeWidth={2} />}
          toggle
          toggleValue={true}
          onToggle={(value) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        />

        <SettingRow
          title="Text Size"
          value="Large"
          icon={<Type size={20} color={colors.lime[500]} strokeWidth={2} />}
          onPress={() => Haptics.selectionAsync()}
        />

        {/* Support Section */}
        <Text
          style={{
            marginBottom: 12,
            marginTop: 24,
            fontSize: 12,
            fontWeight: '600',
            textTransform: 'uppercase',
            color: colors.text.secondary,
          }}>
          Support
        </Text>

        <SettingRow
          title="Help & FAQs"
          icon={<HelpCircle size={20} color={colors.lime[500]} strokeWidth={2} />}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/faq' as any);
          }}
        />

        <SettingRow
          title="Contact Support"
          subtitle="hello@daily-hush.com"
          icon={<Mail size={20} color={colors.lime[500]} strokeWidth={2} />}
          onPress={() => Haptics.selectionAsync()}
        />

        {/* Legal Section */}
        <Text
          style={{
            marginBottom: 12,
            marginTop: 24,
            fontSize: 12,
            fontWeight: '600',
            textTransform: 'uppercase',
            color: colors.text.secondary,
          }}>
          Legal
        </Text>

        <SettingRow
          title="Privacy Policy"
          subtitle="How we protect your data"
          icon={<Shield size={20} color={colors.lime[500]} strokeWidth={2} />}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/legal/privacy');
          }}
        />

        <SettingRow
          title="Terms of Service"
          subtitle="App usage agreement"
          icon={<FileText size={20} color={colors.lime[500]} strokeWidth={2} />}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/legal/terms');
          }}
        />

        {/* App Info */}
        <View style={{ marginTop: 32, alignItems: 'center' }}>
          <Text style={{ marginBottom: 4, fontSize: 12, color: colors.text.secondary }}>
            DailyHush v1.0.0
          </Text>
          <Text style={{ textAlign: 'center', fontSize: 12, color: colors.text.secondary }}>
            Made with ❤️ for women who deserve peace of mind
          </Text>
        </View>
      </ScrollFadeView>
      </View>
    </ScrollControlProvider>
  );
}
