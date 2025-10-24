# DailyHush Mobile - Component Usage Guide

## Premium Components for Tropical Theme

### PremiumCard

Enhanced card component with three visual variants and optional press handling.

**Import:**
```tsx
import { PremiumCard } from '@/components/PremiumCard';
```

**Basic Usage:**
```tsx
// Static card
<PremiumCard variant="default">
  <View style={{ padding: 20 }}>
    <Text>Card content</Text>
  </View>
</PremiumCard>

// Pressable card
<PremiumCard
  variant="elevated"
  onPress={() => router.push('/training')}
>
  <View style={{ padding: 20 }}>
    <Text>Tap me!</Text>
  </View>
</PremiumCard>
```

**Props:**
- `children`: React.ReactNode - Card content
- `onPress?`: () => void - Optional press handler
- `variant?`: 'default' | 'elevated' | 'gradient' - Visual style
- `style?`: ViewStyle - Additional styles
- `activeOpacity?`: number - Press opacity (default: 0.9)

**Variants:**
- **default**: Standard card with subtle border (best for data display)
- **elevated**: Enhanced shadow and glow (best for interactive cards)
- **gradient**: Linear gradient overlay (best for hero sections)

**Examples:**
```tsx
// Stats card
<PremiumCard variant="default" style={{ marginBottom: 16 }}>
  <View style={{ padding: 20 }}>
    <Text style={{ color: colors.text.secondary }}>Spirals interrupted</Text>
    <Text style={{ color: colors.emerald[500], fontSize: 36 }}>12</Text>
  </View>
</PremiumCard>

// Feature card with press
<PremiumCard
  variant="elevated"
  onPress={() => console.log('Pressed!')}
>
  <View style={{ padding: 20, flexDirection: 'row' }}>
    <Brain size={24} color={colors.emerald[500]} />
    <View style={{ marginLeft: 16 }}>
      <Text style={{ color: colors.text.primary }}>F.I.R.E. Training</Text>
      <Text style={{ color: colors.text.secondary }}>Start learning</Text>
    </View>
  </View>
</PremiumCard>
```

---

### TipCard

Daily rotating educational tips with automatic day-based rotation.

**Import:**
```tsx
import { TipCard } from '@/components/TipCard';
```

**Basic Usage:**
```tsx
<TipCard />

// With custom styling
<TipCard style={{ marginBottom: 24 }} />
```

**Props:**
- `style?`: any - Additional styles

**Features:**
- 8 educational tips about rumination
- Rotates automatically based on day of year
- Sparkle icon
- Premium card styling
- No configuration needed

**Tips included:**
1. Spiral timing and interruption
2. Brain threat detection
3. Rumination vs problem-solving
4. 3-3-3 grounding rule
5. 3AM mode and sleep
6. Writing reduces spiral power
7. Worry statistics
8. Average spiral duration

---

### Enhanced PulseButton

Premium button with gradient background, glow effect, and optional pulsing animation.

**Import:**
```tsx
import { PulseButton } from '@/components/PulseButton';
```

**Basic Usage:**
```tsx
<PulseButton
  onPress={() => router.push('/spiral')}
  title="I'M SPIRALING"
  subtitle="Tap to interrupt"
  variant="primary"
  enablePulse={true}
/>
```

**Props:**
- `onPress`: () => void - Press handler (required)
- `title`: string - Button text (required)
- `subtitle?`: string - Optional secondary text
- `icon?`: React.ReactNode - Optional left icon
- `variant?`: 'primary' | 'secondary' | 'danger' - Button style
- `enablePulse?`: boolean - Enable pulsing animation (default: true)
- `style?`: ViewStyle - Additional styles

**Variants:**
- **primary**: Emerald gradient (#52B788 → #40916C)
- **secondary**: Dark gradient (#1A4D3C → #2D6A4F)
- **danger**: Red gradient (#EF4444 → #DC2626)

**Examples:**
```tsx
// Primary CTA with pulse
<PulseButton
  onPress={() => handleSpiral()}
  title="I'M SPIRALING"
  subtitle="Tap to interrupt"
  icon={<Info size={32} color={colors.white} strokeWidth={2} />}
  variant="primary"
  enablePulse={true}
/>

// Secondary action without pulse
<PulseButton
  onPress={() => router.push('/training')}
  title="Start Training"
  variant="secondary"
  enablePulse={false}
/>

// Danger action
<PulseButton
  onPress={() => handleEmergency()}
  title="Emergency Support"
  variant="danger"
  enablePulse={true}
/>
```

---

### TropicalLeaf (Optional)

Simple SVG leaf decoration for subtle tropical accents.

**Import:**
```tsx
import { TropicalLeaf } from '@/components/TropicalLeaf';
```

**Basic Usage:**
```tsx
<TropicalLeaf size={48} color={colors.emerald[600]} />
```

**Props:**
- `size?`: number - Leaf size in pixels (default: 48)
- `color?`: string - Leaf color (default: colors.emerald[600])
- `style?`: any - Additional styles

**Example positioning:**
```tsx
// Top-right corner decoration
<View style={{ position: 'relative' }}>
  <TropicalLeaf
    size={64}
    color={colors.emerald[600]}
    style={{
      position: 'absolute',
      top: -20,
      right: -20,
      opacity: 0.2,
      transform: [{ rotate: '45deg' }],
    }}
  />
  <PremiumCard variant="elevated">
    {/* Card content */}
  </PremiumCard>
</View>
```

---

### BackgroundPattern (Optional)

Subtle background texture patterns for added depth.

**Import:**
```tsx
import { BackgroundPattern } from '@/components/BackgroundPattern';
```

**Basic Usage:**
```tsx
// Add to screen as first child (below StatusBar)
<View style={{ flex: 1, backgroundColor: colors.background.primary }}>
  <StatusBar style="light" />
  <BackgroundPattern variant="dots" />

  <ScrollView>
    {/* Screen content */}
  </ScrollView>
</View>
```

**Props:**
- `variant?`: 'dots' | 'grid' | 'leaves' - Pattern type (default: 'dots')

**Variants:**
- **dots**: Subtle dot grid (recommended)
- **grid**: Light grid lines
- **leaves**: Reserved for future enhancement

**Note:** Pattern has `pointerEvents="none"` so it won't interfere with touch interactions.

---

## Color System

### Importing Colors
```tsx
import { colors } from '@/constants/colors';
```

### Common Colors

**Backgrounds:**
```tsx
colors.background.primary    // #0A1612 - Main screen background
colors.background.secondary  // #0F1F1A - Card background
colors.background.tertiary   // #1A4D3C - Elevated card background
colors.background.border     // rgba(64, 145, 108, 0.15) - Subtle borders
```

**Text:**
```tsx
colors.text.primary    // #E8F4F0 - High contrast text
colors.text.secondary  // #A8CFC0 - Muted text
colors.text.tertiary   // #52B788 - Accent text
```

**Emerald Scale:**
```tsx
colors.emerald[50]   // #E8F4F0 - Lightest
colors.emerald[200]  // #B7E4C7 - Light
colors.emerald[400]  // #74C69D - Medium
colors.emerald[500]  // #52B788 - Primary accent
colors.emerald[600]  // #40916C - Primary button
colors.emerald[700]  // #2D6A4F - Secondary button
colors.emerald[800]  // #1A4D3C - Dark
```

**Gradients:**
```tsx
colors.gradients.primary  // ['#52B788', '#40916C'] - For LinearGradient
colors.gradients.accent   // ['#74C69D', '#52B788']
colors.gradients.card     // ['rgba(26, 77, 60, 0.6)', 'rgba(45, 106, 79, 0.4)']
colors.gradients.glow     // 'rgba(82, 183, 136, 0.3)' - For outer glow
```

**Shadows:**
```tsx
colors.shadow.light   // 'rgba(82, 183, 136, 0.15)'
colors.shadow.medium  // 'rgba(82, 183, 136, 0.25)'
colors.shadow.heavy   // 'rgba(0, 0, 0, 0.4)'
```

---

## Complete Screen Example

```tsx
import { View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Brain, TrendingUp } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { PulseButton } from '@/components/PulseButton';
import { PremiumCard } from '@/components/PremiumCard';
import { TipCard } from '@/components/TipCard';
import { colors } from '@/constants/colors';

export default function MyScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        {/* Hero CTA */}
        <PulseButton
          onPress={() => console.log('Spiral!')}
          title="I'M SPIRALING"
          subtitle="Tap to interrupt"
          variant="primary"
          enablePulse={true}
          style={{ marginBottom: 32 }}
        />

        {/* Stats Card */}
        <PremiumCard variant="default" style={{ marginBottom: 16 }}>
          <View style={{ padding: 20 }}>
            <Text style={{ color: colors.text.secondary, fontSize: 14 }}>
              Spirals interrupted
            </Text>
            <Text style={{ color: colors.emerald[500], fontSize: 36, fontWeight: 'bold' }}>
              12
            </Text>
          </View>
        </PremiumCard>

        {/* Feature Card */}
        <PremiumCard
          variant="elevated"
          onPress={() => console.log('Training')}
          style={{ marginBottom: 16 }}
        >
          <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: colors.emerald[600] + '30',
                padding: 12,
                borderRadius: 16,
                marginRight: 16,
              }}
            >
              <Brain size={24} color={colors.emerald[500]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text.primary, fontSize: 18, fontWeight: '600' }}>
                F.I.R.E. Training
              </Text>
              <Text style={{ color: colors.text.secondary, fontSize: 14 }}>
                Start your training
              </Text>
            </View>
            <Text style={{ color: colors.emerald[500], fontSize: 20 }}>→</Text>
          </View>
        </PremiumCard>

        {/* Daily Tip */}
        <TipCard />
      </ScrollView>
    </View>
  );
}
```

---

## Best Practices

### Card Hierarchy
1. **Hero/Primary CTA**: Use gradient PulseButton with pulse enabled
2. **Important stats**: Use PremiumCard with `variant="default"`
3. **Interactive features**: Use PremiumCard with `variant="elevated"` + onPress
4. **Educational content**: Use TipCard or PremiumCard with `variant="default"`

### Spacing
- Between sections: 24-32px
- Between cards: 16px
- Card padding: 20px
- Screen padding: 20px horizontal

### Border Radius
- Cards: 24px
- Icon containers: 16px
- Buttons: 24px
- Small elements: 12px

### Shadows
- Use emerald-tinted shadows for depth
- Light shadows: `shadowRadius: 12, elevation: 3`
- Medium shadows: `shadowRadius: 16, elevation: 5`
- Heavy shadows: `shadowRadius: 20, elevation: 8`

### Color Usage
- High contrast for primary actions (emerald[500], emerald[600])
- Muted colors for secondary text (text.secondary)
- Alpha values for subtle depth (emerald[600] + '30')
- Gradients only on hero CTAs

---

## Migration from Old Components

### Before:
```tsx
<View className="bg-[#1A4D3C] rounded-2xl p-5">
  <Text className="text-[#E8F4F0]">Content</Text>
</View>
```

### After:
```tsx
<PremiumCard variant="elevated" style={{ marginBottom: 16 }}>
  <View style={{ padding: 20 }}>
    <Text style={{ color: colors.text.primary }}>Content</Text>
  </View>
</PremiumCard>
```

### Why?
- Better visual depth with shadows
- Consistent border radius (24px)
- Proper color system usage
- Press handling built-in
- Gradient support

---

**Version:** 1.0
**Last Updated:** 2025-10-24
