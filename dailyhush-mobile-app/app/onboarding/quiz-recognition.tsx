/**
 * DailyHush - Quiz Recognition Screen
 * First screen in quiz-to-app connection flow
 * Asks if user has already taken the website quiz
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { CheckCircle2, Sparkles } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { ScrollFadeView } from '@/components/ScrollFadeView';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export default function QuizRecognition() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleTookQuiz = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/email-lookup' as any);
  };

  const handleNewUser = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Take the native quiz
    router.push('/onboarding/quiz' as any);
  };

  const handleHaveAccount = async () => {
    await Haptics.selectionAsync();
    // Route to login for existing users
    router.push('/auth/login' as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />

      <ScrollFadeView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + spacing.safeArea.top,
          paddingBottom: spacing.safeArea.bottom + insets.bottom,
          paddingHorizontal: spacing.screenPadding,
          justifyContent: 'center',
        }}
        showsVerticalScrollIndicator={false}
        fadeColor={colors.background.primary}
        fadeHeight={48}
        fadeIntensity={0.95}
        fadeVisibility="always"
      >
        {/* Icon */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: colors.emerald[600] + '20',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: colors.emerald[600] + '40',
            }}
          >
            <Sparkles size={48} color={colors.emerald[500]} strokeWidth={2} />
          </View>
        </View>

        {/* Headline */}
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            color: colors.text.primary,
            textAlign: 'center',
            marginBottom: 16,
            lineHeight: 40,
          }}
        >
          Quick Question
        </Text>

        {/* Description */}
        <Text
          style={{
            fontSize: 19,
            color: colors.text.secondary,
            textAlign: 'center',
            lineHeight: 28,
            marginBottom: 48,
          }}
        >
          Did you take our Overthinking Type Quiz on our website?
        </Text>

        {/* Primary Buttons */}
        <View style={{ marginBottom: 24 }}>
          {/* Yes Button */}
          <Pressable
            onPress={handleTookQuiz}
            style={{
              backgroundColor: colors.emerald[600],
              borderRadius: 20,
              paddingVertical: 20,
              paddingHorizontal: 32,
              marginBottom: 16,
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
                  opacity: pressed ? 0.9 : 1,
                }}
              >
                <CheckCircle2
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
                  Yes, I took the quiz
                </Text>
              </View>
            )}
          </Pressable>

          {/* No Button */}
          <Pressable
            onPress={handleNewUser}
            style={{
              backgroundColor: colors.background.card,
              borderRadius: 20,
              paddingVertical: 20,
              paddingHorizontal: 32,
              borderWidth: 2,
              borderColor: colors.emerald[700],
            }}
          >
            {({ pressed }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.7 : 1,
                }}
              >
                <Sparkles
                  size={24}
                  color={colors.emerald[500]}
                  strokeWidth={2}
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: colors.text.primary,
                  }}
                >
                  No, I'm new here
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Tertiary Link */}
        <View style={{ marginBottom: 16 }}>
          <Pressable
            onPress={handleHaveAccount}
            style={{
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            {({ pressed }) => (
              <Text
                style={{
                  fontSize: 17,
                  color: colors.emerald[400],
                  opacity: pressed ? 0.5 : 1,
                  fontWeight: '600',
                }}
              >
                I already have an account
              </Text>
            )}
          </Pressable>
        </View>

        {/* Helper Text */}
        <View
          style={{
            marginTop: 40,
            backgroundColor: colors.emerald[800] + '40',
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
            If you took our quiz, we can personalize your DailyHush experience using your quiz results.
          </Text>
        </View>
      </ScrollFadeView>
    </View>
  );
}
