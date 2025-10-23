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
      className={`bg-[#1A4D3C] rounded-2xl p-5 mb-4 ${locked ? 'opacity-50' : 'active:opacity-90'}`}
    >
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[#E8F4F0] text-lg font-bold flex-1">
          {title}
        </Text>
        {completed && (
          <View className="bg-[#2D6A4F] p-1.5 rounded-full">
            <Check size={16} color="#B7E4C7" strokeWidth={3} />
          </View>
        )}
        {locked && (
          <View className="bg-[#1A2E26] p-1.5 rounded-full">
            <Lock size={16} color="#95B8A8" strokeWidth={2} />
          </View>
        )}
      </View>

      <Text className="text-[#95B8A8] text-sm leading-relaxed mb-3">
        {description}
      </Text>

      <View className="flex-row items-center">
        <Clock size={14} color="#95B8A8" strokeWidth={2} />
        <Text className="text-[#95B8A8] text-xs ml-1.5">
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
    <View className="flex-1 bg-[#0A1612]">
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* Progress */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-[#95B8A8] text-sm">
              Your Progress
            </Text>
            <Text className="text-[#95B8A8] text-sm">
              {completedCount}/4 Modules
            </Text>
          </View>

          <View className="h-2 bg-[#1A2E26] rounded-full overflow-hidden">
            <View
              className="h-full bg-[#40916C]"
              style={{ width: `${progress}%` }}
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
          <View className="bg-[#2D6A4F] rounded-2xl p-6 mt-4 items-center border border-[#40916C]/30">
            <Text className="text-5xl mb-3">🎓</Text>
            <Text className="text-[#E8F4F0] text-xl font-bold text-center mb-2">
              F.I.R.E. Trained!
            </Text>
            <Text className="text-[#B7E4C7] text-sm text-center leading-relaxed">
              You've completed all modules. You now have advanced techniques unlocked.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
