/**
 * DailyHush - Module 4: EXECUTE
 * Build your 30-day spiral reduction plan
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useMemo, useRef } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, ArrowRight, Target, Calendar } from 'lucide-react-native';
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

type Screen =
  | 'welcome'
  | 'habit-stacking'
  | 'routine'
  | 'environment'
  | 'accountability'
  | 'tracking'
  | 'plan-summary'
  | 'complete';

export default function ExecuteModule() {
  const router = useRouter();
  const user = useUser();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedRoutines, setSelectedRoutines] = useState<string[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const screens: Screen[] = [
    'welcome',
    'habit-stacking',
    'routine',
    'environment',
    'accountability',
    'tracking',
    'plan-summary',
    'complete',
  ];

  const currentIndex = screens.indexOf(currentScreen);
  const progress = currentIndex + 1;

  const dailyRoutines = [
    'Morning check-in (2 min)',
    'Midday trigger review',
    'Evening reflection',
    'Pre-bed wind-down',
  ];

  const environmentChanges = [
    'Phone on Do Not Disturb after 9pm',
    'Notification limits for triggering apps',
    'Physical space for breathing exercises',
    'Accountability partner check-ins',
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

  const toggleRoutine = (routine: string) => {
    setSelectedRoutines((prev) =>
      prev.includes(routine) ? prev.filter((r) => r !== routine) : [...prev, routine]
    );
  };

  const toggleEnvironment = (change: string) => {
    setSelectedEnvironment((prev) =>
      prev.includes(change) ? prev.filter((c) => c !== change) : [...prev, change]
    );
  };

  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.user_id) {
        setIsLoading(false);
        return;
      }

      const { data } = await loadModuleProgress(user.user_id, FireModule.EXECUTE);

      if (data) {
        if (data.currentScreen && data.currentScreen !== 'complete') {
          setCurrentScreen(data.currentScreen as Screen);
        }

        if (data.executeData?.selectedRoutines) {
          setSelectedRoutines(data.executeData.selectedRoutines);
        }

        if (data.executeData?.selectedEnvironment) {
          setSelectedEnvironment(data.executeData.selectedEnvironment);
        }
      }

      setIsLoading(false);
    };

    loadProgress();
  }, [user?.user_id]);

  // Create debounced save function (1 second delay)
  const debouncedSave = useMemo(
    () =>
      debounce(async () => {
        if (!user?.user_id) return;

        await saveModuleProgress(user.user_id, FireModule.EXECUTE, {
          currentScreen,
          executeData: {
            selectedRoutines,
            selectedEnvironment,
          },
        });
      }, timing.debounce.save),
    []
  );

  // Auto-save progress when screen or selections change (debounced)
  useEffect(() => {
    if (isLoading || !user?.user_id) return;

    debouncedSave();
  }, [
    currentScreen,
    selectedRoutines,
    selectedEnvironment,
    user?.user_id,
    isLoading,
    debouncedSave,
  ]);

  // Scroll to top when screen changes
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentScreen]);

  // Show loading state while loading saved progress
  if (isLoading) {
    return <ModuleLoading moduleTitle="Module 4: EXECUTE" />;
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
            Module 4: EXECUTE
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
          paddingBottom: spacing['3xl'],
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        {/* Screen 1: Welcome */}
        {currentScreen === 'welcome' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold text-[#E8F4F0]">
              Your 30-Day Spiral Reduction Plan
            </Text>

            <ContentCard
              icon={<Target size={24} color="#52B788" strokeWidth={2} />}
              body="You know your pattern (FOCUS).

You can interrupt it (INTERRUPT).

You can reframe the shame (REFRAME).

Now we build the system that makes this automatic."
            />

            <KeyTakeaway
              message="Research shows it takes 21-30 days to build a new habit.

This module creates your 30-day plan to make rumination interruption your default response."
            />

            <Text className="text-center text-base italic text-[#95B8A8]">
              Most people reduce rumination by 60-80% in 30 days.
            </Text>
          </View>
        )}

        {/* Screen 2: Habit Stacking */}
        {currentScreen === 'habit-stacking' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold text-[#E8F4F0]">Habit Stacking</Text>

            <ContentCard
              heading="The Formula"
              body="After [EXISTING HABIT], I will [NEW HABIT].

Example:
After I brush my teeth (morning), I will do a 2-minute trigger check.

After I close my laptop (evening), I will do 5 deep breaths."
            />

            <View className="rounded-2xl border border-[#40916C] bg-[#2D6A4F] p-5">
              <Text className="mb-3 text-base font-semibold text-[#E8F4F0]">Why This Works:</Text>
              <Text className="text-base leading-relaxed text-[#E8F4F0]">
                Your brain already has grooves for existing habits.
                {'\n\n'}
                By stacking new habits on top, you use those existing grooves.
                {'\n\n'}
                No willpower required. Just consistency.
              </Text>
            </View>

            <KeyTakeaway message="Don't try to build new habits from scratch. Stack them on routines you already do." />
          </View>
        )}

        {/* Screen 3: Routine */}
        {currentScreen === 'routine' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold text-[#E8F4F0]">Daily Interrupt Routine</Text>

            <Text className="text-base text-[#95B8A8]">
              Choose the routines that fit YOUR schedule:
            </Text>

            <View className="gap-3">
              {dailyRoutines.map((routine) => (
                <Pressable
                  key={routine}
                  onPress={() => {
                    toggleRoutine(routine);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={`flex-row items-center rounded-2xl p-4 ${
                    selectedRoutines.includes(routine) ? 'bg-[#40916C]' : 'bg-[#1A4D3C]'
                  }`}>
                  <View
                    className={`mr-3 h-5 w-5 rounded border-2 ${
                      selectedRoutines.includes(routine)
                        ? 'border-white bg-white'
                        : 'border-[#95B8A8]'
                    }`}>
                    {selectedRoutines.includes(routine) && (
                      <View className="flex-1 items-center justify-center">
                        <View className="h-3 w-3 bg-[#40916C]" />
                      </View>
                    )}
                  </View>
                  <Text
                    className={`flex-1 text-base ${
                      selectedRoutines.includes(routine)
                        ? 'font-semibold text-white'
                        : 'text-[#E8F4F0]'
                    }`}>
                    {routine}
                  </Text>
                </Pressable>
              ))}
            </View>

            <ContentCard
              variant="highlight"
              heading="Recommended Minimum"
              body="Pick at least 2: one in the morning, one in the evening.

Morning = preventive (catch triggers early)
Evening = reflective (learn from the day)"
            />
          </View>
        )}

        {/* Screen 4: Environment */}
        {currentScreen === 'environment' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold text-[#E8F4F0]">
              Trigger Environment Modification
            </Text>

            <ContentCard
              body="You can't willpower your way through a bad environment.

If your phone wakes you at 3am with notifications, you'll ruminate.

If you doom-scroll before bed, you'll ruminate.

Change the environment, change the outcome."
            />

            <Text className="text-base text-[#95B8A8]">
              Choose environment changes you'll commit to:
            </Text>

            <View className="gap-3">
              {environmentChanges.map((change) => (
                <Pressable
                  key={change}
                  onPress={() => {
                    toggleEnvironment(change);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={`flex-row items-center rounded-2xl p-4 ${
                    selectedEnvironment.includes(change) ? 'bg-[#40916C]' : 'bg-[#1A4D3C]'
                  }`}>
                  <View
                    className={`mr-3 h-5 w-5 rounded border-2 ${
                      selectedEnvironment.includes(change)
                        ? 'border-white bg-white'
                        : 'border-[#95B8A8]'
                    }`}>
                    {selectedEnvironment.includes(change) && (
                      <View className="flex-1 items-center justify-center">
                        <View className="h-3 w-3 bg-[#40916C]" />
                      </View>
                    )}
                  </View>
                  <Text
                    className={`flex-1 text-base ${
                      selectedEnvironment.includes(change)
                        ? 'font-semibold text-white'
                        : 'text-[#E8F4F0]'
                    }`}>
                    {change}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Screen 5: Accountability */}
        {currentScreen === 'accountability' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold text-[#E8F4F0]">Accountability System</Text>

            <ContentCard
              heading="Why Accountability Matters"
              body="You're 65% more likely to complete a goal if you have accountability.

Not because someone is judging you.

Because having a witness makes the goal real."
            />

            <View className="rounded-2xl border border-[#40916C] bg-[#2D6A4F] p-5">
              <Text className="mb-3 text-base font-semibold text-[#E8F4F0]">
                Choose Your System:
              </Text>
              <Text className="text-base leading-relaxed text-[#E8F4F0]">
                Option 1: DailyHush streak tracking (built-in)
                {'\n\n'}
                Option 2: Weekly check-ins with a friend
                {'\n\n'}
                Option 3: Private journal (daily log)
                {'\n\n'}
                Option 4: Therapist/coach accountability
              </Text>
            </View>

            <KeyTakeaway
              message="Pick ONE accountability method and commit to 30 days.

That's all. Just 30 days."
            />
          </View>
        )}

        {/* Screen 6: Tracking */}
        {currentScreen === 'tracking' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold text-[#E8F4F0]">Progress Tracking</Text>

            <ContentCard
              icon={<Calendar size={24} color="#52B788" strokeWidth={2} />}
              heading="Track These 3 Metrics"
              body="1. Spiral Count: How many times did you spiral today?

2. Interrupt Success: How many did you catch?

3. Average Duration: How long did spirals last?"
            />

            <View className="rounded-2xl border border-[#40916C]/20 bg-[#1A4D3C] p-5">
              <Text className="mb-3 text-base font-semibold text-[#E8F4F0]">
                What Success Looks Like:
              </Text>
              <Text className="text-base leading-relaxed text-[#E8F4F0]">
                Week 1: You're noticing spirals (awareness)
                {'\n\n'}
                Week 2: You're catching 30-40% of them
                {'\n\n'}
                Week 3: Duration drops from hours to minutes
                {'\n\n'}
                Week 4: Interrupt becomes automatic
              </Text>
            </View>

            <Text className="text-center text-base italic text-[#95B8A8]">
              DailyHush tracks this automatically. Just use the app daily.
            </Text>
          </View>
        )}

        {/* Screen 7: Plan Summary */}
        {currentScreen === 'plan-summary' && (
          <View className="gap-6">
            <Text className="text-2xl font-bold text-[#E8F4F0]">Your 30-Day Plan</Text>

            <View className="rounded-2xl border border-[#40916C] bg-[#2D6A4F] p-5">
              <Text className="mb-4 text-lg font-semibold text-[#E8F4F0]">Plan Summary</Text>

              <View className="gap-4">
                <View>
                  <Text className="mb-1 text-sm text-[#95B8A8]">Daily Routines:</Text>
                  <Text className="text-base text-[#E8F4F0]">
                    {selectedRoutines.length > 0 ? selectedRoutines.join('\n') : 'None selected'}
                  </Text>
                </View>

                <View className="h-px bg-[#40916C]/30" />

                <View>
                  <Text className="mb-1 text-sm text-[#95B8A8]">Environment Changes:</Text>
                  <Text className="text-base text-[#E8F4F0]">
                    {selectedEnvironment.length > 0
                      ? selectedEnvironment.join('\n')
                      : 'None selected'}
                  </Text>
                </View>

                <View className="h-px bg-[#40916C]/30" />

                <View>
                  <Text className="mb-1 text-sm text-[#95B8A8]">Accountability:</Text>
                  <Text className="text-base text-[#E8F4F0]">DailyHush streak tracking</Text>
                </View>
              </View>
            </View>

            <KeyTakeaway
              message="This is YOUR plan. Start tomorrow.

Small, consistent action beats big plans you never execute.

30 days. That's all."
            />

            <Text className="text-center text-base font-semibold text-[#E8F4F0]">
              You've got this.
            </Text>
          </View>
        )}

        {/* Screen 8: Complete */}
        {currentScreen === 'complete' && (
          <ModuleComplete
            moduleTitle="F.I.R.E. Training"
            module={FireModule.EXECUTE}
            keyLearnings={[
              'FOCUS: Your rumination pattern and triggers',
              'INTERRUPT: The 10-second window technique',
              'REFRAME: Shame to growth mindset',
              'EXECUTE: Your 30-day spiral reduction plan',
            ]}
            onContinue={handleComplete}
            showCertification={true}
          />
        )}
      </ScrollView>

      {/* Footer - Continue Button */}
      {currentScreen !== 'complete' && (
        <View
          className="px-5"
          style={{ paddingBottom: Math.max(insets.bottom, spacing.safeArea.bottom) }}>
          <Pressable
            onPress={handleNext}
            className="flex-row items-center justify-center rounded-2xl active:opacity-90"
            style={{
              backgroundColor: colors.button.primary,
              height: spacing.button.height,
            }}>
            <Text className="mr-2 text-lg font-semibold" style={{ color: colors.white }}>
              Continue
            </Text>
            <ArrowRight size={20} color={colors.white} strokeWidth={2} />
          </Pressable>
        </View>
      )}
    </View>
  );
}
