/**
 * Nœma - Test React Native Reusables Components
 * Test page for RNR components with emerald theme
 */

import { View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Text } from '@/components/ui/text';

export default function TestRNR() {
  return (
    <View style={{ flex: 1, backgroundColor: '#064e3b' }}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 24,
          paddingTop: 64,
        }}>
        <Text className="mb-6 text-3xl font-bold text-neutral-50">React Native Reusables Test</Text>

        {/* Button Examples */}
        <View className="mb-8">
          <Text className="mb-4 text-xl font-semibold text-neutral-50">Buttons</Text>

          <View className="gap-3">
            <Button>
              <Text>Default Button (Emerald)</Text>
            </Button>

            <Button variant="secondary">
              <Text>Secondary Button</Text>
            </Button>

            <Button variant="outline">
              <Text>Outline Button</Text>
            </Button>

            <Button variant="ghost">
              <Text>Ghost Button</Text>
            </Button>

            <Button size="lg">
              <Text>Large Button</Text>
            </Button>

            <Button size="sm">
              <Text>Small Button</Text>
            </Button>
          </View>
        </View>

        {/* Card Examples */}
        <View className="mb-8">
          <Text className="mb-4 text-xl font-semibold text-neutral-50">Cards</Text>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>This is a card description with emerald theme</CardDescription>
            </CardHeader>
            <CardContent>
              <Text>Card content goes here. This card uses your emerald branding!</Text>
            </CardContent>
            <CardFooter className="flex-row gap-2">
              <Button size="sm">
                <Text>Action</Text>
              </Button>
              <Button size="sm" variant="outline">
                <Text>Cancel</Text>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
            </CardHeader>
            <CardContent>
              <Text>
                React Native Reusables components work perfectly with your dark emerald theme!
              </Text>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
