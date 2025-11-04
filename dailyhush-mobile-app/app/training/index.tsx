/**
 * DailyHush - F.I.R.E. Training Modules
 * Clean emerald design matching home page
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Lock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { PageHeader } from '@/components/PageHeader';
import { useUser } from '@/store/useStore';
import { FireModule } from '@/types';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { brandFonts } from '@/constants/profileTypography';

interface ModuleCardProps {
  module: FireModule;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  onPress: () => void;
}

function ModuleCard({
  module,
  title,
  subtitle,
  description,
  duration,
  completed,
  locked,
  onPress,
}: ModuleCardProps) {
  // Get module letter (F, I, R, E)
  const getModuleLetter = () => {
    switch (module) {
      case FireModule.FOCUS:
        return 'F';
      case FireModule.INTERRUPT:
        return 'I';
      case FireModule.REFRAME:
        return 'R';
      case FireModule.EXECUTE:
        return 'E';
      default:
        return 'F';
    }
  };

  return (
    <Pressable
      onPress={locked ? undefined : onPress}
      disabled={locked}
      style={{
        marginBottom: 16,
        borderRadius: 20,
        padding: 20,
        backgroundColor: colors.background.card,
        borderWidth: 1,
        borderColor: colors.lime[600] + '15',
        opacity: locked ? 0.6 : 1,
      }}>
      {/* Header Row: Icon + Title + Duration */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        {/* Lime Letter Badge */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: colors.lime[500],
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.background.primary }}>
            {getModuleLetter()}
          </Text>
        </View>

        {/* Title + Duration */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text.primary }}>
            {title}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text.secondary }}>
            {duration}
          </Text>
        </View>
      </View>

      {/* Subtitle in Lime */}
      <Text style={{ fontSize: 15, fontWeight: '600', color: colors.lime[400], marginBottom: 8 }}>
        {subtitle}
      </Text>

      {/* Description */}
      <Text
        style={{ fontSize: 14, lineHeight: 20, color: colors.text.secondary, marginBottom: 16 }}>
        {description}
      </Text>

      {/* Action Button or Lock Message */}
      {locked ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Lock size={14} color={colors.text.muted} strokeWidth={2} />
          <Text style={{ marginLeft: 6, fontSize: 13, color: colors.text.muted }}>
            Complete previous module to unlock
          </Text>
        </View>
      ) : completed ? (
        <View
          style={{
            backgroundColor: colors.background.tertiary,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Check size={16} color={colors.lime[500]} strokeWidth={3} />
          <Text style={{ marginLeft: 8, fontSize: 15, fontWeight: '600', color: colors.lime[500] }}>
            Completed
          </Text>
        </View>
      ) : (
        <Pressable
          onPress={onPress}
          style={{
            backgroundColor: colors.lime[500],
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.background.primary }}>
            Start Module
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
}

export default function Training() {
  const router = useRouter();
  const user = useUser();
  const insets = useSafeAreaInsets();

  const fireProgress = user?.fire_progress || {
    focus: false,
    interrupt: false,
    reframe: false,
    execute: false,
  };

  const modules = [
    {
      module: FireModule.FOCUS,
      title: 'Focus',
      subtitle: 'Understanding Your Pattern',
      description:
        'Learn what rumination is and identify your unique triggers. Map the patterns that keep you stuck.',
      duration: '15 min',
      completed: fireProgress.focus,
      locked: false,
    },
    {
      module: FireModule.INTERRUPT,
      title: 'Interrupt',
      subtitle: 'Stop the Loop',
      description:
        'Master the 10-second window. Practice techniques to catch and interrupt spirals before they lock in.',
      duration: '20 min',
      completed: fireProgress.interrupt,
      locked: !fireProgress.focus,
    },
    {
      module: FireModule.REFRAME,
      title: 'Reframe',
      subtitle: 'Change the Narrative',
      description:
        'Transform shame-based thinking. Learn to challenge cognitive distortions and build healthier thought patterns.',
      duration: '20 min',
      completed: fireProgress.reframe,
      locked: !fireProgress.interrupt,
    },
    {
      module: FireModule.EXECUTE,
      title: 'Execute',
      subtitle: 'Build New Patterns',
      description:
        'Create your personalized 30-day plan. Practice daily techniques that rewire your brain for lasting change.',
      duration: '25 min',
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
          paddingBottom:
            spacing.tabBar.height +
            Math.max(insets.bottom, spacing.safeArea.bottom) +
            spacing['2xl'],
        }}
        showsVerticalScrollIndicator={false}>
        {/* Page Header */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 28,
              fontFamily: brandFonts.headlineBold,
              fontWeight: '700',
              color: colors.text.primary,
              marginBottom: 8,
              lineHeight: 36,
            }}>
            F.I.R.E. Training
          </Text>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 15, color: colors.text.secondary }}>Your Progress</Text>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.lime[500] }}>
              {completedCount}/4 Complete
            </Text>
          </View>

          {/* Progress Bar */}
          <View
            style={{
              marginTop: 12,
              height: 6,
              overflow: 'hidden',
              borderRadius: 3,
              backgroundColor: colors.background.border,
            }}>
            <View
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: colors.lime[500],
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
            style={{
              marginTop: 8,
              borderRadius: 20,
              padding: 24,
              backgroundColor: colors.lime[600],
              borderWidth: 1,
              borderColor: colors.lime[500] + '40',
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🎓</Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: colors.text.primary,
                marginBottom: 8,
                textAlign: 'center',
              }}>
              F.I.R.E. Certified!
            </Text>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                color: colors.lime[200],
                textAlign: 'center',
              }}>
              You&apos;ve mastered all four modules. You now have the complete toolkit to interrupt
              rumination spirals.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
