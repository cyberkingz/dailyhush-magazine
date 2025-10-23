/**
 * DailyHush Global State Management
 * Using Zustand for simple, performant state
 */

import { create } from 'zustand';
import type {
  UserProfile,
  Subscription,
  ShiftDevice,
  InterventionProtocol,
  AppState,
} from '@/types';

interface DailyHushStore extends AppState {
  // Actions
  setUser: (user: UserProfile | null) => void;
  setSubscription: (subscription: Subscription | null) => void;
  setShiftDevice: (device: ShiftDevice | null) => void;
  setSpiraling: (isSpiraling: boolean) => void;
  setNightMode: (active: boolean) => void;
  setCurrentProtocol: (protocol: InterventionProtocol | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: AppState = {
  user: null,
  subscription: null,
  shift_device: null,
  is_spiraling: false,
  night_mode_active: false,
  current_protocol: null,
  loading: false,
  error: null,
};

export const useStore = create<DailyHushStore>((set) => ({
  ...initialState,

  // User management
  setUser: (user) => set({ user }),

  // Subscription management
  setSubscription: (subscription) => set({ subscription }),

  // Shift device management
  setShiftDevice: (shift_device) => set({ shift_device }),

  // Spiral state
  setSpiraling: (is_spiraling) => set({ is_spiraling }),

  // Night mode
  setNightMode: (night_mode_active) => set({ night_mode_active }),

  // Current intervention protocol
  setCurrentProtocol: (current_protocol) => set({ current_protocol }),

  // Loading state
  setLoading: (loading) => set({ loading }),

  // Error handling
  setError: (error) => set({ error }),

  // Reset state (logout)
  reset: () => set(initialState),
}));

// Selectors for optimized re-renders
export const useUser = () => useStore((state) => state.user);
export const useSubscription = () => useStore((state) => state.subscription);
export const useShiftDevice = () => useStore((state) => state.shift_device);
export const useIsSpiraling = () => useStore((state) => state.is_spiraling);
export const useNightMode = () => useStore((state) => state.night_mode_active);
export const useCurrentProtocol = () => useStore((state) => state.current_protocol);
export const useLoading = () => useStore((state) => state.loading);
export const useError = () => useStore((state) => state.error);
