/**
 * DailyHush - Module 1: FOCUS
 * Understanding rumination patterns and triggers
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react-native';
import { debounce } from '@/utils/debounce';

import { Text } from '@/components/ui/text';
import { ContentCard } from '@/components/training/ContentCard';
import { KeyTakeaway } from '@/components/training/KeyTakeaway';
import { ProgressIndicator } from '@/components/training/ProgressIndicator';
import { ModuleComplete } from '@/components/training/ModuleComplete';
import { ModuleLoading } from '@/components/training/ModuleLoading';
import { FireModule } from '@/types';
import { useUser } from '@/store/useStore';
import { saveModuleProgress, loadModuleProgress } from '@/services/training';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { timing } from '@/constants/timing';
import { useAnalytics } from '@/utils/analytics';

const isFocusDebugEnabled = process.env.EXPO_PUBLIC_FIRE_DEBUG === 'true';
const focusLog = (...messages: unknown[]) => {
  if (isFocusDebugEnabled) {
    console.log('[FOCUS]', ...messages);
  }
};

type Screen =
  | 'welcome'
  | 'mechanism'
  | 'promise'
  | 'education'
  | 'triggers'
  | 'categories'
  | 'trigger-map'
  | 'complete';

export default function FocusModule() {
  const router = useRouter();
  const user = useUser();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const analytics = useAnalytics();
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const screens: Screen[] = [
    'welcome',
    'mechanism',
    'promise',
    'education',
    'triggers',
    'categories',
    'trigger-map',
    'complete',
  ];

  const currentIndex = screens.indexOf(currentScreen);
  const progress = currentIndex + 1;

  const triggers = [
    "Someone didn't respond to my message",
    'I said something I regret',
    'Someone criticized me (or I think they did)',
    'I made a mistake at work',
    'Health concerns (real or imagined)',
    'Money worries',
    'Relationship conflict',
  ];

  const handleNext = async () => {
    try {
      focusLog('handleNext called', { currentScreen, nextIndex: currentIndex + 1 });
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const nextIndex = currentIndex + 1;
      if (nextIndex < screens.length) {
        focusLog('Navigating to screen', screens[nextIndex]);
        setCurrentScreen(screens[nextIndex]);
      } else {
        focusLog('Already at last screen');
      }
    } catch (error) {
      console.error('[FOCUS] Error in handleNext:', error);
    }
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentScreen(screens[prevIndex]);
    } else {
      router.back();
    }
  };

  const handleComplete = () => {
    router.back();
  };

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]
    );
  };

  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.user_id) {
        setIsLoading(false);
        return;
      }

      const { data } = await loadModuleProgress(user.user_id, FireModule.FOCUS);

      if (data) {
        // Resume from saved screen
        if (data.currentScreen && data.currentScreen !== 'complete') {
          setCurrentScreen(data.currentScreen as Screen);
        }

        // Load saved triggers
        if (data.focusData?.selectedTriggers) {
          setSelectedTriggers(data.focusData.selectedTriggers);
        }
      } else {
        // Track training start only if this is a new session (no saved progress)
        analytics.track('TRAINING_STARTED', {
          feature_name: FireModule.FOCUS,
        });
      }

      setIsLoading(false);
    };

    loadProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  // Create stable debounced save function using ref to avoid dependency issues
  const debouncedSaveRef = useRef<((screen: Screen, triggers: string[]) => void) | null>(null);
  const userIdRef = useRef(user?.user_id);

  // Update user ID ref when it changes
  useEffect(() => {
    userIdRef.current = user?.user_id;
  }, [user?.user_id]);

  // Initialize debounced save function once
  if (!debouncedSaveRef.current) {
    debouncedSaveRef.current = debounce(async (screen: Screen, triggers: string[]) => {
      focusLog('Debounced save executing', { screen, triggerCount: triggers.length });
      const userId = userIdRef.current;
      if (!userId) {
        focusLog('No user_id, skipping save');
        return;
      }

      focusLog('Saving progress for user', userId);
      const result = await saveModuleProgress(userId, FireModule.FOCUS, {
        currentScreen: screen,
        focusData: {
          selectedTriggers: triggers,
        },
      });
      focusLog('Save result', result);
    }, timing.debounce.save);
  }

  // Auto-save progress when screen or selections change (debounced)
  useEffect(() => {
    focusLog('Auto-save effect triggered', {
      isLoading,
      userId: user?.user_id,
      currentScreen,
      selectedTriggersCount: selectedTriggers.length,
    });
    if (isLoading || !user?.user_id) {
      focusLog('Skipping auto-save - loading or no user');
      return;
    }

    focusLog('Calling debounced save');
    debouncedSaveRef.current!(currentScreen, selectedTriggers);
  }, [currentScreen, selectedTriggers, isLoading]);

  // Scroll to top when screen changes
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentScreen]);

  // Show loading state while loading saved progress
  if (isLoading) {
    return <ModuleLoading moduleTitle="Module 1: FOCUS" />;
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />

      {/* Header */}
      <View className="px-5 pb-3" style={{ paddingTop: insets.top + spacing.safeArea.top }}>
        <View className="mb-4 flex-row items-center justify-between">
          <Pressable onPress={handleBack} className="p-2 active:opacity-70">
            <ArrowLeft size={24} color={colors.text.primary} strokeWidth={2} />
          </Pressable>

          <Text className="text-base font-semibold" style={{ color: colors.text.primary }}>
            Module 1: FOCUS
          </Text>

          <View className="w-10" />
        </View>

        {/* Progress Indicator */}
        {currentScreen !== 'complete' && (
          <ProgressIndicator current={progress} total={screens.length} />
        )}
      </View>

      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.button.height + spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        {/* Screen 1: Welcome */}
        {currentScreen === 'welcome' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              Your Rumination Has a Pattern
            </Text>

            <Text className="text-base leading-relaxed" style={{ color: colors.text.secondary }}>
              And we're going to decode it together.
            </Text>

            <ContentCard
              body="Think about the last time you spiraled. Really spiraled.

What started it?

(Most people can't answer this. They just know they're suddenly in the loop.)"
            />

            <Text className="text-lg font-semibold" style={{ color: colors.text.primary }}>
              That's about to change.
            </Text>
          </View>
        )}

        {/* Screen 2: Mechanism */}
        {currentScreen === 'mechanism' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              The Trigger-Spiral Gap
            </Text>

            <ContentCard
              body="Between the moment something bothers you and the moment you start looping...

There's a gap.

Usually 3-10 seconds."
            />

            <Text className="text-base leading-relaxed" style={{ color: colors.text.secondary }}>
              Right now, you skip over it. Your brain goes straight from:
            </Text>

            <View
              className="rounded-2xl p-5"
              style={{
                borderWidth: 1,
                borderColor: colors.lime[600] + '30',
                backgroundColor: colors.background.secondary,
              }}>
              <Text className="text-base leading-relaxed" style={{ color: colors.text.primary }}>
                "He didn't text back" →{'\n'}
                "He hates me" →{'\n'}
                "I'm unlovable" →{'\n'}2 hours of hell.
              </Text>
            </View>

            <Text className="text-lg font-semibold" style={{ color: colors.text.primary }}>
              But what if you could catch yourself IN that gap?
            </Text>
          </View>
        )}

        {/* Screen 3: Promise */}
        {currentScreen === 'promise' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              By the end of this module, you will:
            </Text>

            <View className="gap-3">
              <View className="flex-row items-start">
                <Text
                  className="mr-3 text-xl"
                  style={{ lineHeight: 28, paddingTop: 2, color: colors.lime[500] }}>
                  ✓
                </Text>
                <Text className="flex-1 text-base leading-relaxed" style={{ color: colors.text.primary }}>
                  Know your #1 rumination trigger
                </Text>
              </View>

              <View className="flex-row items-start">
                <Text
                  className="mr-3 text-xl"
                  style={{ lineHeight: 28, paddingTop: 2, color: colors.lime[500] }}>
                  ✓
                </Text>
                <Text className="flex-1 text-base leading-relaxed" style={{ color: colors.text.primary }}>
                  Recognize it in real-time
                </Text>
              </View>

              <View className="flex-row items-start">
                <Text
                  className="mr-3 text-xl"
                  style={{ lineHeight: 28, paddingTop: 2, color: colors.lime[500] }}>
                  ✓
                </Text>
                <Text className="flex-1 text-base leading-relaxed" style={{ color: colors.text.primary }}>
                  Understand why YOUR brain loops (it's different for everyone)
                </Text>
              </View>
            </View>

            <KeyTakeaway message="This isn't theory. This is your map." />
          </View>
        )}

        {/* Screen 4: Education */}
        {currentScreen === 'education' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              Why Your Brain Spirals
            </Text>

            <ContentCard
              heading="Your Default Mode Network"
              body="Your default mode network (DMN) is designed to spot threats.

10,000 years ago: Lion in the grass.
Today: Awkward silence in a meeting."
            />

            <Text className="text-base leading-relaxed" style={{ color: colors.text.secondary }}>
              Your brain can't tell the difference.
            </Text>

            <ContentCard
              variant="highlight"
              body="So it loops on the 'threat' trying to solve it. Except social anxiety doesn't have a solution.

That's why the loop never ends.

Until you interrupt it."
            />
          </View>
        )}

        {/* Screen 5: Triggers */}
        {currentScreen === 'triggers' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              Your Rumination Triggers
            </Text>

            <Text className="text-base" style={{ color: colors.text.secondary }}>
              Check ALL that apply:
            </Text>

            <View className="gap-3">
              {triggers.map((trigger) => (
                <Pressable
                  key={trigger}
                  onPress={() => {
                    toggleTrigger(trigger);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className="flex-row items-center rounded-2xl p-4"
                  style={{
                    backgroundColor: selectedTriggers.includes(trigger)
                      ? colors.lime[600]
                      : colors.background.secondary,
                  }}>
                  <View
                    className="mr-3 h-6 w-6 items-center justify-center rounded"
                    style={{
                      borderWidth: 2,
                      borderColor: selectedTriggers.includes(trigger)
                        ? colors.background.primary
                        : colors.text.secondary,
                      backgroundColor: selectedTriggers.includes(trigger)
                        ? colors.background.primary
                        : 'transparent',
                    }}>
                    {selectedTriggers.includes(trigger) && (
                      <Check size={16} color={colors.lime[500]} strokeWidth={3} />
                    )}
                  </View>
                  <Text
                    className="flex-1 text-base"
                    style={{
                      fontWeight: selectedTriggers.includes(trigger) ? '600' : '400',
                      color: selectedTriggers.includes(trigger)
                        ? colors.background.primary
                        : colors.text.primary,
                    }}>
                    {trigger}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text className="text-center text-sm italic" style={{ color: colors.text.secondary }}>
              (Most people check 3-4. That's normal.)
            </Text>
          </View>
        )}

        {/* Screen 6: Categories */}
        {currentScreen === 'categories' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              Here's What You Just Discovered:
            </Text>

            <Text className="text-base leading-relaxed" style={{ color: colors.text.secondary }}>
              Your triggers aren't random.
            </Text>

            <ContentCard
              heading="They fall into 2 categories:"
              body="1. Fear of judgment
2. Fear of loss (health, money, relationships)"
            />

            <KeyTakeaway
              title="The Key Insight"
              message="The CONTENT of your rumination doesn't matter.

'Did I say the wrong thing?' and 'Am I getting sick?' are the same spiral.

Different story. Same mechanism.

And that means: One solution fixes both."
            />
          </View>
        )}

        {/* Screen 7: Trigger Map */}
        {currentScreen === 'trigger-map' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              Your Trigger Map
            </Text>

            <Text className="text-base leading-relaxed" style={{ color: colors.text.secondary }}>
              We've created your personalized trigger map.
            </Text>

            <View
              className="rounded-2xl p-5"
              style={{
                borderWidth: 1,
                borderColor: colors.lime[500],
                backgroundColor: colors.lime[600],
              }}>
              <Text className="mb-4 text-base font-semibold" style={{ color: colors.background.primary }}>
                Your Patterns:
              </Text>

              <View className="gap-3">
                <View>
                  <Text className="mb-1 text-sm" style={{ color: colors.background.primary }}>
                    Common triggers:
                  </Text>
                  <Text className="text-base" style={{ color: colors.background.primary }}>
                    {selectedTriggers.length > 0
                      ? selectedTriggers.slice(0, 3).join(', ')
                      : 'No triggers selected'}
                  </Text>
                </View>

                <View>
                  <Text className="mb-1 text-sm" style={{ color: colors.background.primary }}>
                    Category:
                  </Text>
                  <Text className="text-base" style={{ color: colors.background.primary }}>
                    {selectedTriggers.length > 0 ? 'Fear of judgment & social connection' : '—'}
                  </Text>
                </View>

                <View>
                  <Text className="mb-1 text-sm" style={{ color: colors.background.primary }}>
                    The 10-second window:
                  </Text>
                  <Text className="text-base" style={{ color: colors.background.primary }}>
                    Between trigger and spiral
                  </Text>
                </View>
              </View>
            </View>

            <Text className="text-center text-sm" style={{ color: colors.text.secondary }}>
              Screenshot this. Keep it. Reference it.
            </Text>

            <Text className="text-base leading-relaxed" style={{ color: colors.text.primary }}>
              When you know your pattern, you can interrupt it before it starts.
            </Text>
          </View>
        )}

        {/* Screen 8: Complete */}
        {currentScreen === 'complete' && (
          <ModuleComplete
            moduleTitle="Module 1: FOCUS"
            module={FireModule.FOCUS}
            keyLearnings={[
              'Why your brain spirals (default mode network)',
              'What triggers YOUR specific pattern',
              'The 10-second window between trigger and spiral',
            ]}
            nextModuleTitle="Module 2: INTERRUPT"
            onContinue={handleComplete}
          />
        )}
      </ScrollView>

      {/* Footer - Continue Button */}
      {currentScreen !== 'complete' && (
        <View
          className="absolute bottom-0 left-0 right-0 px-5"
          style={{
            paddingTop: spacing.lg,
            paddingBottom: Math.max(insets.bottom, spacing.safeArea.bottom),
            backgroundColor: colors.background.primary,
          }}>
          <Pressable
            onPress={handleNext}
            disabled={currentScreen === 'triggers' && selectedTriggers.length === 0}
            className="flex-row items-center justify-center rounded-2xl"
            style={{
              height: spacing.button.height,
              backgroundColor:
                currentScreen === 'triggers' && selectedTriggers.length === 0
                  ? colors.button.disabled
                  : colors.button.primary,
              opacity: currentScreen === 'triggers' && selectedTriggers.length === 0 ? 0.5 : 1,
            }}>
            <Text
              className="mr-2 text-lg font-semibold"
              style={{
                color:
                  currentScreen === 'triggers' && selectedTriggers.length === 0
                    ? colors.text.secondary
                    : colors.button.primaryText,
              }}>
              Continue
            </Text>
            <ArrowRight
              size={20}
              color={
                currentScreen === 'triggers' && selectedTriggers.length === 0
                  ? colors.text.secondary
                  : colors.button.primaryText
              }
              strokeWidth={2}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}
