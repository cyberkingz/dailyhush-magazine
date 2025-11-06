/**
 * DailyHush - Quiz Signup Screen
 * Collects email and password BEFORE revealing quiz results
 * Creates psychological motivation to complete signup
 */

import { useState } from 'react';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { supabase } from '@/utils/supabase';
import { validateEmail, validatePassword, checkExistingAccount } from '@/services/auth';
import { useStore } from '@/store/useStore';
import { setSignupInProgress } from '@/hooks/useAuthSync';
import { QUIZ_STORAGE_KEYS, QUIZ_REVEAL_CONFIG } from '@/constants/quiz';
import { routes } from '@/constants/routes';
import type { OverthinkerType } from '@/data/quizQuestions';
import { useAnalytics } from '@/utils/analytics';

export default function QuizSignup() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setUser } = useStore();
  const analytics = useAnalytics();

  const params = useLocalSearchParams<{
    type: OverthinkerType;
    score: string;
    rawScore: string;
    title: string;
    description: string;
    insight: string;
    ctaHook: string;
    loopType: string; // Loop type from quiz results
    answers: string;
    // Profile data from profile setup
    profileName?: string;
    profileAge?: string;
    profileRuminationFrequency?: string;
  }>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Field-level errors
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError(null);
      return;
    }
    const validation = validateEmail(email);
    setEmailError(validation.valid ? null : validation.error || null);
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordError(null);
      return;
    }
    const validation = validatePassword(password);
    setPasswordError(validation.valid ? null : validation.error || null);
  };

  const handleCreateAccount = async () => {
    try {
      setErrorMessage('');
      setEmailError(null);
      setPasswordError(null);

      // Validate fields
      const emailValidation = validateEmail(email);
      const passwordValidation = validatePassword(password);

      if (!emailValidation.valid) {
        setEmailError(emailValidation.error || null);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      if (!passwordValidation.valid) {
        setPasswordError(passwordValidation.error || null);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      setIsCreating(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Track signup started
      analytics.track('SIGNUP_STARTED', {
        loop_type: params.loopType as any,
        overthinker_type: params.type,
      });

      // CRITICAL: Suppress auth sync during signup to prevent race conditions
      setSignupInProgress(true);

      // STEP 1: Check if AUTH account already exists
      const accountCheck = await checkExistingAccount(email);

      if (accountCheck.exists) {
        // AUTH account exists - redirect to login
        setErrorMessage('An account with this email already exists. Please log in instead.');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setSignupInProgress(false); // Re-enable auth sync

        setTimeout(() => {
          router.replace({
            pathname: routes.auth.login as any,
            params: { prefillEmail: email.trim().toLowerCase() },
          });
        }, 2000);
        return;
      }

      // STEP 2: Check if quiz submission exists (but no auth account)
      const { data: quizData } = await supabase
        .from('quiz_submissions')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .limit(1);

      if (quizData && quizData.length > 0) {
        // Quiz exists but no auth account - redirect to email lookup to link it
        setErrorMessage(
          "Good news! You already took the quiz on our website. Let's link your account."
        );
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setSignupInProgress(false); // Re-enable auth sync

        setTimeout(() => {
          router.replace({
            pathname: routes.onboarding.emailLookup as any,
            params: {
              prefillEmail: email.trim().toLowerCase(),
              // Pass profile data from this session
              profileName: params.profileName || '',
              profileAge: params.profileAge || '',
              profileRuminationFrequency: params.profileRuminationFrequency || '',
            },
          });
        }, 2000);
        return;
      }

      // Create Supabase auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (authError) {
        console.error('Error creating auth account:', authError);
        setErrorMessage(authError.message || 'Failed to create account. Please try again.');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setSignupInProgress(false); // Re-enable auth sync
        setIsCreating(false);
        return;
      }

      if (!authData.user) {
        setErrorMessage('Failed to create account. Please try again.');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setSignupInProgress(false); // Re-enable auth sync
        setIsCreating(false);
        return;
      }

      console.log('✅ Auth account created:', authData.user.id);

      // Create user profile with profile data + quiz data
      const { error: profileError } = await supabase.from('user_profiles').insert({
        user_id: authData.user.id,
        email: email.trim().toLowerCase(),
        // Profile data from profile setup screen
        name: params.profileName || null,
        age: params.profileAge ? parseInt(params.profileAge) : null,
        // Quiz results - SAVE LOOP TYPE!
        loop_type: params.loopType || null,
        quiz_overthinker_type: params.type || null,
        onboarding_completed: true, // Set to true so home screen doesn't redirect back to onboarding
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        setErrorMessage('Account created but profile setup failed. Please contact support.');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setSignupInProgress(false); // Re-enable auth sync
        setIsCreating(false);
        return;
      }

      console.log('✅ User profile created');

      // BEST PRACTICE: Fetch fresh profile from database (single source of truth)
      const { data: freshProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (fetchError || !freshProfile) {
        console.warn('Could not fetch fresh profile, using constructed data:', fetchError);
        // Fallback: Use constructed profile data
        setUser({
          user_id: authData.user.id,
          email: email.trim().toLowerCase(),
          onboarding_completed: false,
          name: params.profileName || null,
          age: params.profileAge ? parseInt(params.profileAge) : null,
          quiz_email: null,
          quiz_connected: false,
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
      } else {
        console.log('✅ Profile synced from database');
        setUser(freshProfile);
      }

      // Track signup completion and identify user
      analytics.track('SIGNUP_COMPLETED', {
        loop_type: params.loopType as any,
        overthinker_type: params.type,
      });

      // Identify user for analytics
      analytics.identify(authData.user.id, {
        loop_type: params.loopType as any,
        is_premium: false,
        created_at: new Date().toISOString(),
      });

      // CRITICAL: Set the session AFTER profile is created and loaded
      // This prevents race condition where auth listener tries to load non-existent profile
      if (authData.session) {
        await supabase.auth.setSession({
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
        });
        console.log('✅ Session explicitly set after profile creation');
      }

      // Re-enable auth sync now that profile exists
      setSignupInProgress(false);

      // Clear pending results from storage (no longer needed)
      await AsyncStorage.removeItem(QUIZ_STORAGE_KEYS.PENDING_RESULTS);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigate to results reveal with delay for suspense
      setTimeout(() => {
        router.replace({
          pathname: routes.onboarding.quizResults as any,
          params: {
            ...params,
            // Add flag to indicate results should be revealed
            reveal: 'true',
          },
        });
      }, QUIZ_REVEAL_CONFIG.REVEAL_DELAY);
    } catch (error: any) {
      console.error('Exception during account creation:', error);
      setErrorMessage(error?.message || 'An unexpected error occurred. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setSignupInProgress(false); // Re-enable auth sync on error
      setIsCreating(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Unlock Your Results',
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.lime[500],
          headerShadowVisible: false,
        }}
      />
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <StatusBar style="light" />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollFadeView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: spacing.lg,
              paddingBottom: spacing.safeArea.bottom + insets.bottom,
              paddingHorizontal: spacing.screenPadding,
            }}
            showsVerticalScrollIndicator={false}
            fadeColor={colors.background.primary}
            fadeHeight={48}
            fadeIntensity={0.95}
            fadeVisibility="always"
            keyboardShouldPersistTaps="handled">
            {/* Sparkle Icon */}
            <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: colors.lime[600] + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: colors.lime[600] + '40',
                }}>
                <Sparkles size={40} color={colors.lime[500]} strokeWidth={2} />
              </View>
            </View>

            {/* Headline */}
            <Text
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: colors.text.primary,
                textAlign: 'center',
                marginBottom: spacing.sm,
                lineHeight: 36,
              }}>
              {QUIZ_REVEAL_CONFIG.TEASER_TITLE}
            </Text>

            {/* Description */}
            <Text
              style={{
                fontSize: 17,
                color: colors.text.secondary,
                textAlign: 'center',
                lineHeight: 26,
                marginBottom: spacing.xl,
              }}>
              {QUIZ_REVEAL_CONFIG.TEASER_DESCRIPTION}
            </Text>

            {/* Email Input */}
            <View style={{ marginBottom: spacing.md }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}>
                Email Address
              </Text>
              <View style={{ position: 'relative' }}>
                <Mail
                  size={20}
                  color={colors.text.secondary}
                  style={{
                    position: 'absolute',
                    left: 20,
                    top: 18,
                    zIndex: 1,
                  }}
                />
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errorMessage) setErrorMessage('');
                    if (emailError) setEmailError(null);
                  }}
                  onBlur={handleEmailBlur}
                  placeholder="your.email@example.com"
                  placeholderTextColor={colors.text.secondary + '60'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  returnKeyType="next"
                  editable={!isCreating}
                  accessibilityLabel="Email Address"
                  testID="email-input"
                  style={{
                    backgroundColor: colors.background.card,
                    borderRadius: 16,
                    paddingVertical: 18,
                    paddingLeft: 52,
                    paddingRight: 20,
                    fontSize: 17,
                    minHeight: 56,
                    color: colors.text.primary,
                    borderWidth: 2,
                    borderColor: emailError ? '#EF4444' : colors.lime[700] + '60',
                  }}
                />
              </View>
              {emailError && (
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: '#EF4444',
                    marginTop: spacing.xs,
                  }}>
                  {emailError}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: spacing.lg }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}>
                Create Password
              </Text>
              <View style={{ position: 'relative' }}>
                <Lock
                  size={20}
                  color={colors.text.secondary}
                  style={{
                    position: 'absolute',
                    left: 20,
                    top: 18,
                    zIndex: 1,
                  }}
                />
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errorMessage) setErrorMessage('');
                    if (passwordError) setPasswordError(null);
                  }}
                  onBlur={handlePasswordBlur}
                  placeholder="8+ characters"
                  placeholderTextColor={colors.text.secondary + '60'}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="none"
                  passwordRules=""
                  returnKeyType="done"
                  onSubmitEditing={handleCreateAccount}
                  editable={!isCreating}
                  accessibilityLabel="Create Password"
                  testID="password-input"
                  style={{
                    backgroundColor: colors.background.card,
                    borderRadius: 16,
                    paddingVertical: 18,
                    paddingLeft: 52,
                    paddingRight: 56,
                    fontSize: 17,
                    minHeight: 56,
                    color: colors.text.primary,
                    borderWidth: 2,
                    borderColor: passwordError ? '#EF4444' : colors.lime[700] + '60',
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
                  }}>
                  {showPassword ? (
                    <EyeOff size={24} color={colors.text.secondary} strokeWidth={2} />
                  ) : (
                    <Eye size={24} color={colors.text.secondary} strokeWidth={2} />
                  )}
                </Pressable>
              </View>
              {passwordError && (
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: '#EF4444',
                    marginTop: spacing.xs,
                  }}>
                  {passwordError}
                </Text>
              )}
            </View>

            {/* General Error Message */}
            {errorMessage && (
              <View
                style={{
                  backgroundColor: '#EF4444' + '20',
                  borderRadius: 12,
                  padding: spacing.md,
                  marginBottom: spacing.lg,
                  borderWidth: 1,
                  borderColor: '#EF4444' + '40',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: '#EF4444',
                    textAlign: 'center',
                  }}>
                  {errorMessage}
                </Text>
              </View>
            )}

            {/* Create Account Button */}
            <Pressable
              onPress={handleCreateAccount}
              disabled={isCreating}
              style={{
                backgroundColor: isCreating ? colors.lime[700] : colors.lime[600],
                borderRadius: 20,
                paddingVertical: 20,
                paddingHorizontal: 32,
                marginBottom: spacing.lg,
                shadowColor: colors.lime[500],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 6,
              }}>
              {({ pressed }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed && !isCreating ? 0.9 : 1,
                  }}>
                  {isCreating ? (
                    <>
                      <ActivityIndicator size="small" color={colors.button.primaryText} />
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: colors.button.primaryText,
                          marginLeft: 12,
                        }}>
                        Creating Account...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Sparkles
                        size={24}
                        color={colors.button.primaryText}
                        strokeWidth={2}
                        style={{ marginRight: 12 }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: colors.button.primaryText,
                        }}>
                        Unlock My Results
                      </Text>
                    </>
                  )}
                </View>
              )}
            </Pressable>

            {/* Privacy Note */}
            <View
              style={{
                backgroundColor: colors.lime[800] + '30',
                borderRadius: 16,
                padding: spacing.md,
                borderWidth: 1,
                borderColor: colors.lime[700] + '40',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.lime[200],
                  textAlign: 'center',
                  lineHeight: 20,
                }}>
                🔒 Your data is private and secure. We never share your information.
              </Text>
            </View>
          </ScrollFadeView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
