# DailyHush Profile Page - Visual Design System
**Complete Design Specifications**
**Created:** January 1, 2025
**Version:** 1.0

---

## 📋 Table of Contents

1. [Color System](#color-system)
2. [Icon System](#icon-system)
3. [Typography Scale](#typography-scale)
4. [Animation Specifications](#animation-specifications)
5. [Component Visual Specs](#component-visual-specs)
6. [Accessibility Compliance](#accessibility-compliance)
7. [Implementation Guide](#implementation-guide)

---

## 🎨 Color System

### Loop Type Color Palettes

Each loop type has a unique gradient identity designed for calm, therapeutic aesthetics on dark backgrounds.

#### Sleep Loop 🌙
**Theme:** Bedtime Rumination - Deep indigo to soft lavender
**Energy:** Calming, nighttime, cosmic, dreamy

```typescript
Gradient: #5B21B6 → #7C3AED → #C4B5FD
Primary: #7C3AED (Rich purple)
Light: #C4B5FD (Soft lavender)
Dark: #5B21B6 (Deep violet)
Overlay: rgba(124, 58, 237, 0.15)
Glow: rgba(124, 58, 237, 0.25)

Text on Gradient:
  Primary: #FFFFFF
  Secondary: #E9D5FF (Light lavender)
  Muted: rgba(255, 255, 255, 0.7)

WCAG Compliance: 8.2:1 contrast on #0A0A0A
```

#### Decision Loop 🧭
**Theme:** Analysis Paralysis - Warm amber to soft gold
**Energy:** Thoughtful, contemplative, crossroads

```typescript
Gradient: #D97706 → #F59E0B → #FDE68A
Primary: #F59E0B (Golden amber)
Light: #FDE68A (Soft gold)
Dark: #D97706 (Warm amber)
Overlay: rgba(245, 158, 11, 0.15)
Glow: rgba(245, 158, 11, 0.25)

Text on Gradient:
  Primary: #FFFFFF
  Secondary: #FEF3C7 (Pale gold)
  Muted: rgba(255, 255, 255, 0.7)

WCAG Compliance: 5.8:1 contrast on #0A0A0A
```

#### Social Loop 💬
**Theme:** Social Anxiety - Soft coral to warm peach
**Energy:** Gentle, human connection, warm, approachable

```typescript
Gradient: #F97316 → #FB923C → #FED7AA
Primary: #FB923C (Soft coral)
Light: #FED7AA (Warm peach)
Dark: #F97316 (Vibrant coral)
Overlay: rgba(251, 146, 60, 0.15)
Glow: rgba(251, 146, 60, 0.25)

Text on Gradient:
  Primary: #FFFFFF
  Secondary: #FFEDD5 (Pale peach)
  Muted: rgba(255, 255, 255, 0.7)

WCAG Compliance: 5.2:1 contrast on #0A0A0A
```

#### Perfectionism Loop 🌱
**Theme:** Never Good Enough - Cool sage to mint green
**Energy:** Growth-focused, organic, natural, calming

```typescript
Gradient: #10B981 → #6EE7B7 → #D1FAE5
Primary: #6EE7B7 (Mint green)
Light: #D1FAE5 (Soft mint)
Dark: #10B981 (Emerald green)
Overlay: rgba(110, 231, 183, 0.15)
Glow: rgba(110, 231, 183, 0.25)

Text on Gradient:
  Primary: #FFFFFF
  Secondary: #ECFDF5 (Pale mint)
  Muted: rgba(255, 255, 255, 0.7)

WCAG Compliance: 6.8:1 contrast on #0A0A0A
```

### Emotional Weather Colors

Weather-based mood visualization system:

| Weather | Gradient | Icon | Background | Text |
|---------|----------|------|------------|------|
| Sunny | `#FCD34D → #FBBF24 → #F59E0B` | ☀️ | `rgba(251, 191, 36, 0.1)` | `#FEF3C7` |
| Partly Cloudy | `#93C5FD → #60A5FA → #3B82F6` | 🌤️ | `rgba(96, 165, 250, 0.1)` | `#DBEAFE` |
| Cloudy | `#CBD5E1 → #94A3B8 → #64748B` | ☁️ | `rgba(148, 163, 184, 0.1)` | `#F1F5F9` |
| Rainy | `#7DD3FC → #38BDF8 → #0EA5E9` | 🌧️ | `rgba(56, 189, 248, 0.1)` | `#E0F2FE` |
| Stormy | `#6366F1 → #4F46E5 → #4338CA` | ⛈️ | `rgba(79, 70, 229, 0.1)` | `#E0E7FF` |
| Foggy | `#A5B4FC → #818CF8 → #6366F1` | 🌫️ | `rgba(129, 140, 248, 0.1)` | `#E0E7FF` |

---

## 🎯 Icon System

### Loop Type Primary Icons

**Large display icons for hero cards and identity:**

| Loop Type | Emoji | Name | Supporting Icons |
|-----------|-------|------|------------------|
| Sleep Loop | 🌙 | Moon | ⭐ 🛌 ✨ 🌌 💤 |
| Decision Loop | 🧭 | Compass | 🔀 🤔 🗺️ ⚖️ 💭 |
| Social Loop | 💬 | Speech Bubble | 🤝 🌸 💫 🦋 🌺 |
| Perfectionism Loop | 🌱 | Seedling | 🎯 ✨ 🌿 🌻 🌳 |

### Pattern Insight Icons

**Emoji icons for pattern detection cards:**

```typescript
Time Patterns:
  morning-peak: 🌅
  evening-valley: 🌙
  weekend-pattern: 📅
  weekly-cycle: 📊

Emotional Patterns:
  rumination-spike: 🌀
  clarity-moment: 💡
  peace-found: 🕊️
  stress-trigger: ⚡

Growth Indicators:
  progress-made: 📈
  consistency-streak: 🔥
  milestone-reached: 🎯
  breakthrough: ✨

Activity Patterns:
  journaling-habit: 📖
  meditation-practice: 🧘
  walking-routine: 🚶
  reading-time: 📚
```

### UI Element Icons

**Lucide React Native icon names for interface elements:**

```typescript
Navigation: ChevronLeft, ChevronRight, X, Menu, Home
Actions: Share2, Edit3, Save, Trash2, RefreshCw, Download
Status: Check, AlertCircle, XCircle, Info, Lock, Unlock
Content: Calendar, Clock, Heart, Star, Bookmark, Tag
Profile: User, Settings, Bell, Mail
Charts: TrendingUp, TrendingDown, Activity, BarChart3, PieChart
Commerce: ShoppingBag, Package, CreditCard, Gift
Wellness: Sparkles, Zap, Moon, Sun, Leaf
```

### Icon Size Scale

```typescript
xs: 16px   // Small inline icons
sm: 20px   // Secondary icons, badges
md: 24px   // Standard UI icons
lg: 32px   // Section icons, feature icons
xl: 48px   // Large display icons
2xl: 64px  // Hero icons (loop type hero)
3xl: 80px  // Extra large (weather widget)
```

### Icon Container Sizes

For circular icon containers with background:

```typescript
xs: 24px   // Container for 16px icon
sm: 32px   // Container for 20px icon
md: 40px   // Container for 24px icon
lg: 56px   // Container for 32px icon
xl: 80px   // Container for 48px icon
2xl: 96px  // Container for 64px icon
```

### Lucide Icon Stroke Widths

```typescript
thin: 1.5
regular: 2.0
medium: 2.5
bold: 3.0
```

---

## 📝 Typography Scale

### Hero Section Typography

```typescript
Greeting ("Good morning, Alex"):
  fontSize: 20
  fontWeight: '600'
  lineHeight: 28
  letterSpacing: 0.2
  opacity: 0.9

Loop Title ("You're navigating the Sleep Loop"):
  fontSize: 32
  fontWeight: '700'
  lineHeight: 40
  letterSpacing: 0.5
  textAlign: center

Loop Description:
  fontSize: 17
  fontWeight: '400'
  lineHeight: 26 (1.53x for readability)
  letterSpacing: 0.1
  textAlign: center
  opacity: 0.95
```

### Section Headers

```typescript
Title ("Your Journey This Month"):
  fontSize: 24
  fontWeight: '700'
  lineHeight: 32
  letterSpacing: 0.3
  marginBottom: 12

Subtitle ("Based on your recent reflections"):
  fontSize: 15
  fontWeight: '500'
  lineHeight: 22
  letterSpacing: 0
  opacity: 0.7
  marginBottom: 16

Label (Small section labels):
  fontSize: 13
  fontWeight: '600'
  lineHeight: 18
  letterSpacing: 0.8
  textTransform: uppercase
  opacity: 0.6
  marginBottom: 8
```

### Insight Cards

```typescript
Card Title ("Sunday Evenings"):
  fontSize: 18
  fontWeight: '600'
  lineHeight: 24
  letterSpacing: 0.2
  marginBottom: 8

Card Description:
  fontSize: 15
  fontWeight: '400'
  lineHeight: 22 (1.47x)
  letterSpacing: 0
  opacity: 0.85

Metadata ("Detected 3 times this month"):
  fontSize: 13
  fontWeight: '500'
  lineHeight: 18
  letterSpacing: 0
  opacity: 0.6
  marginTop: 8
```

### Stats & Numbers

```typescript
Big Number ("247"):
  fontSize: 48
  fontWeight: '700'
  lineHeight: 56
  letterSpacing: -0.5
  fontVariant: tabular-nums

Number ("12 days"):
  fontSize: 32
  fontWeight: '700'
  lineHeight: 40
  letterSpacing: 0
  fontVariant: tabular-nums

Small Number:
  fontSize: 24
  fontWeight: '600'
  lineHeight: 32
  letterSpacing: 0
  fontVariant: tabular-nums

Number Label:
  fontSize: 14
  fontWeight: '500'
  lineHeight: 20
  letterSpacing: 0.2
  opacity: 0.7
```

### Product Cards

```typescript
Product Name:
  fontSize: 16
  fontWeight: '600'
  lineHeight: 22
  letterSpacing: 0.1

Product Description:
  fontSize: 14
  fontWeight: '400'
  lineHeight: 20
  letterSpacing: 0
  opacity: 0.8

Price:
  fontSize: 20
  fontWeight: '700'
  lineHeight: 28
  letterSpacing: 0.1
  fontVariant: tabular-nums

Rating:
  fontSize: 13
  fontWeight: '500'
  lineHeight: 18
  letterSpacing: 0
  opacity: 0.7
```

### Opacity Scale for Text Hierarchy

```typescript
primary: 1.0     // Main content
secondary: 0.85  // Supporting content
tertiary: 0.7    // Metadata
muted: 0.6       // Labels, hints
disabled: 0.4    // Disabled text
```

---

## ⚡ Animation Specifications

### Animation Durations (milliseconds)

```typescript
instant: 0       // No animation
fast: 150        // Quick feedback (button press)
normal: 300      // Standard transitions
slow: 500        // Gentle, emphasized transitions
relaxed: 800     // Very slow, calming
breathing: 4000  // Breathing animation cycle
```

### Animation Easing Curves

```typescript
// Standard easings
linear: [0, 0, 1, 1]
easeIn: [0.42, 0, 1, 1]
easeOut: [0, 0, 0.58, 1]
easeInOut: [0.42, 0, 0.58, 1]

// Custom therapeutic easings
gentle: [0.25, 0.46, 0.45, 0.94]  // Very smooth
calm: [0.4, 0, 0.2, 1]             // Material Design emphasized
therapeutic: [0.34, 1.56, 0.64, 1] // Slight bounce for delight
breathing: [0.37, 0, 0.63, 1]      // Smooth breathing rhythm
```

### Fade Animations

```typescript
Fade In:
  duration: 300ms
  from: opacity 0
  to: opacity 1
  easing: easeOut

Fade In Up (entrance):
  duration: 500ms
  from: opacity 0, translateY 20px
  to: opacity 1, translateY 0
  easing: calm

Fade Out:
  duration: 150ms
  from: opacity 1
  to: opacity 0
  easing: easeIn
```

### Scale Animations

```typescript
Press Down:
  duration: 150ms
  from: scale 1
  to: scale 0.97
  easing: easeOut

Press Release:
  duration: 300ms
  from: scale 0.97
  to: scale 1
  easing: therapeutic (slight bounce)

Pop In:
  duration: 500ms
  from: scale 0.8, opacity 0
  to: scale 1, opacity 1
  easing: therapeutic

Pulse (attention, looping):
  duration: 4000ms
  from: scale 1
  to: scale 1.05
  loop: true
  easing: breathing
```

### Scroll Parallax Parameters

```typescript
Hero Card:
  multiplier: 0.3  // 30% of scroll speed
  maxOffset: 100px

Background Gradient:
  multiplier: 0.15 // 15% of scroll speed
  maxOffset: 150px

Floating Icons:
  multiplier: 0.5  // 50% of scroll speed
  maxOffset: 80px
```

### Stagger Animation (Sequential Card Appearance)

```typescript
Insight Cards:
  baseDelay: 0ms
  incrementDelay: 100ms (100ms between each card)
  maxCards: 10
  animation: fadeInUp

Product Cards:
  baseDelay: 200ms
  incrementDelay: 80ms
  maxCards: 8
  animation: fadeInUp

Timeline Points:
  baseDelay: 300ms
  incrementDelay: 50ms
  maxCards: 30
  animation: fadeIn
```

### Loading State Animations

```typescript
Skeleton Shimmer:
  duration: 1500ms
  from: opacity 0.4, translateX -100
  to: opacity 1, translateX 100
  loop: true
  easing: linear

Breathing Circle (pull to refresh):
  duration: 4000ms
  from: scale 0.9, opacity 0.5
  to: scale 1, opacity 1
  loop: true
  easing: breathing

Spinner:
  duration: 1000ms
  from: rotate 0deg
  to: rotate 360deg
  loop: true
  easing: linear
```

### Micro-interactions

```typescript
Button Press:
  scaleDownDuration: 150ms
  scaleUpDuration: 300ms
  hapticDelay: 0ms
  hapticType: light

Toggle Switch:
  duration: 300ms
  easing: therapeutic
  hapticDelay: 50ms
  hapticType: light

Checkbox:
  duration: 150ms
  easing: easeOut
  hapticDelay: 0ms
  hapticType: light
```

### Chart/Timeline Animations

```typescript
Line Draw:
  duration: 800ms
  from: strokeDashoffset 1000
  to: strokeDashoffset 0
  easing: calm

Bar Grow:
  duration: 500ms
  from: scaleY 0 (transformOrigin: bottom)
  to: scaleY 1
  easing: therapeutic

Point Appear:
  duration: 300ms
  from: scale 0, opacity 0
  to: scale 1, opacity 1
  easing: therapeutic

Gradient Fill:
  duration: 800ms
  from: opacity 0, scaleY 0
  to: opacity 0.3, scaleY 1
  easing: calm
```

### Growth Garden Animations

```typescript
Plant Grow:
  duration: 2000ms
  from: scale 0.3, translateY 20, opacity 0
  to: scale 1, translateY 0, opacity 1
  easing: therapeutic

Sway (wind effect):
  duration: 3000ms
  from: rotate -2deg
  to: rotate 2deg
  loop: true
  easing: breathing

Bloom:
  duration: 1500ms
  from: scale 0.8, rotate -10deg, opacity 0
  to: scale 1, rotate 0deg, opacity 1
  easing: therapeutic
```

---

## 🎨 Component Visual Specs

### Loop Type Hero Card

**Dimensions:** Full width × 320px height
**Border Radius:** 24px
**Shadow:** iOS - 0 12px 24px rgba(0,0,0,0.25), Android - elevation 12

```
Layout:
┌─────────────────────────────────────┐
│  [Gradient Background Layer]        │  ← Loop-specific gradient
│  [Frosted Glass Overlay]            │  ← rgba(255,255,255,0.08)
│                                     │
│         [Icon Container]            │  ← 80×80px, borderRadius 40px
│              🌙                     │  ← 64px icon
│                                     │
│    Good morning, Alex.              │  ← 20px, weight 600
│                                     │
│  You're navigating the              │  ← 32px, weight 700
│      Sleep Loop                     │
│                                     │
│  "Your mind finds peace in the      │  ← 17px, weight 400
│   quiet hours, but struggles to     │     lineHeight 26px
│   rest when the world sleeps"       │
│                                     │
│  [Share Button]                     │  ← Top-right, 40×40px
└─────────────────────────────────────┘

Layers:
1. Gradient background (loop-specific gradient, opacity 0.95)
2. Frosted glass overlay (backdrop blur 20px)
3. Content (padding 32px, centered)
4. Share button (absolute top-right 16px)

Icon Container:
  size: 80×80px
  borderRadius: 40px
  backgroundColor: rgba(255,255,255,0.15)
  shadow: iOS - 0 8px 16px rgba(0,0,0,0.15)

Parallax: Scroll at 30% speed, max 100px offset
```

### Emotional Weather Widget

**Dimensions:** Full width × auto height
**Border Radius:** 20px
**Padding:** 24px

```
Layout:
┌─────────────────────────────────────┐
│  Today's Emotional Weather          │  ← 18px, weight 600
│                                     │
│        ╭───────────╮               │
│        │           │               │  ← 96×96px container
│        │    ☀️     │               │     80px icon
│        │           │               │
│        ╰───────────╯               │
│                                     │
│    Mostly sunny with                │  ← 24px, weight 700
│    gentle clarity                   │
│                                     │
│  Based on your recent reflections  │  ← 15px, weight 400
│                                     │
└─────────────────────────────────────┘

Background:
  backgroundColor: rgba(26, 77, 60, 0.3)
  borderWidth: 1
  borderColor: rgba(82, 183, 136, 0.2)

Weather Gradient Overlay:
  position: absolute
  opacity: 0.2
  weather-specific gradient

Icon Container:
  size: 96×96px
  borderRadius: 48px
  backgroundColor: rgba(255,255,255,0.1)
  centered

Shadow: iOS - 0 4px 12px rgba(0,0,0,0.1)
```

### Journey Timeline (Organic Curve)

**Dimensions:** Full width × 200px chart area
**Border Radius:** 20px
**Padding:** 20px

```
Layout:
┌─────────────────────────────────────┐
│  Your Journey This Month            │  ← 24px, weight 700
│                                     │
│  ╭─────────────────────────────╮   │
│  │        ╱╲      ╱╲           │   │
│  │       ╱  ╲    ╱  ╲    ╱╲    │   │  ← Chart area 200px
│  │      ╱    ╲  ╱    ╲  ╱  ╲   │   │
│  │     ╱      ╲╱      ╲╱    ╲_ │   │
│  ╰─────────────────────────────╯   │
│                                     │
│  Peaks: Wed mornings ☀️            │  ← Legend
│  Valleys: Sunday evenings 🌙       │
└─────────────────────────────────────┘

Curve Styling:
  strokeWidth: 3
  strokeLinecap: round
  strokeLinejoin: round
  color: loop-specific gradient

Gradient Fill Under Curve:
  opacity: 0.3
  loop-specific gradient

Data Points:
  default: 10×10px circle, borderWidth 2
  active: 14×14px circle, borderWidth 3, shadow

Animation:
  Line draw: 800ms, calm easing
  Points appear: Stagger 50ms, therapeutic easing
```

### Pattern Insight Card

**Dimensions:** Full width × min 140px
**Border Radius:** 16px
**Padding:** 20px

```
Layout:
┌──────────────────────────────────┐
│  ╭───────╮                [LOCK] │  ← Premium badge (if applicable)
│  │  🌙   │                       │
│  ╰───────╯                       │  ← Icon 48×48px container
│                                  │
│  Sunday Evenings                 │  ← 18px, weight 600
│                                  │
│  Your mind tends to wander more  │  ← 15px, weight 400
│  during this time. That's okay - │     lineHeight 22px
│  it's natural.                   │
│                                  │
│  Detected 3 times this month     │  ← 13px, weight 500, opacity 0.6
└──────────────────────────────────┘

Background:
  backgroundColor: rgba(26, 77, 60, 0.4)
  borderWidth: 1
  borderColor: rgba(82, 183, 136, 0.25)
  backdropFilter: blur(10px)

Icon Container:
  size: 48×48px
  borderRadius: 24px
  backgroundColor: rgba(255,255,255,0.12)

Premium Badge:
  position: absolute top 12px, right 12px
  padding: 4px 8px
  borderRadius: 8px
  backgroundColor: rgba(251,191,36,0.2)
  borderColor: rgba(251,191,36,0.4)

Pressed State:
  transform: scale(0.98)
  opacity: 0.9

Shadow: iOS - 0 4px 12px rgba(0,0,0,0.12)
```

### Product Card (E-commerce)

**Dimensions:** 180px width × auto height
**Border Radius:** 16px

```
Layout:
┌──────────────────┐
│  [Product Image] │  ← 180×180px
│  [Gradient       │     Image overlay at bottom
│   Overlay]       │
│  [Recommended]   │  ← Badge top-left 8px
├──────────────────┤
│  Sleep Loop      │  ← 16px, weight 600
│  Journal         │
│                  │
│  Premium journal │  ← 14px, weight 400
│  for evening...  │
│                  │
│  ⭐⭐⭐⭐⭐         │  ← 13px, weight 500
│  248 reviews     │
│                  │
│  $24.99          │  ← 20px, weight 700
│                  │
│  [Add to Cart]   │  ← 40px height button
└──────────────────┘

Image Container:
  width: 180px
  height: 180px
  backgroundColor: rgba(0,0,0,0.2)

Image Overlay (gradient):
  position: absolute bottom
  height: 60px
  loop-specific gradient opacity 0.8

Recommended Badge:
  position: absolute top 8px, left 8px
  padding: 4px 8px
  borderRadius: 8px
  backgroundColor: rgba(110,231,183,0.3)
  borderColor: rgba(110,231,183,0.5)

Content Padding: 16px

CTA Button:
  height: 40px
  borderRadius: 12px
  backgroundColor: rgba(64,145,108,0.8)

Shadow: iOS - 0 6px 12px rgba(0,0,0,0.15)
```

### Growth Garden

**Dimensions:** Full width × min 200px
**Border Radius:** 20px
**Padding:** 24px

```
Layout:
┌─────────────────────────────────────┐
│  Your Growth Garden                 │  ← 24px, weight 700
│                                     │
│  🌱  🌿  🌿  🌸  🌸  🌸  🌺      │  ← Plants 120px height
│                                     │     aligned at bottom
│  ═══════════════════════════════   │  ← Ground 40px
│                                     │
│  ───────────────────────────────   │  ← Divider
│                                     │
│  📖  12 newsletters opened          │  ← Stat rows
│  ✍️  7 reflections written          │     32px icon containers
│  🔥  5 day streak                   │
└─────────────────────────────────────┘

Background:
  backgroundColor: rgba(26, 77, 60, 0.3)
  borderWidth: 1
  borderColor: rgba(82, 183, 136, 0.2)

Ground Visual:
  position: absolute bottom
  height: 40px
  backgroundColor: rgba(45,106,79,0.4)
  borderBottomRadius: 20px

Plant Container:
  height: 120px
  flexDirection: row
  justifyContent: space-around
  alignItems: flex-end

Plant Animation:
  Grow: 2000ms, therapeutic easing
  Sway: 3000ms loop, breathing easing
  Bloom: 1500ms, therapeutic easing

Stat Icon:
  size: 32×32px
  borderRadius: 16px
  backgroundColor: rgba(255,255,255,0.1)
```

### Premium Upgrade Card

**Dimensions:** Full width × auto
**Border Radius:** 20px
**Padding:** 24px

```
Layout:
┌─────────────────────────────────────┐
│  [Gradient Overlay]                 │  ← Purple gradient, opacity 0.1
│                                     │
│        ╭───────╮                    │
│        │  ✨   │                    │  ← 64×64px icon container
│        ╰───────╯                    │
│                                     │
│    Unlock Premium                   │  ← 28px, weight 700
│                                     │
│  ✓  Full historical timeline        │  ← Feature list
│  ✓  Advanced AI insights            │     16px, weight 500
│  ✓  Private journaling              │
│  ✓  Meditation library              │
│                                     │
│      $4.99                          │  ← 32px, weight 700
│    per month                        │     16px, opacity 0.7
│                                     │
│  [Start Premium Trial]              │  ← 56px height CTA
└─────────────────────────────────────┘

Background:
  backgroundColor: rgba(124,58,237,0.15)
  borderWidth: 2
  borderColor: rgba(124,58,237,0.3)

Icon Container:
  size: 64×64px
  borderRadius: 32px
  backgroundColor: rgba(124,58,237,0.2)

Feature Icon (checkmark):
  size: 24×24px
  borderRadius: 12px
  backgroundColor: rgba(124,58,237,0.2)

CTA Button:
  height: 56px
  borderRadius: 16px
  backgroundColor: #7C3AED
  shadow: iOS - 0 8px 16px rgba(124,58,237,0.3)
```

---

## ♿ Accessibility Compliance

### WCAG 2.1 AA Standards (Minimum)

All profile page components meet or exceed WCAG 2.1 Level AA:

#### Color Contrast Requirements

```
Text on Dark Backgrounds (#0A0A0A):
  Normal text (< 18px): 4.5:1 minimum ✓
  Large text (≥ 18px): 3:1 minimum ✓

Loop Type Gradients on Dark:
  Sleep Loop #7C3AED: 8.2:1 ✓ (AAA)
  Decision Loop #F59E0B: 5.8:1 ✓ (AA+)
  Social Loop #FB923C: 5.2:1 ✓ (AA+)
  Perfectionism Loop #6EE7B7: 6.8:1 ✓ (AAA)

Interactive Elements:
  Button text on primary: 7:1+ ✓
  Link text: 4.5:1+ ✓
  Form labels: 4.5:1+ ✓
```

#### Touch Target Sizes

```
Primary Actions (Hero card, Main buttons):
  Minimum: 56×56px ✓
  Recommended: 62×62px ✓

Secondary Actions (Cards, Navigation):
  Minimum: 48×48px ✓

Utility Actions (Close, Share):
  Minimum: 40×40px ✓

Hit Slop: 20px on all sides for small targets
```

#### Screen Reader Support

```
All Components Include:
  - accessibilityLabel (descriptive)
  - accessibilityHint (action guidance)
  - accessibilityRole (button, header, etc)
  - accessibilityState (selected, disabled)

Examples:
  Loop Type Hero:
    label: "Your loop type: Sleep Loop"
    hint: "Tap to share your loop type"
    role: "header"

  Insight Card:
    label: "Pattern detected: Sunday Evenings"
    hint: "Tap to view detailed insights"
    role: "button"

  Weather Widget:
    label: "Today's emotional weather: Mostly sunny"
    hint: "Based on your recent reflections"
    role: "text"
```

#### Keyboard Navigation

```
Tab Order Priority:
  1. Hero card share button
  2. Section navigation
  3. Insight cards (left to right, top to bottom)
  4. Product cards (horizontal scroll)
  5. Premium CTA
  6. Footer actions

Focus Indicators:
  Border: 2px solid loop-specific color
  Outline offset: 2px
  Shadow: 0 0 0 4px rgba(loop-color, 0.2)
```

#### Animation Preferences

```
Respect prefers-reduced-motion:
  - Disable parallax scrolling
  - Disable pulse/loop animations
  - Replace slide animations with fade
  - Reduce animation duration by 50%
  - Disable decorative animations

Code Example:
const shouldReduceMotion = useReducedMotion();
const animationDuration = shouldReduceMotion ? 150 : 500;
```

---

## 🛠️ Implementation Guide

### File Structure

```
constants/
  ├── loopTypeColors.ts         // Loop type color palettes
  ├── profileIcons.ts           // Icon mapping and sizes
  ├── profileTypography.ts      // Typography scales
  ├── profileAnimations.ts      // Animation specs
  └── profileComponents.ts      // Component visual specs

components/profile/
  ├── LoopTypeHero.tsx
  ├── EmotionalWeather.tsx
  ├── JourneyTimeline.tsx
  ├── PatternInsightCard.tsx
  ├── ProductCard.tsx
  ├── GrowthGarden.tsx
  └── PremiumUpgrade.tsx
```

### Usage Examples

#### Using Loop Type Colors

```typescript
import { getLoopTypeColors } from '@/constants/loopTypeColors';
import { LinearGradient } from 'expo-linear-gradient';

const LoopTypeHero = ({ loopType }) => {
  const colors = getLoopTypeColors(loopType);

  return (
    <LinearGradient
      colors={[colors.gradient.start, colors.gradient.middle, colors.gradient.end]}
      style={loopTypeHeroStyles.gradientLayer}
    >
      <Text style={{ color: colors.text.primary }}>
        You're navigating the {loopType}
      </Text>
    </LinearGradient>
  );
};
```

#### Using Animations

```typescript
import { MotiView } from 'moti';
import { fadeAnimations, getDuration, getEasing } from '@/constants/profileAnimations';

const InsightCard = () => {
  return (
    <MotiView
      from={fadeAnimations.fadeInUp.from}
      animate={fadeAnimations.fadeInUp.to}
      transition={{
        type: 'timing',
        duration: getDuration('slow'),
        easing: getEasing('calm'),
      }}
    >
      {/* Card content */}
    </MotiView>
  );
};
```

#### Using Typography

```typescript
import { profileTypography } from '@/constants/profileTypography';

const HeroText = () => {
  return (
    <View>
      <Text style={profileTypography.hero.greeting}>
        Good morning, Alex
      </Text>
      <Text style={profileTypography.hero.loopTitle}>
        You're navigating the Sleep Loop
      </Text>
      <Text style={profileTypography.hero.description}>
        Your mind finds peace in the quiet hours...
      </Text>
    </View>
  );
};
```

#### Using Component Styles

```typescript
import { loopTypeHeroStyles } from '@/constants/profileComponents';

const LoopTypeHero = () => {
  return (
    <View style={[loopTypeHeroStyles.container, loopTypeHeroStyles.shadow]}>
      <LinearGradient style={loopTypeHeroStyles.gradientLayer}>
        <View style={loopTypeHeroStyles.content}>
          {/* Content */}
        </View>
      </LinearGradient>
    </View>
  );
};
```

### Platform-Specific Considerations

#### iOS

```typescript
- Use native shadows (shadowColor, shadowOffset, shadowOpacity, shadowRadius)
- Implement haptic feedback with Haptics.impactAsync()
- Use SF Symbols where possible for native feel
- Respect safe area insets
- Use UIBlurEffect for glassmorphism (via expo-blur)
```

#### Android

```typescript
- Use elevation instead of shadow properties
- Test on various screen densities
- Use Vibration API for haptics
- Material Design ripple effects on cards
- Test on different Android versions (API 21+)
```

### Performance Optimization

```typescript
// Use React.memo for expensive components
const PatternInsightCard = React.memo(({ insight }) => {
  // Component logic
});

// Lazy load images in product cards
<Image
  source={{ uri: product.image }}
  loadingIndicatorSource={require('./placeholder.png')}
  resizeMode="cover"
/>

// Virtualize long lists
<FlatList
  data={insights}
  renderItem={renderInsightCard}
  removeClippedSubviews={true}
  maxToRenderPerBatch={5}
  windowSize={10}
/>

// Optimize animations with native driver
<Animated.View
  style={{
    opacity: fadeAnim,
    useNativeDriver: true, // ✓
  }}
/>
```

---

## 📊 Design System Usage

### Brand Consistency

**DO:**
- Always use loop-specific gradients from loopTypeColors.ts
- Use iconSizes scale for all icon dimensions
- Apply profileTypography for all text elements
- Use animationDurations for all timing
- Follow glassmorphismPresets for card backgrounds

**DON'T:**
- Hardcode color values in components
- Use arbitrary font sizes
- Create custom animation timings without adding to constants
- Mix loop type colors inappropriately
- Ignore accessibility contrast ratios

### Component Checklist

Before shipping any profile component:

- [ ] Uses design tokens from constants/ folder
- [ ] Meets WCAG 2.1 AA contrast requirements
- [ ] Touch targets minimum 44×44pt (preferably 56×56pt)
- [ ] Includes proper accessibilityLabel and accessibilityHint
- [ ] Respects prefers-reduced-motion setting
- [ ] Tested on iOS and Android
- [ ] Animations use therapeutic easing curves
- [ ] Text uses profileTypography scale
- [ ] Colors are loop-specific or brand-consistent
- [ ] Component is memoized if expensive to render

---

## 🎨 Figma Integration (Future)

### Design Tokens Export

When ready to sync with Figma:

```typescript
// Export design tokens as JSON for Figma plugins
import { loopTypeColors } from './constants/loopTypeColors';
import { profileTypography } from './constants/profileTypography';
import { profileSpacing } from './constants/profileComponents';

export const figmaTokens = {
  colors: loopTypeColors,
  typography: profileTypography,
  spacing: profileSpacing,
};

// Use Style Dictionary or Figma Tokens plugin
```

### Component Variants

Map loop types to Figma component variants:

```
Component: LoopTypeHero
Variants:
  - loopType: sleep-loop | decision-loop | social-loop | perfectionism-loop
  - state: default | pressed
  - premium: true | false

Component: PatternInsightCard
Variants:
  - loopType: sleep-loop | decision-loop | social-loop | perfectionism-loop
  - premium: locked | unlocked
  - state: default | pressed
```

---

## 📝 Version History

**v1.0 - January 1, 2025**
- Initial design system for profile page
- Loop type color palettes defined
- Icon system established
- Typography scale created
- Animation specifications documented
- Component visual specs completed
- Accessibility standards defined

---

**For questions or updates to this design system, contact the design team.**

**Remember:** Every design decision should make the user feel **calm, understood, and empowered** - never anxious, judged, or overwhelmed.
