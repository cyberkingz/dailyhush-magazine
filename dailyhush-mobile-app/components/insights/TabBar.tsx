import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export interface Tab {
  id: string;
  label: string;
  accessibilityLabel: string;
  accessibilityHint: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onTabChange(tab.id);
              }}
              style={[
                styles.tab,
                isActive && styles.tabActive
              ]}
              accessible={true}
              accessibilityRole="tab"
              accessibilityLabel={tab.accessibilityLabel}
              accessibilityHint={tab.accessibilityHint}
              accessibilityState={{ selected: isActive }}>
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.tabTextActive
                ]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // WCAG touch target
  },
  tabActive: {
    backgroundColor: colors.lime[500],
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.button.primaryText,
  },
});
