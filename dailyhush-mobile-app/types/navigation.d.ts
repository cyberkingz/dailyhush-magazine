/**
 * Extend Expo Router types to include custom header options
 */
import 'expo-router';

declare module 'expo-router' {
  export interface ScreenOptions {
    headerSubtitle?: string;
  }
}
