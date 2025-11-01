/**
 * DailyHush - Shift Necklace Pairing
 * Bluetooth pairing interface for The Shift necklace
 */

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { useShiftBluetooth } from '@/hooks/useShiftBluetooth';

export default function ShiftPairing() {
  const router = useRouter();

  const {
    isScanning,
    discoveredDevices,
    connectedDevice,
    batteryLevel,
    error,
    startScan,
    stopScan,
    connectToDevice,
    disconnect,
    startBreathingSession,
  } = useShiftBluetooth();

  const backgroundColor = Colors.background.primary;
  const textColor = Colors.neutral.neutral50;

  const handleTestBreathing = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await startBreathingSession();

    // Show success message
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1000);
  };

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={{
          padding: Spacing.lg,
          paddingTop: Spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: Spacing.md }}>
          <Text
            style={{
              fontSize: Typography.fontSize.body,
              color: Colors.primary.emerald600,
            }}>
            ‹ Back
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: Typography.fontSize.heading1,
            fontWeight: Typography.fontWeight.bold as any,
            color: textColor,
            marginBottom: Spacing.sm,
          }}>
          Pair Your Shift
        </Text>

        <Text
          style={{
            fontSize: Typography.fontSize.body,
            color: Colors.neutral.neutral300,
            marginBottom: Spacing.xl,
            lineHeight: Typography.lineHeight.body * Typography.fontSize.body,
          }}>
          {connectedDevice
            ? 'Your Shift necklace is connected'
            : 'Make sure your Shift necklace is turned on and nearby'}
        </Text>

        {/* Connected Device Card */}
        {connectedDevice && (
          <View
            style={{
              backgroundColor: Colors.success[100],
              borderRadius: BorderRadius.md,
              padding: Spacing.lg,
              marginBottom: Spacing.xl,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md }}>
              <Text style={{ fontSize: 48, marginRight: Spacing.md }}>💎</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: Typography.fontSize.heading3,
                    fontWeight: Typography.fontWeight.bold as any,
                    color: Colors.neutral.neutral50,
                    marginBottom: Spacing.xs,
                  }}>
                  {connectedDevice.name || 'The Shift'}
                </Text>
                {batteryLevel !== null && (
                  <Text
                    style={{
                      fontSize: Typography.fontSize.caption,
                      color: Colors.neutral.neutral300,
                    }}>
                    Battery: {batteryLevel}%
                  </Text>
                )}
              </View>
            </View>

            {/* Test Breathing */}
            <TouchableOpacity
              onPress={handleTestBreathing}
              style={{
                backgroundColor: Colors.primary.emerald600,
                borderRadius: BorderRadius.md,
                padding: Spacing.md,
                alignItems: 'center',
                marginBottom: Spacing.sm,
              }}>
              <Text
                style={{
                  fontSize: Typography.fontSize.body,
                  fontWeight: Typography.fontWeight.bold as any,
                  color: '#FFFFFF',
                }}>
                Test Breathing Pattern
              </Text>
            </TouchableOpacity>

            {/* Disconnect Button */}
            <TouchableOpacity
              onPress={disconnect}
              style={{
                backgroundColor: 'transparent',
                borderRadius: BorderRadius.md,
                padding: Spacing.md,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: Typography.fontSize.body,
                  fontWeight: Typography.fontWeight.semibold as any,
                  color: Colors.text.slate600,
                }}>
                Disconnect
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Scan Button */}
        {!connectedDevice && (
          <View style={{ marginBottom: Spacing.xl }}>
            <TouchableOpacity
              onPress={isScanning ? stopScan : startScan}
              disabled={isScanning}
              style={{
                backgroundColor: isScanning ? Colors.text.slate300 : Colors.primary.emerald600,
                borderRadius: BorderRadius.lg,
                padding: Spacing.lg,
                alignItems: 'center',
                minHeight: 64,
                justifyContent: 'center',
              }}>
              {isScanning ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator
                    color="#FFFFFF"
                    size="small"
                    style={{ marginRight: Spacing.sm }}
                  />
                  <Text
                    style={{
                      fontSize: Typography.fontSize.button,
                      fontWeight: Typography.fontWeight.bold as any,
                      color: '#FFFFFF',
                    }}>
                    Scanning...
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    fontSize: Typography.fontSize.button,
                    fontWeight: Typography.fontWeight.bold as any,
                    color: '#FFFFFF',
                  }}>
                  Scan for Devices
                </Text>
              )}
            </TouchableOpacity>

            {error && (
              <View
                style={{
                  backgroundColor: '#FEE2E2',
                  borderRadius: BorderRadius.sm,
                  padding: Spacing.md,
                  marginTop: Spacing.md,
                }}>
                <Text
                  style={{
                    fontSize: Typography.fontSize.caption,
                    color: '#991B1B',
                    textAlign: 'center',
                  }}>
                  {error}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Discovered Devices List */}
        {!connectedDevice && discoveredDevices.length > 0 && (
          <View>
            <Text
              style={{
                fontSize: Typography.fontSize.heading3,
                fontWeight: Typography.fontWeight.semibold as any,
                color: textColor,
                marginBottom: Spacing.md,
              }}>
              Available Devices
            </Text>

            {discoveredDevices.map((device) => (
              <TouchableOpacity
                key={device.id}
                onPress={() => connectToDevice(device)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: BorderRadius.md,
                  padding: Spacing.lg,
                  marginBottom: Spacing.sm,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontSize: 32, marginRight: Spacing.md }}>💎</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: Typography.fontSize.body,
                        fontWeight: Typography.fontWeight.semibold as any,
                        color: textColor,
                        marginBottom: Spacing.xs,
                      }}>
                      {device.name || 'Unknown Device'}
                    </Text>
                    <Text
                      style={{
                        fontSize: Typography.fontSize.caption,
                        color: Colors.text.slate500,
                      }}>
                      Tap to connect
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: Typography.fontSize.body,
                    color: Colors.primary.emerald600,
                  }}>
                  ›
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* No Devices Found */}
        {!connectedDevice && !isScanning && discoveredDevices.length === 0 && (
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: BorderRadius.md,
              padding: Spacing.xl,
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 64, marginBottom: Spacing.md }}>🔍</Text>
            <Text
              style={{
                fontSize: Typography.fontSize.body,
                color: Colors.neutral.neutral300,
                textAlign: 'center',
                lineHeight: Typography.lineHeight.body * Typography.fontSize.body,
              }}>
              No devices found. Make sure your Shift necklace is powered on and nearby, then tap
              &quot;Scan for Devices&quot;.
            </Text>
          </View>
        )}

        {/* Troubleshooting */}
        <View style={{ marginTop: Spacing.xxxl }}>
          <Text
            style={{
              fontSize: Typography.fontSize.heading3,
              fontWeight: Typography.fontWeight.semibold as any,
              color: textColor,
              marginBottom: Spacing.md,
            }}>
            Troubleshooting
          </Text>

          {[
            'Make sure Bluetooth is enabled on your phone',
            'Ensure your Shift necklace is charged (LED should be on)',
            'Hold the power button for 3 seconds to turn on',
            'Move closer to the necklace (within 10 feet)',
            'Try removing and reinserting the battery',
          ].map((tip, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: Spacing.sm,
              }}>
              <Text
                style={{
                  fontSize: Typography.fontSize.body,
                  color: Colors.primary.emerald600,
                  marginRight: Spacing.sm,
                }}>
                •
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: Typography.fontSize.body,
                  color: Colors.neutral.neutral300,
                  lineHeight: Typography.lineHeight.body * Typography.fontSize.body,
                }}>
                {tip}
              </Text>
            </View>
          ))}

          <View style={{ marginTop: Spacing.lg }}>
            <Text
              style={{
                fontSize: Typography.fontSize.caption,
                color: Colors.text.slate500,
                textAlign: 'center',
              }}>
              Need help? Email hello@daily-hush.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
