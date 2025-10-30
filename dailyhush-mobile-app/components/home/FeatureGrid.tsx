/**
 * FeatureGrid Component
 * 2x2 grid layout for feature cards
 */

import { View } from 'react-native';
import { FeatureCard } from './FeatureCard';
import { LucideIcon } from 'lucide-react-native';

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBackgroundColor: string;
  onPress?: () => void;
  isInteractive?: boolean;
}

interface FeatureGridProps {
  features: FeatureItem[];
}

export function FeatureGrid({ features }: FeatureGridProps) {
  // Split features into two rows
  const firstRow = features.slice(0, 2);
  const secondRow = features.slice(2, 4);

  const rowStyle = {
    flexDirection: 'row' as const,
    gap: 12,
    height: 160,
  };

  return (
    <View style={{ paddingHorizontal: 20 }}>
      {/* First Row */}
      <View
        style={{
          ...rowStyle,
          marginBottom: 12,
        }}>
        {firstRow.map((feature) => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            iconColor={feature.iconColor}
            iconBackgroundColor={feature.iconBackgroundColor}
            onPress={feature.onPress}
            isInteractive={feature.isInteractive}
          />
        ))}
      </View>

      {/* Second Row */}
      <View style={rowStyle}>
        {secondRow.map((feature) => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            iconColor={feature.iconColor}
            iconBackgroundColor={feature.iconBackgroundColor}
            onPress={feature.onPress}
            isInteractive={feature.isInteractive}
          />
        ))}
      </View>
    </View>
  );
}
