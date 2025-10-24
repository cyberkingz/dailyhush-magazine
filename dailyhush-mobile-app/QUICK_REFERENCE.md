# DailyHush Tropical Theme - Quick Reference Card

## Import Statements

```tsx
// Colors
import { colors } from '@/constants/colors';

// Components
import { PremiumCard } from '@/components/PremiumCard';
import { TipCard } from '@/components/TipCard';
import { PulseButton } from '@/components/PulseButton';
import { TropicalLeaf } from '@/components/TropicalLeaf';
import { BackgroundPattern } from '@/components/BackgroundPattern';

// Icons
import { Brain, Moon, Info, TrendingUp, Sparkles } from 'lucide-react-native';
```

---

## Color Quick Reference

```tsx
// Backgrounds
colors.background.primary     // #0A1612 - Main screen
colors.background.secondary   // #0F1F1A - Cards
colors.background.tertiary    // #1A4D3C - Elevated cards
colors.background.border      // rgba(64, 145, 108, 0.15)

// Text
colors.text.primary          // #E8F4F0 - Main text
colors.text.secondary        // #A8CFC0 - Muted text
colors.text.tertiary         // #52B788 - Accent text

// Emerald
colors.emerald[500]          // #52B788 - Primary accent
colors.emerald[600]          // #40916C - Primary button
colors.emerald[700]          // #2D6A4F - Secondary button

// Gradients
colors.gradients.primary     // ['#52B788', '#40916C']
colors.gradients.glow        // 'rgba(82, 183, 136, 0.3)'

// Shadows
colors.shadow.light          // 'rgba(82, 183, 136, 0.15)'
colors.shadow.medium         // 'rgba(82, 183, 136, 0.25)'
```

---

## Component Cheat Sheet

### PremiumCard

```tsx
// Default card (data display)
<PremiumCard variant="default">
  <View style={{ padding: 20 }}>
    <Text>Content</Text>
  </View>
</PremiumCard>

// Elevated card (interactive)
<PremiumCard
  variant="elevated"
  onPress={() => handlePress()}
>
  <View style={{ padding: 20 }}>
    <Text>Tap me</Text>
  </View>
</PremiumCard>

// Gradient card (hero sections)
<PremiumCard variant="gradient">
  <View style={{ padding: 20 }}>
    <Text>Hero content</Text>
  </View>
</PremiumCard>
```

### TipCard

```tsx
// Simple - no props needed
<TipCard />

// With custom styling
<TipCard style={{ marginBottom: 24 }} />
```

### PulseButton

```tsx
// Primary CTA
<PulseButton
  onPress={() => handleAction()}
  title="I'M SPIRALING"
  subtitle="Tap to interrupt"
  variant="primary"
  enablePulse={true}
/>

// Secondary action
<PulseButton
  onPress={() => handleAction()}
  title="Start Training"
  variant="secondary"
  enablePulse={false}
/>

// With icon
<PulseButton
  onPress={() => handleAction()}
  title="ACTION"
  icon={<Info size={32} color={colors.white} />}
  variant="primary"
/>
```

---

## Common Patterns

### Screen Layout

```tsx
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
        {/* Content */}
      </ScrollView>
    </View>
  );
}
```

### Feature Card

```tsx
<PremiumCard
  variant="elevated"
  onPress={() => router.push('/route')}
  style={{ marginBottom: 16 }}
>
  <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
    {/* Icon container */}
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

    {/* Text content */}
    <View style={{ flex: 1 }}>
      <Text
        style={{
          color: colors.text.primary,
          fontSize: 18,
          fontWeight: '600',
          marginBottom: 4,
        }}
      >
        Feature Title
      </Text>
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: 14,
          lineHeight: 20,
        }}
      >
        Feature description
      </Text>
    </View>

    {/* Arrow */}
    <Text style={{ color: colors.emerald[500], fontSize: 20, marginLeft: 8 }}>
      →
    </Text>
  </View>
</PremiumCard>
```

### Stats Display

```tsx
<PremiumCard variant="default">
  <View style={{ padding: 20 }}>
    <Text
      style={{
        color: colors.text.secondary,
        fontSize: 14,
        marginBottom: 8,
      }}
    >
      Metric Name
    </Text>
    <Text
      style={{
        color: colors.emerald[500],
        fontSize: 36,
        fontWeight: 'bold',
      }}
    >
      {value}
    </Text>
  </View>
</PremiumCard>
```

---

## Style Snippets

### Standard Card Padding
```tsx
style={{ padding: 20 }}
```

### Icon Container
```tsx
style={{
  backgroundColor: colors.emerald[600] + '30',
  padding: 12,
  borderRadius: 16,
}}
```

### Section Title
```tsx
style={{
  color: colors.text.primary,
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 12,
}}
```

### Body Text
```tsx
style={{
  color: colors.text.secondary,
  fontSize: 14,
  lineHeight: 20,
}}
```

### Large Number
```tsx
style={{
  color: colors.emerald[500],
  fontSize: 36,
  fontWeight: 'bold',
}}
```

---

## Spacing Standards

```tsx
// Between sections
marginBottom: 24

// Between cards
marginBottom: 16

// Card padding
padding: 20

// Screen padding
paddingHorizontal: 20

// Icon margin
marginRight: 16

// Text line height
lineHeight: 20
```

---

## Shadow Presets

### Light Shadow (default cards)
```tsx
shadowColor: colors.shadow.light,
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 1,
shadowRadius: 12,
elevation: 3,
```

### Medium Shadow (elevated cards)
```tsx
shadowColor: colors.shadow.light,
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 1,
shadowRadius: 16,
elevation: 5,
```

### Heavy Shadow (buttons)
```tsx
shadowColor: colors.emerald[500],
shadowOffset: { width: 0, height: 8 },
shadowOpacity: 0.4,
shadowRadius: 16,
elevation: 8,
```

---

## Border Radius Standards

```tsx
// Cards & Buttons
borderRadius: 24

// Icon containers
borderRadius: 16

// Small elements
borderRadius: 12

// Pills/badges
borderRadius: 999
```

---

## Common Gradients

```tsx
import { LinearGradient } from 'expo-linear-gradient';

// Primary gradient
<LinearGradient
  colors={colors.gradients.primary}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
  {/* Content */}
</LinearGradient>

// Accent gradient
<LinearGradient
  colors={colors.gradients.accent}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
  {/* Content */}
</LinearGradient>
```

---

## Checklist for New Screens

- [ ] Import colors from constants
- [ ] Use PremiumCard for containers
- [ ] Use TipCard for educational content
- [ ] Use PulseButton for primary CTAs
- [ ] 20px horizontal padding
- [ ] 24px spacing between sections
- [ ] 16px spacing between cards
- [ ] 24px border radius on cards
- [ ] Emerald-tinted shadows
- [ ] Proper text hierarchy

---

## Migration Quick Tips

### Replace hardcoded colors
```tsx
// Old
color: '#E8F4F0'

// New
color: colors.text.primary
```

### Replace basic View with PremiumCard
```tsx
// Old
<View className="bg-[#1A4D3C] rounded-2xl p-5">

// New
<PremiumCard variant="elevated">
  <View style={{ padding: 20 }}>
```

### Replace basic button with PulseButton
```tsx
// Old
<Pressable style={styles.button}>
  <Text>Action</Text>
</Pressable>

// New
<PulseButton
  onPress={() => {}}
  title="Action"
  variant="primary"
/>
```

---

## Performance Tips

- Use `enablePulse={false}` on secondary buttons
- Set `pointerEvents="none"` on decorative elements
- Enable native driver in animations
- Use LinearGradient sparingly (hero elements only)

---

## Accessibility Checklist

- [ ] 44x44pt minimum touch targets
- [ ] WCAG AA contrast ratios (15.6:1, 9.2:1)
- [ ] Clear press states
- [ ] Haptic feedback on interactions
- [ ] Semantic structure

---

## File Locations

```
constants/colors.ts          ← Color system
components/PremiumCard.tsx   ← Card component
components/TipCard.tsx       ← Tip component
components/PulseButton.tsx   ← Button component
components/TropicalLeaf.tsx  ← Leaf decoration
app/index.tsx                ← Example implementation
```

---

## Documentation

- `TROPICAL_THEME_IMPLEMENTATION.md` - Technical details
- `COMPONENT_USAGE_GUIDE.md` - Complete API docs
- `BEFORE_AFTER.md` - Visual comparison
- `IMPLEMENTATION_SUMMARY.md` - Change summary
- `QUICK_REFERENCE.md` - This file

---

**Quick Start:** Copy-paste the component snippets above and adjust colors/text as needed!
