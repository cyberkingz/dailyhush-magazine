/**
 * DailyHush - Module 3: REFRAME
 * Transform shame spirals into growth mindset
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, ArrowRight, RefreshCcw } from 'lucide-react-native';
import { debounce } from '@/utils/debounce';

import { Text } from '@/components/ui/text';
import { ContentCard } from '@/components/training/ContentCard';
import { InteractiveExercise } from '@/components/training/InteractiveExercise';
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

type Screen =
  | 'welcome'
  | 'distortions'
  | 'perspective'
  | 'compassion'
  | 'practice'
  | 'common-spirals'
  | 'library'
  | 'complete';

export default function ReframeModule() {
  const router = useRouter();
  const user = useUser();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [reframeText, setReframeText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const screens: Screen[] = [
    'welcome',
    'distortions',
    'perspective',
    'compassion',
    'practice',
    'common-spirals',
    'library',
    'complete',
  ];

  const currentIndex = screens.indexOf(currentScreen);
  const progress = currentIndex + 1;

  const commonShameSpirals = [
    {
      spiral: `"I'm so stupid for saying that"`,
      reframe: `"I'm learning what works in conversations"`,
    },
    {
      spiral: `"Everyone must think I'm incompetent"`,
      reframe: `"I made one mistake. That doesn't define me"`,
    },
    {
      spiral: `"I always mess things up"`,
      reframe: `"I'm noticing a pattern I can change"`,
    },
    {
      spiral: `"I'll never be good enough"`,
      reframe: `"I'm growing. Progress isn't perfection"`,
    },
  ];

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nextIndex = currentIndex + 1;
    if (nextIndex < screens.length) {
      setCurrentScreen(screens[nextIndex]);
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

  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.user_id) {
        setIsLoading(false);
        return;
      }

      const { data } = await loadModuleProgress(user.user_id, FireModule.REFRAME);

      if (data) {
        if (data.currentScreen && data.currentScreen !== 'complete') {
          setCurrentScreen(data.currentScreen as Screen);
        }

        if (data.reframeData?.reframeText) {
          setReframeText(data.reframeData.reframeText);
        }
      }

      setIsLoading(false);
    };

    loadProgress();
  }, [user?.user_id]);

  // Create stable debounced save function using ref to avoid dependency issues
  const debouncedSaveRef = useRef<((screen: Screen, text: string) => void) | null>(null);

  if (!debouncedSaveRef.current) {
    debouncedSaveRef.current = debounce(async (screen: Screen, text: string) => {
      if (!user?.user_id) return;

      await saveModuleProgress(user.user_id, FireModule.REFRAME, {
        currentScreen: screen,
        reframeData: {
          reframeText: text,
        },
      });
    }, timing.debounce.save);
  }

  // Auto-save progress when screen or text changes (debounced)
  useEffect(() => {
    if (isLoading || !user?.user_id) return;

    debouncedSaveRef.current!(currentScreen, reframeText);
  }, [currentScreen, reframeText, isLoading]);

  // Scroll to top when screen changes
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentScreen]);

  // Show loading state while loading saved progress
  if (isLoading) {
    return <ModuleLoading moduleTitle="Module 3: REFRAME" />;
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
            Module 3: REFRAME
          </Text>

          <View className="w-10" />
        </View>

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
              Shame vs Growth
            </Text>

            <ContentCard
              body="You can FOCUS on your pattern.

You can INTERRUPT the spiral.

But there's still a voice:

'I shouldn't have to do this.'
'Why am I like this?'
'Everyone else has it together.'"
            />

            <Text className="text-base leading-relaxed" style={{ color: colors.text.secondary }}>
              That's the shame spiral.
            </Text>

            <Text className="text-lg font-semibold" style={{ color: colors.text.primary }}>
              And it's killing your progress.
            </Text>

            <KeyTakeaway
              message="This module teaches you to catch shame thoughts and replace them with growth thoughts.

Not toxic positivity. Not lies.

Just... truth."
            />
          </View>
        )}

        {/* Screen 2: Distortions */}
        {currentScreen === 'distortions' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              Cognitive Distortions
            </Text>

            <ContentCard
              heading="All-or-Nothing Thinking"
              body={`"I messed up once, so I'm a failure"

Reality: One mistake doesn't define you.`}
            />

            <ContentCard
              heading="Mind Reading"
              body={`"They definitely think I'm weird"

Reality: You don't know what they think. You're ruminating on assumptions.`}
            />

            <ContentCard
              heading="Catastrophizing"
              body={`"This will ruin everything"

Reality: Most outcomes aren't as bad as the spiral predicts.`}
            />

            <KeyTakeaway
              message="Your rumination isn't reality. It's a distortion.

When you recognize the distortion, you take away its power."
            />
          </View>
        )}

        {/* Screen 3: Perspective Shift */}
        {currentScreen === 'perspective' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              Reframing Technique #1: Perspective Shift
            </Text>

            <ContentCard
              icon={<RefreshCcw size={24} color={colors.lime[500]} strokeWidth={2} />}
              heading="The Formula"
              body="Shame thought → Evidence → Reframe

Example:
Shame: 'I always say the wrong thing'
Evidence: I've had successful conversations
Reframe: 'I'm learning what works'"
            />

            <View
              className="rounded-2xl p-5"
              style={{
                borderWidth: 1,
                borderColor: colors.lime[500],
                backgroundColor: colors.lime[600],
              }}>
              <Text className="mb-3 text-base font-semibold" style={{ color: colors.background.primary }}>
                Ask yourself:
              </Text>
              <Text className="text-base leading-relaxed" style={{ color: colors.background.primary }}>
                • Is this thought 100% true?{'\n\n'}• What evidence contradicts it?{'\n\n'}• What
                would I tell a friend?{'\n\n'}• What's a more balanced view?
              </Text>
            </View>

            <Text className="text-center text-base italic" style={{ color: colors.text.secondary }}>
              You're not lying to yourself. You're telling the FULL truth, not just the shame
              version.
            </Text>
          </View>
        )}

        {/* Screen 4: Compassion */}
        {currentScreen === 'compassion' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              Reframing Technique #2: Self-Compassion
            </Text>

            <ContentCard
              body="When you ruminate, you're already suffering.

Adding shame on top doesn't help. It makes it worse."
            />

            <View
              className="rounded-2xl p-5"
              style={{
                borderWidth: 1,
                borderColor: colors.background.border,
                backgroundColor: colors.background.secondary,
              }}>
              <Text className="mb-3 text-base font-semibold" style={{ color: colors.text.primary }}>
                The Shame Layer:
              </Text>
              <Text className="text-base leading-relaxed text-[#DC2626]">
                ❌ "I shouldn't be ruminating"
                {'\n\n'}❌ "Why can't I just stop?"
                {'\n\n'}❌ "Everyone else is fine"
              </Text>
            </View>

            <View
              className="rounded-2xl p-5"
              style={{
                borderWidth: 1,
                borderColor: colors.lime[500],
                backgroundColor: colors.lime[600],
              }}>
              <Text className="mb-3 text-base font-semibold" style={{ color: colors.background.primary }}>
                The Compassion Reframe:
              </Text>
              <Text className="text-base leading-relaxed" style={{ color: colors.background.primary }}>
                ✓ "This is hard. It's okay that it's hard"
                {'\n\n'}✓ "I'm doing my best"
                {'\n\n'}✓ "Millions of people struggle with this"
              </Text>
            </View>

            <KeyTakeaway message="Self-compassion isn't self-pity. It's recognizing that struggle is part of being human." />
          </View>
        )}

        {/* Screen 5: Practice */}
        {currentScreen === 'practice' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              Practice: Reframe Your Spiral
            </Text>

            <Text className="text-base" style={{ color: colors.text.secondary }}>
              Think of a recent rumination. Write the shame thought, then reframe it:
            </Text>

            <InteractiveExercise
              emoji="✍️"
              title="Your Reframe"
              prompt="Example:
Shame: 'I'm such an idiot for that mistake'
Reframe: 'I'm learning. One mistake doesn't define my competence'

Now you try:"
              onComplete={setReframeText}
              minLength={15}
              maxLength={300}
            />

            <KeyTakeaway
              message="The more you practice reframing, the faster it becomes automatic.

You're literally rewiring your brain."
            />
          </View>
        )}

        {/* Screen 6: Common Spirals */}
        {currentScreen === 'common-spirals' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              Common Shame Spirals & Reframes
            </Text>

            <Text className="text-base" style={{ color: colors.text.secondary }}>
              Here are reframes for the most common rumination patterns:
            </Text>

            {commonShameSpirals.map((item, index) => (
              <View
                key={index}
                className="rounded-2xl p-5"
                style={{
                  borderWidth: 1,
                  borderColor: colors.background.border,
                  backgroundColor: colors.background.secondary,
                }}>
                <View className="mb-3">
                  <Text className="mb-1 text-xs" style={{ color: colors.text.secondary }}>
                    Shame:
                  </Text>
                  <Text className="text-base text-[#DC2626]">{item.spiral}</Text>
                </View>

                <View className="my-3 h-px" style={{ backgroundColor: colors.lime[500] + '30' }} />

                <View>
                  <Text className="mb-1 text-xs" style={{ color: colors.text.secondary }}>
                    Reframe:
                  </Text>
                  <Text className="text-base font-semibold" style={{ color: colors.lime[500] }}>
                    {item.reframe}
                  </Text>
                </View>
              </View>
            ))}

            <Text className="text-center text-sm italic" style={{ color: colors.text.secondary }}>
              Screenshot these. Use them when you need them.
            </Text>
          </View>
        )}

        {/* Screen 7: Library */}
        {currentScreen === 'library' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              Your Personal Reframe Library
            </Text>

            <ContentCard
              heading="Build Your Collection"
              body="Every time you successfully reframe a shame thought, save it.

Over time, you'll have a library of YOUR reframes for YOUR specific patterns."
            />

            <View
              className="rounded-2xl p-5"
              style={{
                borderWidth: 1,
                borderColor: colors.lime[500],
                backgroundColor: colors.lime[600],
              }}>
              <Text className="mb-3 text-base font-semibold" style={{ color: colors.background.primary }}>
                How to use this:
              </Text>
              <Text className="text-base leading-relaxed" style={{ color: colors.background.primary }}>
                1. Catch the shame thought
                {'\n\n'}2. Pull up your library
                {'\n\n'}3. Find a similar reframe
                {'\n\n'}4. Repeat it until it sticks
              </Text>
            </View>

            <Text className="text-center text-base" style={{ color: colors.text.secondary }}>
              The pattern you repeat becomes your default.
            </Text>

            <Text className="text-center text-lg font-semibold" style={{ color: colors.text.primary }}>
              Right now, shame is your default.
            </Text>

            <Text className="text-center text-base" style={{ color: colors.text.secondary }}>
              After 30 days of reframing, growth becomes your default.
            </Text>
          </View>
        )}

        {/* Screen 8: Complete */}
        {currentScreen === 'complete' && (
          <ModuleComplete
            moduleTitle="Module 3: REFRAME"
            module={FireModule.REFRAME}
            keyLearnings={[
              'Cognitive distortions vs reality',
              'Perspective shift technique',
              'Self-compassion as a reframe tool',
              'Your personal reframe library',
            ]}
            nextModuleTitle="Module 4: EXECUTE"
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
            className="flex-row items-center justify-center rounded-2xl active:opacity-90"
            style={{
              backgroundColor: colors.button.primary,
              height: spacing.button.height,
            }}>
            <Text className="mr-2 text-lg font-semibold" style={{ color: colors.button.primaryText }}>
              Continue
            </Text>
            <ArrowRight size={20} color={colors.button.primaryText} strokeWidth={2} />
          </Pressable>
        </View>
      )}
    </View>
  );
}
