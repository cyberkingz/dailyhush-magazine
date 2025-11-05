/**
 * DailyHush - Email Login Screen
 * Sign in with existing email and password
 * Includes forgot password link
 */

import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  DimensionValue,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { AuthTextInput } from '@/components/auth/AuthTextInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { signInWithEmail, validateEmail } from '@/services/auth';
import { useStore } from '@/store/useStore';
import { authTypography, authSpacing, screenLayout } from '@/constants/authStyles';
import { useAnalytics } from '@/utils/analytics';

export default function Login() {
  const router = useRouter();
  const params = useLocalSearchParams<{ prefillEmail?: string }>();
  const { setUser } = useStore();
  const analytics = useAnalytics();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Field-level errors
  const [emailError, setEmailError] = useState<string | null>(null);

  /**
   * Pre-fill email if passed via URL params
   * (e.g., when redirected from email lookup)
   */
  useEffect(() => {
    if (params.prefillEmail) {
      setEmail(params.prefillEmail);
    }
  }, [params.prefillEmail]);

  /**
   * Validate email on blur
   */
  const handleEmailBlur = () => {
    if (!email) {
      setEmailError(null);
      return;
    }

    const validation = validateEmail(email);
    setEmailError(validation.valid ? null : validation.error || null);
  };

  /**
   * Handle form submission
   */
  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Clear field errors
      setEmailError(null);

      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        setEmailError(emailValidation.error || null);
        setLoading(false);
        return;
      }

      // Validate password exists
      if (!password) {
        setError('Please enter your password');
        setLoading(false);
        return;
      }

      console.log('Signing in...');
      const result = await signInWithEmail(email, password);

      if (!result.success) {
        setError(result.error || 'Failed to sign in');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      console.log('Signed in successfully');
      setSuccess(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Load the user profile and update store
      let hasProfile = false;
      if (result.userId) {
        const { loadUserProfile } = await import('@/services/auth');
        const profileResult = await loadUserProfile(result.userId);
        if (profileResult.success && profileResult.profile) {
          setUser(profileResult.profile);
          hasProfile = true;
          console.log('User profile loaded into store:', profileResult.profile.email);

          // Track successful login
          analytics.track('LOGIN_COMPLETED', {
            loop_type: profileResult.profile.loop_type,
            is_premium: profileResult.profile.is_premium || false,
          });

          // Identify user for analytics
          analytics.identify(result.userId, {
            loop_type: profileResult.profile.loop_type,
            is_premium: profileResult.profile.is_premium || false,
          });
        } else {
          console.log('No profile found - orphaned account detected');
        }
      }

      // Short delay to show success message, then navigate
      setTimeout(() => {
        if (!hasProfile) {
          // Orphaned account - redirect to profile setup
          console.log('Redirecting to profile setup for orphaned account');
          router.replace('/onboarding/profile-setup');
        } else {
          // Profile exists - go to home
          router.replace('/');
        }
      }, 1000);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigate to quiz flow
   * All new users should discover their overthinker type
   */
  const handleNavigateToSignUp = async () => {
    await Haptics.selectionAsync();
    router.push('/onboarding/quiz');
  };

  /**
   * Navigate to forgot password screen
   */
  const handleForgotPassword = async () => {
    await Haptics.selectionAsync();
    router.push('/auth/forgot-password');
  };

  return (
    <SafeAreaView style={screenLayout.container}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: authSpacing.screenPadding.horizontal,
            paddingTop: 40,
            paddingBottom: authSpacing.screenPadding.bottom,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Form wrapper */}
          <View style={screenLayout.formWrapper}>
            {/* Header */}
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  ...authTypography.headline,
                  marginBottom: 8,
                }}>
                Welcome Back
              </Text>

              <Text style={authTypography.subheadline}>Sign in to continue your progress</Text>
            </View>

            {/* Success alert */}
            {success && (
              <ErrorAlert message="Signed in! Redirecting..." type="success" dismissible={false} />
            )}

            {/* Error alert */}
            {error && <ErrorAlert message={error} type="error" onDismiss={() => setError(null)} />}

            {/* Form fields */}
            <View style={{ width: '100%' as DimensionValue }}>
              <AuthTextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                onBlur={handleEmailBlur}
                placeholder="your.email@example.com"
                error={emailError || undefined}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
                editable={!loading}
                testID="email-input"
              />

              <AuthTextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
                editable={!loading}
                testID="password-input"
              />

              {/* Forgot password link */}
              <View style={{ alignItems: 'flex-end', marginTop: 12, marginBottom: 32 }}>
                <Pressable
                  onPress={handleForgotPassword}
                  disabled={loading}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={{ paddingVertical: 8, paddingHorizontal: 4 }}>
                  <Text
                    style={{
                      ...authTypography.linkText,
                      fontSize: 15,
                      textDecorationLine: 'underline',
                      textDecorationColor: '#52B788',
                    }}>
                    Forgot password?
                  </Text>
                </Pressable>
              </View>

              {/* Submit button */}
              <AuthButton
                title="Sign In"
                onPress={handleSignIn}
                variant="primary"
                disabled={loading || success}
                loading={loading}
                testID="login-button"
              />
            </View>

            {/* Footer link */}
            <View style={screenLayout.footerSection}>
              <Pressable
                onPress={handleNavigateToSignUp}
                disabled={loading}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={{
                  paddingVertical: 16,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}>
                <Text style={authTypography.footerText}>Don&apos;t have an account? </Text>
                <Text
                  style={{
                    ...authTypography.footerText,
                    color: '#7AF859',
                    fontWeight: '600',
                  }}>
                  Sign up
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
