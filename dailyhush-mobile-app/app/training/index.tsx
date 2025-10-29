/**
 * DailyHush - F.I.R.E. Training Modules
 * Clean emerald design matching home page
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable, ScrollView } from 'react-native';
import { ArrowLeft, Check, Lock, Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { useUser } from '@/store/useStore';
import { FireModule } from '@/types';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface ModuleCardProps {
  module: FireModule;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  onPress: () => void;
}

function ModuleCard({ module, title, description, duration, completed, locked, onPress }: ModuleCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={locked}
      className={`rounded-2xl p-5 mb-4 ${locked ? 'opacity-50' : 'active:opacity-90'}`}
      style={{ backgroundColor: colors.background.secondary }}
    >
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold flex-1" style={{ color: colors.text.primary }}>
          {title}
        </Text>
        {completed && (
          <View className="p-1.5 rounded-full" style={{ backgroundColor: colors.background.tertiary }}>
            <Check size={16} color={colors.emerald[100]} strokeWidth={3} />
          </View>
        )}
        {locked && (
          <View className="p-1.5 rounded-full" style={{ backgroundColor: colors.background.border }}>
            <Lock size={16} color={colors.text.secondary} strokeWidth={2} />
          </View>
        )}
      </View>

      <Text className="text-sm leading-relaxed mb-3" style={{ color: colors.text.secondary }}>
        {description}
      </Text>

      <View className="flex-row items-center">
        <Clock size={14} color={colors.text.secondary} strokeWidth={2} />
        <Text className="text-xs ml-1.5" style={{ color: colors.text.secondary }}>
          {duration}
        </Text>
      </View>
    </Pressable>
  );
}

export default function Training() {
  const router = useRouter();
  const user = useUser();

  const fireProgress = user?.fire_progress || {
    focus: false,
    interrupt: false,
    reframe: false,
    execute: false,
  };

  const modules = [
    {
      module: FireModule.FOCUS,
      title: 'Module 1: FOCUS',
      description: 'Understanding your rumination pattern. Learn why you spiral and what triggers it.',
      duration: '15 minutes',
      completed: fireProgress.focus,
      locked: false,
    },
    {
      module: FireModule.INTERRUPT,
      title: 'Module 2: INTERRUPT',
      description: 'Stop the loop before it starts. Master the 10-second window technique.',
      duration: '15 minutes',
      completed: fireProgress.interrupt,
      locked: !fireProgress.focus,
    },
    {
      module: FireModule.REFRAME,
      title: 'Module 3: REFRAME',
      description: 'Change the narrative. Transform shame spirals into growth mindset.',
      duration: '20 minutes',
      completed: fireProgress.reframe,
      locked: !fireProgress.interrupt,
    },
    {
      module: FireModule.EXECUTE,
      title: 'Module 4: EXECUTE',
      description: 'Build new patterns. Create your 30-day spiral reduction plan.',
      duration: '20 minutes',
      completed: fireProgress.execute,
      locked: !fireProgress.reframe,
    },
  ];

  const handleModulePress = (module: FireModule, locked: boolean) => {
    if (locked) return;
    Haptics.selectionAsync();
    router.push(`/training/${module}` as any);
  };

  const completedCount = Object.values(fireProgress).filter(Boolean).length;
  const progress = (completedCount / 4) * 100;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing['3xl'],
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* Progress */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm" style={{ color: colors.text.secondary }}>
              Your Progress
            </Text>
            <Text className="text-sm" style={{ color: colors.text.secondary }}>
              {completedCount}/4 Modules
            </Text>
          </View>

          <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.background.border }}>
            <View
              className="h-full"
              style={{
                width: `${progress}%`,
                backgroundColor: colors.button.primary,
              }}
            />
          </View>
        </View>

        {/* Modules */}
        {modules.map((module) => (
          <ModuleCard
            key={module.module}
            {...module}
            onPress={() => handleModulePress(module.module, module.locked)}
          />
        ))}

        {/* Certification */}
        {completedCount === 4 && (
          <View
            className="rounded-2xl p-6 mt-4 items-center border"
            style={{
              backgroundColor: colors.background.tertiary,
              borderColor: colors.button.primary + '33', // 20% opacity
            }}
          >
            <Text className="text-5xl mb-3">🎓</Text>
            <Text className="text-xl font-bold text-center mb-2" style={{ color: colors.text.primary }}>
              F.I.R.E. Trained!
            </Text>
            <Text className="text-sm text-center leading-relaxed" style={{ color: colors.emerald[100] }}>
              You&apos;ve completed all modules. You now have advanced techniques unlocked.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
