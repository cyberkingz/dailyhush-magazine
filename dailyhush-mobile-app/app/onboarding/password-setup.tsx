/**
 * DailyHush - Password Setup Screen
 * Creates account for quiz users (email already verified via quiz)
 * Links quiz results to new user profile
 */

import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, Pressable, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { supabase } from '@/utils/supabase';
import { useStore } from '@/store/useStore';
import { withRetry } from '@/utils/retry';
import { checkExistingAccount } from '@/services/auth';
import { routes } from '@/constants/routes';

export default function PasswordSetup() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    email: string;
    quizSubmissionId: string;
    overthinkerType: string;
    score: string;
    // Profile data from signup redirect (optional)
    profileName?: string;
    profileAge?: string;
    profileRuminationFrequency?: string;
  }>();
  const insets = useSafeAreaInsets();
  const { setUser } = useStore();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validatePassword = (): boolean => {
    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return false;
    }

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setErrorMessage('Password must include uppercase, lowercase, and number');
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleCreateAccount = async () => {
    try {
      setErrorMessage('');

      if (!validatePassword()) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      setIsCreating(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // DEFENSIVE CHECK: Verify auth account doesn't already exist
      // This catches cases where email-lookup's check failed or was bypassed
      console.log('🔍 Checking if auth account already exists for:', params.email);
      const accountCheck = await checkExistingAccount(params.email);

      if (accountCheck.exists) {
        // Auth account exists - should NOT be here!
        // Redirect to login instead
        console.log('⚠️ Auth account already exists! Redirecting to login...');
        setErrorMessage('An account with this email already exists. Redirecting to login...');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

        setTimeout(() => {
          router.replace({
            pathname: routes.auth.login as any,
            params: { prefillEmail: params.email },
          });
        }, 2000);
        setIsCreating(false);
        return;
      }

      console.log('✅ No existing auth account - proceeding with account creation');

      // Step 1: Create Supabase auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: params.email,
        password: password,
      });

      if (authError) {
        console.error('Error creating auth account:', authError);

        // Handle specific auth errors
        if (authError.message.includes('already registered')) {
          setErrorMessage('This email is already registered. Please sign in instead.');
        } else {
          setErrorMessage(authError.message || 'Failed to create account. Please try again.');
        }

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setIsCreating(false);
        return;
      }

      if (!authData.user) {
        setErrorMessage('Failed to create account. Please try again.');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setIsCreating(false);
        return;
      }

      // Safe reference to user after null check
      const newUser = authData.user;
      console.log('Auth account created:', newUser.id);

      // Step 2: Create user profile with quiz connection + profile data (if provided)
      // If profile data is provided (from signup redirect), onboarding is complete
      const hasProfileData = !!(params.profileName || params.profileAge || params.profileRuminationFrequency);

      const { error: profileError } = await withRetry(
        async () => await supabase
          .from('user_profiles')
          .insert({
            user_id: newUser.id,
            email: params.email,
            quiz_email: params.email,
            quiz_connected: true,
            quiz_submission_id: params.quizSubmissionId,
            quiz_overthinker_type: params.overthinkerType,
            quiz_connected_at: new Date().toISOString(),
            // Profile data from signup redirect (if provided)
            name: params.profileName || null,
            age: params.profileAge ? parseInt(params.profileAge) : null,
            // Note: rumination_frequency not in schema - removed
            // Complete onboarding if profile data was provided
            onboarding_completed: hasProfileData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        {
          maxRetries: 3,
          onRetry: (attempt) => {
            console.log(`Retrying profile creation (attempt ${attempt}/3)...`);
          }
        }
      );

      if (profileError) {
        console.error('Error creating user profile after retries:', profileError);
        setErrorMessage('Account created but profile setup failed. Please contact support.');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setIsCreating(false);
        return;
      }

      console.log('User profile created with quiz connection');

      // Step 3: Update local store with profile data
      setUser({
        user_id: newUser.id,
        email: params.email,
        quiz_email: params.email,
        quiz_connected: true,
        quiz_submission_id: params.quizSubmissionId,
        quiz_overthinker_type: params.overthinkerType,
        onboarding_completed: hasProfileData,
        // Profile data from signup redirect (if provided)
        name: params.profileName || null,
        age: params.profileAge ? parseInt(params.profileAge) : null,
        // Note: rumination_frequency not in schema - removed
        has_shift_necklace: false,
        shift_paired: false,
        fire_progress: {
          focus: false,
          interrupt: false,
          reframe: false,
          execute: false,
        },
        triggers: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Success!
      console.log('Account setup complete - quiz user connected');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Route based on whether profile data was provided
      if (hasProfileData) {
        // Profile data already collected during in-app quiz - go to home
        console.log('Profile data provided - onboarding complete');
        router.replace('/');
      } else {
        // No profile data - route to profile setup to collect it
        console.log('No profile data - routing to profile setup');
        router.replace('/onboarding/profile-setup');
      }
    } catch (error: any) {
      console.error('Exception during account creation:', error);
      setErrorMessage(error?.message || 'An unexpected error occurred. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setIsCreating(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Create Account',
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.emerald[500],
          headerShadowVisible: false,
        }}
      />
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <StatusBar style="light" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollFadeView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 24,
            paddingBottom: spacing.safeArea.bottom + insets.bottom,
            paddingHorizontal: spacing.screenPadding,
          }}
          showsVerticalScrollIndicator={false}
          fadeColor={colors.background.primary}
          fadeHeight={48}
          fadeIntensity={0.95}
          fadeVisibility="always"
          keyboardShouldPersistTaps="handled"
        >
          {/* Success Icon */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.emerald[600] + '20',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: colors.emerald[600] + '40',
              }}
            >
              <CheckCircle2 size={40} color={colors.emerald[500]} strokeWidth={2} />
            </View>
          </View>

          {/* Headline */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: colors.text.primary,
              textAlign: 'center',
              marginBottom: 12,
              lineHeight: 36,
            }}
          >
            Great! We Found You
          </Text>

          {/* Description */}
          <Text
            style={{
              fontSize: 17,
              color: colors.text.secondary,
              textAlign: 'center',
              lineHeight: 26,
              marginBottom: 8,
            }}
          >
            Your quiz results are ready to connect.{'\n'}
            Just create a password to get started.
          </Text>

          {/* Email Display */}
          <View
            style={{
              backgroundColor: colors.emerald[800] + '30',
              borderRadius: 12,
              padding: 16,
              marginBottom: 40,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.emerald[300],
                fontWeight: '600',
              }}
            >
              {params.email}
            </Text>
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: 12,
              }}
            >
              Create Password
            </Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="8+ chars, upper, lower, number"
                placeholderTextColor={colors.text.secondary + '60'}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password-new"
                returnKeyType="next"
                editable={!isCreating}
                style={{
                  backgroundColor: colors.background.card,
                  borderRadius: 16,
                  paddingVertical: 18,
                  paddingHorizontal: 20,
                  paddingRight: 56,
                  fontSize: 17,
                  minHeight: 56, // WCAG AAA compliance for 55-70 demographic
                  color: colors.text.primary,
                  borderWidth: 2,
                  borderColor: errorMessage ? '#EF4444' : colors.emerald[700] + '60',
                }}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 48,
                }}
              >
                {showPassword ? (
                  <EyeOff size={24} color={colors.text.secondary} strokeWidth={2} />
                ) : (
                  <Eye size={24} color={colors.text.secondary} strokeWidth={2} />
                )}
              </Pressable>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: 12,
              }}
            >
              Confirm Password
            </Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Re-enter your password"
                placeholderTextColor={colors.text.secondary + '60'}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password-new"
                returnKeyType="done"
                onSubmitEditing={handleCreateAccount}
                editable={!isCreating}
                style={{
                  backgroundColor: colors.background.card,
                  borderRadius: 16,
                  paddingVertical: 18,
                  paddingHorizontal: 20,
                  paddingRight: 56,
                  fontSize: 17,
                  minHeight: 56, // WCAG AAA compliance for 55-70 demographic
                  color: colors.text.primary,
                  borderWidth: 2,
                  borderColor: errorMessage ? '#EF4444' : colors.emerald[700] + '60',
                }}
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 48,
                }}
              >
                {showConfirmPassword ? (
                  <EyeOff size={24} color={colors.text.secondary} strokeWidth={2} />
                ) : (
                  <Eye size={24} color={colors.text.secondary} strokeWidth={2} />
                )}
              </Pressable>
            </View>

            {errorMessage ? (
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#EF4444',
                  marginTop: 8,
                  lineHeight: 24,
                }}
              >
                {errorMessage}
              </Text>
            ) : null}
          </View>

          {/* Create Account Button */}
          <Pressable
            onPress={handleCreateAccount}
            disabled={isCreating}
            style={{
              backgroundColor: isCreating ? colors.emerald[700] : colors.emerald[600],
              borderRadius: 20,
              paddingVertical: 20,
              paddingHorizontal: 32,
              marginBottom: 24,
              shadowColor: colors.emerald[500],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            {({ pressed }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed && !isCreating ? 0.9 : 1,
                }}
              >
                {isCreating ? (
                  <>
                    <ActivityIndicator size="small" color={colors.white} />
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: colors.white,
                        marginLeft: 12,
                      }}
                    >
                      Creating Account...
                    </Text>
                  </>
                ) : (
                  <>
                    <Lock
                      size={24}
                      color={colors.white}
                      strokeWidth={2}
                      style={{ marginRight: 12 }}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: colors.white,
                      }}
                    >
                      Create Account
                    </Text>
                  </>
                )}
              </View>
            )}
          </Pressable>

          {/* Quiz Info */}
          {params.overthinkerType && (
            <View
              style={{
                backgroundColor: colors.emerald[800] + '30',
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: colors.emerald[700] + '40',
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: colors.emerald[200],
                  textAlign: 'center',
                  lineHeight: 22,
                  marginBottom: 8,
                }}
              >
                Your Overthinking Type:
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: colors.emerald[400],
                  textAlign: 'center',
                  textTransform: 'capitalize',
                }}
              >
                {params.overthinkerType}
              </Text>
            </View>
          )}
        </ScrollFadeView>
      </KeyboardAvoidingView>
      </View>
    </>
  );
}
