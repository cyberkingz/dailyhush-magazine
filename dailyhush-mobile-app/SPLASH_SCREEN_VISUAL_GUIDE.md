# DailyHush Splash Screen - Visual Guide

A visual reference for the splash screen design with ASCII art mockups and detailed specifications.

---

## Full Screen Layout

```
┌───────────────────────────────────────┐
│                                       │
│            [Safe Area]                │ ← iOS: 60px, Android: 40px
│                                       │
│                                       │
│              ╭─────╮                  │
│             ╱       ╲                 │
│            │    🌙   │                │ ← Moon Icon (40×40px)
│             ╲       ╱                 │   Color: #34D399
│              ╰─────╯                  │   Opacity: 0.9
│                                       │
│                                       │
│          D a i l y H u s h           │ ← App Name (42px, Semi-bold)
│                                       │   Color: #ECFDF5
│                                       │   Letter-spacing: 1.5px
│                                       │
│                                       │
│     Stop the Spiral of Overthinking   │ ← Tagline (16px, Light)
│                                       │   Color: #ECFDF5
│                                       │   Opacity: 0.8
│                                       │
│                                       │
│              ╭───────╮                │
│            ╱    ╱ ╲    ╲              │
│          ╱     ╱   ╲     ╲            │
│         │     │  •  │     │           │ ← Breaking Spiral
│          ╲     ╲   ╱     ╱            │   (180×180px)
│            ╲    ╲ ╱    ╱              │   3 broken arcs
│              ╰───────╯                │   Color: #34D399
│                • •                    │   Accent: #6EE7B7
│                                       │
│                                       │
│                                       │
│               • • •                   │ ← Loading Dots (optional)
│                                       │   Size: 8×8px each
│                                       │   Color: #34D399
│                                       │   Wave animation
│                                       │
│                                       │
│            [Safe Area]                │ ← iOS: 40px, Android: 30px
│                                       │
└───────────────────────────────────────┘
     ↑                             ↑
Background Gradient:            Safe areas
#0A1612 → #0D1F1A → #0A1612   auto-adjust
```

---

## Color Swatches

```
███████████  #0A1612  Background Base (Very Dark Green)
███████████  #0D1F1A  Gradient Middle (Slightly Lighter)
███████████  #34D399  Primary Accent (Emerald-400)
███████████  #6EE7B7  Secondary Accent (Emerald-300)
███████████  #ECFDF5  Text Color (Emerald-50)
```

---

## Breaking Spiral Detail View

```
        Outer Arc (r=70px, opacity 0.3)
             ╭────────────────╮
            ╱                  ╲
          ╱    Middle Arc       ╲
         │     (r=50px, 0.5)     │
        │                         │
        │    ╭─────────────╮     │
        │   ╱  Inner Arc    ╲    │
        │  │   (r=30px,0.7) │   │
        │  │                 │   │
        │  │       • ←────────────── Center Dot (break point)
        │  │     (r=5px)     │   │
        │   ╲               ╱    │
        │    ╰─────────────╯     │
        │           •            │ ← Accent dots show
         │          ↑            │   "interruption points"
          ╲    Break points    ╱
            ╲                ╱
             ╰──────────────╯
                    •

Legend:
─────  Solid portion of arc
       (Empty space where arc "breaks")
  •    Interruption point accent dots
```

---

## Moon Icon Detail

```
       ╭──────╮
      ╱        ╲
     │          │
     │    ╭─────╯
     │   ╱    ⋆       ← Small star/accent dot
     │  │             (r=2px, opacity 0.6)
     │  │
     │  │    ⋆        ← Another accent dot
     │  │             (r=1.5px, opacity 0.6)
     │   ╲
     │    ╰─────╮
     │          │
      ╲        ╱
       ╰──────╯

Shape: Crescent moon
Size: 40×40px viewBox
Fill: #34D399
Opacity: 0.9 (main shape), 0.6 (accent dots)
```

---

## Typography Samples

### App Name
```
D a i l y H u s h

Size:    42px
Weight:  600 (Semi-bold)
Spacing: 1.5px
Color:   #ECFDF5
Font:    System (SF Pro / Roboto)
```

### Tagline
```
Stop the Spiral of Overthinking

Size:    16px
Weight:  300 (Light)
Spacing: 0.5px
Color:   #ECFDF5
Opacity: 0.8
Font:    System (SF Pro / Roboto)
```

---

## Animation States

### State 1: Initial (0s)
```
┌─────────────────┐
│                 │
│                 │
│                 │  Everything is
│                 │  invisible
│                 │  (opacity: 0)
│                 │
│                 │
└─────────────────┘
Background: Solid #0A1612
```

### State 2: Background Fade (0-0.4s)
```
┌─────────────────┐
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  Gradient fades in
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  (opacity: 0 → 1)
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
└─────────────────┘
```

### State 3: Logo Appears (0.4-1.0s)
```
┌─────────────────┐
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│▒▒▒▒▒ 🌙 ▒▒▒▒▒▒▒▒│  Logo fades in
│▒▒ DailyHush ▒▒▒▒│  and slides up
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  (translateY: 30→0)
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
└─────────────────┘
```

### State 4: Spiral Rotates (0.4-1.6s)
```
┌─────────────────┐
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│▒▒▒▒ 🌙 ▒▒▒▒▒▒▒▒▒│
│▒▒ DailyHush ▒▒▒▒│
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│▒▒▒▒  ╱ ╲  ▒▒▒▒▒▒│  Spiral appears
│▒▒▒ ╱  •  ╲ ▒▒▒▒▒│  and rotates 360°
│▒▒▒▒  ╲ ╱  ▒▒▒▒▒▒│  (rotate: 0→360)
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
└─────────────────┘
```

### State 5: Complete (1.6-2.0s)
```
┌─────────────────┐
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│▒▒▒▒ 🌙 ▒▒▒▒▒▒▒▒▒│
│▒▒ DailyHush ▒▒▒▒│
│ Stop the Spiral │  Tagline appears
│▒▒▒  ╱ ╲  ▒▒▒▒▒▒▒│  (fade in + slide)
│▒▒ ╱  • • ╲ ▒▒▒▒▒│
│▒▒▒  ╲ ╱  ▒▒▒▒▒▒▒│
│▒▒▒▒  • • •  ▒▒▒▒│  Loading dots
└─────────────────┘
```

---

## Spacing & Measurements

```
┌────────────── Screen Width ──────────────┐
│                                           │
│  ← 60px Safe Area (iOS) / 40px (Android)  │
│                                           │
│              40×40px                      │
│                 ▼                         │
│               [🌙]                        │
│                 ↕ 16px                    │
│            [DailyHush]                    │
│                 ↕ 16px                    │
│          [Tagline Text]                   │
│                 ↕ 60px                    │
│          ┌─────────────┐                  │
│          │   180×180px │                  │
│          │   [Spiral]  │                  │
│          └─────────────┘                  │
│                 ↕ 60px                    │
│              [• • •]                      │
│                 ↕ 80px                    │
│                                           │
│  ← 40px Safe Area (iOS) / 30px (Android)  │
│                                           │
└───────────────────────────────────────────┘
           Auto-adjusts to screen
```

---

## Responsive Behavior

### iPhone SE (Small Screen)
```
┌─────────┐
│   🌙    │  Smaller safe areas
│DailyHush│  Same sizes (may feel tighter)
│ Tagline │  Content stays centered
│    ╱╲   │  Spiral may appear larger
│   ╱• ╲  │  relative to screen
│    ╲╱   │
│  • • •  │
└─────────┘
```

### iPhone 15 Pro Max (Large Screen)
```
┌───────────────┐
│               │
│      🌙       │  More breathing room
│  DailyHush    │  Same sizes (more space)
│   Tagline     │  Content stays centered
│               │  Spiral has more space
│     ╱───╲     │  around it
│    │  •  │    │
│     ╲───╱     │
│               │
│     • • •     │
│               │
└───────────────┘
```

### iPad (Tablet)
```
┌─────────────────────────┐
│                         │
│         🌙              │  Much more space
│     DailyHush           │  Content centered
│      Tagline            │  Same sizes
│                         │  (don't scale up)
│        ╱───╲            │
│       │  •  │           │
│        ╲───╱            │
│                         │
│        • • •            │
│                         │
└─────────────────────────┘
```

---

## Device-Specific Notes

### iPhone with Dynamic Island
```
┌───────────────────┐
│  ⚫━━━━━━━━⚫      │ ← Dynamic Island
│  ↕ 60px padding   │   (accounted for)
│                   │
│       🌙          │
│   DailyHush       │
│                   │
```

### Android with Gesture Navigation
```
│                   │
│       🌙          │
│   DailyHush       │
│                   │
│  ↕ 30px padding   │
└───────────────────┘
     ▔▔▔▔▔▔▔         ← Gesture bar
                       (accounted for)
```

---

## Color Contrast Analysis

### Text on Background
```
Foreground: #ECFDF5 (emerald-50)
Background: #0A1612 (very dark green)

Contrast Ratio: ~15.2:1
WCAG Level: AAA (exceeds 7:1 requirement)
✓ Perfect for body text
✓ Excellent for large text
✓ Accessible for all users
```

### Accent on Background
```
Foreground: #34D399 (emerald-400)
Background: #0A1612 (very dark green)

Contrast Ratio: ~9.8:1
WCAG Level: AAA (exceeds 4.5:1)
✓ Great for UI elements
✓ Highly visible
✓ Maintains calm aesthetic
```

---

## Export Specifications

### For Designers Using Figma/Sketch

**Frame Setup:**
- Width: 375px (iPhone base) or 390px (iPhone 14/15)
- Height: 812px (iPhone X+) or 844px (iPhone 14/15)
- Background: #0A1612

**Layer Structure:**
```
Splash Screen Frame
├─ Background Gradient (Linear)
│  └─ Colors: #0A1612 → #0D1F1A → #0A1612
├─ Moon Icon Group
│  ├─ Crescent Shape (Vector)
│  └─ Accent Dots (2 circles)
├─ App Name (Text)
│  └─ "DailyHush" - 42px/600
├─ Tagline (Text)
│  └─ "Stop the Spiral..." - 16px/300
├─ Spiral Group
│  ├─ Outer Arc (Stroke, dashed)
│  ├─ Middle Arc (Stroke, dashed)
│  ├─ Inner Arc (Stroke, dashed)
│  ├─ Center Dot
│  └─ Accent Dots (3 circles)
└─ Loading Dots Group (Optional)
   ├─ Dot 1
   ├─ Dot 2
   └─ Dot 3
```

---

## Quick Reference Card

```
╔════════════════════════════════════════╗
║  DAILYHUSH SPLASH SCREEN QUICK REF    ║
╠════════════════════════════════════════╣
║ Primary Background:  #0A1612           ║
║ Gradient Middle:     #0D1F1A           ║
║ Accent Color:        #34D399           ║
║ Light Accent:        #6EE7B7           ║
║ Text Color:          #ECFDF5           ║
╠════════════════════════════════════════╣
║ App Name Size:       42px              ║
║ Tagline Size:        16px              ║
║ Moon Icon:           40×40px           ║
║ Spiral Graphic:      180×180px         ║
║ Loading Dot:         8×8px             ║
╠════════════════════════════════════════╣
║ Animation Duration:  ~2.6 seconds      ║
║ Safe Area Top:       60px (iOS)        ║
║ Safe Area Bottom:    40px (iOS)        ║
╠════════════════════════════════════════╣
║ File Location:                         ║
║ /components/SplashScreen.tsx           ║
╚════════════════════════════════════════╝
```

---

## ASCII Color Palette Reference

```
Dark to Light (Background to Accent):

█████  #0A1612  Darkest (Base background)
████▓  #0D1F1A  Dark+ (Gradient mid)
███▓▒  #064E3B  Medium Dark (not used, reference)
██▓▒░  #34D399  Accent (Primary emerald)
█▓▒░   #6EE7B7  Light Accent (Secondary)
▓▒░    #D1FAE5  Lightest (Not used, future)
▒░     #ECFDF5  Text (Soft white)
```

---

**Document Purpose**: Visual reference for designers and developers
**Companion Docs**: SPLASH_SCREEN_DESIGN.md, SPLASH_SCREEN_INTEGRATION.md
**Last Updated**: 2025-10-24
