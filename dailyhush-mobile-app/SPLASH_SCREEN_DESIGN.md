# DailyHush Splash Screen Design Specification

## Overview
The DailyHush splash screen creates a calming, professional first impression that aligns with the app's mission to interrupt rumination spirals and stop overthinking. The design uses subtle animations and a "breaking spiral" visual metaphor to communicate the app's core value proposition.

---

## Design Philosophy

### Core Concept: "Breaking the Spiral"
The splash screen visualizes the concept of interrupting mental spirals through:
- Broken circular arcs (incomplete spirals)
- Each arc "breaks" at different points
- Subtle rotation suggests movement being stopped
- Central breaking point represents the moment of interruption

### Emotional Goals
1. **Calm**: Dark, peaceful color palette with soft gradients
2. **Trust**: Professional typography and clean layout
3. **Hope**: Subtle glow effects suggest light breaking through
4. **Clarity**: Simple, uncluttered design that doesn't overwhelm

---

## Color Palette

### Primary Colors
```
Background Base:      #0A1612  (Very dark green - main app color)
Background Gradient:  #0D1F1A  (Slightly lighter dark green)
Brand Accent:         #34D399  (emerald-400 - vibrant but calming)
Brand Light:          #6EE7B7  (emerald-300 - softer accent)
Brand Subtle:         #D1FAE5  (emerald-100 - very light, for future use)
```

### Text Colors
```
Primary Text:   #ECFDF5  (emerald-50 - soft white with green tint)
Secondary Text: #6EE7B7  (emerald-300 - for less emphasis)
Text Opacity:   0.8      (for tagline to reduce intensity)
```

### Opacity Values
```
Spiral Outer Arc:    0.3  (subtle presence)
Spiral Middle Arc:   0.5  (more visible)
Spiral Inner Arc:    0.7  (brightest)
Accent Dots:         0.6  (gentle emphasis)
Icon Opacity:        0.9  (moon - primary visibility)
```

---

## Layout Specification

### Overall Structure
```
┌─────────────────────────────────┐
│     Safe Area (iOS: 60px)       │  Platform-specific safe area
├─────────────────────────────────┤
│                                 │
│          (35% height)           │  Spacing from top
│                                 │
│    🌙                           │  Moon icon (40×40px)
│         DailyHush               │  App name (42px)
│                                 │
│   Stop the Spiral of            │  Tagline (16px)
│      Overthinking               │
│                                 │
│          (spacing)              │  60px gap
│                                 │
│      [Spiral Graphic]           │  Breaking spiral (180×180px)
│                                 │
│          (spacing)              │  60px gap
│                                 │
│      • • •                      │  Loading dots (optional)
│                                 │
│          (auto flex)            │  Remaining space
│                                 │
│     Safe Area (iOS: 40px)       │  Bottom safe area
└─────────────────────────────────┘
```

### Precise Measurements

#### App Name Section
- **Moon Icon**: 40×40px
- **Icon Bottom Margin**: 16px
- **Font Size**: 42px
- **Font Weight**: 600 (Semi-bold)
- **Letter Spacing**: 1.5px
- **Color**: #ECFDF5
- **Section Bottom Margin**: 16px

#### Tagline
- **Font Size**: 16px
- **Font Weight**: 300 (Light)
- **Letter Spacing**: 0.5px
- **Color**: #ECFDF5
- **Opacity**: 0.8
- **Horizontal Padding**: 40px (for text wrap)
- **Bottom Margin**: 60px

#### Spiral Graphic
- **Size**: 180×180px
- **Center Aligned**: Horizontally centered
- **Bottom Margin**: 60px
- **Arc Radii**:
  - Outer: 70px
  - Middle: 50px
  - Inner: 30px
- **Stroke Widths**:
  - Outer: 2px
  - Middle: 2.5px
  - Inner: 3px

#### Loading Indicator
- **Position**: Absolute, bottom 80px from screen bottom
- **Dot Size**: 8×8px circles
- **Dot Spacing**: 8px gap between dots
- **Dot Color**: #34D399

---

## Typography System

### Font Families
```
iOS:     SF Pro (System default)
Android: Roboto (System default)
```

Using system fonts ensures:
- Native feel on each platform
- Optimal readability
- No additional font loading
- Better performance

### Text Styles

#### App Name
```css
font-size: 42px
font-weight: 600
letter-spacing: 1.5px
color: #ECFDF5
text-align: center
```

#### Tagline
```css
font-size: 16px
font-weight: 300
letter-spacing: 0.5px
color: #ECFDF5
opacity: 0.8
text-align: center
```

---

## Visual Elements

### 1. Moon Icon (🌙 Metaphor)
**Concept**: Represents nighttime calm, rest, and mental peace

**Structure**:
- SVG crescent shape
- Size: 40×40px
- Color: #34D399 (emerald-400)
- Main opacity: 0.9
- Two accent stars/dots with 0.6 opacity
- Simple, minimal design

**Symbolism**:
- Night → Rest → Peace
- Complements "Hush" in DailyHush
- Universal calming symbol

### 2. Breaking Spiral Graphic
**Concept**: Visual metaphor for interrupting rumination spirals

**Structure**:
- Three concentric broken arcs
- Each arc is incomplete (uses strokeDasharray)
- Different break points create asymmetry
- Subtle rotation animation (360° over 1.2s)

**Arc Configuration**:
```
Outer Arc:
  - Radius: 70px
  - Stroke: 2px, #34D399
  - Opacity: 0.3
  - Dash: 140px visible, rest transparent
  - Offset: 0

Middle Arc:
  - Radius: 50px
  - Stroke: 2.5px, #34D399
  - Opacity: 0.5
  - Dash: 100px visible, rest transparent
  - Offset: 50px (creates different break point)

Inner Arc:
  - Radius: 30px
  - Stroke: 3px, #6EE7B7 (lighter accent)
  - Opacity: 0.7 (brightest)
  - Dash: 60px visible, rest transparent
  - Offset: 100px (third break point)
```

**Accent Elements**:
- Center dot: 5px radius, represents the "break" point
- Three interruption dots at strategic positions:
  - Right (70, 0): Shows first break
  - Upper left (-35, -60): Shows second break
  - Lower left (-50, 50): Shows third break

### 3. Background Gradient
**Structure**:
- Linear gradient, vertical direction
- Three color stops:
  - 0%: #0A1612 (base dark green)
  - 50%: #0D1F1A (slightly lighter - subtle depth)
  - 100%: #0A1612 (return to base)

**Purpose**:
- Creates subtle depth without being distracting
- Maintains dark, calming atmosphere
- Center lightness draws eye to spiral graphic

---

## Animation Specifications

### Animation Sequence
Total duration: ~2.6 seconds

#### Phase 1: Background Fade (0-0.4s)
```javascript
Duration: 400ms
Property: opacity (0 → 1)
Easing: Default
Effect: Smooth fade in from black
```

#### Phase 2: Logo + Spiral (0.4-1.6s)
```javascript
Logo:
  Duration: 600ms
  Property: opacity (0 → 1), translateY (30 → 0)
  Easing: Default
  Effect: Fade in and slide up

Spiral:
  Duration: 1200ms (starts with logo)
  Property: opacity (0 → 1), rotate (0° → 360°)
  Easing: Default
  Effect: Fade in with full rotation
```

#### Phase 3: Tagline (1.6-2.0s)
```javascript
Duration: 400ms
Property: opacity (0 → 1), translateY (20 → 0)
Easing: Default
Effect: Gentle slide up and fade in
```

#### Phase 4: Loading Animation (2.0s+, if enabled)
```javascript
Duration: 1200ms per cycle
Loop: Infinite
Effect: Wave animation across three dots
Dot opacity sequence: 0.3 → 1 → 0.3
Stagger: Each dot peaks at 33% intervals
```

### Animation Timing Rationale
- **Staggered entrance**: Prevents overwhelming the user
- **Smooth transitions**: All animations use native driver for 60fps
- **Natural pace**: Not too fast (jarring) or too slow (boring)
- **Spiral rotation**: Full 360° suggests completion/breaking of cycle

---

## Implementation Details

### Component Structure
```
SplashScreen (main component)
├── LinearGradient (background)
├── Animated.View (logo section)
│   ├── Moon Icon SVG
│   └── App Name Text
├── Animated.View (tagline)
│   └── Tagline Text
├── Animated.View (spiral)
│   └── BreakingSpiralGraphic
└── Animated.View (loading, optional)
    └── LoadingDots
```

### Props API
```typescript
interface SplashScreenProps {
  onAnimationComplete?: () => void;  // Callback when animations finish
  showLoading?: boolean;              // Show loading dots indicator
}
```

### Usage Example
```tsx
import { SplashScreen } from '@/components/SplashScreen';

// In your app entry point or _layout.tsx
export default function App() {
  const [isReady, setIsReady] = React.useState(false);

  if (!isReady) {
    return (
      <SplashScreen
        onAnimationComplete={() => setIsReady(true)}
        showLoading={true}
      />
    );
  }

  return <MainApp />;
}
```

---

## Platform-Specific Considerations

### iOS
- **Safe Area**: Top padding of 60px for notch/Dynamic Island
- **Bottom Safe Area**: 40px for home indicator
- **Font**: Uses SF Pro system font automatically
- **Status Bar**: Can be set to light content for dark background

### Android
- **Safe Area**: Top padding of 40px for status bar
- **Bottom Safe Area**: 30px for gesture navigation
- **Font**: Uses Roboto system font automatically
- **Status Bar**: Set to translucent with light icons

### Accessibility
- **No critical information**: All info is visual/branding
- **No user interaction required**: Auto-plays and dismisses
- **Respects reduced motion**: Consider disabling rotation for users with motion sensitivity
- **High contrast**: Emerald on dark green provides excellent contrast

---

## Alternative Variations (Future Considerations)

### Minimal Version
- Remove spiral graphic
- Just logo and tagline
- Faster animation (1.5s total)
- Use for returning users

### Dark Mode / Light Mode
Current design is dark-only, matching app theme. If light mode needed:
```
Background: #F0FDF4 (emerald-50)
Text: #064E3B (emerald-900)
Accents: #059669 (emerald-600)
Gradient: Lighter green tones
```

### Seasonal Variations
Could swap moon icon for:
- Sun (morning energy)
- Stars (night calm)
- Leaf (growth metaphor)

---

## Export Assets Needed

If creating static splash screens for app stores:

### iOS (App Store)
- 1242×2688px (iPhone Max)
- 1242×2208px (iPhone Plus)
- 1125×2436px (iPhone X)

### Android (Google Play)
- 1080×1920px (common resolution)
- Adaptive icon considerations

### Colors to Provide Designers
```
Primary: #34D399
Background: #0A1612
Gradient: #0D1F1A
Text: #ECFDF5
```

---

## Performance Notes

### Optimization Strategies
1. **Native Driver**: All animations use `useNativeDriver: true` for 60fps
2. **SVG vs Images**: SVG used for scalability and small bundle size
3. **No external assets**: Everything rendered programmatically
4. **Linear Gradient**: Expo's optimized LinearGradient component
5. **Minimal Re-renders**: Animation refs prevent component re-renders

### Bundle Impact
- Component size: ~8KB
- No external dependencies beyond Expo standard
- SVG rendering is hardware-accelerated
- Animation overhead is minimal

---

## Testing Checklist

- [ ] Test on iPhone 15 Pro (Dynamic Island)
- [ ] Test on iPhone SE (small screen)
- [ ] Test on Android phones (various screen sizes)
- [ ] Test on tablets (iPad, Android tablets)
- [ ] Verify animations run at 60fps
- [ ] Test with slow internet (loading state)
- [ ] Verify safe area handling
- [ ] Test rapid app restarts (animation doesn't stutter)
- [ ] Verify gradient renders correctly on both platforms
- [ ] Test with accessibility settings (reduced motion)

---

## Design Rationale

### Why This Approach?

1. **Dark Theme**: Matches app's core identity and creates calm atmosphere
2. **Green/Emerald**: Associated with growth, peace, and mental health
3. **Broken Spirals**: Direct visual metaphor for the app's core function
4. **Minimal Icons**: Moon is universally understood and doesn't require explanation
5. **System Fonts**: Native feel, better performance, accessibility
6. **Subtle Animation**: Engaging but not distracting or anxiety-inducing
7. **Professional Polish**: Builds trust for a mental health application

### Psychological Considerations
- **Dark colors**: Reduce overstimulation for anxious users
- **Slow animations**: Don't trigger anxiety or overwhelm
- **Symmetry in layout**: Creates sense of order and calm
- **Broken spirals**: Visual promise that spirals can be interrupted
- **Soft glow**: Hope and positivity without being overly bright

---

## Future Enhancements

### Potential Additions
1. **Haptic feedback**: Subtle vibration on spiral completion
2. **Sound**: Optional soft chime or breath sound
3. **Personalization**: Different color themes based on time of day
4. **Progress indicator**: For first-time setup or data loading
5. **Version number**: Small text at bottom for debugging

### A/B Testing Ideas
- With vs without spiral animation
- Different moon icon styles
- Alternative taglines
- Faster vs slower animation timing

---

## Maintenance Notes

### When to Update
- Rebrand: Update colors in one place (color constants)
- New features: Can add subtle hints in splash
- Seasonal: Can swap icons or add small seasonal elements
- Performance: Monitor animation frame rates in production

### Code Location
```
Component: /components/SplashScreen.tsx
Documentation: /SPLASH_SCREEN_DESIGN.md
Usage: Typically in app/_layout.tsx or app entry point
```

---

## Credits & Resources

### Design Tools Used
- React Native Animated API
- Expo Linear Gradient
- React Native SVG
- Figma (for design mockups - optional)

### Inspiration
- Mental health app design patterns
- Mindfulness app aesthetics
- iOS Human Interface Guidelines
- Material Design principles

---

**Document Version**: 1.0
**Last Updated**: 2025-10-24
**Designer**: Claude (AI UI Design Agent)
**Status**: Ready for Implementation
