/**
 * DailyHush - Profile Screen
 * Edit profile information and personalize experience
 */

import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useState, useEffect } from 'react';

import { Text } from '@/components/ui/text';
import { useStore, useUser } from '@/store/useStore';
import { supabase } from '@/utils/supabase';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { withRetry } from '@/utils/retry';

export default function Profile() {
  const router = useRouter();
  const user = useUser();
  const { setUser } = useStore();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage('');
      setSuccessMessage('');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (!user?.user_id) {
        setErrorMessage('No user account found. Please sign in again.');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setIsSaving(false);
        return;
      }

      // Validate age if provided
      const ageValue = age ? parseInt(age, 10) : null;
      if (ageValue !== null && (ageValue < 18 || ageValue > 120)) {
        setErrorMessage('Please enter a valid age between 18 and 120.');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setIsSaving(false);
        return;
      }

      // Update user profile in database
      // Use retry logic for robust profile updates
      const { error } = await withRetry(
        async () => await supabase
          .from('user_profiles')
          .update({
            name: name || null,
            age: ageValue,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.user_id),
        {
          maxRetries: 3,
          onRetry: (attempt) => {
            console.log(`Retrying profile update (attempt ${attempt}/3)...`);
          }
        }
      );

      if (error) {
        console.error('Error updating profile after retries:', error);
        setErrorMessage('Failed to save profile after multiple attempts. Please check your connection and try again.');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setIsSaving(false);
        return;
      }

      // Update local store
      setUser({
        ...user,
        name: name || null,
        age: ageValue,
      });

      console.log('Profile updated successfully');
      setSuccessMessage('Profile saved successfully!');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      console.error('Exception updating profile:', error);
      setErrorMessage(error?.message || 'An unexpected error occurred. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = async () => {
    await Haptics.selectionAsync();
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-[#0A1612]">
        <StatusBar style="light" />

      {/* Header */}
      <View
        className="bg-[#0A1612] border-b border-[#1A4D3C]/30"
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 16,
          paddingHorizontal: 20,
        }}
      >
        <Pressable
          onPress={handleBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="active:opacity-70"
        >
          <View className="flex-row items-center">
            <ArrowLeft size={24} color="#52B788" strokeWidth={2} />
            <Text className="text-[#E8F4F0] text-xl font-semibold ml-3">
              Edit Profile
            </Text>
          </View>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 40 + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Success Message */}
          {successMessage && (
            <ErrorAlert
              message={successMessage}
              type="success"
              onDismiss={() => setSuccessMessage('')}
            />
          )}

          {/* Error Message */}
          {errorMessage && (
            <ErrorAlert
              message={errorMessage}
              type="error"
              onDismiss={() => setErrorMessage('')}
            />
          )}

          {/* Value Proposition */}
          <View className="bg-[#2D6A4F] rounded-2xl p-5 mb-6">
            <Text className="text-[#E8F4F0] text-lg font-bold mb-2">
              Why share this with us?
            </Text>
            <Text className="text-[#B7E4C7] text-base leading-relaxed">
              We&apos;ll greet you warmly each morning and tailor your DailyHush experience to feel like it was made just for you.
            </Text>
          </View>

          {/* Account Info */}
          <View className="mb-8">
            <Text className="text-[#95B8A8] text-sm font-bold uppercase mb-4">
              Account
            </Text>
            <View className="bg-[#1A4D3C] rounded-2xl p-4">
              <Text className="text-[#95B8A8] text-base mb-1">Email</Text>
              <Text className="text-[#E8F4F0] text-lg">
                {user?.email || 'Not set'}
              </Text>
            </View>
          </View>

          {/* Personal Information */}
          <View className="mb-6">
            <Text className="text-[#95B8A8] text-sm font-bold uppercase mb-4">
              Personal Information
            </Text>

            {/* Name Input */}
            <View className="mb-6">
              <Text className="text-[#E8F4F0] text-base font-semibold mb-2">Name (Optional)</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="What should we call you?"
                placeholderTextColor="#4A6B5C"
                className="bg-[#1A4D3C] text-[#E8F4F0] text-lg rounded-xl px-4 border-2 border-transparent focus:border-[#40916C]"
                style={{ height: 56, paddingVertical: 16 }}
                autoCapitalize="words"
                returnKeyType="next"
                editable={!isSaving}
              />
              <Text className="text-[#A8CFC0] text-base mt-2">
                We&apos;ll greet you warmly each morning
              </Text>
            </View>

            {/* Age Input */}
            <View className="mb-6">
              <Text className="text-[#E8F4F0] text-base font-semibold mb-2">Age (Optional)</Text>
              <TextInput
                value={age}
                onChangeText={(text) => {
                  // Only allow numbers
                  const numericValue = text.replace(/[^0-9]/g, '');
                  setAge(numericValue);
                }}
                placeholder="Your age"
                placeholderTextColor="#4A6B5C"
                className="bg-[#1A4D3C] text-[#E8F4F0] text-lg rounded-xl px-4 border-2 border-transparent focus:border-[#40916C]"
                style={{ height: 56, paddingVertical: 16 }}
                keyboardType="number-pad"
                returnKeyType="done"
                maxLength={3}
                editable={!isSaving}
              />
              <Text className="text-[#A8CFC0] text-base mt-2">
                Helps us provide age-appropriate content
              </Text>
            </View>
          </View>

          {/* Privacy Message */}
          <View className="bg-[#1A4D3C]/50 rounded-xl p-5 mt-4 mb-6">
            <Text className="text-[#E8F4F0] text-base font-semibold mb-2">
              Your Privacy Matters
            </Text>
            <Text className="text-[#A8CFC0] text-base leading-relaxed">
              • Your data is never sold or shared{'\n'}
              • Only you can see your profile{'\n'}
              • Delete anytime with one button{'\n'}
              • Encrypted and secure
            </Text>
          </View>

          {/* Save Button - Bottom */}
          <View style={{ paddingBottom: 20 }}>
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              className="active:opacity-90"
            >
              <View
                className="bg-[#40916C] rounded-xl flex-row items-center justify-center"
                style={{ height: 56 }}
              >
                <Save size={20} color="#FFFFFF" strokeWidth={2} />
                <Text className="text-white text-lg font-semibold ml-2">
                  {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </View>
    </>
  );
}
