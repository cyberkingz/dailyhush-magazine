# Mood Selector: Visual Layout Guide

## Component Anatomy with All Improvements

```
┌─────────────────────────────────────────────────────────┐
│  [iPhone Notch / Dynamic Island Area]                   │ ← Safe Area (auto-detected)
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │         Safe Area Padding (insets.top)         │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓     │
│  ┃         How are you feeling?                  ┃     │ ← Title (28px, bold)
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛     │
│                                                          │
│    Choose the mood that feels closest right now         │ ← Subtitle (16px)
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  ↓  Swipe up to see all 5 moods                  │   │ ← NEW: Scroll Hint Banner
│  └──────────────────────────────────────────────────┘   │    (emerald bg, icon + text)
│                                                          │
│  ╔══════════════════════════════════════════════════╗   │
│  ║  😌  Calm                                    [1] ║   │ ← Mood Card 1 (fully visible)
│  ║      Peaceful and centered                       ║   │   + Progress Dot (right side)
│  ╚══════════════════════════════════════════════════╝   │
│                                                          │
│  ╔══════════════════════════════════════════════════╗   │
│  ║  😰  Anxious                                 [2] ║   │ ← Mood Card 2 (fully visible)
│  ║      Worried or on edge                          ║   │   + Progress Dot (highlighted)
│  ╚══════════════════════════════════════════════════╝   │
│                                                          │
│  ╔══════════════════════════════════════╗               │
│  ║  😢  Sad                          [3] ║               │ ← Mood Card 3 (HALF visible)
│  ║      Down or tearful            ▒▒▒▒▒▒║               │   + Gradient fade starts
│  ║                                 ▒▒▒▒▒▒║               │   + Progress Dot (dim)
│  ╚═════════════════════════════════▒▒▒▒▒▒╝               │
│         ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒               │
│         ▒▒▒▒▒▒  GRADIENT FADE ▒▒▒▒▒▒▒▒▒▒▒               │ ← NEW: Stronger gradient
│         ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒       [4]     │    (120px, 4-color stops)
│         ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒               │    + Progress Dot (dim)
│         ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒               │
│         ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒               │
│         ▒▒▒▒ ┌────────────────┐ ▒▒▒▒▒▒▒▒▒               │
│         ▒▒▒▒ │       ▼        │ ▒▒▒▒▒▒▒▒▒       [5]     │ ← NEW: Bouncing Chevron
│         ▒▒▒▒ │   MORE BELOW   │ ▒▒▒▒▒▒▒▒▒               │    (animated, loops)
│         ▒▒▒▒ └────────────────┘ ▒▒▒▒▒▒▒▒▒               │    + Progress Dot (dim)
│         ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒               │
│         ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓               │
│  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■  │ ← Solid background
└─────────────────────────────────────────────────────────┘
```

---

## Legend

### Visual Elements

```
╔═══╗  Mood card (full visibility)
║   ║  88px minimum height
╚═══╝  Border: emerald color

▒▒▒▒   Gradient fade overlay
▓▓▓▓   Stronger opacity areas

┌───┐  Interactive UI elements
│   │  (buttons, indicators)
└───┘

[1-5]  Scroll progress dots
       (right side of screen)
```

---

## Interaction States

### Initial State (User Opens Modal)

```
VISIBLE:
✓ Title & Subtitle
✓ Scroll Hint Banner (with icon)
✓ Card 1: Calm (full)
✓ Card 2: Anxious (full)
✓ Card 3: Sad (50% visible, faded)
✓ Gradient Fade (strong)
✓ Bouncing Chevron (animated)
✓ Progress Dots (dots 1-2 lit, 3-5 dim)

HIDDEN:
✗ Cards 4-5 (below viewport)
```

### Mid-Scroll State (User Scrolls 100px)

```
VISIBLE:
✓ Title & Subtitle
✓ Scroll Hint Banner (fading out)
✓ Card 2: Anxious (full)
✓ Card 3: Sad (full)
✓ Card 4: Frustrated (60% visible)
✓ Gradient Fade (strong)
✓ Bouncing Chevron (still animated)
✓ Progress Dots (dots 2-3 lit, 1/4-5 dim)
✓ Haptic Feedback (fires once)

HIDDEN:
✗ Card 1 (scrolled above)
✗ Card 5 (still below)
```

### Scrolled to Bottom State

```
VISIBLE:
✓ Title & Subtitle (may be partially scrolled off)
✓ Card 3: Sad (partial/full)
✓ Card 4: Frustrated (full)
✓ Card 5: Mixed (full)
✓ Progress Dots (dots 4-5 lit, 1-3 dim)

HIDDEN (ALL INDICATORS REMOVED):
✗ Scroll Hint Banner
✗ Gradient Fade
✗ Bouncing Chevron
✗ No more visual affordances

REASON: User has discovered all content,
        indicators now unnecessary clutter.
```

---

## Animation Timings

### Entrance Animations

```
┌─────────────────────────────────────────────────────────┐
│ Time      Element               Animation                │
├─────────────────────────────────────────────────────────┤
│ 0ms       Modal Sheet           Slide up from bottom    │
│ 0ms       Overlay               Fade in (overlay blur)  │
│ 100ms     Title                 Fade in + slide up      │
│ 200ms     Subtitle              Fade in + slide up      │
│ 300ms     Scroll Hint Banner    Fade in + slide down    │
│ 350ms     Card 1 (Calm)         Fade in + slide up      │
│ 400ms     Card 2 (Anxious)      Fade in + slide up      │
│ 450ms     Card 3 (Sad)          Fade in + slide up      │
│ 500ms     Gradient Fade         Fade in                 │
│ 500ms     Bouncing Chevron      Start loop animation    │
│ 600ms     Progress Dots         Fade in + scale         │
└─────────────────────────────────────────────────────────┘

Total entrance duration: ~600ms for full reveal
```

### Looping Animations

```
Bouncing Chevron:
┌───────────────────────────────────────────┐
│ 0ms    ▼  (position: 0px, opacity: 0.6)  │
│        │                                   │
│ 500ms  ↓  (position: 4px, opacity: 0.8)  │
│        ↓                                   │
│ 1000ms ▼  (position: 8px, opacity: 1.0)  │
│        ↑                                   │
│ 1500ms ↑  (position: 4px, opacity: 0.8)  │
│        │                                   │
│ 2000ms ▼  (position: 0px, opacity: 0.6)  │
│        → LOOP REPEATS                     │
└───────────────────────────────────────────┘

Duration: 1000ms per cycle
Type: Reverse (smooth up/down)
```

---

## Scroll Progress Dot Behavior

### Visual States

```
Inactive Dot:  ○  (8px, dim, no glow)
Active Dot:    ●  (10px, bright, glows)

CALCULATION:
─────────────────────────────────────────────
Card Height: 88px (min height)
Card Margin: 16px (marginBottom)
Total per card: 104px

Card 1 visible: scrollPosition 0-104px     → Dot 1 active
Card 2 visible: scrollPosition 52-156px    → Dot 2 active
Card 3 visible: scrollPosition 104-208px   → Dot 3 active
Card 4 visible: scrollPosition 156-260px   → Dot 4 active
Card 5 visible: scrollPosition 208-312px   → Dot 5 active

Overlap = 50% of card height for smooth transitions
```

### Visual Example

```
Scroll Position: 0px (Top)
┌──────┐
│  ●   │ ← Card 1 active
│  ○   │ ← Cards 2-5 inactive
│  ○   │
│  ○   │
│  ○   │
└──────┘

Scroll Position: 100px (Mid)
┌──────┐
│  ○   │ ← Card 1 scrolled away
│  ●   │ ← Card 2 active
│  ●   │ ← Card 3 becoming visible
│  ○   │
│  ○   │
└──────┘

Scroll Position: 250px (Bottom)
┌──────┐
│  ○   │
│  ○   │
│  ○   │ ← Cards 1-3 scrolled away
│  ●   │ ← Card 4 active
│  ●   │ ← Card 5 active
└──────┘
```

---

## Gradient Breakdown

### Color Stops (Bottom to Top)

```
Height: 120px total

┌────────────────────────────────────┐  ← 0px (bottom)
│ ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ │  colors.emerald[800] (100% opaque)
├────────────────────────────────────┤  ← 30px
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  colors.emerald[800] + 'DD' (87% opaque)
├────────────────────────────────────┤  ← 60px
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │  colors.emerald[800] + '99' (60% opaque)
├────────────────────────────────────┤  ← 90px
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  transparent (0% opaque)
└────────────────────────────────────┘  ← 120px (top)

Effect: Strong fade that clearly signals "more below"
```

---

## Haptic Feedback Timeline

```
Event: Modal Opens
Action: None (no haptic)
───────────────────────────────────────────

Event: User Starts Scrolling (>10px)
Action: ⚡ Light Impact (one-time)
Feedback: Confirms scrollability
───────────────────────────────────────────

Event: User Selects Mood Card
Action: ⚡⚡ Medium Impact
Feedback: Confirms selection
───────────────────────────────────────────

Event: Continue to Next Step
Action: ⚡⚡ Medium Impact
Feedback: Confirms progression
```

---

## Safe Area Handling

### iPhone Models Coverage

```
iPhone 15 Pro Max (Dynamic Island):
┌────────────────────────────┐
│    ●■■●  ← Dynamic Island  │
│  (59px safe area top)       │
│                             │
│  ┌───────────────────────┐ │
│  │ Mood Selector Content │ │
│  │ (paddingTop: 59px)    │ │

iPhone 14 Pro (Dynamic Island):
┌────────────────────────────┐
│    ●■■●  ← Dynamic Island  │
│  (59px safe area top)       │

iPhone X/XS/11/12/13 (Notch):
┌────────────────────────────┐
│      ▬▬▬▬▬  ← Notch        │
│  (44px safe area top)       │

iPhone 8/SE (No Notch):
┌────────────────────────────┐
│  (Uses minimum 20px)        │
```

### Safe Area Implementation

```typescript
// Automatic detection
const insets = useSafeAreaInsets();

// Dynamic padding
paddingTop: Math.max(insets.top, 20)
                    ↑           ↑
                    |           └─ Minimum fallback
                    └─ Device-specific value
```

---

## Color Palette Reference

### Primary Colors Used

```
Background:
■■■■■■  colors.emerald[800]  #1A4D3C  (Dark emerald)

Accent Colors:
━━━━━━  colors.emerald[400]  #34D399  (Medium - scroll hint)
━━━━━━  colors.emerald[300]  #7dd3c0  (Bright - chevron/dots)
━━━━━━  colors.emerald[600]  #40916C  (Primary brand)

Text:
──────  colors.text.primary    #FFFFFF  (High contrast)
──────  colors.text.secondary  #C8E6DB  (WCAG AAA)

Gradients:
▓▓▓▓▓▓  rgba(26, 77, 60, 0.15)  (Banner background)
▒▒▒▒▒▒  rgba(64, 145, 108, 0.X)  (Fade overlay, varying opacity)
```

---

## Accessibility Features

### WCAG AAA Compliance

```
✓ Color Contrast: 7:1+ on all text
✓ Touch Targets: 88px+ minimum height
✓ Motion: Gentle, slow animations (1000ms)
✓ Text Size: 15px+ for body text, 28px title
✓ Semantic HTML: radiogroup, list roles
✓ Screen Reader: Full descriptions on all elements
```

### Motion Preferences

```
If user has "Reduce Motion" enabled:
→ Moti library automatically respects OS setting
→ Animations become instant transitions
→ Bouncing chevron becomes static
→ No jarring effects
```

---

## Z-Index Stack

```
Layer 4 (Top):    Progress Dots (z-index: 3)
                  └─ Always visible, never blocked

Layer 3:          Bouncing Chevron (z-index: 2)
                  └─ Above gradient, below dots

Layer 2:          Fade Gradient (z-index: 1)
                  └─ Overlays scroll content

Layer 1 (Base):   Scroll View & Mood Cards (z-index: 0)
                  └─ Content layer
```

---

## Performance Metrics

```
Scroll Event Throttle: 16ms (60fps)
Animation Frame Rate:  60fps target
Re-render Triggers:    Scroll position only
Conditional Renders:   4 elements (hide when scrolled)

Memory Impact:         Minimal (+5 state variables)
Bundle Size Impact:    ~2KB (new code)
```

---

## Testing Scenarios

### Visual Testing

```
□ Banner visible on load
□ Chevron bounces smoothly
□ Gradient fades content naturally
□ Dots highlight correctly as cards appear
□ All indicators hide at bottom scroll
□ Safe area respected on all iPhone models
```

### Interaction Testing

```
□ Haptic fires once on first scroll
□ Smooth scroll at 60fps
□ No layout shift during scroll
□ Indicators don't block touch on cards
□ Screen reader announces roles correctly
```

### Edge Cases

```
□ Very slow scroll (should still update dots)
□ Rapid scroll to bottom (indicators disappear)
□ Scroll back up (indicators reappear)
□ Landscape orientation (all elements visible)
□ Small screens (iPhone SE) - content fits
```

---

## Future Optimization Ideas

### Potential Enhancements

1. **Partial Card Visibility**
   - Adjust container height to show exactly 2.5 cards
   - Math: `height = (cardHeight * 2.5) + margins`

2. **First-Time Tutorial**
   - One-time overlay showing swipe gesture
   - Auto-dismiss after 3 seconds or first scroll

3. **Scroll Velocity Detection**
   - Faster bouncing if user tries to scroll repeatedly
   - Signals "yes, there's more content!"

4. **Voice Guidance** (Accessibility++)
   - Optional spoken hint: "Swipe up for more moods"
   - Useful for low-vision users

---

**Document Version**: 1.0
**Last Updated**: 2025-01-11
**Component**: MoodSelector.tsx
**Designer**: UI/UX Design Expert Agent
