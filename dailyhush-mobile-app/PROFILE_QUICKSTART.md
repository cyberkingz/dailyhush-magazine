# DailyHush Profile Design System - Quick Start Guide

**For Developers**
**5-Minute Setup Guide**

---

## 📦 What You Got

New design system files in `/constants/`:

1. **loopTypeColors.ts** - Loop-specific color palettes
2. **profileIcons.ts** - Icon system and sizes
3. **profileTypography.ts** - Typography scales
4. **profileAnimations.ts** - Animation specs
5. **profileComponents.ts** - Component visual specs
6. **profileHelpers.ts** - Utility functions

---

## 🚀 Quick Examples

### 1. Loop Type Hero Card

```tsx
import { getLoopTypeColors, loopTypeIcons } from '@/constants';
import { LinearGradient } from 'expo-linear-gradient';

const LoopTypeHero = ({ loopType, userName }) => {
  const colors = getLoopTypeColors(loopType);
  const icon = loopTypeIcons[loopType];

  return (
    <LinearGradient
      colors={[
        colors.gradient.start,
        colors.gradient.middle,
        colors.gradient.end,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ height: 320, borderRadius: 24 }}
    >
      <View style={{ padding: 32, alignItems: 'center' }}>
        <Text style={{ fontSize: 64 }}>{icon.emoji}</Text>
        <Text style={{ fontSize: 32, color: colors.text.primary }}>
          {loopType.replace('-', ' ')}
        </Text>
      </View>
    </LinearGradient>
  );
};
```

### 2. Insight Card with Animation

```tsx
import { MotiView } from 'moti';
import { fadeAnimations, patternInsightCardStyles } from '@/constants';

const InsightCard = ({ insight, index }) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 500,
        delay: index * 100, // Stagger animation
      }}
      style={patternInsightCardStyles.container}
    >
      <View style={patternInsightCardStyles.iconContainer}>
        <Text style={{ fontSize: 32 }}>{insight.icon}</Text>
      </View>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>
        {insight.title}
      </Text>
      <Text style={{ fontSize: 15, opacity: 0.85 }}>
        {insight.description}
      </Text>
    </MotiView>
  );
};
```

### 3. Product Card

```tsx
import { productCardStyles, formatCurrency } from '@/constants';

const ProductCard = ({ product }) => {
  return (
    <Pressable style={productCardStyles.container}>
      <View style={productCardStyles.imageContainer}>
        <Image source={{ uri: product.image }} />
      </View>

      <View style={productCardStyles.content}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>
          {product.name}
        </Text>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>
          {formatCurrency(product.price)}
        </Text>
        <Pressable style={productCardStyles.ctaButton}>
          <Text style={{ color: '#FFF' }}>Add to Cart</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};
```

---

## 🎨 Common Patterns

### Using Loop-Specific Colors

```tsx
// Get colors for a loop type
const colors = getLoopTypeColors('sleep-loop');

// Use in styles
<View style={{ backgroundColor: colors.overlay }}>
  <Text style={{ color: colors.text.primary }}>Hello</Text>
</View>

// Create gradient
<LinearGradient
  colors={[colors.gradient.start, colors.gradient.end]}
>
  {/* Content */}
</LinearGradient>
```

### Using Icons

```tsx
// Emoji icons
const icon = loopTypeIcons['sleep-loop'];
<Text>{icon.emoji}</Text> // 🌙

// Lucide icons
import { Moon } from 'lucide-react-native';
import { getIconSize } from '@/constants';

<Moon size={getIconSize('lg')} color="#FFF" />
```

### Using Typography

```tsx
import { profileTypography } from '@/constants';

<Text style={profileTypography.hero.loopTitle}>
  Sleep Loop
</Text>

<Text style={profileTypography.insights.description}>
  Your mind tends to wander...
</Text>
```

### Using Animations

```tsx
import { MotiView } from 'moti';
import { fadeAnimations, getDuration } from '@/constants';

<MotiView
  from={fadeAnimations.fadeInUp.from}
  animate={fadeAnimations.fadeInUp.to}
  transition={{
    type: 'timing',
    duration: getDuration('slow'),
  }}
>
  {/* Animated content */}
</MotiView>
```

---

## 🛠️ Helper Functions

### Gradients

```tsx
import { getLoopTypeGradient } from '@/constants';

const gradient = getLoopTypeGradient('sleep-loop');
<LinearGradient {...gradient}>
  {/* Content */}
</LinearGradient>
```

### Responsive Fonts

```tsx
import { getResponsiveFontSize } from '@/constants';

const fontSize = getResponsiveFontSize(24); // Scales based on screen
```

### Accessibility

```tsx
import { createAccessibilityLabel, createAccessibilityHint } from '@/constants';

<Pressable
  accessibilityLabel={createAccessibilityLabel('loopTypeHero', {
    loopType: 'sleep-loop',
    description: 'Bedtime rumination',
  })}
  accessibilityHint={createAccessibilityHint('share')}
>
  {/* Content */}
</Pressable>
```

### Growth Garden

```tsx
import { calculateGrowthStage, getPlantEmoji, getGrowthMessage } from '@/constants';

const stage = calculateGrowthStage(12, 7, 3); // 'sprout'
const emoji = getPlantEmoji(stage); // 🌿
const message = getGrowthMessage(stage); // "Your garden is starting to grow..."
```

---

## 📱 Platform-Specific

### Shadows

```tsx
import { createShadow } from '@/constants';

<View style={[
  styles.card,
  createShadow(8, '#000', 0.2) // Works on iOS and Android
]}>
  {/* Card content */}
</View>
```

### Glassmorphism

```tsx
import { createGlassmorphism } from '@/constants';

<View style={[
  styles.card,
  createGlassmorphism(0.08, 20, 0.12)
]}>
  {/* Frosted glass card */}
</View>
```

---

## ♿ Accessibility

### Reduced Motion

```tsx
import { useReducedMotion, getAccessibleDuration } from '@/constants';

const Component = () => {
  const reducedMotion = useReducedMotion();
  const duration = getAccessibleDuration(500, 150);

  return (
    <MotiView
      animate={{ opacity: 1 }}
      transition={{ duration }}
    >
      {/* Content */}
    </MotiView>
  );
};
```

### Touch Targets

```tsx
import { TOUCH_TARGETS } from '@/constants/designTokens';

<Pressable
  style={{
    minWidth: TOUCH_TARGETS.primary.minWidth, // 56px
    minHeight: TOUCH_TARGETS.primary.minHeight, // 56px
  }}
  hitSlop={20} // Extend touch area
>
  {/* Button */}
</Pressable>
```

---

## 🎯 Best Practices

### DO:

```tsx
// ✓ Use constants
import { loopTypeColors, profileTypography } from '@/constants';
const colors = getLoopTypeColors(loopType);

// ✓ Use helper functions
const gradient = getLoopTypeGradient('sleep-loop');

// ✓ Provide accessibility
accessibilityLabel="Your loop type: Sleep Loop"

// ✓ Respect reduced motion
const duration = getAccessibleDuration(500);
```

### DON'T:

```tsx
// ✗ Hardcode colors
<View style={{ backgroundColor: '#7C3AED' }}>

// ✗ Hardcode font sizes
<Text style={{ fontSize: 24 }}>

// ✗ Ignore accessibility
<Pressable onPress={...}> {/* Missing label */}

// ✗ Use arbitrary animations
<Animated.View duration={347}> {/* Not from constants */}
```

---

## 📚 Full Documentation

See `PROFILE_DESIGN_SYSTEM.md` for:
- Complete color palettes
- All icon mappings
- Typography specifications
- Animation timing details
- Component visual specs
- Accessibility standards

---

## 🐛 Common Issues

### Colors not showing on Android?

```tsx
// Use elevation instead of iOS shadows
import { Platform } from 'react-native';

const shadow = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.2 },
  android: { elevation: 4 },
});
```

### Animations not smooth?

```tsx
// Enable native driver
<MotiView
  animate={{ opacity: 1 }}
  transition={{ type: 'timing', useNativeDriver: true }}
>
```

### Text hard to read?

```tsx
// Check contrast ratio (use colors from constants)
const colors = getLoopTypeColors(loopType);
<Text style={{ color: colors.text.primary }}> // High contrast
```

---

## 🚢 Ready to Ship Checklist

Before shipping any profile component:

- [ ] Uses colors from `loopTypeColors.ts`
- [ ] Uses typography from `profileTypography.ts`
- [ ] Uses animations from `profileAnimations.ts`
- [ ] Includes `accessibilityLabel` and `accessibilityHint`
- [ ] Respects `prefers-reduced-motion`
- [ ] Touch targets at least 44×44pt
- [ ] Tested on iOS and Android
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Component is memoized if expensive

---

**Questions?** Check the full design system docs or ask the team!

**Remember:** Make users feel calm and understood, never anxious or judged.
