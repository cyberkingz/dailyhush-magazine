/**
 * DailyHush - Module 2: INTERRUPT
 * Master the 10-second window technique
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react-native';
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

type Screen =
  | 'welcome'
  | 'early-warning'
  | 'physical'
  | 'mental'
  | 'scenario1'
  | 'scenario2'
  | 'warning-system'
  | 'complete';

export default function InterruptModule() {
  const router = useRouter();
  const user = useUser();
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedPhysical, setSelectedPhysical] = useState<string[]>([]);
  const [selectedMental, setSelectedMental] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const screens: Screen[] = [
    'welcome',
    'early-warning',
    'physical',
    'mental',
    'scenario1',
    'scenario2',
    'warning-system',
    'complete',
  ];

  const currentIndex = screens.indexOf(currentScreen);
  const progress = currentIndex + 1;

  const physicalSigns = [
    'Stomach drops / tightness',
    'Heart rate increases',
    'Chest tightness',
    'Jaw clenching',
    'Shoulders tensing',
    'Shallow breathing',
  ];

  const mentalCues = [
    'Replaying conversation',
    'What if... thoughts',
    'Should have / could have',
    'Mind goes blank',
    'Obsessive checking (phone, email)',
    'Imagining worst outcomes',
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

  const togglePhysical = (sign: string) => {
    setSelectedPhysical(prev =>
      prev.includes(sign)
        ? prev.filter(s => s !== sign)
        : [...prev, sign]
    );
  };

  const toggleMental = (cue: string) => {
    setSelectedMental(prev =>
      prev.includes(cue)
        ? prev.filter(c => c !== cue)
        : [...prev, cue]
    );
  };

  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.user_id) {
        setIsLoading(false);
        return;
      }

      const { data } = await loadModuleProgress(user.user_id, FireModule.INTERRUPT);

      if (data) {
        if (data.currentScreen && data.currentScreen !== 'complete') {
          setCurrentScreen(data.currentScreen as Screen);
        }

        if (data.interruptData?.selectedPhysicalSigns) {
          setSelectedPhysical(data.interruptData.selectedPhysicalSigns);
        }

        if (data.interruptData?.selectedMentalCues) {
          setSelectedMental(data.interruptData.selectedMentalCues);
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

        await saveModuleProgress(user.user_id, FireModule.INTERRUPT, {
          currentScreen,
          interruptData: {
            selectedPhysicalSigns: selectedPhysical,
            selectedMentalCues: selectedMental,
          },
        });
      }, 1000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Auto-save progress when screen or selections change (debounced)
  useEffect(() => {
    if (isLoading || !user?.user_id) return;

    debouncedSave();
  }, [currentScreen, selectedPhysical, selectedMental, user?.user_id, isLoading, debouncedSave]);

  // Show loading state while loading saved progress
  if (isLoading) {
    return <ModuleLoading moduleTitle="Module 2: INTERRUPT" />;
  }

  return (
    <View className="flex-1 bg-[#0A1612]">
      <StatusBar style="light" />

      {/* Header */}
      <View className="px-5 pt-5 pb-3">
        <View className="flex-row items-center justify-between mb-4">
          <Pressable onPress={handleBack} className="p-2 active:opacity-70">
            <ArrowLeft size={24} color="#E8F4F0" strokeWidth={2} />
          </Pressable>

          <Text className="text-[#E8F4F0] text-base font-semibold">
            Module 2: INTERRUPT
          </Text>

          <View className="w-10" />
        </View>

        {currentScreen !== 'complete' && (
          <ProgressIndicator current={progress} total={screens.length} />
        )}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen 1: Welcome */}
        {currentScreen === 'welcome' && (
          <View className="gap-6">
            <Text className="text-[#E8F4F0] text-2xl font-bold">
              The 10-Second Window
            </Text>

            <ContentCard body="You know the pattern now. You know your triggers.

But knowing isn't enough.

You need to catch the spiral BEFORE it starts." />

            <KeyTakeaway message="Between trigger and spiral, there's a 3-10 second window.

This module teaches you to recognize it and use it." />

            <Text className="text-[#95B8A8] text-base leading-relaxed">
              Most people who ruminate spend years trying to stop spirals once
              they've started.
            </Text>

            <Text className="text-[#E8F4F0] text-lg font-semibold">
              That's like trying to stop a train after it leaves the station.
            </Text>

            <Text className="text-[#95B8A8] text-base leading-relaxed">
              Instead, we're going to catch it at the platform.
            </Text>
          </View>
        )}

        {/* Screen 2: Early Warning */}
        {currentScreen === 'early-warning' && (
          <View className="gap-6">
            <Text className="text-[#E8F4F0] text-2xl font-bold">
              Early Warning Signs
            </Text>

            <ContentCard
              heading="Your body knows BEFORE your mind does"
              body="When a trigger happens, your body reacts first.

Stomach drops.
Heart races.
Jaw clenches.

Most people ignore these. You're about to learn to catch them."
            />

            <ContentCard
              variant="highlight"
              icon={<AlertCircle size={24} color="#52B788" strokeWidth={2} />}
              heading="Why this matters"
              body="Your body gives you a 3-10 second head start.

That's your window.

That's when interrupt is easy.

Wait too long, and you're already looping."
            />
          </View>
        )}

        {/* Screen 3: Physical Sensations */}
        {currentScreen === 'physical' && (
          <View className="gap-6">
            <Text className="text-[#E8F4F0] text-2xl font-bold">
              Physical Warning Signs
            </Text>

            <Text className="text-[#95B8A8] text-base">
              Which physical sensations do YOU experience? Check all that apply:
            </Text>

            <View className="gap-3">
              {physicalSigns.map((sign) => (
                <Pressable
                  key={sign}
                  onPress={() => {
                    togglePhysical(sign);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={`rounded-2xl p-4 flex-row items-center ${
                    selectedPhysical.includes(sign)
                      ? 'bg-[#40916C]'
                      : 'bg-[#1A4D3C]'
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded border-2 mr-3 ${
                      selectedPhysical.includes(sign)
                        ? 'border-white bg-white'
                        : 'border-[#95B8A8]'
                    }`}
                  >
                    {selectedPhysical.includes(sign) && (
                      <View className="flex-1 items-center justify-center">
                        <View className="w-3 h-3 bg-[#40916C]" />
                      </View>
                    )}
                  </View>
                  <Text
                    className={`text-base flex-1 ${
                      selectedPhysical.includes(sign)
                        ? 'text-white font-semibold'
                        : 'text-[#E8F4F0]'
                    }`}
                  >
                    {sign}
                  </Text>
                </Pressable>
              ))}
            </View>

            <KeyTakeaway message="Memorize YOUR physical signs. When you feel them, that's your cue." />
          </View>
        )}

        {/* Screen 4: Mental Cues */}
        {currentScreen === 'mental' && (
          <View className="gap-6">
            <Text className="text-[#E8F4F0] text-2xl font-bold">
              Mental Warning Cues
            </Text>

            <Text className="text-[#95B8A8] text-base">
              What mental patterns signal the start of a spiral? Check all that
              apply:
            </Text>

            <View className="gap-3">
              {mentalCues.map((cue) => (
                <Pressable
                  key={cue}
                  onPress={() => {
                    toggleMental(cue);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={`rounded-2xl p-4 flex-row items-center ${
                    selectedMental.includes(cue) ? 'bg-[#40916C]' : 'bg-[#1A4D3C]'
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded border-2 mr-3 ${
                      selectedMental.includes(cue)
                        ? 'border-white bg-white'
                        : 'border-[#95B8A8]'
                    }`}
                  >
                    {selectedMental.includes(cue) && (
                      <View className="flex-1 items-center justify-center">
                        <View className="w-3 h-3 bg-[#40916C]" />
                      </View>
                    )}
                  </View>
                  <Text
                    className={`text-base flex-1 ${
                      selectedMental.includes(cue)
                        ? 'text-white font-semibold'
                        : 'text-[#E8F4F0]'
                    }`}
                  >
                    {cue}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Screen 5: Scenario 1 */}
        {currentScreen === 'scenario1' && (
          <View className="gap-6">
            <Text className="text-[#E8F4F0] text-2xl font-bold">
              Practice Scenario 1
            </Text>

            <ContentCard
              variant="highlight"
              heading="The Setup"
              body="You send a text to a friend.

They don't respond.

2 hours pass."
            />

            <Text className="text-[#E8F4F0] text-lg font-semibold">
              The OLD Way (Missing the window):
            </Text>

            <View className="bg-[#1A4D3C] rounded-2xl p-5 border border-[#DC2626]/40">
              <Text className="text-[#E8F4F0] text-base leading-relaxed">
                ❌ "Did I say something wrong?"
                {'\n\n'}❌ Start replaying the text
                {'\n\n'}❌ Check phone obsessively
                {'\n\n'}❌ 2 hours of spiral
              </Text>
            </View>

            <Text className="text-[#E8F4F0] text-lg font-semibold">
              The NEW Way (Using the window):
            </Text>

            <View className="bg-[#2D6A4F] rounded-2xl p-5 border border-[#40916C]">
              <Text className="text-[#E8F4F0] text-base leading-relaxed">
                ✓ Notice: Stomach drops (physical cue)
                {'\n\n'}✓ Recognize: "This is my pattern"
                {'\n\n'}✓ Interrupt: 5 deep breaths
                {'\n\n'}✓ Move: Do something else
              </Text>
            </View>

            <KeyTakeaway message="The window is in that first stomach drop. That's when you act." />
          </View>
        )}

        {/* Screen 6: Scenario 2 */}
        {currentScreen === 'scenario2' && (
          <View className="gap-6">
            <Text className="text-[#E8F4F0] text-2xl font-bold">
              Practice Scenario 2
            </Text>

            <ContentCard
              variant="highlight"
              heading="The Setup"
              body="You make a mistake in a meeting.

Someone points it out.

Everyone hears."
            />

            <Text className="text-[#E8F4F0] text-lg font-semibold">
              The OLD Way:
            </Text>

            <View className="bg-[#1A4D3C] rounded-2xl p-5 border border-[#DC2626]/40">
              <Text className="text-[#E8F4F0] text-base leading-relaxed">
                ❌ Face gets hot
                {'\n\n'}❌ "Everyone thinks I'm incompetent"
                {'\n\n'}❌ Replay for days
              </Text>
            </View>

            <Text className="text-[#E8F4F0] text-lg font-semibold">
              The NEW Way:
            </Text>

            <View className="bg-[#2D6A4F] rounded-2xl p-5 border border-[#40916C]">
              <Text className="text-[#E8F4F0] text-base leading-relaxed">
                ✓ Notice: Face hot (physical cue)
                {'\n\n'}✓ Catch the thought: "Everyone thinks..."
                {'\n\n'}✓ Interrupt: "That's the pattern"
                {'\n\n'}✓ Ground: Name 5 things you can see
              </Text>
            </View>

            <Text className="text-[#95B8A8] text-base text-center italic">
              You caught it. That's a win.
            </Text>
          </View>
        )}

        {/* Screen 7: Warning System */}
        {currentScreen === 'warning-system' && (
          <View className="gap-6">
            <Text className="text-[#E8F4F0] text-2xl font-bold">
              Your Personal Early Warning System
            </Text>

            <ContentCard
              heading="Your signals:"
              body={`Physical: ${
                selectedPhysical.length > 0
                  ? selectedPhysical.slice(0, 2).join(', ')
                  : 'Body sensations'
              }

Mental: ${
                selectedMental.length > 0
                  ? selectedMental.slice(0, 2).join(', ')
                  : 'Thought patterns'
              }`}
            />

            <KeyTakeaway
              title="Your Interrupt Protocol"
              message="1. Notice the signal (body or mind)
2. Name it: 'This is the pattern'
3. Interrupt with breathing or grounding
4. Move your body or change environment

That's it. Keep it simple."
            />

            <Text className="text-[#95B8A8] text-base text-center">
              The more you practice, the faster you'll catch it.
            </Text>

            <Text className="text-[#E8F4F0] text-base text-center font-semibold">
              Most people go from 2 hours of rumination to 2 minutes in 30 days.
            </Text>
          </View>
        )}

        {/* Screen 8: Complete */}
        {currentScreen === 'complete' && (
          <ModuleComplete
            moduleTitle="Module 2: INTERRUPT"
            module={FireModule.INTERRUPT}
            keyLearnings={[
              'The 10-second window between trigger and spiral',
              'Your physical warning signs (body knows first)',
              'Mental cues that signal spiral start',
              'Interrupt techniques for the critical window',
            ]}
            nextModuleTitle="Module 3: REFRAME"
            onContinue={handleComplete}
          />
        )}
      </ScrollView>

      {/* Footer - Continue Button */}
      {currentScreen !== 'complete' && (
        <View className="px-5 pb-5">
          <Pressable
            onPress={handleNext}
            className="bg-[#40916C] h-14 rounded-2xl flex-row items-center justify-center active:opacity-90"
          >
            <Text className="text-white text-lg font-semibold mr-2">
              Continue
            </Text>
            <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
        </View>
      )}
    </View>
  );
}
