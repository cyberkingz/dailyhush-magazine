/**
 * DailyHush - Features List Component
 * Reusable features list with checkmarks
 */

import { View } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

interface FeaturesListProps {
  title?: string;
  features: readonly string[];
  backgroundColor?: string;
  titleColor?: string;
}

export function FeaturesList({
  title,
  features,
  backgroundColor = colors.background.card,
  titleColor = colors.emerald[300],
}: FeaturesListProps) {
  return (
    <View
      style={{
        backgroundColor,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.emerald[700] + '30',
      }}>
      {title && (
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: titleColor,
            marginBottom: 16,
            textAlign: 'center',
          }}>
          {title}
        </Text>
      )}

      {features.map((feature, index) => (
        <View
          key={index}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: index < features.length - 1 ? 12 : 0,
          }}>
          <CheckCircle
            size={20}
            color={colors.emerald[500]}
            strokeWidth={2}
            style={{ marginRight: 12, marginTop: 2 }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: 15,
              color: colors.text.secondary,
              lineHeight: 22,
            }}>
            {feature}
          </Text>
        </View>
      ))}
    </View>
  );
}
