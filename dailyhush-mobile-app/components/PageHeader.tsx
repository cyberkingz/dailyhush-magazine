/**
 * PageHeader Component
 * Clean, accessible header optimized for 55-70 year old users
 * Features: proper touch targets, clear hierarchy, safe area support
 */

import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { brandFonts } from '@/constants/profileTypography';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export function PageHeader({ title, subtitle, onBack }: PageHeaderProps) {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack?.();
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing.sm,
          paddingHorizontal: spacing.lg,
        },
      ]}>
      <View style={styles.content}>
        {onBack && (
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessible={true}
            accessibilityLabel="Go back"
            accessibilityRole="button">
            <ArrowLeft size={24} color={colors.text.primary} strokeWidth={2} />
          </Pressable>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title} accessible={true} accessibilityRole="header">
            {title}
          </Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    paddingBottom: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: brandFonts.headlineBold,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    marginTop: 4,
    lineHeight: 20,
  },
});
