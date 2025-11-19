# Noema Design System - Visual Reference Guide

This document provides visual representations of layouts, component structures, and design patterns using ASCII diagrams and code examples.

---

## Layout Grid System

### 12-Column Grid Structure
```
┌─────────────────────────────────────────────────────────────────────┐
│  Container (max-w-7xl, px-4 sm:px-6 lg:px-8)                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  Grid (grid-cols-12, gap-6)                                   │ │
│  │  ┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐                      │ │
│  │  │1 │2 │3 │4 │5 │6 │7 │8 │9 │10│11│12│                      │ │
│  │  └──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘                      │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Common Column Patterns

#### Two Equal Columns (50/50)
```
┌─────────────────────────────────────┬─────────────────────────────────────┐
│  col-span-6                         │  col-span-6                         │
│                                     │                                     │
│  Left content                       │  Right content                      │
│                                     │                                     │
└─────────────────────────────────────┴─────────────────────────────────────┘
```

#### Three Equal Columns (33/33/33)
```
┌───────────────────┬───────────────────┬───────────────────┐
│  col-span-4       │  col-span-4       │  col-span-4       │
│                   │                   │                   │
│  Column 1         │  Column 2         │  Column 3         │
│                   │                   │                   │
└───────────────────┴───────────────────┴───────────────────┘
```

#### Sidebar + Main (33/67)
```
┌───────────────────┬──────────────────────────────────────────────────┐
│  col-span-4       │  col-span-8                                      │
│                   │                                                  │
│  Sidebar          │  Main content                                    │
│                   │                                                  │
│  - Nav item 1     │  Lorem ipsum dolor sit amet, consectetur         │
│  - Nav item 2     │  adipiscing elit. Sed do eiusmod tempor          │
│  - Nav item 3     │  incididunt ut labore et dolore magna aliqua.    │
│                   │                                                  │
└───────────────────┴──────────────────────────────────────────────────┘
```

---

## Homepage Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  Header (sticky, bg-neutral-0/95, backdrop-blur)                    │
│  ┌──────────┬────────────────────────────────────┬──────────────┐  │
│  │  Logo    │  Nav Links                         │  CTA Button  │  │
│  └──────────┴────────────────────────────────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Hero Section (py-20 sm:py-28 lg:py-36)                            │
│  Gradient: from-forestGreen-50 via-neutral-50 to-softLime-50       │
│                                                                     │
│                     ╔════════════════════╗                          │
│                     ║  Headline (H1)     ║                          │
│                     ║  Display font      ║                          │
│                     ║  text-5xl lg:text-7xl                         │
│                     ╚════════════════════╝                          │
│                                                                     │
│              Subheadline (text-lg sm:text-xl)                       │
│              text-neutral-600, leading-relaxed                      │
│                                                                     │
│          ┌──────────────────┐  ┌──────────────────┐               │
│          │  Primary CTA     │  │  Secondary CTA   │               │
│          │  softLime-500    │  │  outline         │               │
│          └──────────────────┘  └──────────────────┘               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Social Proof Bar (py-12, bg-neutral-50)                           │
│  "Trusted by 50,000+ overthinkers"                                 │
│                                                                     │
│      [Logo 1]    [Logo 2]    [Logo 3]    [Logo 4]    [Logo 5]     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Features Section (py-20 lg:py-28, bg-neutral-0)                   │
│                                                                     │
│                    Section Heading (H2)                             │
│                    Subheading (text-neutral-600)                    │
│                                                                     │
│  ┌─────────────┬─────────────┬─────────────┐                      │
│  │ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │                      │
│  │ │  Icon   │ │ │  Icon   │ │ │  Icon   │ │                      │
│  │ └─────────┘ │ └─────────┘ │ └─────────┘ │                      │
│  │   Title     │   Title     │   Title     │                      │
│  │ Description │ Description │ Description │                      │
│  │ [Learn more]│ [Learn more]│ [Learn more]│                      │
│  └─────────────┴─────────────┴─────────────┘                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  How It Works (py-20 lg:py-28, bg-neutral-50)                      │
│                                                                     │
│                    Section Heading (H2)                             │
│                                                                     │
│  ┌─────────────┬─────────────┬─────────────┐                      │
│  │    ┌───┐    │    ┌───┐    │    ┌───┐    │                      │
│  │    │ 1 │    │    │ 2 │    │    │ 3 │    │                      │
│  │    └───┘    │    └───┘    │    └───┘    │                      │
│  │   Step 1    │   Step 2    │   Step 3    │                      │
│  │ Description │ Description │ Description │                      │
│  └─────────────┴─────────────┴─────────────┘                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Testimonials (py-20 lg:py-28, bg-neutral-0)                       │
│                                                                     │
│                    Section Heading (H2)                             │
│                                                                     │
│  ┌─────────────┬─────────────┬─────────────┐                      │
│  │ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │                      │
│  │ │"Quote 1"│ │ │"Quote 2"│ │ │"Quote 3"│ │                      │
│  │ └─────────┘ │ └─────────┘ │ └─────────┘ │                      │
│  │  [Avatar]   │  [Avatar]   │  [Avatar]   │                      │
│  │  Name       │  Name       │  Name       │                      │
│  │  Title      │  Title      │  Title      │                      │
│  │  ★★★★★      │  ★★★★★      │  ★★★★★      │                      │
│  └─────────────┴─────────────┴─────────────┘                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  CTA Section (py-16 sm:py-20 lg:py-28)                             │
│  bg-gradient-to-br from-forestGreen-900 to-forestGreen-800         │
│  text-neutral-0                                                     │
│                                                                     │
│                  Final CTA Headline (H2)                            │
│                  text-4xl sm:text-5xl lg:text-6xl                   │
│                                                                     │
│                  Supporting text (text-lg)                          │
│                  text-forestGreen-100                               │
│                                                                     │
│          ┌──────────────────┐  ┌──────────────────┐               │
│          │  Primary CTA     │  │  Ghost CTA       │               │
│          │  softLime-500    │  │  transparent     │               │
│          └──────────────────┘  └──────────────────┘               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Footer (pt-16 pb-8, bg-forestGreen-900, text-neutral-0)           │
│                                                                     │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐        │
│  │  Column 1   │  Column 2   │  Column 3   │  Column 4   │        │
│  │  ─────────  │  ─────────  │  ─────────  │  ─────────  │        │
│  │  Link 1     │  Link 1     │  Link 1     │  Newsletter │        │
│  │  Link 2     │  Link 2     │  Link 2     │  Signup     │        │
│  │  Link 3     │  Link 3     │  Link 3     │             │        │
│  └─────────────┴─────────────┴─────────────┴─────────────┘        │
│                                                                     │
│  ───────────────────────────────────────────────────────────       │
│                                                                     │
│  © 2025 Noema  |  Privacy  |  Terms  |  [Social Icons]            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Card Component Anatomy

### Default Card
```
┌─────────────────────────────────────────┐
│ Card (bg-neutral-0, border, rounded-lg) │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ CardHeader (px-6 pt-6 pb-4)         │ │
│ │   CardTitle (text-xl, font-semibold)│ │
│ │   CardDescription (text-sm, muted)  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ CardContent (px-6 py-4)             │ │
│ │                                     │ │
│ │   Main card content goes here       │ │
│ │   Multiple paragraphs, images, etc. │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ CardFooter (px-6 pb-6 pt-4)         │ │
│ │   [Cancel]  [Confirm]               │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Elevated Card (with shadow)
```
    ╔═══════════════════════════════════╗
    ║ Card (shadow-lg, rounded-xl)      ║
    ║                                   ║
    ║  ┌─────────┐                      ║
    ║  │  Icon   │                      ║
    ║  └─────────┘                      ║
    ║                                   ║
    ║  Feature Title                    ║
    ║  Feature description goes here    ║
    ║                                   ║
    ║  [Learn more →]                   ║
    ╚═══════════════════════════════════╝
       └── Shadow depth indicates elevation
```

---

## Button Variants

### Visual Representation
```
Primary Button (softLime-500, white text):
┌──────────────────┐
│  Get Started →   │  ← Hover: lift + glow
└──────────────────┘

Secondary Button (forestGreen-900, white text):
┌──────────────────┐
│  Learn More      │  ← Hover: darken
└──────────────────┘

Outline Button (transparent bg, border):
╔══════════════════╗
║  Cancel          ║  ← Hover: fill light
╚══════════════════╝

Ghost Button (transparent, minimal):
┌ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│  Skip            │  ← Hover: subtle bg
└ ─ ─ ─ ─ ─ ─ ─ ─ ┘

Loading State:
┌──────────────────┐
│  ⟳ Loading...    │  ← Spinner animation
└──────────────────┘

Disabled State:
┌──────────────────┐
│  Disabled        │  ← opacity-50, no pointer
└──────────────────┘
```

### Size Comparison
```
Small (sm):
┌────────────┐
│  Small     │  ← px-4 py-1.5, text-sm, h-8
└────────────┘

Medium (md) - Default:
┌─────────────────┐
│  Medium         │  ← px-6 py-3, text-base, h-11
└─────────────────┘

Large (lg):
┌──────────────────────┐
│  Large               │  ← px-8 py-4, text-lg, h-14
└──────────────────────┘
```

---

## Form Layout

### Vertical Form (Default)
```
┌─────────────────────────────────────────┐
│ Form Container (max-w-md mx-auto)       │
│                                         │
│ Email address *                         │
│ ┌─────────────────────────────────────┐ │
│ │ you@example.com                     │ │
│ └─────────────────────────────────────┘ │
│ We'll never share your email            │
│                                         │
│ Password *                              │
│ ┌─────────────────────────────────────┐ │
│ │ ••••••••••                          │ │
│ └─────────────────────────────────────┘ │
│ Must be at least 8 characters           │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │  ☐  I agree to Terms of Service     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │      Sign Up                        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Already have an account? [Log in]      │
└─────────────────────────────────────────┘
```

### Horizontal Form (Two Columns)
```
┌─────────────────────────────────────────────────────────────┐
│ Form Container (max-w-4xl)                                   │
│                                                             │
│ ┌──────────────────────┐  ┌──────────────────────┐        │
│ │ First name *         │  │ Last name *          │        │
│ │ ┌──────────────────┐ │  │ ┌──────────────────┐ │        │
│ │ │ John             │ │  │ │ Doe              │ │        │
│ │ └──────────────────┘ │  │ └──────────────────┘ │        │
│ └──────────────────────┘  └──────────────────────┘        │
│                                                             │
│ Email address *                                             │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ john@example.com                                      │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐  │
│ │      Submit                                           │  │
│ └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Mobile Navigation

### Desktop Header
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]    Features    Pricing    About    Support    [Get Started]│
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Header (Collapsed)
```
┌─────────────────────────────────────────┐
│ [Logo]                    [≡ Menu]      │
└─────────────────────────────────────────┘
```

### Mobile Menu (Expanded)
```
Screen Overlay (backdrop-blur)
┌─────────────────────────────────────────┐
│                                  [✕]    │
│                                         │
│  [Logo]                                 │
│                                         │
│  Features                               │
│  Pricing                                │
│  About                                  │
│  Support                                │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Get Started                      │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Already a member? [Log in]             │
└─────────────────────────────────────────┘
```

---

## FAQ Accordion

### Collapsed State
```
┌─────────────────────────────────────────────────────────────┐
│ What is Noema?                                          [▼] │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ How does the free trial work?                          [▼] │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Can I cancel anytime?                                   [▼] │
└─────────────────────────────────────────────────────────────┘
```

### Expanded State (First Item)
```
┌─────────────────────────────────────────────────────────────┐
│ What is Noema?                                          [▲] │
├─────────────────────────────────────────────────────────────┤
│ Noema is a mental health app designed for overthinkers.     │
│ We provide science-backed exercises, daily journaling       │
│ prompts, and progress tracking to help you calm your mind.  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ How does the free trial work?                          [▼] │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Can I cancel anytime?                                   [▼] │
└─────────────────────────────────────────────────────────────┘
```

---

## Responsive Grid Examples

### Mobile (Single Column)
```
┌───────────────────────┐
│  Feature Card 1       │
│                       │
│  [Icon]               │
│  Title                │
│  Description...       │
└───────────────────────┘

┌───────────────────────┐
│  Feature Card 2       │
│                       │
│  [Icon]               │
│  Title                │
│  Description...       │
└───────────────────────┘

┌───────────────────────┐
│  Feature Card 3       │
│                       │
│  [Icon]               │
│  Title                │
│  Description...       │
└───────────────────────┘
```

### Tablet (Two Columns)
```
┌─────────────────┬─────────────────┐
│  Feature Card 1 │  Feature Card 2 │
│                 │                 │
│  [Icon]         │  [Icon]         │
│  Title          │  Title          │
│  Description... │  Description... │
└─────────────────┴─────────────────┘

┌─────────────────┬─────────────────┐
│  Feature Card 3 │  Feature Card 4 │
│                 │                 │
│  [Icon]         │  [Icon]         │
│  Title          │  Title          │
│  Description... │  Description... │
└─────────────────┴─────────────────┘
```

### Desktop (Three Columns)
```
┌───────────┬───────────┬───────────┐
│ Feature 1 │ Feature 2 │ Feature 3 │
│           │           │           │
│  [Icon]   │  [Icon]   │  [Icon]   │
│  Title    │  Title    │  Title    │
│  Desc...  │  Desc...  │  Desc...  │
└───────────┴───────────┴───────────┘

┌───────────┬───────────┬───────────┐
│ Feature 4 │ Feature 5 │ Feature 6 │
│           │           │           │
│  [Icon]   │  [Icon]   │  [Icon]   │
│  Title    │  Title    │  Title    │
│  Desc...  │  Desc...  │  Desc...  │
└───────────┴───────────┴───────────┘
```

---

## Color Palette Visual

### Primary Colors
```
Forest Green Scale:
┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐
│ 50 │100 │200 │300 │400 │500 │600 │700 │800 │900 │950 │
└────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘
 Lightest                                        Darkest
 (Backgrounds)                                   (Brand)

Soft Lime Scale:
┌────┬────┬────┬────┬────┬────┬────┬────┬────┐
│ 50 │100 │200 │300 │400 │500 │600 │700 │800 │
└────┴────┴────┴────┴────┴────┴────┴────┴────┘
 Lightest                          Darkest
 (Highlights)        (Accent)

Neutral Scale:
┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐
│  0 │ 50 │100 │200 │300 │400 │500 │600 │700 │800 │900 │
└────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘
 White                                              Black
 (Cards)  (Page BG) (Borders)    (Text)
```

### Usage Examples
```
Primary CTA:
┌──────────────────┐
│  softLime-500    │  ← Accent color, high energy
│  text-white      │
└──────────────────┘

Secondary CTA:
┌──────────────────┐
│  forestGreen-900 │  ← Brand color, calm
│  text-white      │
└──────────────────┘

Page Background:
╔══════════════════╗
║  neutral-50      ║  ← Light gray, calm
║  (Page BG)       ║
╚══════════════════╝

Card Background:
┌──────────────────┐
│  neutral-0       │  ← Pure white, clean
│  (Cards)         │
└──────────────────┘

Text Hierarchy:
neutral-900  ← Primary text (headings, emphasis)
neutral-700  ← Body text
neutral-600  ← Secondary text
neutral-500  ← Muted text (labels, captions)
neutral-400  ← Placeholder text
```

---

## Typography Scale Visual

```
Display Heading (H1)
══════════════════
Font: Instrument Serif
Size: 3.75rem (60px) → 5rem (80px) on desktop
Weight: 400 (Regular)
Line Height: 1 (tight)
Letter Spacing: -0.03em

Section Heading (H2)
────────────────────
Font: Inter
Size: 1.875rem (30px) → 3rem (48px) on desktop
Weight: 600 (Semibold)
Line Height: 1.2
Letter Spacing: -0.02em

Subsection (H3)
──────────────
Font: Inter
Size: 1.5rem (24px) → 2.25rem (36px) on desktop
Weight: 600 (Semibold)
Line Height: 1.3
Letter Spacing: -0.01em

Card Title (H4)
──────────────
Font: Inter
Size: 1.25rem (20px)
Weight: 600 (Semibold)
Line Height: 1.4

Body Text
─────────
Font: Inter
Size: 1rem (16px) → 1.125rem (18px) on desktop
Weight: 400 (Regular)
Line Height: 1.6
Color: neutral-600

Muted Text
─────────
Font: Inter
Size: 0.875rem (14px)
Weight: 400 (Regular)
Line Height: 1.4
Color: neutral-500

Caption
───────
Font: Inter
Size: 0.75rem (12px)
Weight: 400 (Regular)
Line Height: 1
Letter Spacing: 0.02em
Color: neutral-400
```

---

## Spacing System Visual

```
8px Grid Base:

0.5  ──  2px
1    ────  4px
1.5  ──────  6px
2    ────────  8px
3    ────────────  12px
4    ────────────────  16px
6    ────────────────────────  24px
8    ────────────────────────────────  32px
12   ────────────────────────────────────────────────  48px
16   ────────────────────────────────────────────────────────────  64px
24   ────────────────────────────────────────────────────────────────────────────────────────  96px

Common Usage:
├─ gap-2 (8px)   → Tight spacing (button icon gaps)
├─ gap-4 (16px)  → Default spacing (form fields)
├─ gap-6 (24px)  → Grid gaps (card grids)
├─ gap-8 (32px)  → Section spacing
├─ py-12 (48px)  → Section padding (mobile)
└─ py-24 (96px)  → Section padding (desktop)
```

---

## Shadow & Elevation System

```
Elevation 0 (Flat):
┌─────────────┐
│   No shadow │
└─────────────┘

Elevation 1 (Hover):
┌─────────────┐
│   shadow-sm │ ← Subtle lift
└─────────────┘
   └─ shadow

Elevation 2 (Card):
┌─────────────┐
│   shadow    │ ← Default card
└─────────────┘
  └─── shadow

Elevation 3 (Active):
┌─────────────┐
│   shadow-md │ ← Dropdown, popover
└─────────────┘
  └───── shadow

Elevation 4 (Modal):
┌─────────────┐
│   shadow-lg │ ← Modal, dialog
└─────────────┘
  └──────── shadow

Elevation 5 (Maximum):
┌─────────────┐
│   shadow-xl │ ← Notification
└─────────────┘
  └────────── shadow
```

---

## Animation States

### Button Hover Sequence
```
Frame 1 (Rest):           Frame 2 (Hover):          Frame 3 (Active):
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│  Click me    │    →     │  Click me    │    →     │  Click me    │
└──────────────┘          └──────────────┘          └──────────────┘
                              ↑ translate-y-1           ↓ translate-y-0
                              ↑ scale-[1.005]           ↓ scale-[0.995]
                              ↑ shadow-md               ↓ shadow-sm

Duration: 150ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

### Card Hover
```
Before Hover:             On Hover:
┌─────────────┐          ┌─────────────┐
│             │          │             │
│   Content   │    →     │   Content   │
│             │          │             │
└─────────────┘          └─────────────┘
  └─ shadow-sm              └── shadow-md
                              ↑ -translate-y-1

Duration: 250ms
```

### Fade In Animation
```
Opacity:  0%    →    25%    →    50%    →    75%    →   100%
          ░░░░░      ▒▒▒▒▒      ▓▓▓▓▓      ████▒      █████

Duration: 500ms
```

---

## Accessibility Indicators

### Focus States
```
Default (no focus):
┌──────────────┐
│  Button      │
└──────────────┘

Keyboard Focus (visible):
╔══════════════╗ ← ring-2 ring-forestGreen-500
║  Button      ║ ← ring-offset-2
╚══════════════╝

Mouse Focus (hidden):
┌──────────────┐
│  Button      │ ← No visible ring
└──────────────┘    (focus-visible:ring-2)
```

### Form Input States
```
Default:                  Focus:                    Error:
┌──────────────┐         ╔══════════════╗          ┌──────────────┐
│ Enter email  │    →    ║ user@email   ║    →     │ invalid@     │
└──────────────┘         ╚══════════════╝          └──────────────┘
border-neutral-300       ring-forestGreen-500      border-error-500
                                                    ↓
                                                    "Invalid email"
```

### Skip Links (for keyboard users)
```
┌─────────────────────────────────────┐
│  [Skip to main content]  ← Hidden until focused
├─────────────────────────────────────┤
│  Header content...                  │
└─────────────────────────────────────┘
```

---

## Responsive Breakpoints Visual

```
Mobile          Tablet          Desktop         Wide
(0-639px)       (640-1023px)    (1024-1279px)   (1280px+)
│               │               │               │
├─────────────► ├─────────────► ├─────────────► ├─────────────►
│               │               │               │
sm:             md:             lg:             xl:

Example: Text sizing
──────────────────────
Mobile:   text-base (16px)
Tablet:   sm:text-lg (18px)
Desktop:  lg:text-xl (20px)
Wide:     xl:text-2xl (24px)

Example: Grid columns
────────────────────
Mobile:   grid-cols-1 (single column)
Tablet:   md:grid-cols-2 (two columns)
Desktop:  lg:grid-cols-3 (three columns)

Example: Visibility
──────────────────
Mobile:   hidden (hide element)
Desktop:  lg:block (show element)
```

---

## Component File Structure

```
src/
├── components/
│   ├── ui/                          ← Base UI components
│   │   ├── Button.tsx               ← Primary interaction
│   │   ├── Card.tsx                 ← Content container
│   │   ├── Input.tsx                ← Text input
│   │   ├── Textarea.tsx             ← Multi-line input
│   │   ├── Select.tsx               ← Dropdown selection
│   │   ├── Checkbox.tsx             ← Boolean input
│   │   ├── Heading.tsx              ← Heading component
│   │   ├── Text.tsx                 ← Text component
│   │   ├── Accordion.tsx            ← Expandable content
│   │   ├── Modal.tsx                ← Dialog overlay
│   │   ├── Spinner.tsx              ← Loading indicator
│   │   └── index.ts                 ← Barrel export
│   │
│   ├── layout/                      ← Layout components
│   │   ├── Container.tsx            ← Content wrapper
│   │   ├── Header.tsx               ← Site header
│   │   ├── Footer.tsx               ← Site footer
│   │   ├── MobileMenu.tsx           ← Mobile navigation
│   │   └── index.ts
│   │
│   ├── sections/                    ← Page sections
│   │   ├── Hero.tsx                 ← Hero section
│   │   ├── CTASection.tsx           ← Call-to-action
│   │   └── index.ts
│   │
│   ├── features/                    ← Feature components
│   │   ├── FeatureCard.tsx
│   │   ├── FeatureGrid.tsx
│   │   └── index.ts
│   │
│   ├── testimonials/                ← Testimonial components
│   │   ├── TestimonialCard.tsx
│   │   ├── TestimonialGrid.tsx
│   │   └── index.ts
│   │
│   └── faq/                         ← FAQ components
│       ├── FAQAccordion.tsx
│       └── index.ts
│
├── lib/                             ← Utility functions
│   ├── utils.ts                     ← cn() helper
│   └── constants.ts
│
├── types/                           ← TypeScript types
│   └── components.ts
│
└── styles/                          ← Global styles
    └── globals.css
```

---

**Usage Tips:**

1. Start with mobile layout (smallest screen)
2. Add responsive classes for larger screens (sm:, md:, lg:, xl:)
3. Use Container component for consistent max-width and padding
4. Follow 8px grid system for spacing
5. Test keyboard navigation and screen reader support

**Reference:**
- Full spec: `NOEMA_DESIGN_SYSTEM.md`
- Implementation guide: `NOEMA_IMPLEMENTATION_GUIDE.md`
- TypeScript types: `NOEMA_COMPONENT_TYPES.ts`
