/**
 * DailyHush - Daily Tip Card Component
 * Educational tips that rotate daily with sparkle icon
 */

import { View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

const DAILY_TIPS = [
  "Most spirals happen in the first 10 seconds. The faster you interrupt, the easier it is to stop.",
  "Your brain can't tell the difference between a real threat and an imagined one. That's why rumination feels so urgent.",
  "Rumination isn't problem-solving. Problem-solving has a beginning, middle, and end. Rumination just loops.",
  "The 3-3-3 rule: Name 3 things you see, 3 sounds you hear, 3 body parts you can move. Instant grounding.",
  "Spiraling at 3AM? Your brain's emotional regulation is 40% weaker when sleep-deprived.",
  "Writing down your spiral thoughts reduces their power by 30%. Putting them on paper gets them out of your head.",
  "Research shows 90% of what we worry about never happens. Your anxiety is not a prediction.",
  "The average spiral lasts 30 minutes if uninterrupted. With intervention? Under 2 minutes.",
];

interface TipCardProps {
  style?: any;
}

export function TipCard({ style }: TipCardProps) {
  // Get tip based on day of year for daily rotation
  const getDailyTip = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
  };

  return (
    <View
      style={[
        {
          backgroundColor: colors.background.secondary,
          borderRadius: 24,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.background.border,
          shadowColor: colors.shadow.light,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 12,
          elevation: 3,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Sparkles size={18} color={colors.emerald[400]} strokeWidth={2} />
        <Text
          style={{
            color: colors.text.primary,
            fontSize: 16,
            fontWeight: '600',
            marginLeft: 8,
          }}
        >
          Did you know?
        </Text>
      </View>
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: 14,
          lineHeight: 20,
        }}
      >
        {getDailyTip()}
      </Text>
    </View>
  );
}
