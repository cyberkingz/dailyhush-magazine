/**
 * ScrollControlContext
 *
 * Provides scroll control for nested gesture handlers.
 * Allows components (like IntensityCircular) to temporarily disable
 * parent ScrollView during drag operations.
 *
 * @module components/mood-widget/ScrollControlContext
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScrollControlContextValue {
  /** Current scroll enabled state */
  scrollEnabled: boolean;

  /** Enable or disable parent ScrollView */
  setScrollEnabled: (enabled: boolean) => void;
}

const ScrollControlContext = createContext<ScrollControlContextValue>({
  scrollEnabled: true,
  setScrollEnabled: () => {
    console.warn('ScrollControlContext: setScrollEnabled called outside provider');
  },
});

interface ScrollControlProviderProps {
  children: ReactNode;
}

/**
 * ScrollControlProvider
 * Wraps app/page to provide scroll control to nested components
 */
export function ScrollControlProvider({ children }: ScrollControlProviderProps) {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <ScrollControlContext.Provider value={{ scrollEnabled, setScrollEnabled }}>
      {children}
    </ScrollControlContext.Provider>
  );
}

/**
 * useScrollControl Hook
 * Access scroll control from nested components
 *
 * @example
 * ```tsx
 * const { scrollEnabled, setScrollEnabled } = useScrollControl();
 *
 * // Disable scroll during drag
 * onDragStart={() => setScrollEnabled(false)}
 * onDragEnd(() => setScrollEnabled(true)}
 * ```
 */
export function useScrollControl() {
  return useContext(ScrollControlContext);
}
