/**
 * Nœma - Subscription Option Component
 * Selectable subscription plan card with accessibility support
 * Updated: 2025-11-01 - Added priceValue, accessibility, haptics
 */

import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

export interface SubscriptionPlan {
  id: string;
  title: string;
  price: string; // Localized price string from RevenueCat (e.g., "$9.99", "€9.99")
  priceValue: number; // Numeric value for sorting/logic
  period: string;
  badge?: string;
  savings?: string;
  description: string;
}

interface SubscriptionOptionProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  onSelect: (planId: string) => void;
}

export function SubscriptionOption({ plan, isSelected, onSelect }: SubscriptionOptionProps) {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(plan.id);
  };

  return (
    <Pressable
      onPress={handlePress}
      accessible={true}
      accessibilityRole="radio"
      accessibilityLabel={`${plan.title} plan, ${plan.price} ${plan.period}`}
      accessibilityHint={plan.description}
      accessibilityState={{ checked: isSelected }}
      testID={`subscription-option-${plan.id}`}
      style={{
        backgroundColor: isSelected ? colors.emerald[800] + '40' : colors.background.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: isSelected ? colors.emerald[600] : colors.emerald[700] + '30',
      }}>
      {({ pressed }) => (
        <View style={{ opacity: pressed ? 0.9 : 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Selection Indicator */}
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: isSelected ? colors.emerald[500] : colors.text.tertiary,
                backgroundColor: isSelected ? colors.emerald[600] : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}>
              {isSelected && <Check size={16} color={colors.white} strokeWidth={3} />}
            </View>

            {/* Plan Details */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: colors.text.primary,
                  marginBottom: 4,
                }}>
                {plan.title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.text.secondary,
                  marginBottom: 4,
                }}>
                {plan.description}
              </Text>
              {plan.savings && (
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.emerald[400],
                    fontWeight: '600',
                  }}>
                  {plan.savings}
                </Text>
              )}
            </View>

            {/* Price */}
            <View style={{ alignItems: 'flex-end' }}>
              {plan.badge && (
                <View
                  style={{
                    backgroundColor:
                      plan.badge === 'MOST POPULAR'
                        ? colors.emerald[600]
                        : plan.badge === 'BEST VALUE'
                          ? '#F59E0B'
                          : colors.emerald[600],
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: colors.white,
                      letterSpacing: 0.5,
                    }}>
                    {plan.badge}
                  </Text>
                </View>
              )}
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: colors.text.primary,
                }}>
                {plan.price}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.text.tertiary,
                }}>
                {plan.period}
              </Text>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}
