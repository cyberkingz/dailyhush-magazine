# DailyHush Animated Components

This directory contains custom animated UI components with organic, morphing effects that match the DailyHush emerald wellness theme.

## ⭕ CountdownRing

**Elegant, minimal progress ring with gradient stroke**

A refined circular progress indicator with a beautiful gradient stroke, designed for calm focus and meditation.

### Usage

```tsx
import { CountdownRing } from '@/components/CountdownRing';

export default function TimerScreen() {
  const [progress, setProgress] = useState(0);

  return (
    <View className="flex-1 items-center justify-center">
      <View style={{ position: 'relative', width: 260, height: 260 }}>
        <CountdownRing
          size={260}
          strokeWidth={8}
          color="#40916C"
          glowColor="#52B788"
          progress={progress} // 0-100
        />

        {/* Overlay countdown text */}
        <View style={{ position: 'absolute', alignSelf: 'center' }}>
          <Text className="text-6xl font-bold tracking-wider">90</Text>
          <Text className="mt-1 text-sm font-normal">seconds</Text>
          <Text className="mt-2 text-xs font-medium opacity-75">Step 4 of 12</Text>
        </View>
      </View>
    </View>
  );
}
```

### Props

- `size?: number` - Diameter of the ring in pixels (default: 260)
- `strokeWidth?: number` - Thickness of the ring stroke (default: 8)
- `color?: string` - Primary gradient color (default: '#40916C')
- `glowColor?: string` - Secondary gradient & glow color (default: '#52B788')
- `progress?: number` - Progress percentage 0-100 (default: 0)

### Features

- **Linear gradient stroke** - Smooth color transition from dark to light emerald
- **No background elements** - Pure, clean ring with transparent center
- **Refined stroke** - 8px default width balances elegance with visibility
- **Progress indicator** - Fills clockwise from top (0-100%)
- **No animations or pulse** - Static, distraction-free design
- **95% ring opacity** - Crisp, clear presence without harshness
- **Rounded linecap** - Smooth stroke endings
- **Minimal design** - Perfect for focus and meditation
- **Lightweight** - No heavy animations, pure SVG rendering
- **Optimized typography** - Letter spacing and refined hierarchy for countdown text

### Used In

- `/app/spiral.tsx` - Main countdown timer during protocol
- Perfect for timers, progress indicators, meditation exercises

---

## 🌊 MagmaLoader

**Organic morphing loading animation with emerald theme**

A multi-layered blob loader with asynchronous rotation and scaling animations that create a flowing, lava-lamp style effect.

### Usage

```tsx
import { MagmaLoader } from '@/components/MagmaLoader';

export default function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <MagmaLoader text="Loading" size={80} />
    </View>
  );
}
```

### Props

- `text?: string` - Text to display below loader (default: "Loading")
- `size?: number` - Size of the loader in pixels (default: 80)

### Features

- **3 morphing blob layers** with different speeds (2000ms, 1600ms, 1800ms)
- **Independent rotation animations** (4000ms, 3200ms, 3600ms)
- **Letter wave animation** - Each letter pulses in sequence
- **Emerald color palette** - Uses DailyHush brand colors (#40916C, #52B788, #2D6A4F)

---

## ✨ SuccessRipple

**Expanding ripple effect for completion states**

An animated success indicator with staggered ripple waves and a rotating check mark.

### Usage

```tsx
import { SuccessRipple } from '@/components/SuccessRipple';

export default function SuccessScreen() {
  return (
    <SuccessRipple
      size={80}
      onAnimationComplete={() => {
        console.log('Animation finished!');
      }}
    />
  );
}
```

### Props

- `size?: number` - Size of the check mark circle (default: 80)
- `onAnimationComplete?: () => void` - Callback when animation finishes

### Features

- **3 staggered ripples** - Expand at 0ms, 200ms, 400ms delays
- **Bouncy check mark** - Spring animation with rotation
- **Color gradient** - Ripples fade from #40916C → #52B788 → #B7E4C7
- **Auto-completes** - Runs once, calls callback when done
- **Total duration** - ~1200ms

---

## 💫 PulseButton

**Animated button with organic pulsing aura for important CTAs**

A pressable button with continuous pulse animation and press feedback.

### Usage

```tsx
import { PulseButton } from '@/components/PulseButton';
import { Info } from 'lucide-react-native';

export default function HomeScreen() {
  return (
    <PulseButton
      onPress={() => console.log('Pressed!')}
      title="I'M SPIRALING"
      subtitle="Tap to interrupt"
      icon={<Info size={32} color="#E8F4F0" strokeWidth={2} />}
      variant="primary"
      enablePulse={true}
    />
  );
}
```

### Props

- `onPress: () => void` - **Required** - Press handler
- `title: string` - **Required** - Main button text
- `subtitle?: string` - Optional subtitle text
- `icon?: React.ReactNode` - Optional icon (left-aligned)
- `variant?: 'primary' | 'secondary' | 'danger'` - Color scheme (default: 'primary')
- `enablePulse?: boolean` - Enable pulsing aura (default: true)
- `style?: ViewStyle` - Additional styles

### Variants

**Primary** (default)

- Background: #40916C
- Pulse: #52B788
- Text: #FFFFFF

**Secondary**

- Background: #1A4D3C
- Pulse: #2D6A4F
- Text: #E8F4F0

**Danger**

- Background: #DC2626
- Pulse: #EF4444
- Text: #FFFFFF

### Features

- **Continuous gentle pulse** - 1500ms expand/contract cycle
- **Press feedback** - Scales to 0.95 on press with spring animation
- **Haptic feedback** - Medium impact on press
- **Flexible layout** - Supports icon, title, and subtitle
- **Shadow effects** - Colored glow matching variant

---

## 🎨 Color Palette

All components use the DailyHush emerald wellness theme:

```tsx
const colors = {
  background: '#0A1612',
  foreground: '#E8F4F0',
  primary: '#40916C',
  primaryLight: '#52B788',
  primaryDark: '#2D6A4F',
  surface: '#1A4D3C',
  muted: '#95B8A8',
  accent: '#B7E4C7',
  border: '#1A2E26',
};
```

---

## 📱 Used In

### CountdownRing

- `/app/spiral.tsx` - Main countdown timer with progress indicator
- Meditation timers
- Breathing exercise visualizations
- Any timed protocols or exercises

### MagmaLoader

- Loading screens
- Data fetching states
- Screen transitions

### SuccessRipple

- `/app/spiral.tsx` - Post-check success animation
- Onboarding completion
- Achievement unlocks

### PulseButton

- `/app/index.tsx` - "I'M SPIRALING" main CTA
- High-priority action buttons
- Emergency interrupt triggers

---

## 🔧 Technical Details

All components use:

- **React Native Animated API** with `useNativeDriver: true` for 60fps performance
- **Expo Haptics** for tactile feedback
- **TypeScript** for type safety
- **NativeWind** (Tailwind) classes where applicable
- **Lucide React Native** icons

### Performance Optimization

- All animations run on native thread (GPU-accelerated)
- Cleanup on unmount prevents memory leaks
- Animated.loop used for continuous animations
- Spring animations for natural feel

---

## 🎭 Animation Philosophy

These components follow DailyHush's **organic, calming** design principles:

1. **Asynchronous timing** - Layers animate at different speeds to create organic movement
2. **Non-circular shapes** - Scale transforms create morphing, flowing effects
3. **Soft colors** - Semi-transparent emerald layers blend naturally
4. **Gentle pacing** - 1500-3000ms cycles feel meditative, not rushed
5. **Natural physics** - Spring animations for press feedback feel tactile

---

## 📚 Examples

### Loading Screen with MagmaLoader

```tsx
import { View } from 'react-native';
import { MagmaLoader } from '@/components/MagmaLoader';

export default function DataFetchScreen() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0A1612]">
        <MagmaLoader text="Analyzing patterns" size={100} />
      </View>
    );
  }

  return <YourContent />;
}
```

### Success Flow with SuccessRipple

```tsx
import { useState } from 'react';
import { View } from 'react-native';
import { SuccessRipple } from '@/components/SuccessRipple';
import { Text } from '@/components/ui/text';

export default function CompletionScreen() {
  const [showNext, setShowNext] = useState(false);

  return (
    <View className="flex-1 items-center justify-center">
      <SuccessRipple
        size={100}
        onAnimationComplete={() => {
          setTimeout(() => setShowNext(true), 500);
        }}
      />

      {showNext && <Text className="mt-8 text-xl text-[#E8F4F0]">Great job! 🎉</Text>}
    </View>
  );
}
```

### Multiple PulseButtons

```tsx
import { View } from 'react-native';
import { PulseButton } from '@/components/PulseButton';
import { Brain, TrendingUp, Settings } from 'lucide-react-native';

export default function ActionScreen() {
  return (
    <View className="flex-1 gap-4 p-6">
      <PulseButton
        onPress={() => console.log('Primary')}
        title="Start Protocol"
        subtitle="Interrupt rumination"
        icon={<Brain size={24} color="#E8F4F0" />}
        variant="primary"
        enablePulse={true}
      />

      <PulseButton
        onPress={() => console.log('Secondary')}
        title="View Insights"
        icon={<TrendingUp size={24} color="#E8F4F0" />}
        variant="secondary"
        enablePulse={false}
      />

      <PulseButton
        onPress={() => console.log('Settings')}
        title="Settings"
        variant="secondary"
        enablePulse={false}
      />
    </View>
  );
}
```

---

## 🚀 Future Enhancements

Potential additions to the animated components library:

- **WaveTransition** - Page transition with wave effect
- **FloatingParticles** - Ambient background particles
- **BreathingOrb** - Guided breathing animation
- **ProgressRing** - Circular progress with morphing effect
- **ShimmerCard** - Loading skeleton with shimmer
- **ConfettiExplosion** - Celebration animation

---

Built with ❤️ for DailyHush by the design & engineering team
