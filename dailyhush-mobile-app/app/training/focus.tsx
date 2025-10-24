/**
 * DailyHush - Module 1: FOCUS
 * Understanding rumination patterns and triggers
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
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
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [reflectionText, setReflectionText] = useState('');
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
    'Someone didn\'t respond to my message',
    'I said something I regret',
    'Someone criticized me (or I think they did)',
    'I made a mistake at work',
    'Health concerns (real or imagined)',
    'Money worries',
    'Relationship conflict',
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

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev =>
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
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

        await saveModuleProgress(user.user_id, FireModule.FOCUS, {
          currentScreen,
          focusData: {
            selectedTriggers,
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
  }, [currentScreen, selectedTriggers, user?.user_id, isLoading, debouncedSave]);

  // Show loading state while loading saved progress
  if (isLoading) {
    return <ModuleLoading moduleTitle="Module 1: FOCUS" />;
  }

  return (
    <View className="flex-1 bg-[#0A1612]">
      <StatusBar style="light" />

      {/* Header */}
      <View className="px-5 pt-5 pb-3">
        <View className="flex-row items-center justify-between mb-4">
          <Pressable
            onPress={handleBack}
            className="p-2 active:opacity-70"
          >
            <ArrowLeft size={24} color="#E8F4F0" strokeWidth={2} />
          </Pressable>

          <Text className="text-[#E8F4F0] text-base font-semibold">
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
              Your Rumination Has a Pattern
            </Text>

            <Text className="text-[#95B8A8] text-base leading-relaxed">
              And we're going to decode it together.
            </Text>

            <ContentCard
              body="Think about the last time you spiraled. Really spiraled.

What started it?

(Most people can't answer this. They just know they're suddenly in the loop.)"
            />

            <Text className="text-[#E8F4F0] text-lg font-semibold">
              That's about to change.
            </Text>
          </View>
        )}

        {/* Screen 2: Mechanism */}
        {currentScreen === 'mechanism' && (
          <View className="gap-6">
            <Text className="text-[#E8F4F0] text-2xl font-bold">
              The Trigger-Spiral Gap
            </Text>

            <ContentCard
              body="Between the moment something bothers you and the moment you start looping...

There's a gap.

Usually 3-10 seconds."
            />

            <Text className="text-[#95B8A8] text-base leading-relaxed">
              Right now, you skip over it. Your brain goes straight from:
            </Text>

            <View className="bg-[#1A4D3C] rounded-2xl p-5 border border-[#40916C]/20">
              <Text className="text-[#E8F4F0] text-base leading-relaxed">
                "He didn't text back" →{'\n'}
                "He hates me" →{'\n'}
                "I'm unlovable" →{'\n'}
                2 hours of hell.
              </Text>
            </View>

            <Text className="text-[#E8F4F0] text-lg font-semibold">
              But what if you could catch yourself IN that gap?
            </Text>
          </View>
        )}

        {/* Screen 3: Promise */}
        {currentScreen === 'promise' && (
          <View className="gap-6">
            <Text className="text-[#E8F4F0] text-2xl font-bold">
              By the end of this module, you will:
            </Text>

            <View className="gap-3">
              <View className="flex-row items-start">
                <Text className="text-[#52B788] text-xl mr-3">✓</Text>
                <Text className="text-[#E8F4F0] text-base flex-1 leading-relaxed">
                  Know your #1 rumination trigger
                </Text>
              </View>

              <View className="flex-row items-start">
                <Text className="text-[#52B788] text-xl mr-3">✓</Text>
                <Text className="text-[#E8F4F0] text-base flex-1 leading-relaxed">
                  Recognize it in real-time
                </Text>
              </View>

              <View className="flex-row items-start">
                <Text className="text-[#52B788] text-xl mr-3">✓</Text>
                <Text className="text-[#E8F4F0] text-base flex-1 leading-relaxed">
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
            <Text className="text-[#E8F4F0] text-2xl font-bold">
              Why Your Brain Spirals
            </Text>

            <ContentCard
              heading="Your Default Mode Network"
              body="Your default mode network (DMN) is designed to spot threats.

10,000 years ago: Lion in the grass.
Today: Awkward silence in a meeting."
            />

            <Text className="text-[#95B8A8] text-base leading-relaxed">
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
            <Text className="text-[#E8F4F0] text-2xl font-bold">
              Your Rumination Triggers
            </Text>

            <Text className="text-[#95B8A8] text-base">
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
                  className={`rounded-2xl p-4 flex-row items-center ${
                    selectedTriggers.includes(trigger)
                      ? 'bg-[#40916C]'
                      : 'bg-[#1A4D3C]'
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded border-2 mr-3 ${
                      selectedTriggers.includes(trigger)
                        ? 'border-white bg-white'
                        : 'border-[#95B8A8]'
                    }`}
                  >
                    {selectedTriggers.includes(trigger) && (
                      <View className="flex-1 items-center justify-center">
                        <View className="w-3 h-3 bg-[#40916C]" />
                      </View>
                    )}
                  </View>
                  <Text
                    className={`text-base flex-1 ${
                      selectedTriggers.includes(trigger)
                        ? 'text-white font-semibold'
                        : 'text-[#E8F4F0]'
                    }`}
                  >
                    {trigger}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text className="text-[#95B8A8] text-sm text-center italic">
              (Most people check 3-4. That's normal.)
            </Text>
          </View>
        )}

        {/* Screen 6: Categories */}
        {currentScreen === 'categories' && (
          <View className="gap-6">
            <Text className="text-[#E8F4F0] text-2xl font-bold">
              Here's What You Just Discovered:
            </Text>

            <Text className="text-[#95B8A8] text-base leading-relaxed">
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
            <Text className="text-[#E8F4F0] text-2xl font-bold">
              Your Trigger Map
            </Text>

            <Text className="text-[#95B8A8] text-base leading-relaxed">
              We've created your personalized trigger map.
            </Text>

            <View className="bg-[#2D6A4F] border border-[#40916C] rounded-2xl p-5">
              <Text className="text-[#E8F4F0] text-base font-semibold mb-4">
                Your Patterns:
              </Text>

              <View className="gap-3">
                <View>
                  <Text className="text-[#95B8A8] text-sm mb-1">
                    Common triggers:
                  </Text>
                  <Text className="text-[#E8F4F0] text-base">
                    {selectedTriggers.length > 0
                      ? selectedTriggers.slice(0, 3).join(', ')
                      : 'No triggers selected'}
                  </Text>
                </View>

                <View>
                  <Text className="text-[#95B8A8] text-sm mb-1">
                    Category:
                  </Text>
                  <Text className="text-[#E8F4F0] text-base">
                    {selectedTriggers.length > 0
                      ? 'Fear of judgment & social connection'
                      : '—'}
                  </Text>
                </View>

                <View>
                  <Text className="text-[#95B8A8] text-sm mb-1">
                    The 10-second window:
                  </Text>
                  <Text className="text-[#E8F4F0] text-base">
                    Between trigger and spiral
                  </Text>
                </View>
              </View>
            </View>

            <Text className="text-[#95B8A8] text-sm text-center">
              Screenshot this. Keep it. Reference it.
            </Text>

            <Text className="text-[#E8F4F0] text-base leading-relaxed">
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
        <View className="px-5 pb-5">
          <Pressable
            onPress={handleNext}
            disabled={currentScreen === 'triggers' && selectedTriggers.length === 0}
            className={`h-14 rounded-2xl flex-row items-center justify-center ${
              currentScreen === 'triggers' && selectedTriggers.length === 0
                ? 'bg-[#1A2E26] opacity-50'
                : 'bg-[#40916C] active:opacity-90'
            }`}
          >
            <Text className={`text-lg font-semibold mr-2 ${
              currentScreen === 'triggers' && selectedTriggers.length === 0
                ? 'text-[#95B8A8]'
                : 'text-white'
            }`}>
              Continue
            </Text>
            <ArrowRight size={20} color={currentScreen === 'triggers' && selectedTriggers.length === 0 ? '#95B8A8' : '#FFFFFF'} strokeWidth={2} />
          </Pressable>
        </View>
      )}
    </View>
  );
}
