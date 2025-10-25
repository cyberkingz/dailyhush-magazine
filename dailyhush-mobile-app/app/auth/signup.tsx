/**
 * DailyHush - Email Signup Screen
 * Create new account with email and password
 * Simplified validation for 55-70 demographic
 */

import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  DimensionValue,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { CheckSquare, Square } from 'lucide-react-native';

import { AuthTextInput } from '@/components/auth/AuthTextInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { signUpWithEmail, validateEmail, validatePassword } from '@/services/auth';
import { useStore } from '@/store/useStore';
import {
  authTypography,
  authSpacing,
  screenLayout,
} from '@/constants/authStyles';
import { colors } from '@/constants/colors';

export default function SignUp() {
  const router = useRouter();
  const { setUser } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Field-level errors
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Legal agreement checkboxes (required for App Store)
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

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
   * Validate password on blur
   */
  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordError(null);
      return;
    }

    const validation = validatePassword(password);
    setPasswordError(validation.valid ? null : validation.error || null);
  };

  /**
   * Handle form submission
   */
  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Clear field errors
      setEmailError(null);
      setPasswordError(null);

      // Validate legal agreements (REQUIRED for App Store)
      if (!agreedToTerms || !agreedToPrivacy) {
        setError('Please agree to the Terms of Service and Privacy Policy to continue');
        setLoading(false);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      // Validate fields
      const emailValidation = validateEmail(email);
      const passwordValidation = validatePassword(password);

      if (!emailValidation.valid) {
        setEmailError(emailValidation.error || null);
        setLoading(false);
        return;
      }

      if (!passwordValidation.valid) {
        setPasswordError(passwordValidation.error || null);
        setLoading(false);
        return;
      }

      console.log('Creating account...');
      const result = await signUpWithEmail(email, password);

      if (!result.success) {
        setError(result.error || 'Failed to create account');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      console.log('Account created successfully');

      // Check if email confirmation is required
      if (result.needsEmailConfirmation) {
        // Show email confirmation message (no redirect, stay on page)
        setSuccess(true);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // User stays on signup page to see the "Check your email" message
        return;
      }

      // Email confirmed or confirmation disabled - proceed normally
      setSuccess(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Load the new user profile and update store
      if (result.userId) {
        const { loadUserProfile } = await import('@/services/auth');
        const profileResult = await loadUserProfile(result.userId);
        if (profileResult.success && profileResult.profile) {
          setUser(profileResult.profile);
          console.log('New user profile loaded into store:', profileResult.profile.email);
        }
      }

      // Delay to show success message (2 seconds)
      setTimeout(() => {
        router.replace('/');
      }, 2000);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigate to login screen
   */
  const handleNavigateToLogin = async () => {
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
            paddingTop: 40, // Less top padding for form screens
            paddingBottom: authSpacing.screenPadding.bottom,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Form wrapper */}
          <View style={screenLayout.formWrapper}>
            {/* Header */}
            <View style={{ marginBottom: 36 }}>
              <Text
                style={{
                  ...authTypography.headline,
                  marginBottom: 10,
                }}
              >
                Create Your Account
              </Text>

              <Text style={authTypography.subheadline}>
                Your safe space for interrupting spirals
              </Text>
            </View>

            {/* Success alert */}
            {success && (
              <ErrorAlert
                message="Account created! Redirecting..."
                type="success"
                dismissible={false}
              />
            )}

            {/* Error alert */}
            {error && (
              <ErrorAlert
                message={error}
                type="error"
                onDismiss={() => setError(null)}
              />
            )}

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
                onBlur={handlePasswordBlur}
                placeholder="At least 8 characters"
                error={passwordError || undefined}
                helperText="Minimum 8 characters"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
                editable={!loading}
                testID="password-input"
              />

              {/* Legal agreements (REQUIRED for App Store) */}
              <View style={legalStyles.agreementsContainer}>
                {/* Terms of Service */}
                <Pressable
                  onPress={() => {
                    setAgreedToTerms(!agreedToTerms);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  disabled={loading}
                  style={legalStyles.checkboxRow}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {agreedToTerms ? (
                    <CheckSquare size={24} color={colors.emerald[500]} strokeWidth={2} />
                  ) : (
                    <Square size={24} color={colors.text.muted} strokeWidth={2} />
                  )}
                  <Text style={legalStyles.checkboxText}>
                    I agree to the{' '}
                    <Link href="/legal/terms" asChild>
                      <Text style={legalStyles.link}>Terms of Service</Text>
                    </Link>
                  </Text>
                </Pressable>

                {/* Privacy Policy */}
                <Pressable
                  onPress={() => {
                    setAgreedToPrivacy(!agreedToPrivacy);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  disabled={loading}
                  style={legalStyles.checkboxRow}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {agreedToPrivacy ? (
                    <CheckSquare size={24} color={colors.emerald[500]} strokeWidth={2} />
                  ) : (
                    <Square size={24} color={colors.text.muted} strokeWidth={2} />
                  )}
                  <Text style={legalStyles.checkboxText}>
                    I agree to the{' '}
                    <Link href="/legal/privacy" asChild>
                      <Text style={legalStyles.link}>Privacy Policy</Text>
                    </Link>
                  </Text>
                </Pressable>
              </View>

              {/* Submit button */}
              <View style={{ marginTop: 28 }}>
                <AuthButton
                  title="Create Account"
                  onPress={handleSignUp}
                  variant="primary"
                  disabled={loading || success}
                  loading={loading}
                  testID="signup-button"
                />
              </View>
            </View>

            {/* Footer link */}
            <View style={screenLayout.footerSection}>
              <Pressable
                onPress={handleNavigateToLogin}
                disabled={loading}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={{ paddingVertical: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}
              >
                <Text style={authTypography.footerText}>
                  Already have an account?{' '}
                </Text>
                <Text
                  style={{
                    ...authTypography.footerText,
                    color: '#52B788',
                    fontWeight: '600',
                  }}
                >
                  Sign in
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Legal checkbox styles
const legalStyles = StyleSheet.create({
  agreementsContainer: {
    marginTop: 24,
    gap: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkboxText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
  },
  link: {
    color: colors.emerald[500],
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
