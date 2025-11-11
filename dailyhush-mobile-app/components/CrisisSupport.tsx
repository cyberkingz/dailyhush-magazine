/**
 * Nœma - Crisis Support Footer
 * Persistent safety messaging for mental health app
 */

import { View, Pressable, Linking } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

export function CrisisSupport() {
  const handleCrisisCall = () => {
    Linking.openURL('tel:988');
  };

  return (
    <View
      className="border-t px-5 py-3"
      style={{
        borderTopColor: colors.status.warning + '33',
        backgroundColor: colors.background.primary,
      }}>
      <Pressable onPress={handleCrisisCall} className="flex-row items-center active:opacity-70">
        <AlertCircle size={16} color={colors.status.warning} strokeWidth={2} />
        <View className="ml-2 flex-1">
          <Text className="text-xs leading-relaxed" style={{ color: colors.text.secondary }}>
            In crisis? Call{' '}
            <Text className="font-bold" style={{ color: colors.status.warning }}>
              988
            </Text>{' '}
            for immediate help
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
