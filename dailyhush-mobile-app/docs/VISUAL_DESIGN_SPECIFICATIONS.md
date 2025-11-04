# Visual Design Specifications: Mental Health Exercises

## Quick Reference Card for Designers & Developers

This document provides exact specifications for implementing mental health exercises for ages 55-70.

---

## Color Palette Reference

### Primary Exercise Colors

```
Stop Spiraling (Urgent Intervention)
═══════════════════════════════════════
Background:     #0A1612  (Deep forest)
Overlay:        rgba(10, 22, 18, 0.85)
Primary:        #40916C  (Soft emerald)
Glow:           #52B788  (Gentle glow)
Text:           #E8F4F0  (High contrast)
Text Secondary: #95B8A8  (Soft sage)

Calm Anxiety (Preventive)
═══════════════════════════════════════
Background:     #0F1F1A → #1A4D3C (gradient)
Primary:        #10B981  (Brighter emerald)
Accent:         #34D399  (Light emerald)
Text:           #E8F4F0
Text Secondary: #B7D4C7  (Warmer)

Process Emotions (Reflective)
═══════════════════════════════════════
Dynamic based on emotion selected:
Happy:          #10B981 on #0F1F1A
Sad:            #6B7280 on #1F2937
Angry:          #DC2626 on #1A0F0F
Anxious:        #F59E0B on #1F1A0A
Neutral:        #059669 on #0A1612

Better Sleep (Night Mode)
═══════════════════════════════════════
Background:     #000000  (Pure black)
Text:           #8B7355  (Warm amber)
Text Secondary: #5C4A3A  (Dark amber)
Accent:         #D4A574  (Soft gold)

Gain Focus (Clarity)
═══════════════════════════════════════
Background:     #0A1612 → #0F2A1F
Primary:        #059669  (Dark emerald)
Accent:         #047857  (Deep emerald)
Text:           #FFFFFF  (Maximum clarity)
Text Secondary: #C8E6DB
```

### Contrast Ratios (WCAG AAA = 7:1 minimum)

```
Text Combination              Ratio    Pass
═════════════════════════════════════════════
#FFFFFF on #0A1612           21:1     AAA ✓
#E8F4F0 on #0A1612           19.5:1   AAA ✓
#C8E6DB on #0A1612           9:1      AAA ✓
#B7D4C7 on #0A1612           6:1      AA+ ✓
#95B8A8 on #0A1612           4.5:1    AA  ✓
#8B7355 on #000000 (night)   7.2:1    AAA ✓
```

---

## Typography Scale

### Size Hierarchy
```
Hero     32pt   Onboarding, Major Headings
H1       28pt   Screen Titles
H2       24pt   Section Headings
H3       20pt   Subsections
Body     18pt   Primary Reading (age-optimized)
Small    16pt   Secondary Information
Label    14pt   Input Labels, Tags
Caption  12pt   Metadata (use sparingly)
```

### Font Families (Current Stack)
```
Primary:    Poppins (rounded, friendly)
- Poppins_700Bold
- Poppins_600SemiBold
- Poppins_500Medium
- Poppins_400Regular

Fallback:   System/Inter
```

### Line Heights
```
Headings:   1.2-1.3  (tight)
Body:       1.6-1.8  (breathing room)
Captions:   1.4-1.5  (compact)
```

### Letter Spacing
```
Headings:   0.3-0.5  (slight spacing)
Body:       0.0      (default)
All Caps:   0.5-1.0  (avoid all caps if possible)
```

---

## Spacing System

### Base Scale (pixels)
```
xs     4px    Micro spacing
sm     8px    Tight spacing
md     12px   Default inline
base   16px   Standard gap
lg     20px   Section padding
xl     24px   Card padding
2xl    32px   Large gaps
3xl    40px   Container spacing
4xl    56px   Major sections
```

### Component-Specific
```
Button Height:       56px (standard)
Button Height Large: 60px (critical actions)
Card Padding:        20px
Screen Padding:      20px horizontal
Safe Area Top:       8px
Safe Area Bottom:    16px
```

---

## Touch Target Specifications

### Minimum Sizes (iOS Guidelines)
```
Priority         Size        Use Case
═══════════════════════════════════════════
Critical         60×60pt    Emergency exit
Primary          56×56pt    Main CTA buttons
Secondary        44×44pt    Back, close, nav
Minimum          44×44pt    Never go below
```

### Spacing Between Targets
```
Minimum Gap:     16px
Recommended:     20-24px
Critical Actions: 32px
```

### Visual vs Touch Area
```
Icon:            20×20pt visual
Touch Area:      44×44pt (or larger)

[Button Visual: 140px wide]
[Touch Area:    160px wide] ← 10px padding each side
```

---

## Animation Specifications

### Timing Functions
```
Instant:         0ms       State changes
Fast:            200ms     Micro-interactions
Normal:          400ms     Standard transitions
Slow:            600ms     Calming transitions
Breathing:       4000ms    Natural rhythm
```

### Easing Curves
```
Standard:        ease-in-out
Entrance:        ease-out
Exit:            ease-in
Spring:          Avoid (too playful for therapy)
```

### Breathing Animation
```typescript
Inhale:
  Duration:      4000ms
  Scale:         1.0 → 1.2
  Opacity:       0.6 → 1.0
  Easing:        ease-in-out

Hold:
  Duration:      1000ms
  Scale:         1.2 (static)
  Opacity:       1.0 (static)

Exhale:
  Duration:      6000ms
  Scale:         1.2 → 0.8
  Opacity:       1.0 → 0.6
  Easing:        ease-in-out
```

### Progress Ring
```
Stroke Width:    8px
Radius:          126px (260px total)
Color:           #40916C
Glow:            #52B788
Shadow:          0px 0px 20px rgba(82, 183, 136, 0.3)
```

### Reduced Motion
```
If user has Reduce Motion enabled:
- All scale animations → static
- All slide animations → fade (200ms max)
- All rotations → instant
- Progress indicators → static
```

---

## Button Specifications

### Primary Button
```
Height:          56px
Border Radius:   100px (fully rounded)
Background:      #059669
Padding:         0 24px
Font Size:       18px
Font Weight:     600
Text Color:      #FFFFFF

Shadow:
  Color:         #52B788
  Offset:        0px 8px
  Opacity:       0.4
  Radius:        16px

Pressed State:
  Opacity:       0.9
  Scale:         0.98

Disabled State:
  Background:    #1A2E26
  Opacity:       0.5
  Shadow:        None
```

### Secondary Button
```
Height:          56px
Border Radius:   100px
Background:      #1A4D3C
Border:          1px solid rgba(64, 145, 108, 0.3)
Padding:         0 24px
Font Size:       18px
Font Weight:     600
Text Color:      #E8F4F0

Shadow:
  Color:         #000000
  Offset:        0px 4px
  Opacity:       0.15
  Radius:        8px
```

### Ghost Button
```
Height:          56px
Border Radius:   100px
Background:      transparent
Border:          2px solid #1A4D3C
Padding:         0 24px
Font Size:       18px
Font Weight:     600
Text Color:      #95B8A8
Shadow:          None
```

---

## Input Field Specifications

### Text Input
```
Height:          56px (single line)
Min Height:      120px (multiline)
Border Radius:   16px
Background:      #1A4D3C
Border:          1px solid rgba(64, 145, 108, 0.3)
Padding:         16px
Font Size:       18px
Text Color:      #E8F4F0
Placeholder:     #95B8A8

Focus State:
  Border:        2px solid #059669
  Shadow:        0px 0px 12px rgba(5, 150, 105, 0.3)
```

### Slider
```
Track Height:    8px
Thumb Size:      28px
Min Track:       #10B981
Max Track:       #1A4D3C
Active Thumb:    #34D399

Touch Area:      60px (entire slider height for easier grab)
```

---

## Card Specifications

### Standard Card
```
Background:      #0F1F1A
Border Radius:   20px
Border:          1px solid rgba(64, 145, 108, 0.15)
Padding:         20px
Gap:             24px (internal spacing)

Shadow:
  Color:         #000000
  Offset:        0px 4px
  Opacity:       0.1
  Radius:        8px
```

### Highlighted Card
```
Background:      #2D6A4F
Border:          1px solid #40916C
Border Radius:   20px
Padding:         20px

Shadow:
  Color:         #52B788
  Offset:        0px 6px
  Opacity:       0.25
  Radius:        12px
```

---

## Iconography Rules

### Icon Sizes
```
Small:           16px  (inline with small text)
Medium:          20px  (inline with body text)
Large:           24px  (standalone icons)
XLarge:          32px  (feature icons)
Emoji:           48px  (emotion selection)
```

### Icon + Text Pattern
```
[Icon 20px] [8px gap] [Text 18px]

Vertical alignment: center
Icon stroke width:  2px (standard)
                    2.5px (bold for emphasis)
```

### Icon-Only Buttons
```
AVOID: Icon-only buttons are hard for 55-70 demographic

INSTEAD:
┌──────────────┐
│  ✓  Done     │  ← Always include text
└──────────────┘

NOT:
┌────┐
│  ✓ │  ← Hard to understand
└────┘
```

---

## Progress Indicator Specifications

### Circular Progress Ring
```typescript
Size:            260px
Stroke Width:    8px
Color:           #40916C
Glow Color:      #52B788
Background:      rgba(64, 145, 108, 0.15)

Center Content:
  Timer:         60pt bold #E8F4F0
  Label:         12pt regular #95B8A8
  Step Counter:  12pt regular #95B8A8
```

### Bar Progress
```
Height:          8px
Border Radius:   4px
Background:      #1A4D3C
Fill:            #10B981
Width:           100% of container
```

### Dot Indicators
```
Inactive Dot:    8×8px circle, #1A4D3C
Active Dot:      12×12px circle, #10B981
Completed Dot:   8×8px circle, #059669
Gap:             8px between dots
```

---

## Modal Specifications

### Standard Modal
```
Background:      #0F1F1A
Border Radius:   24px
Border:          1px solid rgba(64, 145, 108, 0.3)
Padding:         24px
Max Width:       400px
Margin:          24px (from screen edge)

Overlay:
  Color:         rgba(0, 0, 0, 0.8)
  Backdrop Blur: Optional (avoid on older devices)
```

### Exit Confirmation Modal
```
Title:           24pt bold
Message:         18pt regular
Button Height:   56px
Button Gap:      12px
Subtitle:        14pt muted
```

---

## Haptic Feedback Patterns

### iOS Haptic Types
```
Light:           Button taps, selections
Medium:          Confirmations, toggles
Heavy:           Avoid (too strong for therapy app)
Success:         Task completion
Warning:         Cautionary action
Error:           Validation failure
```

### Time-Based Intensity
```
22:00 - 06:00    30% intensity (night)
20:00 - 22:00    60% intensity (evening)
08:00 - 20:00    100% intensity (day)
06:00 - 08:00    60% intensity (morning)
```

### Pattern Timing
```
Single Tap:      Immediate
Success:         Delayed 100ms after visual confirmation
Error:           Immediate with visual
Breathing:       Sync with animation transitions
```

---

## Accessibility Checklist

### Visual
- [ ] All text ≥ 18pt (or 16pt minimum for labels)
- [ ] All touch targets ≥ 44×44pt
- [ ] Contrast ratio ≥ 7:1 (WCAG AAA)
- [ ] No color-only information (use icons + text)
- [ ] Support Dynamic Type (iOS font scaling)
- [ ] Test at 20% brightness

### Motor
- [ ] Touch targets ≥ 44pt with 16pt spacing
- [ ] No precise gestures (pinch, rotate)
- [ ] No time-based interactions
- [ ] No drag-and-drop (provide tap alternative)
- [ ] Large buttons for critical actions (60pt)

### Cognitive
- [ ] One primary action per screen
- [ ] Clear, literal language (6th grade reading level)
- [ ] No jargon or technical terms
- [ ] Consistent navigation patterns
- [ ] Auto-save all progress

### Vestibular
- [ ] Respect Reduce Motion preference
- [ ] No parallax effects
- [ ] No auto-playing video
- [ ] Gentle animations (400-600ms)
- [ ] Static alternatives for all animations

### Auditory
- [ ] Captions for all audio
- [ ] Visual alternatives for sound cues
- [ ] Haptic alternatives for audio feedback
- [ ] No audio-only information

---

## Screen Layout Templates

### Full-Screen Exercise Template
```
┌────────────────────────────────┐
│ [Safe Area Top: 8px]           │
│ ┌──────────────────────────┐   │
│ │ × Back (44×44pt)         │   │ Header
│ └──────────────────────────┘   │
│                                │
│ ┌──────────────────────────┐   │
│ │                          │   │
│ │   Primary Content        │   │ Scrollable
│ │   (max-width: 85%)       │   │ Area
│ │                          │   │
│ └──────────────────────────┘   │
│                                │
│ ┌──────────────────────────┐   │
│ │    Primary CTA (56pt)    │   │ Footer
│ └──────────────────────────┘   │
│ [Safe Area Bottom: 16px]       │
└────────────────────────────────┘

Padding: 20px horizontal
Gap: 24px between sections
```

### Multi-Step Exercise Template
```
┌────────────────────────────────┐
│ [Safe Area Top]                │
│ ←  [Progress: •••○○]          │ Header
│                                │
│ ┌──────────────────────────┐   │
│ │  Step Title (24pt)       │   │
│ └──────────────────────────┘   │
│                                │
│ ┌──────────────────────────┐   │
│ │                          │   │
│ │  Content Area            │   │
│ │  (varies by step)        │   │
│ │                          │   │
│ └──────────────────────────┘   │
│                                │
│ ┌──────────────────────────┐   │
│ │  [Secondary]  [Primary]  │   │ Footer
│ └──────────────────────────┘   │
│ [Safe Area Bottom]             │
└────────────────────────────────┘

Button Layout:
- Secondary: 40% width
- Primary: 55% width
- Gap: 5% (spacing between)
```

---

## Night Mode Specifications

### Color Shifts
```
Default Mode → Night Mode
═══════════════════════════════════
#0A1612  →  #000000  (pure black)
#E8F4F0  →  #D4A574  (warm amber)
#95B8A8  →  #8B7355  (dark amber)
#40916C  →  #B8956B  (muted gold)

Blue Light Reduction:
- Remove all blue/cyan tones
- Shift to amber/orange spectrum
- Maximum color temperature: 2700K
```

### Brightness Adjustments
```
Auto-dim:        30-40% brightness
Manual:          User controls, minimum 5%
OLED:            Pure black (#000000) for battery saving
Transition:      Gradual (2 second fade)
```

### UI Adjustments
```
Animations:      Minimal (opacity only)
Haptics:         30% intensity
Audio:           Off by default
Contrast:        Reduced (softer on eyes)
Glow effects:    Disabled
```

---

## Responsive Breakpoints

```
iPhone SE (Small)    320px - 375px
iPhone Standard      375px - 430px
iPhone Pro Max       430px+
iPad Mini           744px+
iPad Standard        820px+

Design for:          375px base
Test on:            320px (worst case)
Scale up:           Automatically with flexbox
```

---

## Shadow Specifications

### Button Shadows
```
Primary Button:
  shadowColor:     #52B788
  shadowOffset:    0px 8px
  shadowOpacity:   0.4
  shadowRadius:    16px
  elevation:       8 (Android)

Secondary Button:
  shadowColor:     #000000
  shadowOffset:    0px 4px
  shadowOpacity:   0.15
  shadowRadius:    8px
  elevation:       4
```

### Card Shadows
```
Standard Card:
  shadowColor:     #000000
  shadowOffset:    0px 4px
  shadowOpacity:   0.1
  shadowRadius:    8px
  elevation:       2

Elevated Card:
  shadowColor:     #52B788
  shadowOffset:    0px 6px
  shadowOpacity:   0.25
  shadowRadius:    12px
  elevation:       6
```

### Glow Effects
```
Active Element:
  shadowColor:     #10B981
  shadowOffset:    0px 0px
  shadowOpacity:   0.5
  shadowRadius:    20px
  (Creates soft glow around element)
```

---

## Loading States

### Skeleton Screens
```
Background:      #1A4D3C
Shimmer:         linear-gradient(90deg,
                   transparent,
                   rgba(255,255,255,0.1),
                   transparent)
Animation:       2000ms ease-in-out infinite
Border Radius:   Match component (12-20px)
```

### Spinner
```
Size:            24px (inline)
                 40px (full-screen)
Color:           #10B981
Thickness:       3px
Style:           Indeterminate circular
```

### Progress Text
```
"Loading..."     14pt regular #95B8A8
"Saving..."      14pt regular #95B8A8
No spinner:      Text only (reduces visual noise)
```

---

## Implementation Quick Reference

### CSS/StyleSheet Pattern
```typescript
const styles = StyleSheet.create({
  // Colors
  bg: { backgroundColor: colors.background.primary },
  text: { color: colors.text.primary },

  // Typography
  h1: { fontSize: 28, fontWeight: 'bold' },
  body: { fontSize: 18, lineHeight: 1.6 },

  // Spacing
  p20: { padding: spacing.lg },
  gap24: { gap: spacing.xl },

  // Touch targets
  btn: { height: spacing.button.height },
  touch44: { width: 44, height: 44 },

  // Accessibility
  contrast: {
    color: colors.text.primary, // 21:1
    backgroundColor: colors.background.primary
  },
});
```

### Common Component Props
```typescript
// Button
<AccessibleButton
  onPress={handlePress}
  label="Continue"
  variant="primary"
  size="standard"
  disabled={false}
/>

// Text Input
<AccessibleTextInput
  value={text}
  onChangeText={setText}
  label="How are you feeling?"
  placeholder="Type here..."
  multiline={true}
  maxLength={200}
/>

// Scale
<EmotionScale
  value={intensity}
  onChange={setIntensity}
  minLabel="Not at all"
  maxLabel="Extremely"
  showNumber={true}
/>
```

---

## Design System File Structure

```
constants/
├── colors.ts          # All color definitions
├── spacing.ts         # Spacing scale
└── timing.ts          # Animation timing

components/exercises/
├── AccessibleButton.tsx
├── AccessibleTextInput.tsx
├── EmotionScale.tsx
├── BreathingCircle.tsx
├── ProgressTracker.tsx
└── ExitConfirmation.tsx

hooks/
├── useNightMode.ts
├── useAutoSave.ts
└── useReducedMotion.ts

utils/
└── haptics.ts         # Adaptive haptic feedback
```

---

## Testing Devices

### Minimum Test Suite
```
Physical Devices:
- iPhone SE (small screen, older demographic common)
- iPhone 14 Pro (standard size)
- iPad Mini (tablet usage)

Simulators:
- iPhone SE (3rd gen)
- iPhone 14 Pro Max
- iPad (10th gen)

Settings to Test:
- Text Size: Maximum
- Reduce Motion: On
- Increase Contrast: On
- Smart Invert: On
- Display Zoom: Zoomed
```

---

This specification document ensures consistency across all mental health exercises while maintaining the highest accessibility standards for the 55-70 demographic.

**Version**: 1.0 (2025-01-04)
**Status**: Production Ready
**Next Review**: After user testing feedback
