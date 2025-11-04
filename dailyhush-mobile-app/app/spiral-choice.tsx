/**
 * DailyHush - Spiral Choice Screen
 * Critical decision point when user is spiraling
 * Choose between talking to Anna (AI) or using the quick protocol
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, MessageCircle, Zap } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useAnalytics } from '@/utils/analytics';

export default function SpiralChoice() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const analytics = useAnalytics();

  const handleTalkToAnna = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    analytics.track('SPIRAL_CHOICE_ANNA');
    router.push('/anna/conversation');
  };

  const handleQuickProtocol = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    analytics.track('SPIRAL_CHOICE_PROTOCOL');
    router.push('/spiral');
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View className="flex-1 bg-[#0A1612]">
      <StatusBar style="light" />

      <LinearGradient
        colors={['#0A1612', '#0F1F1A', '#0A1612']}
        locations={[0, 0.5, 1]}
        style={{ flex: 1 }}>
        {/* Header with Back Button */}
        <View
          style={{
            paddingTop: insets.top + 8,
            paddingBottom: 12,
            paddingHorizontal: 20,
          }}>
          <Pressable
            onPress={handleBack}
            accessibilityLabel="Go back"
            accessibilityHint="Returns to the previous screen"
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 22,
              backgroundColor: pressed ? 'rgba(64, 145, 108, 0.25)' : 'rgba(64, 145, 108, 0.15)',
              borderWidth: 1,
              borderColor: 'rgba(82, 183, 136, 0.3)',
            })}>
            <ArrowLeft size={20} color="#E8F4F0" strokeWidth={2.5} />
          </Pressable>
        </View>

        {/* Main Content - Centered */}
        <View className="flex-1 justify-center px-6">
          {/* Heading Section */}
          <View className="mb-12 items-center">
            {/* Calming icon */}
            <View className="mb-6">
              <View
                className="h-20 w-20 items-center justify-center rounded-full"
                style={{
                  backgroundColor: 'rgba(64, 145, 108, 0.15)',
                  borderWidth: 2,
                  borderColor: 'rgba(82, 183, 136, 0.3)',
                }}>
                <Text className="text-4xl">🌿</Text>
              </View>
            </View>

            <Text
              className="mb-3 text-center text-[#E8F4F0]"
              style={{
                fontSize: 28,
                fontFamily: 'Poppins_700Bold',
                letterSpacing: 0.3,
                lineHeight: 36,
              }}>
              How would you like help?
            </Text>

            <Text
              className="px-4 text-center text-[#95B8A8]"
              style={{
                fontSize: 16,
                fontFamily: 'Poppins_400Regular',
                lineHeight: 24,
                opacity: 0.9,
              }}>
              Choose what feels right for you right now
            </Text>
          </View>

          {/* Primary CTA: Talk to Anna */}
          <Pressable
            onPress={handleTalkToAnna}
            accessibilityLabel="Talk to Anna"
            accessibilityHint="Start a conversation with Anna, your AI companion"
            className="mb-4 active:opacity-90"
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#3A8360' : '#40916C',
              borderRadius: 20,
              paddingVertical: 24,
              paddingHorizontal: 24,
              shadowColor: '#52B788',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 16,
              elevation: 8,
              borderWidth: 1,
              borderColor: 'rgba(82, 183, 136, 0.4)',
            })}>
            <View className="items-center">
              {/* Icon */}
              <View className="mb-3">
                <View
                  className="h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  }}>
                  <MessageCircle size={28} color="#FFFFFF" strokeWidth={2} />
                </View>
              </View>

              {/* Main Text */}
              <Text
                className="mb-2 text-center text-white"
                style={{
                  fontSize: 22,
                  fontFamily: 'Poppins_600SemiBold',
                  letterSpacing: 0.3,
                }}>
                Talk to Anna
              </Text>

              {/* Subtitle */}
              <Text
                className="text-center"
                style={{
                  fontSize: 15,
                  fontFamily: 'Poppins_400Regular',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 22,
                }}>
                Let&apos;s talk through it together
              </Text>
            </View>
          </Pressable>

          {/* Secondary CTA: Quick Protocol */}
          <Pressable
            onPress={handleQuickProtocol}
            accessibilityLabel="Quick Protocol"
            accessibilityHint="Start a 90-second guided exercise to interrupt the spiral"
            className="active:opacity-90"
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#162E26' : 'transparent',
              borderRadius: 20,
              paddingVertical: 20,
              paddingHorizontal: 24,
              borderWidth: 2,
              borderColor: pressed ? 'rgba(64, 145, 108, 0.4)' : 'rgba(64, 145, 108, 0.3)',
            })}>
            <View className="items-center">
              {/* Icon */}
              <View className="mb-3">
                <View
                  className="h-14 w-14 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: 'rgba(64, 145, 108, 0.15)',
                    borderWidth: 1,
                    borderColor: 'rgba(82, 183, 136, 0.25)',
                  }}>
                  <Zap size={24} color="#52B788" strokeWidth={2} />
                </View>
              </View>

              {/* Main Text */}
              <Text
                className="mb-2 text-center text-[#E8F4F0]"
                style={{
                  fontSize: 20,
                  fontFamily: 'Poppins_600SemiBold',
                  letterSpacing: 0.3,
                }}>
                Quick Protocol
              </Text>

              {/* Subtitle */}
              <Text
                className="text-center text-[#95B8A8]"
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins_400Regular',
                  lineHeight: 20,
                }}>
                90-second guided exercise
              </Text>
            </View>
          </Pressable>

          {/* Breathing room at bottom */}
          <View style={{ height: 40 }} />
        </View>

        {/* Safe Area Bottom Padding */}
        <View style={{ height: insets.bottom }} />
      </LinearGradient>
    </View>
  );
}
