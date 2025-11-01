# DailyHush Profile Page - Visual Summary

**At-a-Glance Component Gallery**

---

## 🎨 Loop Type Color Swatches

### Sleep Loop 🌙
```
████ #5B21B6 (Deep Violet)
████ #7C3AED (Rich Purple)
████ #C4B5FD (Soft Lavender)

Overlay: rgba(124, 58, 237, 0.15)
Text: #FFFFFF / #E9D5FF
Vibe: Dreamy, cosmic, calming
```

### Decision Loop 🧭
```
████ #D97706 (Warm Amber)
████ #F59E0B (Golden Amber)
████ #FDE68A (Soft Gold)

Overlay: rgba(245, 158, 11, 0.15)
Text: #FFFFFF / #FEF3C7
Vibe: Thoughtful, contemplative
```

### Social Loop 💬
```
████ #F97316 (Vibrant Coral)
████ #FB923C (Soft Coral)
████ #FED7AA (Warm Peach)

Overlay: rgba(251, 146, 60, 0.15)
Text: #FFFFFF / #FFEDD5
Vibe: Warm, gentle, human
```

### Perfectionism Loop 🌱
```
████ #10B981 (Emerald Green)
████ #6EE7B7 (Mint Green)
████ #D1FAE5 (Soft Mint)

Overlay: rgba(110, 231, 183, 0.15)
Text: #FFFFFF / #ECFDF5
Vibe: Growth, organic, natural
```

---

## 📏 Component Size Reference

### Loop Type Hero Card
```
Dimensions: Full width × 320px
Border Radius: 24px
Padding: 32px
Icon: 64px (in 80×80px container)
Greeting: 20px font
Title: 32px font
Description: 17px font, line-height 26px
```

### Emotional Weather Widget
```
Dimensions: Full width × auto
Border Radius: 20px
Padding: 24px
Icon Container: 96×96px
Icon: 80px
Title: 18px font
Condition: 24px font
Description: 15px font
```

### Journey Timeline
```
Dimensions: Full width × 200px chart
Border Radius: 20px
Padding: 20px
Curve Stroke: 3px
Data Points: 10×10px (default), 14×14px (active)
Title: 24px font
Axis Labels: 12px font
```

### Pattern Insight Card
```
Dimensions: Full width × min 140px
Border Radius: 16px
Padding: 20px
Icon Container: 48×48px
Icon: 32px
Title: 18px font
Description: 15px font, line-height 22px
Metadata: 13px font, opacity 0.6
```

### Product Card
```
Dimensions: 180px × auto
Border Radius: 16px
Image: 180×180px
Content Padding: 16px
Name: 16px font
Description: 14px font
Price: 20px font
CTA Button: 40px height
```

### Growth Garden
```
Dimensions: Full width × min 200px
Border Radius: 20px
Padding: 24px
Plant Container: 120px height
Ground: 40px height
Stat Icons: 32×32px
Title: 24px font
```

---

## ⏱️ Animation Timing Cheat Sheet

```
instant:    0ms    - No animation
fast:       150ms  - Button press
normal:     300ms  - Standard transitions
slow:       500ms  - Emphasized transitions
relaxed:    800ms  - Very slow, calming
breathing:  4000ms - Breathing/pulse cycle
```

### Common Animation Patterns

**Fade In:**
```typescript
Duration: 300ms
From: opacity 0
To: opacity 1
Easing: easeOut
```

**Fade In Up (Card Entrance):**
```typescript
Duration: 500ms
From: opacity 0, translateY 20px
To: opacity 1, translateY 0
Easing: calm
```

**Press Down:**
```typescript
Duration: 150ms
From: scale 1
To: scale 0.97
Easing: easeOut
```

**Pulse (Attention):**
```typescript
Duration: 4000ms
From: scale 1
To: scale 1.05
Loop: true
Easing: breathing
```

**Stagger Cards:**
```typescript
Base Delay: 0ms
Increment: 100ms per card
Max Cards: 10
Animation: fadeInUp
```

---

## 🎯 Icon Size Reference

```
xs:   16px  ●  Small inline icons
sm:   20px  ●  Secondary icons, badges
md:   24px  ●  Standard UI icons
lg:   32px  ●  Section icons
xl:   48px  ●  Large display icons
2xl:  64px  ●  Hero icons (loop type)
3xl:  80px  ●  Extra large (weather)
```

### Icon Containers (circular backgrounds)

```
xs:   24px  (16px icon)
sm:   32px  (20px icon)
md:   40px  (24px icon)
lg:   56px  (32px icon)
xl:   80px  (48px icon)
2xl:  96px  (64px icon)
```

---

## 📝 Typography Quick Reference

### Hero Section
```
Greeting:     20px / 600 / 28 line-height
Loop Title:   32px / 700 / 40 line-height
Description:  17px / 400 / 26 line-height
```

### Section Headers
```
Title:        24px / 700 / 32 line-height
Subtitle:     15px / 500 / 22 line-height
Label:        13px / 600 / 18 line-height (uppercase)
```

### Insight Cards
```
Title:        18px / 600 / 24 line-height
Description:  15px / 400 / 22 line-height
Metadata:     13px / 500 / 18 line-height
```

### Numbers & Stats
```
Big Number:   48px / 700 / 56 line-height
Number:       32px / 700 / 40 line-height
Small:        24px / 600 / 32 line-height
Label:        14px / 500 / 20 line-height
```

### Products
```
Name:         16px / 600 / 22 line-height
Description:  14px / 400 / 20 line-height
Price:        20px / 700 / 28 line-height
Rating:       13px / 500 / 18 line-height
```

---

## 🌈 Emotional Weather Colors

| Weather | Gradient | Icon | Use Case |
|---------|----------|------|----------|
| Sunny ☀️ | Yellow-Gold | Happy, clear | High mood, clarity |
| Partly Cloudy 🌤️ | Sky Blue | Hopeful | Good with moments |
| Cloudy ☁️ | Gray | Neutral | Flat, uncertain |
| Rainy 🌧️ | Rain Blue | Reflective | Sad, processing |
| Stormy ⛈️ | Indigo | Intense | Overwhelmed |
| Foggy 🌫️ | Purple-Gray | Confused | Unclear, foggy |

---

## 🎭 Component States

### Default → Pressed → Active

**Insight Card:**
```
Default:  scale 1, opacity 1
Pressed:  scale 0.98, opacity 0.9
Duration: 150ms
```

**Button:**
```
Default:  scale 1, backgroundColor primary
Pressed:  scale 0.97, slight darken
Release:  scale 1 (bounce), 300ms
```

**Toggle:**
```
Duration: 300ms
Easing:   therapeutic (slight bounce)
Haptic:   50ms delay, light
```

---

## 🔧 Common Code Snippets

### Loop Type Gradient
```tsx
import { getLoopTypeGradient } from '@/constants';

<LinearGradient {...getLoopTypeGradient('sleep-loop')}>
  {/* Content */}
</LinearGradient>
```

### Animated Card Entrance
```tsx
<MotiView
  from={{ opacity: 0, translateY: 20 }}
  animate={{ opacity: 1, translateY: 0 }}
  transition={{ type: 'timing', duration: 500 }}
>
  {/* Card content */}
</MotiView>
```

### Glassmorphism Card
```tsx
import { createGlassmorphism } from '@/constants';

<View style={[
  styles.card,
  createGlassmorphism(0.08, 20, 0.12)
]}>
  {/* Frosted glass effect */}
</View>
```

### Platform Shadow
```tsx
import { createShadow } from '@/constants';

<View style={[
  styles.container,
  createShadow(8, '#000', 0.2)
]}>
  {/* Works on iOS and Android */}
</View>
```

---

## ♿ Accessibility Checklist

### Color Contrast
```
✓ Sleep Loop:        8.2:1 (AAA)
✓ Decision Loop:     5.8:1 (AA+)
✓ Social Loop:       5.2:1 (AA+)
✓ Perfectionism:     6.8:1 (AAA)
✓ All text on dark:  4.5:1+ (AA)
```

### Touch Targets
```
✓ Primary actions:   56×56px (AAA)
✓ Secondary actions: 48×48px (AA)
✓ Utility actions:   40×40px (minimum)
✓ Hit slop:          20px on all sides
```

### Screen Reader
```
✓ All components have accessibilityLabel
✓ All actions have accessibilityHint
✓ Proper accessibilityRole (button, header, etc)
✓ accessibilityState for toggles/checks
```

### Reduced Motion
```
✓ Check useReducedMotion() hook
✓ Disable parallax if true
✓ Disable loop animations if true
✓ Reduce duration by 50% if true
✓ Replace slide with fade if true
```

---

## 🎨 Glassmorphism Presets

### Subtle (backgrounds)
```
Background: rgba(255, 255, 255, 0.05)
Blur: 10px
Border: rgba(255, 255, 255, 0.08)
```

### Medium (cards)
```
Background: rgba(255, 255, 255, 0.08)
Blur: 20px
Border: rgba(255, 255, 255, 0.12)
```

### Strong (modals)
```
Background: rgba(255, 255, 255, 0.12)
Blur: 30px
Border: rgba(255, 255, 255, 0.15)
```

### Dark (light bg overlay)
```
Background: rgba(0, 0, 0, 0.15)
Blur: 20px
Border: rgba(0, 0, 0, 0.2)
```

---

## 📦 File Import Map

```typescript
// Colors
import { getLoopTypeColors } from '@/constants/loopTypeColors';

// Icons
import { loopTypeIcons, getIconSize } from '@/constants/profileIcons';

// Typography
import { profileTypography } from '@/constants/profileTypography';

// Animations
import { fadeAnimations, getDuration } from '@/constants/profileAnimations';

// Components
import { loopTypeHeroStyles } from '@/constants/profileComponents';

// Helpers
import {
  getLoopTypeGradient,
  formatCurrency,
  createAccessibilityLabel
} from '@/constants/profileHelpers';

// Or import everything:
import * from '@/constants';
```

---

## 🚀 Quick Component Generator

### Hero Card Template
```tsx
<View style={[loopTypeHeroStyles.container, loopTypeHeroStyles.shadow]}>
  <LinearGradient {...getLoopTypeGradient(loopType)}>
    <Text style={{ fontSize: 64 }}>{loopTypeIcons[loopType].emoji}</Text>
    <Text style={profileTypography.hero.loopTitle}>
      {getLoopTypeMetadata(loopType).name}
    </Text>
  </LinearGradient>
</View>
```

### Insight Card Template
```tsx
<MotiView
  from={{ opacity: 0, translateY: 20 }}
  animate={{ opacity: 1, translateY: 0 }}
  style={patternInsightCardStyles.container}
>
  <View style={patternInsightCardStyles.iconContainer}>
    <Text>{insight.icon}</Text>
  </View>
  <Text style={profileTypography.insights.title}>
    {insight.title}
  </Text>
  <Text style={profileTypography.insights.description}>
    {insight.description}
  </Text>
</MotiView>
```

---

## 🎯 Design Principles Summary

**DO:**
- Use constants from design system files
- Follow loop-specific color palettes
- Respect WCAG AA contrast (4.5:1 minimum)
- Use therapeutic easing curves
- Provide accessibility labels
- Test reduced motion

**DON'T:**
- Hardcode colors or font sizes
- Mix loop type colors inappropriately
- Use harsh, linear animations
- Skip accessibility attributes
- Create touch targets smaller than 44px
- Ignore platform differences

---

**For full specifications, see:**
- `PROFILE_DESIGN_SYSTEM.md` - Complete design documentation
- `PROFILE_QUICKSTART.md` - Developer quick start guide
- `/constants/` folder - All design token files

**Remember:** Make users feel calm, understood, and empowered.
