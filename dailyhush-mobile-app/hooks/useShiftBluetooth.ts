/**
 * useShiftBluetooth Hook
 * Bluetooth Low Energy integration for The Shift necklace
 *
 * Features:
 * - Device scanning and pairing
 * - Connection management
 * - Battery level monitoring
 * - Breathing pattern synchronization
 * - Haptic feedback control
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/utils/supabase';
import { useStore } from '@/store/useStore';

// The Shift necklace UUIDs (these would be provided by the hardware team)
const SHIFT_SERVICE_UUID = '0000180a-0000-1000-8000-00805f9b34fb'; // Device Information Service
const SHIFT_BATTERY_CHAR_UUID = '00002a19-0000-1000-8000-00805f9b34fb'; // Battery Level Characteristic
const SHIFT_CONTROL_CHAR_UUID = '0000ff01-0000-1000-8000-00805f9b34fb'; // Custom control characteristic
const SHIFT_DEVICE_NAME_PREFIX = 'Shift-'; // Device name prefix for filtering

export interface ShiftDevice {
  id: string;
  name: string;
  batteryLevel: number | null;
  isConnected: boolean;
  firmwareVersion?: string;
}

export function useShiftBluetooth() {
  const { user, setShiftDevice } = useStore();
  const [bleManager] = useState(() => new BleManager());
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deviceRef = useRef<Device | null>(null);

  /**
   * Initialize BLE manager
   */
  useEffect(() => {
    const subscription = bleManager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        console.log('Bluetooth is ready');
      } else {
        console.log('Bluetooth state:', state);
      }
    }, true);

    return () => {
      subscription.remove();
      bleManager.destroy();
    };
  }, [bleManager]);

  /**
   * Scan for Shift devices
   */
  const startScan = useCallback(() => {
    setIsScanning(true);
    setDiscoveredDevices([]);
    setError(null);

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        setError('Failed to scan for devices');
        setIsScanning(false);
        return;
      }

      // Filter for Shift devices
      if (device && device.name?.startsWith(SHIFT_DEVICE_NAME_PREFIX)) {
        setDiscoveredDevices((prev) => {
          // Avoid duplicates
          if (prev.find((d) => d.id === device.id)) {
            return prev;
          }
          return [...prev, device];
        });
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => {
      stopScan();
    }, 10000);
  }, [bleManager]);

  /**
   * Stop scanning
   */
  const stopScan = useCallback(() => {
    bleManager.stopDeviceScan();
    setIsScanning(false);
  }, [bleManager]);

  /**
   * Connect to a Shift device
   */
  const connectToDevice = useCallback(
    async (device: Device) => {
      try {
        setError(null);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Stop scanning first
        stopScan();

        // Connect to device
        console.log('Connecting to:', device.name);
        const connectedDev = await bleManager.connectToDevice(device.id);

        // Discover services and characteristics
        await connectedDev.discoverAllServicesAndCharacteristics();

        deviceRef.current = connectedDev;
        setConnectedDevice(connectedDev);

        // Subscribe to battery level updates
        subscribeToBattery(connectedDev);

        // Save to Supabase
        if (user) {
          await supabase.from('shift_devices').upsert({
            device_id: device.id,
            user_id: user.user_id,
            name: device.name || 'The Shift',
            is_connected: true,
          });

          // Update global store
          setShiftDevice({
            device_id: device.id,
            name: device.name || 'The Shift',
            is_connected: true,
            battery_level: null,
          });
        }

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        console.log('Connected successfully');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to connect';
        setError(errorMessage);
        console.error('Connection error:', err);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    },
    [bleManager, user, stopScan, setShiftDevice]
  );

  /**
   * Disconnect from device
   */
  const disconnect = useCallback(async () => {
    if (!deviceRef.current) return;

    try {
      await bleManager.cancelDeviceConnection(deviceRef.current.id);
      deviceRef.current = null;
      setConnectedDevice(null);
      setBatteryLevel(null);

      // Update Supabase
      if (user && connectedDevice) {
        await supabase
          .from('shift_devices')
          .update({ is_connected: false })
          .eq('device_id', connectedDevice.id);

        setShiftDevice(null);
      }

      console.log('Disconnected');
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  }, [bleManager, user, connectedDevice, setShiftDevice]);

  /**
   * Subscribe to battery level characteristic
   */
  const subscribeToBattery = useCallback(
    async (device: Device) => {
      try {
        device.monitorCharacteristicForService(
          SHIFT_SERVICE_UUID,
          SHIFT_BATTERY_CHAR_UUID,
          (error, characteristic) => {
            if (error) {
              console.error('Battery monitoring error:', error);
              return;
            }

            if (characteristic?.value) {
              // Decode battery level (assuming it's a single byte 0-100)
              const buffer = Buffer.from(characteristic.value, 'base64');
              const level = buffer.readUInt8(0);
              setBatteryLevel(level);

              // Update Supabase
              if (user) {
                supabase
                  .from('shift_devices')
                  .update({
                    battery_level: level,
                    last_sync: new Date().toISOString(),
                  })
                  .eq('device_id', device.id)
                  .then();
              }
            }
          }
        );
      } catch (err) {
        console.error('Failed to subscribe to battery:', err);
      }
    },
    [user]
  );

  /**
   * Send breathing pattern to necklace
   * @param pattern - Breathing pattern (e.g., '4-7-8' for 4s inhale, 7s hold, 8s exhale)
   */
  const sendBreathingPattern = useCallback(
    async (pattern: string) => {
      if (!deviceRef.current) {
        console.warn('No device connected');
        return;
      }

      try {
        // Encode pattern as bytes
        const buffer = Buffer.from(pattern, 'utf-8');
        const base64Value = buffer.toString('base64');

        // Write to control characteristic
        await deviceRef.current.writeCharacteristicWithResponseForService(
          SHIFT_SERVICE_UUID,
          SHIFT_CONTROL_CHAR_UUID,
          base64Value
        );

        console.log('Sent breathing pattern:', pattern);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (err) {
        console.error('Failed to send breathing pattern:', err);
      }
    },
    []
  );

  /**
   * Start breathing session on necklace
   */
  const startBreathingSession = useCallback(async () => {
    // Default 4-7-8 breathing (calming)
    await sendBreathingPattern('4-7-8');
  }, [sendBreathingPattern]);

  /**
   * Stop breathing session
   */
  const stopBreathingSession = useCallback(async () => {
    await sendBreathingPattern('stop');
  }, [sendBreathingPattern]);

  return {
    // State
    isScanning,
    discoveredDevices,
    connectedDevice,
    batteryLevel,
    error,

    // Actions
    startScan,
    stopScan,
    connectToDevice,
    disconnect,
    sendBreathingPattern,
    startBreathingSession,
    stopBreathingSession,
  };
}
