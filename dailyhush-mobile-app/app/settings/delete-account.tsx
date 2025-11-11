/**
 * Nœma - Delete Account Screen
 * REQUIRED for Apple App Store compliance (Guideline 5.1.1 (v))
 *
 * Deletes user's authentication account (prevents login)
 * NOTE: User data is retained for analytics and improvement purposes
 */

import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, AlertTriangle, Trash2, Check } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { AuthTextInput } from '@/components/auth/AuthTextInput';
import { PrivacyDisclosure } from '@/components/legal';
import { colors } from '@/constants/colors';
import { useStore, useUser } from '@/store/useStore';
import { supabase } from '@/utils/supabase';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const user = useUser();
  const { reset: resetStore } = useStore();

  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmChecked, setConfirmChecked] = useState(false);

  // Check if user is anonymous (shouldn't be able to access this screen, but just in case)
  if (!user || !user.email) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertTriangle size={48} color={colors.status.error} />
          <Text style={styles.errorTitle}>No Account Found</Text>
          <Text style={styles.errorText}>
            You&apos;re using Nœma as a guest. Only authenticated accounts can be deleted.
          </Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * Handle account deletion
   */
  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      // Validate password is entered
      if (!password || password.trim().length === 0) {
        setError('Please enter your password to confirm deletion');
        setIsDeleting(false);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      // Validate confirmation checkbox
      if (!confirmChecked) {
        setError('Please confirm you understand this action is permanent');
        setIsDeleting(false);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      console.log('Starting account deletion process...');

      // Step 1: Re-authenticate user with password to ensure security
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: password,
      });

      if (signInError) {
        console.error('Password verification failed:', signInError);
        setError('Incorrect password. Please try again.');
        setIsDeleting(false);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      console.log('Password verified successfully');

      // NOTE: We intentionally DO NOT delete user data from database tables:
      // - user_profiles (email, preferences, etc.)
      // - spiral_logs (rumination tracking data)
      // - shift_devices (device pairing data)
      // - quiz_submissions (quiz results)
      // - pattern_insights (analytics data)
      //
      // This data is retained for:
      // 1. Product improvement and analytics
      // 2. Aggregate insights about user patterns
      // 3. Research purposes (anonymized)
      //
      // User can no longer access this data once auth is deleted.

      // Delete authentication account via Edge Function (requires server-side admin privileges)
      const { data: session } = await supabase.auth.getSession();

      if (!session.session?.access_token) {
        console.error('No active session found');
        setError('Authentication error. Please sign out and try again.');
        setIsDeleting(false);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/delete-account`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to delete account via Edge Function:', errorData);
        setError('Failed to delete account. Please contact support at hello@daily-hush.com');
        setIsDeleting(false);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      const result = await response.json();
      console.log('Account deleted successfully:', result);

      // CRITICAL: Perform cleanup operations BEFORE showing success alert
      // This prevents race conditions where the user might close the app before cleanup completes

      // Step 1: Sign out to clear session from AsyncStorage
      // This prevents session restoration on app restart
      try {
        await supabase.auth.signOut();
        console.log('Local session cleared successfully');
      } catch (signOutError) {
        // Don't fail the whole flow if signOut errors
        // The server-side account deletion succeeded, which is what matters
        console.error('Failed to clear local session (non-critical): ', signOutError);
      }

      // Step 2: Clear Zustand store
      // This is a synchronous operation and should not fail
      resetStore();
      console.log('Local store cleared');

      // Step 3: Success haptics AFTER cleanup
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Step 4: Show success message and navigate
      // Cleanup is complete, so even if user closes app now, state is clean
      Alert.alert(
        'Account Deleted',
        'Your account has been deleted. You will no longer be able to sign in.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to onboarding screen
              router.replace('/onboarding');
            },
          },
        ],
        { cancelable: false }
      );
    } catch (err: any) {
      console.error('Exception during account deletion:', err);
      setError(err.message || 'An unexpected error occurred');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Show confirmation dialog before deletion
   */
  const confirmDeletion = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    Alert.alert(
      'Delete Account?',
      'This action cannot be undone. Your account will be deleted and you will no longer be able to sign in.\n\nNote: Your usage data will be retained for analytics and product improvement purposes.\n\nAre you absolutely sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => Haptics.selectionAsync(),
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: handleDeleteAccount,
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              router.back();
            }}
            style={styles.headerButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <ChevronLeft size={24} color={colors.text.primary} strokeWidth={2} />
          </Pressable>
          <Text style={styles.headerTitle}>Delete Account</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {/* Warning banner */}
            <View style={styles.warningBanner}>
              <AlertTriangle size={32} color={colors.status.error} strokeWidth={2} />
              <View style={styles.warningContent}>
                <Text style={styles.warningTitle}>Account Deletion</Text>
                <Text style={styles.warningText}>
                  This will delete your account and prevent you from signing in. Your usage data
                  will be retained for analytics and product improvement.
                </Text>
              </View>
            </View>

            {/* What will be deleted */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What Will Be Deleted</Text>

              <View style={styles.deleteItem}>
                <View style={styles.deleteItemIcon}>
                  <Check size={16} color={colors.status.error} strokeWidth={2} />
                </View>
                <Text style={styles.deleteItemText}>
                  Your login credentials (email: {user.email})
                </Text>
              </View>

              <View style={styles.deleteItem}>
                <View style={styles.deleteItemIcon}>
                  <Check size={16} color={colors.status.error} strokeWidth={2} />
                </View>
                <Text style={styles.deleteItemText}>Ability to sign in to your account</Text>
              </View>

              <View style={styles.deleteItem}>
                <View style={styles.deleteItemIcon}>
                  <Check size={16} color={colors.status.error} strokeWidth={2} />
                </View>
                <Text style={styles.deleteItemText}>Access to your Nœma data</Text>
              </View>
            </View>

            {/* What will be retained */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What Will Be Retained</Text>

              <View style={styles.retainItem}>
                <View style={styles.retainItemIcon}>
                  <Check size={16} color={colors.emerald[500]} strokeWidth={2} />
                </View>
                <Text style={styles.retainItemText}>
                  Spiral logs and pattern insights (for analytics)
                </Text>
              </View>

              <View style={styles.retainItem}>
                <View style={styles.retainItemIcon}>
                  <Check size={16} color={colors.emerald[500]} strokeWidth={2} />
                </View>
                <Text style={styles.retainItemText}>F.I.R.E. framework progress data</Text>
              </View>

              <View style={styles.retainItem}>
                <View style={styles.retainItemIcon}>
                  <Check size={16} color={colors.emerald[500]} strokeWidth={2} />
                </View>
                <Text style={styles.retainItemText}>The Shift necklace usage data</Text>
              </View>

              <View style={styles.retainItem}>
                <View style={styles.retainItemIcon}>
                  <Check size={16} color={colors.emerald[500]} strokeWidth={2} />
                </View>
                <Text style={styles.retainItemText}>Quiz submissions and preferences</Text>
              </View>

              <Text style={styles.retainNote}>
                This data helps us improve Nœma for everyone. It cannot be accessed after
                account deletion.
              </Text>
            </View>

            {/* Note about local data */}
            <View style={styles.noteBox}>
              <Text style={styles.noteTitle}>Note About Local Data</Text>
              <Text style={styles.noteText}>
                Voice journals are stored only on your device. To fully delete them, uninstall the
                Nœma app after deleting your account.
              </Text>
            </View>

            {/* Privacy Disclosure */}
            <PrivacyDisclosure type="account-deletion" showIcon={true} />

            {/* Password confirmation */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Confirm Your Identity</Text>
              <AuthTextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                returnKeyType="done"
                editable={!isDeleting}
                error={error || undefined}
              />
            </View>

            {/* Confirmation checkbox */}
            <Pressable
              onPress={() => {
                setConfirmChecked(!confirmChecked);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              disabled={isDeleting}
              style={styles.confirmCheckbox}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <View style={[styles.checkbox, confirmChecked && styles.checkboxChecked]}>
                {confirmChecked && <Check size={18} color={colors.white} strokeWidth={3} />}
              </View>
              <Text style={styles.confirmText}>
                I understand this action is permanent and cannot be undone
              </Text>
            </Pressable>

            {/* Delete button */}
            <Pressable
              onPress={confirmDeletion}
              disabled={isDeleting}
              style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]}>
              {isDeleting ? (
                <Text style={styles.deleteButtonText}>Deleting Account...</Text>
              ) : (
                <>
                  <Trash2 size={20} color={colors.white} strokeWidth={2} />
                  <Text style={styles.deleteButtonText}>Delete Account Forever</Text>
                </>
              )}
            </Pressable>

            {/* Support contact */}
            <View style={styles.supportSection}>
              <Text style={styles.supportText}>Need help or have questions?</Text>
              <Text style={styles.supportEmail}>hello@daily-hush.com</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.border,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  warningBanner: {
    backgroundColor: colors.error.background,
    borderWidth: 1,
    borderColor: colors.error.border,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error.text,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.error.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  deleteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  deleteItemIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  deleteItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
  },
  retainItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  retainItemIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  retainItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
  },
  retainNote: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.muted,
    marginTop: 12,
    fontStyle: 'italic',
  },
  noteBox: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.emerald[400],
    marginBottom: 6,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  confirmCheckbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.text.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.status.error,
    borderColor: colors.status.error,
  },
  confirmText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
  },
  deleteButton: {
    backgroundColor: colors.status.error,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  supportSection: {
    alignItems: 'center',
    paddingTop: 12,
  },
  supportText: {
    fontSize: 14,
    color: colors.text.muted,
    marginBottom: 4,
  },
  supportEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.emerald[500],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: colors.emerald[600],
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
