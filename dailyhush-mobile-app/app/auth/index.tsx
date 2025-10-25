/**
 * DailyHush - Auth Choice Screen
 * "Want to Save Your Progress?" screen after onboarding
 * Offers: Email signup/login or Continue as Guest
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  DimensionValue,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { AuthButton } from '@/components/auth/AuthButton';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { signInAnonymously, getSession } from '@/services/auth';
import { useStore } from '@/store/useStore';
import {
  authTypography,
  authSpacing,
  screenLayout,
} from '@/constants/authStyles';
import { colors } from '@/constants/colors';

export default function AuthChoice() {
  const router = useRouter();
  const { setUser } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle Continue as Guest
   * If already has anonymous session (from onboarding), just navigate to home
   * Otherwise, create new anonymous session
   */
  const handleContinueAsGuest = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user already has a session (from onboarding)
      const session = await getSession();

      if (session.userId) {
        // Already have a session (anonymous or email), just navigate to home
        console.log('Existing session found, navigating to home');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/');
        return;
      }

      // No session exists, create new anonymous session
      console.log('No session found, creating anonymous session...');
      const result = await signInAnonymously();

      if (!result.success) {
        setError(result.error || 'Failed to create guest session');
        return;
      }

      console.log('Guest session created, navigating to home');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigate to home (index will load user profile)
      router.replace('/');
    } catch (err: any) {
      console.error('Guest session error:', err);
      setError(err.message || 'Failed to continue as guest');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigate to email signup
   */
  const handleSignUp = async () => {
    await Haptics.selectionAsync();
    router.push('/auth/signup');
  };

  /**
   * Navigate to email login
   */
  const handleSignIn = async () => {
    await Haptics.selectionAsync();
    router.push('/auth/login');
  };

  return (
    <SafeAreaView style={screenLayout.container}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: authSpacing.screenPadding.horizontal,
            paddingTop: authSpacing.screenPadding.top,
            paddingBottom: authSpacing.screenPadding.bottom,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Centered content wrapper */}
          <View style={screenLayout.centerWrapper}>
            {/* Header section */}
            <View style={{ alignItems: 'center', marginBottom: authSpacing.subheadToForm }}>
              <Text
                style={{
                  ...authTypography.headline,
                  textAlign: 'center',
                  marginBottom: authSpacing.headlineToSubhead,
                }}
              >
                Want to Save Your Progress?
              </Text>

              <Text
                style={{
                  ...authTypography.subheadline,
                  textAlign: 'center',
                  maxWidth: 320,
                }}
              >
                Your patterns and insights will be safely stored
              </Text>
            </View>

            {/* Error alert */}
            {error && (
              <ErrorAlert
                message={error}
                type="error"
                onDismiss={() => setError(null)}
              />
            )}

            {/* Button section */}
            <View style={{ width: '100%' as DimensionValue }}>
              {/* Email Signup (Primary CTA) */}
              <AuthButton
                title="Create Account"
                onPress={handleSignUp}
                variant="primary"
                disabled={loading}
              />

              {/* Separator */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 20,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: 'rgba(64, 145, 108, 0.2)',
                  }}
                />
                <Text
                  style={{
                    marginHorizontal: 16,
                    fontSize: 15,
                    color: '#95B8A8',
                    fontWeight: '500',
                  }}
                >
                  or
                </Text>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: 'rgba(64, 145, 108, 0.2)',
                  }}
                />
              </View>

              {/* Email Login (Secondary CTA) */}
              <AuthButton
                title="Sign In"
                onPress={handleSignIn}
                variant="secondary"
                disabled={loading}
              />

              {/* Continue as Guest (Tertiary) */}
              <AuthButton
                title="Continue as Guest"
                onPress={handleContinueAsGuest}
                variant="link"
                loading={loading}
              />

              {/* Helper text for guest mode */}
              <Text
                style={{
                  ...authTypography.helperText,
                  textAlign: 'center',
                  marginTop: 16,
                  paddingHorizontal: 32,
                }}
              >
                Guest mode lets you try the app. You can create an account anytime.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
