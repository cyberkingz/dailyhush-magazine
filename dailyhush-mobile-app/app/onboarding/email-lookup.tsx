/**
 * DailyHush - Email Lookup Screen
 * Looks up user's email in quiz_submissions table
 * Routes to password setup if found
 */

import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { View, Pressable, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Mail, Search } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { timing } from '@/constants/timing';
import { routes } from '@/constants/routes';
import { messages } from '@/constants/messages';
import { supabase } from '@/utils/supabase';
import { checkExistingAccount } from '@/services/auth';

export default function EmailLookup() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Accept prefilled email and profile data from signup redirect
  const params = useLocalSearchParams<{
    prefillEmail?: string;
    profileName?: string;
    profileAge?: string;
    profileRuminationFrequency?: string;
  }>();

  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill email if provided
  useEffect(() => {
    if (params.prefillEmail) {
      setEmail(params.prefillEmail);
    }
  }, [params.prefillEmail]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLookup = async () => {
    try {
      setErrorMessage('');

      // Validate email format
      if (!email.trim()) {
        setErrorMessage(messages.validation.emailRequired);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      if (!validateEmail(email.trim())) {
        setErrorMessage(messages.validation.emailInvalid);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      setIsSearching(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // FIRST: Check if this email already has a DailyHush account
      const accountCheck = await checkExistingAccount(email);

      if (accountCheck.error) {
        console.warn('Error checking for existing account (continuing anyway):', accountCheck.error);
      }

      if (accountCheck.exists) {
        // Account exists (regardless of onboarding status) - route to login!
        console.log('Existing account found for:', email, 'Onboarding completed:', accountCheck.accountCompleted);
        setErrorMessage(messages.account.alreadyExists);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        setTimeout(() => {
          router.replace({
            pathname: routes.auth.login as any,
            params: { prefillEmail: email.trim().toLowerCase() },
          });
        }, timing.navigation.redirectDelay);
        return;
      }

      // If no existing account, look up email in quiz_submissions table
      const { data, error } = await supabase
        .from('quiz_submissions')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        // Database error
        console.error('Error looking up quiz submission:', error);
        setErrorMessage(messages.error.database);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setIsSearching(false);
        return;
      }

      if (!data || data.length === 0) {
        // Email not found in quiz submissions
        setErrorMessage(messages.account.notFound);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setIsSearching(false);
        return;
      }

      // Get the most recent submission
      const submission = data[0];

      // Success! Found quiz submission
      console.log('Found quiz submission:', submission.id);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Route to password setup with quiz data + profile data (if from signup redirect)
      router.push({
        pathname: routes.onboarding.passwordSetup as any,
        params: {
          email: email.trim().toLowerCase(),
          quizSubmissionId: submission.id,
          overthinkerType: submission.overthinker_type || '',
          score: submission.score?.toString() || '0',
          // Profile data from signup redirect (if provided)
          profileName: params.profileName || '',
          profileAge: params.profileAge || '',
          profileRuminationFrequency: params.profileRuminationFrequency || '',
        },
      });
    } catch (error: any) {
      console.error('Exception during email lookup:', error);
      setErrorMessage(messages.error.generic);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Find Your Quiz',
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
          {/* Icon */}
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
              <Mail size={40} color={colors.emerald[500]} strokeWidth={2} />
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
            Find Your Quiz Results
          </Text>

          {/* Description */}
          <Text
            style={{
              fontSize: 17,
              color: colors.text.secondary,
              textAlign: 'center',
              lineHeight: 26,
              marginBottom: 40,
            }}
          >
            Enter the email you used for the quiz and we'll connect your results
          </Text>

          {/* Email Input */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: 12,
              }}
            >
              Email Address
            </Text>
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="your.email@example.com"
              placeholderTextColor={colors.text.secondary + '60'}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              returnKeyType="search"
              onSubmitEditing={handleLookup}
              editable={!isSearching}
              style={{
                backgroundColor: colors.background.card,
                borderRadius: 16,
                paddingVertical: 18,
                paddingHorizontal: 20,
                fontSize: 17,
                minHeight: 56, // WCAG AAA compliance for 55-70 demographic
                color: colors.text.primary,
                borderWidth: 2,
                borderColor: errorMessage ? '#EF4444' : colors.emerald[700] + '60',
              }}
            />

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

          {/* Search Button */}
          <Pressable
            onPress={handleLookup}
            disabled={isSearching}
            style={{
              backgroundColor: isSearching ? colors.emerald[700] : colors.emerald[600],
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
                  opacity: pressed && !isSearching ? 0.9 : 1,
                }}
              >
                {isSearching ? (
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
                      Searching...
                    </Text>
                  </>
                ) : (
                  <>
                    <Search
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
                      Find My Quiz
                    </Text>
                  </>
                )}
              </View>
            )}
          </Pressable>

          {/* Helper Text */}
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
              }}
            >
              Can't find your quiz? No worries! You can still use DailyHush and take the quiz later.
            </Text>
          </View>

          {/* Continue Without Quiz Link */}
          <Pressable
            onPress={async () => {
              await Haptics.selectionAsync();
              router.push(routes.onboarding.quiz as any);
            }}
            style={{
              marginTop: 24,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            {({ pressed }) => (
              <Text
                style={{
                  fontSize: 17,
                  color: colors.text.secondary,
                  opacity: pressed ? 0.5 : 0.8,
                  textDecorationLine: 'underline',
                }}
              >
                Take the quiz instead
              </Text>
            )}
          </Pressable>
        </ScrollFadeView>
      </KeyboardAvoidingView>
      </View>
    </>
  );
}
