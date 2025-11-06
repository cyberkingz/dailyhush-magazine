/**
 * DailyHush - Forgot Password Screen
 * Request password reset email
 * Simplified flow for 55-70 demographic
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
  Pressable,
  SafeAreaView,
  DimensionValue,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ArrowLeft } from 'lucide-react-native';

import { AuthTextInput } from '@/components/auth/AuthTextInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { sendPasswordResetEmail, validateEmail } from '@/services/auth';
import { authTypography, authSpacing, screenLayout } from '@/constants/authStyles';

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Field-level errors
  const [emailError, setEmailError] = useState<string | null>(null);

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
   * Handle password reset request
   */
  const handleSendResetEmail = async () => {
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

      console.log('Sending password reset email...');
      const result = await sendPasswordResetEmail(email);

      if (!result.success) {
        setError(result.error || 'Failed to send reset email');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      console.log('Password reset email sent');
      setSuccess(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send reset email');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigate back to login
   */
  const handleBackToLogin = async () => {
    await Haptics.selectionAsync();
    router.back();
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
            {/* Back button */}
            <Pressable
              onPress={handleBackToLogin}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={{ marginBottom: 24, alignSelf: 'flex-start' }}>
              <ArrowLeft size={24} color="#7AF859" strokeWidth={2} />
            </Pressable>

            {/* Header */}
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  ...authTypography.headline,
                  marginBottom: 8,
                }}>
                Reset Your Password
              </Text>

              <Text style={authTypography.subheadline}>
                We&apos;ll send you an email with instructions to reset your password
              </Text>
            </View>

            {/* Success message */}
            {success ? (
              <View>
                <ErrorAlert
                  message={`We&apos;ve sent password reset instructions to ${email}. Please check your email.`}
                  type="success"
                  dismissible={false}
                />

                <View style={{ marginTop: 32 }}>
                  <AuthButton
                    title="Back to Sign In"
                    onPress={handleBackToLogin}
                    variant="primary"
                  />
                </View>

                <Text
                  style={{
                    ...authTypography.helperText,
                    textAlign: 'center',
                    marginTop: 24,
                    paddingHorizontal: 16,
                  }}>
                  Didn&apos;t receive the email? Check your spam folder or try again in a few
                  minutes.
                </Text>
              </View>
            ) : (
              <View>
                {/* Error alert */}
                {error && (
                  <ErrorAlert message={error} type="error" onDismiss={() => setError(null)} />
                )}

                {/* Form field */}
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
                    returnKeyType="done"
                    onSubmitEditing={handleSendResetEmail}
                    editable={!loading}
                    testID="email-input"
                  />

                  {/* Submit button */}
                  <View style={{ marginTop: 32 }}>
                    <AuthButton
                      title="Send Reset Email"
                      onPress={handleSendResetEmail}
                      variant="primary"
                      disabled={loading}
                      loading={loading}
                      testID="reset-button"
                    />
                  </View>
                </View>

                {/* Back to login link */}
                <View style={{ marginTop: 24, alignItems: 'center' }}>
                  <Pressable
                    onPress={handleBackToLogin}
                    disabled={loading}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    style={{ paddingVertical: 16 }}>
                    <Text
                      style={{
                        ...authTypography.linkText,
                        textDecorationLine: 'underline',
                        textDecorationColor: '#7AF859',
                      }}>
                      Back to Sign In
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
